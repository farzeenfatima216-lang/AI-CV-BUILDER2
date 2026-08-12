import urllib.request
for path in ['/assets/index-2cd3cddf.js','/assets/index-3c2c9508.css','/register']:
    url = 'http://127.0.0.1:8000' + path
    try:
        data = urllib.request.urlopen(url).read()
        print(path, 'ok', len(data))
        print(data[:200])
    except Exception as e:
        print(path, 'error', e)
