import json
import urllib.request
import urllib.error

login_data = json.dumps({'email':'test@example.com','password':'secret123'}).encode()
req = urllib.request.Request('http://127.0.0.1:8000/auth/login', data=login_data, headers={'Content-Type':'application/json'})
with urllib.request.urlopen(req) as resp:
    token = json.load(resp)['access_token']

payload = json.dumps({
    'personal_information': {'name': 'Test User'},
    'education': [],
    'experience': [],
    'skills': {'technical': ['Python'], 'soft': ['Communication']},
    'projects': [],
    'certifications': []
}).encode()
req2 = urllib.request.Request('http://127.0.0.1:8000/resume/create', data=payload, headers={'Content-Type':'application/json','Authorization':'Bearer ' + token})
try:
    with urllib.request.urlopen(req2) as resp2:
        print(resp2.read().decode())
except urllib.error.HTTPError as e:
    print('STATUS', e.code)
    print(e.read().decode())
