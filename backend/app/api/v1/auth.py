from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserResponse
from app.services.user_service import (
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
