import logging
from typing import List, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os

logger = logging.getLogger(__name__)

# Using dummy logger if SENDGRID_API_KEY is not configured
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", "")

class EmailService:
    def __init__(self):
        self.api_key = SENDGRID_API_KEY
        self.from_email = "noreply@pashuvaani.com"

    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send an email using Sendgrid synchronously."""
        if not self.api_key:
            logger.info(f"SendGrid not configured. Mocking email to {to_email}: {subject}")
            return True
            
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            return response.status_code in [200, 201, 202]
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False

email_service_impl = EmailService()
