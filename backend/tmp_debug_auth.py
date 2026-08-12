import os
import json
import sqlite3
import urllib.request
import urllib.error

print('cwd', os.getcwd())
db_path = os.path.join('backend', 'app.db')
print('db_path', db_path)
print('exists', os.path.exists(db_path))
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute('SELECT id, name, email, password_hash FROM users')
        rows = cur.fetchall()
        print('users', rows)
    except Exception as e:
        print('db read error', e)
    conn.close()
else:
    print('no db file')

try:
    data = json.dumps({'email': 'test@example.com', 'password': 'secret123'}).encode()
    req = urllib.request.Request('http://127.0.0.1:8000/api/auth/login', data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=5) as resp:
        print('status', resp.status)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('HTTPERR', e.code, e.read().decode())
except Exception as e:
    print('REQERR', type(e).__name__, e)
