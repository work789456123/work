"""
PashuVaani API Backend Tests
Tests for: doctors, blogs, appointments, auth, admin endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """API Health Check Tests"""
    
    def test_api_root(self):
        """Test API root endpoint returns status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "version" in data
        print(f"API Status: {data}")


class TestDoctorsAPI:
    """Doctors endpoint tests - static doctors list"""
    
    def test_get_doctors_returns_list(self):
        """Test GET /api/doctors returns list of doctors"""
        response = requests.get(f"{BASE_URL}/api/doctors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 4  # Should have 4 static doctors
        print(f"Found {len(data)} doctors")
    
    def test_doctors_have_required_fields(self):
        """Test each doctor has required fields"""
        response = requests.get(f"{BASE_URL}/api/doctors")
        assert response.status_code == 200
        doctors = response.json()
        
        required_fields = ["id", "name", "image", "specialization", "years_of_practice", "consultation_fee"]
        for doctor in doctors:
            for field in required_fields:
                assert field in doctor, f"Missing field: {field} in doctor {doctor.get('name', 'unknown')}"
        print("All doctors have required fields")
    
    def test_doctors_names(self):
        """Test specific doctor names are present"""
        response = requests.get(f"{BASE_URL}/api/doctors")
        doctors = response.json()
        names = [d["name"] for d in doctors]
        
        expected_names = ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Amit Patel", "Dr. Sneha Reddy"]
        for name in expected_names:
            assert name in names, f"Expected doctor {name} not found"
        print(f"All expected doctors found: {names}")


class TestBlogsAPI:
    """Blogs endpoint tests"""
    
    def test_get_blogs_returns_list(self):
        """Test GET /api/blogs returns list of blogs"""
        response = requests.get(f"{BASE_URL}/api/blogs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} blogs")
    
    def test_blogs_have_required_fields(self):
        """Test each blog has required fields"""
        response = requests.get(f"{BASE_URL}/api/blogs")
        assert response.status_code == 200
        blogs = response.json()
        
        if len(blogs) == 0:
            pytest.skip("No blogs available to test")
        
        required_fields = ["id", "title", "description", "content", "published"]
        for blog in blogs:
            for field in required_fields:
                assert field in blog, f"Missing field: {field} in blog"
        print("All blogs have required fields")
    
    def test_get_single_blog(self):
        """Test GET /api/blogs/{id} returns single blog"""
        # First get list of blogs
        response = requests.get(f"{BASE_URL}/api/blogs")
        blogs = response.json()
        
        if len(blogs) == 0:
            pytest.skip("No blogs available to test")
        
        blog_id = blogs[0]["id"]
        response = requests.get(f"{BASE_URL}/api/blogs/{blog_id}")
        assert response.status_code == 200
        blog = response.json()
        assert blog["id"] == blog_id
        print(f"Successfully fetched blog: {blog['title']}")
    
    def test_get_nonexistent_blog_returns_404(self):
        """Test GET /api/blogs/{invalid_id} returns 404"""
        response = requests.get(f"{BASE_URL}/api/blogs/nonexistent-id-12345")
        assert response.status_code == 404
        print("Correctly returns 404 for nonexistent blog")


class TestAppointmentsAPI:
    """Appointments endpoint tests"""
    
    def test_create_appointment_success(self):
        """Test POST /api/appointments creates appointment"""
        appointment_data = {
            "pet_name": "TEST_Buddy",
            "pet_type": "Dog",
            "gender": "Male",
            "age": "3 years",
            "weight": "15",
            "weight_unit": "KG",
            "owner_name": "TEST_John Doe",
            "owner_number": "9876543210",
            "vaccination_status": True,
            "medical_history_available": True,
            "medical_history": "No previous issues",
            "time_slot": "10:00 AM"
        }
        
        response = requests.post(f"{BASE_URL}/api/appointments", json=appointment_data)
        assert response.status_code == 200
        data = response.json()
        assert "appointment_id" in data
        assert data["status"] == "pending"
        print(f"Appointment created: {data['appointment_id']}")
    
    def test_create_appointment_with_lbs_weight(self):
        """Test appointment with LBS weight unit"""
        appointment_data = {
            "pet_name": "TEST_Max",
            "pet_type": "Cat",
            "gender": "Female",
            "age": "2 years",
            "weight": "10",
            "weight_unit": "LBS",
            "owner_name": "TEST_Jane Smith",
            "owner_number": "9876543211",
            "vaccination_status": False,
            "medical_history_available": False,
            "medical_history": "",
            "time_slot": "2:00 PM"
        }
        
        response = requests.post(f"{BASE_URL}/api/appointments", json=appointment_data)
        assert response.status_code == 200
        data = response.json()
        assert "appointment_id" in data
        print(f"Appointment with LBS weight created: {data['appointment_id']}")


class TestAuthAPI:
    """Authentication endpoint tests"""
    
    def test_register_new_user(self):
        """Test POST /api/auth/register creates new user"""
        unique_id = str(uuid.uuid4())[:8]
        user_data = {
            "full_name": f"TEST_User_{unique_id}",
            "phone_or_email": f"test_{unique_id}@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["full_name"] == user_data["full_name"]
        assert data["credits"] == 3  # New users get 3 free credits
        print(f"User registered: {data['full_name']}")
    
    def test_register_duplicate_user_fails(self):
        """Test registering duplicate user returns error"""
        unique_id = str(uuid.uuid4())[:8]
        user_data = {
            "full_name": f"TEST_Duplicate_{unique_id}",
            "phone_or_email": f"duplicate_{unique_id}@example.com",
            "password": "testpass123"
        }
        
        # First registration
        response1 = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        assert response1.status_code == 200
        
        # Second registration with same email
        response2 = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        assert response2.status_code == 400
        print("Duplicate registration correctly rejected")
    
    def test_login_success(self):
        """Test POST /api/auth/login with valid credentials"""
        unique_id = str(uuid.uuid4())[:8]
        user_data = {
            "full_name": f"TEST_Login_{unique_id}",
            "phone_or_email": f"login_{unique_id}@example.com",
            "password": "testpass123"
        }
        
        # Register first
        requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        
        # Login
        login_data = {
            "phone_or_email": user_data["phone_or_email"],
            "password": user_data["password"]
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["full_name"] == user_data["full_name"]
        print(f"Login successful for: {data['full_name']}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        login_data = {
            "phone_or_email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 401
        print("Invalid login correctly rejected")


class TestAdminAPI:
    """Admin endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        # Initialize admin first
        requests.post(f"{BASE_URL}/api/admin/init")
        
        # Login as admin
        login_data = {
            "email": "admin@pashuvaani.com",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/api/admin/login", json=login_data)
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Admin login failed")
    
    def test_admin_init(self):
        """Test POST /api/admin/init creates admin"""
        response = requests.post(f"{BASE_URL}/api/admin/init")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"Admin init: {data['message']}")
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        # Initialize admin first
        requests.post(f"{BASE_URL}/api/admin/init")
        
        login_data = {
            "email": "admin@pashuvaani.com",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/api/admin/login", json=login_data)
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        print("Admin login successful")
    
    def test_admin_login_invalid_credentials(self):
        """Test admin login with invalid credentials"""
        login_data = {
            "email": "admin@pashuvaani.com",
            "password": "wrongpassword"
        }
        response = requests.post(f"{BASE_URL}/api/admin/login", json=login_data)
        assert response.status_code == 401
        print("Invalid admin login correctly rejected")
    
    def test_admin_dashboard_requires_auth(self):
        """Test admin dashboard requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard")
        assert response.status_code in [401, 403]
        print("Admin dashboard correctly requires auth")
    
    def test_admin_dashboard_with_auth(self, admin_token):
        """Test admin dashboard with valid token"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_users" in data
        assert "total_appointments" in data
        print(f"Admin dashboard: {data}")


class TestContactAPI:
    """Contact form endpoint tests"""
    
    def test_submit_contact_form(self):
        """Test POST /api/contact submits form"""
        contact_data = {
            "name": "TEST_Contact User",
            "email": "testcontact@example.com",
            "message": "This is a test message"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"Contact form submitted: {data['message']}")


class TestSeedAPI:
    """Seed data endpoint tests"""
    
    def test_seed_blogs(self):
        """Test POST /api/seed/blogs seeds blog data"""
        response = requests.post(f"{BASE_URL}/api/seed/blogs")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"Seed blogs: {data['message']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
