import urllib.request, urllib.error, json
url='http://127.0.0.1:8000/api/auth/register'
payload={'name': 'Debug User', 'email': 'debug@example.com', 'password': 'Password123!'}
req=urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print('REGISTER', resp.status, resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('REGISTER ERROR', e.code, e.read().decode('utf-8'))
url='http://127.0.0.1:8000/api/auth/login'
payload={'email': 'debug@example.com', 'password': 'Password123!'}
req=urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        login_resp=resp.read().decode('utf-8'); print('LOGIN', resp.status, login_resp)
        data=json.loads(login_resp); token=data.get('access_token')
except urllib.error.HTTPError as e:
    print('LOGIN ERROR', e.code, e.read().decode('utf-8')); token=None
if token:
    url='http://127.0.0.1:8000/api/dashboard'
    req=urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'}, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print('DASHBOARD', resp.status, resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print('DASHBOARD ERROR', e.code, e.read().decode('utf-8'))
