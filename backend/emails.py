from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from dotenv import load_dotenv

load_dotenv()

class EmailDeliveryError(Exception):
    pass

def send_email(to: str, subject: str, content: str, content_type: str = "html"):
    """Send email via SendGrid"""
    message = Mail(
        from_email=os.getenv('SENDER_EMAIL'),
        to_emails=to,
        subject=subject,
        html_content=content if content_type == "html" else None,
        plain_text_content=content if content_type == "plain" else None
    )
    
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        raise EmailDeliveryError(f"Failed to send email: {str(e)}")

def send_appointment_confirmation(recipient_email: str, appointment_data: dict):
    """Send appointment confirmation email"""
    subject = f"PashuVaani - Appointment Confirmed for {appointment_data.get('pet_name')}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #111111;">
        <h2 style="color: #0F766E;">Appointment Confirmed</h2>
        <p>Dear {appointment_data.get('owner_name')},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="border: 1px solid #EAEAEA; padding: 20px; margin: 20px 0; border-radius: 12px;">
            <p><strong>Pet Name:</strong> {appointment_data.get('pet_name')}</p>
            <p><strong>Pet Type:</strong> {appointment_data.get('pet_type')}</p>
            <p><strong>Time Slot:</strong> {appointment_data.get('time_slot')}</p>
            <p><strong>Doctor:</strong> {appointment_data.get('doctor_name', 'Will be assigned')}</p>
        </div>
        <p>Thank you for choosing PashuVaani - The Voice of Animal Health.</p>
        <p style="color: #6F6F6F; font-size: 12px;">For any queries, contact us at contact@pashuvaani.com or call 7357123673</p>
    </body>
    </html>
    """
    
    return send_email(recipient_email, subject, html_content, "html")

def send_doctor_application_notification(recipient_email: str, doctor_name: str, status: str):
    """Send doctor application status notification"""
    subject = f"PashuVaani - Doctor Application {status.title()}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #111111;">
        <h2 style="color: #0F766E;">Application {status.title()}</h2>
        <p>Dear Dr. {doctor_name},</p>
        <p>Your application to join PashuVaani has been <strong>{status}</strong>.</p>
        {'<p>Our team will contact you shortly with next steps.</p>' if status == 'approved' else '<p>Thank you for your interest. Please feel free to reapply in the future.</p>'}
        <p>Best regards,<br>PashuVaani Team</p>
        <p style="color: #6F6F6F; font-size: 12px;">Contact: contact@pashuvaani.com | 7357123673</p>
    </body>
    </html>
    """
    
    return send_email(recipient_email, subject, html_content, "html")

def send_contact_form_notification(form_data: dict):
    """Send contact form submission to admin"""
    subject = f"New Contact Form Submission from {form_data.get('name')}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #111111;">
        <h2 style="color: #0F766E;">New Contact Form Submission</h2>
        <div style="border: 1px solid #EAEAEA; padding: 20px; margin: 20px 0; border-radius: 12px;">
            <p><strong>Name:</strong> {form_data.get('name')}</p>
            <p><strong>Email:</strong> {form_data.get('email')}</p>
            <p><strong>Message:</strong></p>
            <p>{form_data.get('message')}</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(os.getenv('SENDER_EMAIL'), subject, html_content, "html")