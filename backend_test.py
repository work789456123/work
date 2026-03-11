import requests
import sys
import base64
import json
from datetime import datetime
from io import BytesIO
from PIL import Image

class PashuVaaniAPITester:
    def __init__(self, base_url="api.pashuvaani.com/api"):
        self.base_url = base_url
        self.user_token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = None
        self.test_session_id = f"test_session_{datetime.now().strftime('%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if token:
            test_headers['Authorization'] = f'Bearer {token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def create_test_image_base64(self):
        """Create a simple test image in base64 format"""
        # Create a simple 100x100 test image with some visual features
        img = Image.new('RGB', (100, 100), color='white')
        # Add some visual features - a simple pattern
        pixels = img.load()
        for i in range(100):
            for j in range(100):
                if (i + j) % 20 < 10:
                    pixels[i, j] = (255, 0, 0)  # Red squares
                else:
                    pixels[i, j] = (0, 255, 0)  # Green squares
        
        buffer = BytesIO()
        img.save(buffer, format='JPEG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return img_base64

    def test_user_registration(self):
        """Test user registration"""
        test_user = f"test_user_{datetime.now().strftime('%H%M%S')}"
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "full_name": "Test User",
                "phone_or_email": f"{test_user}@example.com",
                "password": "test123"
            }
        )
        if success and 'token' in response:
            self.user_token = response['token']
            self.test_user_id = response.get('user_id')
            print(f"   User registered with ID: {self.test_user_id}")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        test_user = f"test_user_{datetime.now().strftime('%H%M%S')}"
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "phone_or_email": f"{test_user}@example.com",
                "password": "test123"
            }
        )
        return success

    def test_protected_route(self):
        """Test protected route with token"""
        if not self.user_token:
            print("❌ No user token available for protected route test")
            return False
            
        success, response = self.run_test(
            "Protected Route (/auth/me)",
            "GET",
            "auth/me",
            200,
            token=self.user_token
        )
        return success

    def test_ai_chat_basic(self):
        """Test basic AI chat functionality"""
        success, response = self.run_test(
            "AI Chat - Basic",
            "POST",
            "chat",
            200,
            data={
                "message": "My dog is vomiting since morning",
                "session_id": self.test_session_id
            }
        )
        if success:
            # Check response structure
            if 'response' in response and 'severity' in response:
                print(f"   AI Response received with severity: {response.get('severity')}")
                return True
            else:
                print(f"   Missing required fields in response: {response}")
        return False

    def test_ai_chat_emergency(self):
        """Test emergency detection in AI chat"""
        success, response = self.run_test(
            "AI Chat - Emergency Detection",
            "POST",
            "chat",
            200,
            data={
                "message": "My cat is bleeding heavily from leg and not moving",
                "session_id": f"{self.test_session_id}_emergency"
            }
        )
        if success:
            severity = response.get('severity')
            if severity == 'red':
                print(f"   ✅ Emergency correctly detected with RED severity")
                return True
            else:
                print(f"   ⚠️ Expected RED severity for emergency, got: {severity}")
        return False

    def test_ai_chat_with_image(self):
        """Test AI chat with image upload"""
        img_base64 = self.create_test_image_base64()
        success, response = self.run_test(
            "AI Chat - With Image",
            "POST",
            "chat",
            200,
            data={
                "message": "What's wrong with my pet in this image?",
                "session_id": f"{self.test_session_id}_image",
                "image_base64": img_base64
            }
        )
        if success and 'response' in response:
            print(f"   Image analysis response received")
            return True
        return False

    def test_doctor_application(self):
        """Test doctor application submission"""
        success, response = self.run_test(
            "Doctor Application",
            "POST",
            "doctors/apply",
            200,
            data={
                "name": "Dr. Test Veterinarian",
                "phone": "9876543210",
                "email": f"drtest_{datetime.now().strftime('%H%M%S')}@example.com",
                "qualification": "BVSc & AH",
                "registration_number": f"VET{datetime.now().strftime('%H%M%S')}",
                "specialization": "Small Animals",
                "district": "Mumbai",
                "experience_years": 5,
                "consultation_fee": 500.0,
                "availability": "Mon-Fri 9AM-6PM"
            }
        )
        return success

    def test_get_doctors(self):
        """Test getting approved doctors list"""
        success, response = self.run_test(
            "Get Doctors List",
            "GET",
            "doctors",
            200
        )
        if success:
            print(f"   Found {len(response)} approved doctors")
        return success

    def test_appointment_booking(self):
        """Test appointment booking"""
        success, response = self.run_test(
            "Appointment Booking",
            "POST",
            "appointments",
            200,
            data={
                "pet_name": "Bruno",
                "pet_type": "Dog",
                "gender": "Male",
                "age": "3 years",
                "weight": "15 kg",
                "owner_name": "Test Owner",
                "owner_number": "9988776655",
                "vaccination_status": True,
                "medical_history": "Regular checkups done",
                "time_slot": "10:00 AM"
            }
        )
        if success and 'appointment_id' in response:
            print(f"   Appointment booked with ID: {response['appointment_id']}")
            return True
        return False

    def test_contact_form(self):
        """Test contact form submission"""
        success, response = self.run_test(
            "Contact Form",
            "POST",
            "contact",
            200,
            data={
                "name": "Test Contact",
                "email": f"contact_{datetime.now().strftime('%H%M%S')}@test.com",
                "message": "Test inquiry about veterinary services"
            }
        )
        return success

    def test_admin_initialization(self):
        """Test admin initialization"""
        success, response = self.run_test(
            "Admin Initialization",
            "POST",
            "admin/init",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={
                "email": "admin@pashuvaani.com",
                "password": "admin123"
            }
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   Admin logged in successfully")
            return True
        return False

    def test_admin_dashboard(self):
        """Test admin dashboard"""
        if not self.admin_token:
            print("❌ No admin token available for dashboard test")
            return False
            
        success, response = self.run_test(
            "Admin Dashboard",
            "GET",
            "admin/dashboard",
            200,
            token=self.admin_token
        )
        if success:
            stats = ['total_users', 'total_doctors', 'pending_doctor_applications', 'total_appointments']
            for stat in stats:
                if stat in response:
                    print(f"   {stat}: {response[stat]}")
        return success

    def test_admin_doctor_applications(self):
        """Test getting doctor applications"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test(
            "Admin - Get Doctor Applications",
            "GET",
            "admin/doctor-applications?status=pending",
            200,
            token=self.admin_token
        )
        if success:
            print(f"   Found {len(response)} pending applications")
        return success

    def test_admin_emergency_logs(self):
        """Test getting emergency logs"""
        if not self.admin_token:
            print("❌ No admin token available")
            return False
            
        success, response = self.run_test(
            "Admin - Emergency Logs",
            "GET",
            "admin/emergency-logs",
            200,
            token=self.admin_token
        )
        if success:
            print(f"   Found {len(response)} emergency logs")
        return success

    def test_blogs(self):
        """Test blog endpoints"""
        success, response = self.run_test(
            "Get Blogs",
            "GET",
            "blogs",
            200
        )
        if success:
            print(f"   Found {len(response)} published blogs")
        return success

def main():
    print("🚀 Starting PashuVaani API Testing...")
    print("=" * 60)
    
    tester = PashuVaaniAPITester()
    
    # Test sequence
    tests = [
        # Core Authentication
        ("User Registration", tester.test_user_registration),
        ("Protected Route Access", tester.test_protected_route),
        
        # AI Chat - Core Feature
        ("AI Chat Basic", tester.test_ai_chat_basic),
        ("AI Chat Emergency", tester.test_ai_chat_emergency),
        ("AI Chat with Image", tester.test_ai_chat_with_image),
        
        # Doctor Management
        ("Doctor Application", tester.test_doctor_application),
        ("Get Doctors", tester.test_get_doctors),
        
        # Appointments
        ("Appointment Booking", tester.test_appointment_booking),
        
        # Contact
        ("Contact Form", tester.test_contact_form),
        
        # Admin Panel
        ("Admin Init", tester.test_admin_initialization),
        ("Admin Login", tester.test_admin_login),
        ("Admin Dashboard", tester.test_admin_dashboard),
        ("Admin Doctor Applications", tester.test_admin_doctor_applications),
        ("Admin Emergency Logs", tester.test_admin_emergency_logs),
        
        # Content
        ("Blogs", tester.test_blogs),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} - Exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {len(failed_tests)}")
    
    if failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n✅ ALL TESTS PASSED!")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())