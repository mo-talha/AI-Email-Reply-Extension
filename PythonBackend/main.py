from fastapi import FastAPI, HTTPException, Request
from .email_generator_service import EmailGeneratorService
from .email_request import EmailRequest
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = ["https://mail.google.com"]  # List of allowed origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.post("/api/email/generate")
async def generate_email(request: Request, email_request: EmailRequest):
    """
    Generates an email reply based on the provided content and tone.

    Args:
        request: The incoming HTTP request object.
        email_request: The data model containing the email content and desired tone.

    Returns:
        A JSON response containing the generated email reply.

    Raises:
        HTTPException: If an error occurs during email generation.
    """
    try:
        email_generator = EmailGeneratorService()
        generated_email = email_generator.generate_email_reply(email_request)
        return {"generated_email": generated_email}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating email: {str(e)}")
