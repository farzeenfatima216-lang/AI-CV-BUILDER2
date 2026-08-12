from fastapi.testclient import TestClient
from backend.app.main import app
import random
import string

client = TestClient(app)
email = "testuser_" + "".join(random.choice(string.ascii_lowercase) for _ in range(6)) + "@example.com"
print('email', email)

resp = client.post('/api/auth/signup', json={
    'name': 'Test User',
    'email': email,
    'password': 'Secret1234'
})
print('signup', resp.status_code, resp.json())
assert resp.status_code == 200

resp = client.post('/api/auth/login', json={
    'email': email,
    'password': 'Secret1234'
})
print('login', resp.status_code, resp.json())
assert resp.status_code == 200

headers = {'Authorization': f"Bearer {resp.json()['access_token']}"}
resp = client.get('/api/auth/me', headers=headers)
print('me', resp.status_code, resp.json())
assert resp.status_code == 200

resp = client.post('/api/resume/create', json={
    'title': 'My Resume',
    'selected_template': 'modern',
    'personal_information': {'name': 'Test User'},
    'summary': 'Summary',
    'education': [],
    'experience': [],
    'skills': {},
    'projects': [],
    'certifications': [],
    'languages': [],
    'achievements': [],
    'references': []
}, headers=headers)
print('resume', resp.status_code, resp.json())
assert resp.status_code == 200

resp = client.get('/api/resumes', headers=headers)
print('resumes', resp.status_code, resp.json())
assert resp.status_code == 200
print('All checks passed successfully.')

# duplicate registration check
resp = client.post('/api/auth/signup', json={'name': 'Test User', 'email': email, 'password': 'Secret1234'})
print('duplicate signup', resp.status_code, resp.json())
assert resp.status_code == 409

# AI endpoints smoke test
resp = client.post('/api/ai/improve', json={'text': 'This is a test'})
print('ai improve', resp.status_code, resp.json())
assert resp.status_code == 200
resp = client.post('/api/ai/cover-letter', json={'name': 'Test User', 'role': 'Engineer', 'company': 'ACME'})
print('ai cover-letter', resp.status_code, resp.json())
assert resp.status_code == 200
resp = client.post('/api/ai/linkedin', json={'name': 'Test User', 'summary': 'Experienced engineer'})
print('ai linkedin', resp.status_code, resp.json())
assert resp.status_code == 200
resp = client.post('/api/ats/analyze', json={'text': 'Experienced engineer with AI skills'})
print('ats analyze', resp.status_code, resp.json())
assert resp.status_code == 200
