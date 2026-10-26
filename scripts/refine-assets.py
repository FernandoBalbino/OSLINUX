from pathlib import Path
import json,urllib.request,posixpath
root=Path(__file__).resolve().parents[1]
data=json.load(urllib.request.urlopen('https://api.github.com/repos/ubuntu/yaru/git/trees/master?recursive=1'))
entries={x['path']:x for x in data['tree']}
print('CURSOR SOURCES:', '\n'.join(p for p in entries if ('left_ptr' in p or 'pointer' in p or 'cursor' in p and p.endswith('.svg')))[:3000],flush=True)
replacements={'org.gnome.Evince':'org.gnome.Papers','org.gnome.eog':'org.gnome.Loupe','gnome-system-monitor':'net.nokyan.Resources','org.gnome.Terminal':'org.gnome.Ptyxis','org.gnome.Totem':'org.gnome.Showtime'}
catalog=root/'src/core/catalog.js';s=catalog.read_text(encoding='utf-8')
for old,new in replacements.items():s=s.replace(old,new)
catalog.write_text(s,encoding='utf-8')
def read(path):
    for _ in range(10):
        url=f"https://raw.githubusercontent.com/ubuntu/yaru/{data['sha']}/{path}"
        payload=urllib.request.urlopen(url,timeout=30).read()
        if entries[path].get('mode')!='120000':return payload,url
        path=posixpath.normpath(posixpath.join(posixpath.dirname(path),payload.decode().strip()))
    raise RuntimeError('Cyclic symlink')
out=root/'public/assets/cursors';out.mkdir(parents=True,exist_ok=True)
manifest_path=root/'asset-sources.json';manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
import hashlib
for name in ['left_ptr','hand2','xterm']:
    path=f'icons/Yaru/cursors/{name}.cur'
    payload,url=read(path)
    (out/f'{name}.cur').write_bytes(payload)
    manifest['assets']=[x for x in manifest['assets'] if x['file']!=f'cursors/{name}.cur']
    manifest['assets'].append({'file':f'cursors/{name}.cur','source':url,'license':'CC-BY-SA-4.0','sha256':hashlib.sha256(payload).hexdigest()})
    print(name, len(payload),payload[:8].hex(),flush=True)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
