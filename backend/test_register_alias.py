import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from fastapi.testclient import TestClient
from backend.app.main import app
client = TestClient(app)
email = 'regtest@example.com'
resp = client.post('/api/auth/register', json={'name':'Reg Test','email':email,'password':'Secret1234'})
print('first', resp.status_code, resp.json())
resp2 = client.post('/api/auth/register', json={'name':'Reg Test','email':email,'password':'Secret1234'})
print('second', resp2.status_code, resp2.json())
