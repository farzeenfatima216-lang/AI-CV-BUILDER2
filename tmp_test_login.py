import json 
import urllib.request,urllib.error 
data=json.dumps({'email':'admin@gmail.com','password':'admin_password'}).encode('utf-8') 
req=urllib.request.Request('http://127.0.0.1:8000/api/auth/login',data=data,headers={'Content-Type':'application/json'}) 
try: 
    resp=urllib.request.urlopen(req) 
    print(resp.status) 
    print(resp.read().decode()) 
except urllib.error.HTTPError as e: 
    print('HTTP',e.code) 
    print(e.read().decode()) 
except urllib.error.URLError as e: 
    print('URLERR',e.reason) 
