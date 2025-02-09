from typing import Union
from pydantic import BaseModel

class EmailRequest(BaseModel):
    """
    Data model for the email request.
    """
    email_content: str
    tone: Union[str, None] = None
