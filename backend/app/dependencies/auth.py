from uuid import UUID

from fastapi import Header, HTTPException, status
from jose import JWTError, jwt

from app.core.config import settings


async def get_current_user_id(authorization: str | None = Header(default=None)) -> UUID:
    print(f"[AUTH] jwt_secret_key: {settings.jwt_secret_key}", flush=True)
    print(f"[AUTH] authorization header: {authorization}", flush=True)
    if not authorization:
        if settings.allow_mock_auth:
            return UUID(settings.mock_user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format",
        )

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="JWT payload does not contain 'sub'",
            )
        return UUID(user_id)
    except (JWTError, ValueError) as exc:
        print(f"[AUTH ERROR] {str(exc)}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc