import os
from typing import Callable, Optional, TypeVar
from dotenv import (
    load_dotenv,
)  ## Must be removed before deployment! Comment out or other action locally (no need to commit)

load_dotenv()

T = TypeVar("T")  # Generic type


def get_setting(
    key: str,
    error_response: Optional[str] = None,
    cast: Optional[
        Callable[[str], T]
    ] = None,  # A function that takes a str and returns some type T. Define these functions below if needed!
) -> T:
    value = os.getenv(key)
    if value is None:
        raise ValueError(
            error_response
            or f"Cannot find env setting: {key}. Please ensure the .env key value is defined!"
        )

    if cast:
        try:
            return cast(value)
        except (ValueError, TypeError) as e:
            raise ValueError(
                f"Key value for env setting: {key}, failed to be casted. Expected: {cast.__name__}. Got: {value}"
            )

    return value
