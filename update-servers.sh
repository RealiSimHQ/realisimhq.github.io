#!/bin/bash
# Scan AssettoServer ports 9000-9010 and update server-status.json
cd "$(dirname "$0")"
python3 -c "
import json, subprocess
results = []
for port in range(9000, 9011):
    try:
        r = subprocess.run(['ssh', '-o', 'ConnectTimeout=3', 'pods@152.53.83.105',
            f'curl -s --connect-timeout 2 http://localhost:{port}/api/details'],
            capture_output=True, text=True, timeout=10)
        if r.returncode == 0 and r.stdout.strip().startswith('{'):
            data = json.loads(r.stdout.split('___')[0] if '___' in r.stdout else r.stdout)
            if 'name' in data:
                track = data.get('trackBase', data.get('track', '')).split('/')[-1].replace('-X10DD','')
                results.append({
                    'port': port,
                    'online': True,
                    'clients': data.get('clients', 0),
                    'maxclients': data.get('maxclients', 0),
                    'name': data.get('name', ''),
                    'track': track
                })
                continue
    except: pass
    results.append({'port': port, 'online': False, 'clients': 0, 'maxclients': 0, 'name': '', 'track': ''})

with open('server-status.json', 'w') as f:
    json.dump(results, f)
print(f'Updated: {sum(1 for r in results if r[\"online\"])} online')
"
git add server-status.json
git commit -m "auto: update server status" --allow-empty 2>/dev/null
git push origin main 2>/dev/null
