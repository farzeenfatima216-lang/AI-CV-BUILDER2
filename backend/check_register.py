import urllib.request
for path in ['/','/register','/static/assets/index-2cd3cddf.js']:
    url = 'http://127.0.0.1:8000' + path
    try:
        r = urllib.request.urlopen(url)
        print(path, 'status', r.status)
    except Exception as e:
        print(path, 'error', e)
