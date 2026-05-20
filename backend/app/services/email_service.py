import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.user = settings.SMTP_USER
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAILS_FROM_EMAIL
        self.from_name = settings.EMAILS_FROM_NAME
        self.enabled = settings.EMAILS_ENABLED
        self.use_tls = settings.SMTP_TLS

    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send an email using SMTP. Returns True only when the message was handed off to SMTP."""
        if not self.enabled:
            logger.warning(
                "EMAILS_ENABLED is false — no email was sent to %s (%s). "
                "Set EMAILS_ENABLED=true and SMTP_* / EMAILS_FROM_* for password reset.",
                to_email,
                subject,
            )
            return False

        if not all([self.host, self.port, self.user, self.password]):
            logger.warning("SMTP not fully configured (host/port/user/password). Email not sent.")
            return False

        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            part = MIMEText(html_content, "html")
            message.attach(part)

            # Use SMTP_SSL for port 465, STARTTLS for port 587
            if self.port == 465:
                with smtplib.SMTP_SSL(self.host, self.port) as server:
                    server.login(self.user, self.password)
                    server.sendmail(self.from_email, to_email, message.as_string())
            else:
                with smtplib.SMTP(self.host, self.port) as server:
                    if self.use_tls:
                        server.starttls()
                    server.login(self.user, self.password)
                    server.sendmail(self.from_email, to_email, message.as_string())
            
            return True
        except Exception as e:
            logger.error(f"Error sending email via SMTP: {e}")
            return False

email_service_impl = EmailService()



