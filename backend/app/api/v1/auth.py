from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import decode_refresh_token
from app.core.security import (
	create_access_token,
	create_refresh_token,
	hash_password,
	verify_password,
)
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.user import (
	RefreshRequest,
	RefreshResponse,
	Token,
	UserLogin,
	UserRegister,
	UserResponse,
)
from app.services.user_service import (
	authenticate_user,
	create_user,
	get_user_by_email,
)

router = APIRouter(
	prefix="/auth",
	tags=["Authentication"],
)


@router.post(
	"/register",
	response_model=UserResponse,
	status_code=status.HTTP_201_CREATED,
)
def register(
	user: UserRegister,
	db: Session = Depends(get_db),
):
	existing_user = get_user_by_email(
		db,
		user.email,
	)

	if existing_user:
		raise HTTPException(
			status_code=400,
			detail="Email already registered",
		)

	db_user = User(
		name=user.name,
		email=user.email,
		password_hash=hash_password(
			user.password
		),
	)

	return create_user(
		db,
		db_user,
	)


@router.post(
	"/login",
	response_model=Token,
)
def login(
	user: UserLogin,
	db: Session = Depends(get_db),
):
	db_user = authenticate_user(
		db,
		user.email,
	)

	if not db_user:
		raise HTTPException(
			status_code=401,
			detail="Invalid email or password",
		)

	if not verify_password(
		user.password,
		db_user.password_hash,
	):
		raise HTTPException(
			status_code=401,
			detail="Invalid email or password",
		)

	token = create_access_token(
		{
			"sub": str(db_user.id),
			"email": db_user.email,
		}
	)

	refresh_token = create_refresh_token(
		{
			"sub": str(db_user.id),
		}
	)

	return {
		"access_token": token,
		"refresh_token": refresh_token,
		"token_type": "bearer",
		"user": db_user,
	}


@router.post(
	"/refresh",
	response_model=RefreshResponse,
)
def refresh(
	data: RefreshRequest,
	db: Session = Depends(get_db),
):
	user_id = decode_refresh_token(data.refresh_token)

	user = (
		db.query(User)
		.filter(User.id == user_id)
		.first()
	)

	if not user:
		raise HTTPException(
			status_code=401,
			detail="Invalid or expired refresh token",
		)

	new_access_token = create_access_token(
		{
			"sub": str(user.id),
			"email": user.email,
		}
	)

	return {
		"access_token": new_access_token,
		"token_type": "bearer",
	}