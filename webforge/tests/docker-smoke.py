"""Docker + Caddy HTTPS check with a locally trusted test CA and disposable data."""
import http.cookiejar
import json
import os
from pathlib import Path
import secrets
import socket
import ssl
import subprocess
import tempfile
import time
import urllib.error
import urllib.request

IMAGE=os.environ.get('WEBFORGE_TEST_IMAGE','webforge-local-validation')
PREFIX='webforge-check-'+secrets.token_hex(5)
APP=PREFIX+'-app'
CADDY=PREFIX+'-caddy'
NETWORK=PREFIX+'-network'
VOLUME=PREFIX+'-data'
CADDY_VOLUME=PREFIX+'-certs'

def docker(*args, capture=False):
    return subprocess.run(['docker',*args],check=True,text=True,capture_output=capture)

def request(opener,url,method='GET',payload=None,headers=None):
    data=json.dumps(payload).encode() if payload is not None else None
    values={'Content-Type':'application/json',**(headers or {})}
    req=urllib.request.Request(url,data=data,method=method,headers=values)
    try:
        with opener.open(req,timeout=10) as response:
            return response.status,response.headers,response.read()
    except urllib.error.HTTPError as error:
        return error.code,error.headers,error.read()

with tempfile.TemporaryDirectory(prefix=PREFIX) as temp:
    temp=Path(temp)
    sock=socket.socket();sock.bind(('127.0.0.1',0));port=sock.getsockname()[1];sock.close()
    origin=f'https://localhost:{port}'
    config=temp/'Caddyfile'
    config.write_text('{\n auto_https disable_redirects\n}\nhttps://localhost:'+str(port)+' {\n tls internal\n reverse_proxy app:8080\n}\n')
    try:
        docker('network','create',NETWORK,capture=True)
        docker('volume','create',VOLUME,capture=True)
        docker('volume','create',CADDY_VOLUME,capture=True)
        docker('run','-d','--name',APP,'--network',NETWORK,'--network-alias','app','--read-only','--tmpfs','/tmp','--cap-drop','ALL','--security-opt','no-new-privileges:true','--env','APP_ORIGIN='+origin,'--env','TRUST_PROXY_HOPS=1','--volume',VOLUME+':/data',IMAGE,capture=True)
        for _ in range(40):
            probe=subprocess.run(['docker','exec',APP,'node','-e',"fetch('http://127.0.0.1:8080/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],capture_output=True)
            if probe.returncode==0:break
            time.sleep(.5)
        else:raise RuntimeError('App health check failed.')
        # Generate a test-only password inside the temporary volume; never print it.
        docker('exec',APP,'node','--input-type=module','-e',"import{randomBytes}from'node:crypto';import{writeFileSync}from'node:fs';writeFileSync('/data/test-password','Test-only-'+randomBytes(24).toString('hex'),{mode:0o600})",capture=True)
        docker('exec',APP,'npm','run','admin','--','company:create','--name','Disposable Docker test','--slug','tapioca-estacao-br','--prototype','tapioca-estacao-br',capture=True)
        docker('exec','--env','WEBFORGE_PASSWORD_FILE=/data/test-password',APP,'npm','run','admin','--','user:create','--company','tapioca-estacao-br','--username','docker-test-client',capture=True)
        docker('cp',APP+':/data/test-password',str(temp/'password'),capture=True)
        password=(temp/'password').read_text()
        docker('exec',APP,'node','--input-type=module','-e',"import{unlinkSync}from'node:fs';unlinkSync('/data/test-password')",capture=True)
        docker('run','-d','--name',CADDY,'--network',NETWORK,'--publish',f'127.0.0.1:{port}:{port}','--volume',str(config)+':/etc/caddy/Caddyfile:ro','--volume',CADDY_VOLUME+':/data','caddy:2-alpine',capture=True)
        ca=temp/'root.crt'
        for _ in range(40):
            copied=subprocess.run(['docker','cp',CADDY+':/data/caddy/pki/authorities/local/root.crt',str(ca)],capture_output=True)
            if copied.returncode==0:break
            time.sleep(.5)
        else:raise RuntimeError('Caddy test CA was not generated.')
        tls=ssl.create_default_context(cafile=str(ca))
        jar=http.cookiejar.CookieJar()
        opener=urllib.request.build_opener(urllib.request.ProxyHandler({}),urllib.request.HTTPSHandler(context=tls),urllib.request.HTTPCookieProcessor(jar))
        anonymous=urllib.request.build_opener(urllib.request.ProxyHandler({}),urllib.request.HTTPSHandler(context=tls))
        assert request(anonymous,origin+'/projetos')[0]==200
        assert request(anonymous,origin+'/projetos/tapioca-estacao-br/images/tapioca-frango.webp')[0]==401
        status,headers,body=request(opener,origin+'/projetos/api/login','POST',{'username':'docker-test-client','password':password},{'Origin':origin})
        assert status==200
        assert json.loads(body)['redirect']=='/projetos/tapioca-estacao-br/'
        cookie_header=headers['Set-Cookie']
        assert '__Host-webforge=' in cookie_header and 'Secure' in cookie_header and 'HttpOnly' in cookie_header
        assert any(c.secure for c in jar)
        assert request(opener,origin+'/projetos/tapioca-estacao-br/')[0]==200
        assert request(opener,origin+'/projetos/tapioca-estacao-br/images/tapioca-frango.webp')[0]==200
        assert request(opener,origin+'/projetos/lima-climatizacao/')[0]==403
        assert request(opener,origin+'/projetos/lima-climatizacao/images/hero.webp')[0]==403
        # Restart app: database and session must remain in the volume.
        docker('restart',APP,capture=True)
        for _ in range(40):
            try:
                if request(opener,origin+'/projetos/api/session')[0]==200:break
            except (urllib.error.URLError,TimeoutError):pass
            time.sleep(.5)
        else:raise RuntimeError('Persistent session did not survive restart.')
        assert request(opener,origin+'/projetos/api/logout','POST',headers={'Origin':origin})[0]==204
        assert request(opener,origin+'/projetos/tapioca-estacao-br/images/tapioca-frango.webp')[0]==401
        assert request(anonymous,origin+'/projetos/tapioca-estacao-br/',headers={'Cookie':cookie_header.split(';')[0]})[0]==401
        docker('exec',APP,'node','server/backup.js',capture=True)
        backup_check=docker('exec',APP,'node','--input-type=module','-e',"import{readdirSync,statSync}from'node:fs';const files=readdirSync('/data/backups');if(files.length!==1||(statSync('/data/backups/'+files[0]).mode&0o777)!==0o600)process.exit(1)",capture=True)
        assert backup_check.returncode==0
        print('PASS: production image, non-root read-only container, CLI provisioning, real Caddy HTTPS with verified test CA, Secure/HttpOnly cookie, per-company private files, persistent SQLite/session after restart, logout token revocation and consistent restricted backup.')
    except Exception:
        for container in [APP,CADDY]:
            subprocess.run(['docker','logs','--tail','20',container],check=False)
        raise
    finally:
        for container in [CADDY,APP]:subprocess.run(['docker','rm','-f',container],capture_output=True)
        for volume in [CADDY_VOLUME,VOLUME]:subprocess.run(['docker','volume','rm',volume],capture_output=True)
        subprocess.run(['docker','network','rm',NETWORK],capture_output=True)
