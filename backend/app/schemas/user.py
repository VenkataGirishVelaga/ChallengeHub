from pydantic import BaseModel, ConfigDict, EmailStr


class UserRegister(BaseModel):
	name: str
	email: EmailStr
	password: str


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class UserResponse(BaseModel):
	id: int
	name: str
	email: EmailStr
	level: int
	xp: int
	streak: int

	model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
	access_token: str
	refresh_token: str
	token_type: str = "bearer"
	user: UserResponse


class RefreshRequest(BaseModel):
	refresh_token: str


class RefreshResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"