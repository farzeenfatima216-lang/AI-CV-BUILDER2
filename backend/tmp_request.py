import urllib.request, urllib.error, json
urls=[('POST', 'http://127.0.0.1:8000/api/ai/summary', {'text': 'hello'}),('POST', 'http://127.0.0.1:8000/api/ai/rewrite', {'text': 'hello'}),('POST', 'http://127.0.0.1:8000/api/ai/experience-rewrite', {'text': 'hello'}),('POST', 'http://127.0.0.1:8000/api/ai/improve-skills', {'text': 'python,react,sql'}),('POST', 'http://127.0.0.1:8000/api/ai/cover-letter', {'name': 'Alex', 'role': 'Engineer', 'company': 'ACME'}),('POST', 'http://127.0.0.1:8000/api/ai/linkedin', {'name': 'Alex', 'summary': 'building modern web apps'}),('GET', 'http://127.0.0.1:8000/api/dashboard', None)];
for method,url,payload in urls:
    print('---',method,url)
    try:
        if method=='POST':
            data=json.dumps(payload).encode('utf-8')
            req=urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
        else:
            req=urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=10) as resp:
            print('STATUS', resp.status)
            print(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print('HTTP ERROR', e.code, e.read().decode('utf-8'))
    except Exception as e:
        print('ERROR', type(e).__name__, e)
