import hashlib,json,pathlib,posixpath,urllib.request
root=pathlib.Path(__file__).resolve().parents[1]
manifest=json.loads((root/'asset-sources.json').read_text(encoding='utf-8'))
def get(url):return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'OSLINUX'}),timeout=45).read()
def save(file,url,license):
 data=get(url);(root/'public/assets'/file).write_bytes(data)
 manifest['assets']=[x for x in manifest['assets'] if x['file']!=file]+[dict(file=file,source=url,license=license,sha256=hashlib.sha256(data).hexdigest())]
sha=manifest['yaruCommit']
tree=json.loads(get(f'https://api.github.com/repos/ubuntu/yaru/git/trees/{sha}?recursive=1'))
entries={x['path']:x for x in tree['tree']}
save('apps/google-chrome.svg','https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg','Google Chrome trademark; see upstream SVG metadata')
for name in ['org.gnome.Weather']:
 path=next(p for p in entries if p.startswith('icons/Yaru/256x256/apps/') and p.endswith('/'+name+'.png'))
 for _ in range(12):
  url=f'https://raw.githubusercontent.com/ubuntu/yaru/{sha}/{path}';data=get(url)
  if entries[path]['mode']!='120000':break
  path=posixpath.normpath(posixpath.join(posixpath.dirname(path),data.decode().strip()))
 save('apps/'+name+'.png',url,'CC-BY-SA-4.0')
for file,path in [('Inter.ttf','ofl/inter/Inter%5Bopsz,wght%5D.ttf'),('BarlowCondensed-Bold.ttf','ofl/barlowcondensed/BarlowCondensed-Bold.ttf')]:
 save('fonts/'+file,'https://raw.githubusercontent.com/google/fonts/main/'+path,'SIL-OFL-1.1')
for name,path in [('Inter','inter'),('BarlowCondensed','barlowcondensed')]:save('licenses/'+name+'.txt',f'https://raw.githubusercontent.com/google/fonts/main/ofl/{path}/OFL.txt','SIL-OFL-1.1')
for file in (root/'public/assets').rglob('*'):
 if not file.is_file():continue
 relative=file.relative_to(root/'public/assets').as_posix()
 if any(x['file']==relative for x in manifest['assets']):continue
 if relative.startswith('cursors/') and file.suffix=='.png':source='https://meulinux.com/sim-assets/ubuntu/'+relative;license='Yaru; CC-BY-SA-4.0'
 elif relative=='google.png':source='https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png';license='Google trademark'
 elif relative.startswith('learning/oslab-'):source='https://github.com/FernandoBalbino/OSLab/tree/main/assets/learning/mascot';license='Original OSLab illustration, Fernando Balbino'
 elif relative.startswith('learning/checkmark') or relative.startswith('learning/Fluent'):source='https://github.com/microsoft/fluentui-system-icons';license='MIT'
 elif relative=='learning/linux-basics-icon.png':source='Original OSLINUX artwork, generated with Image Generation';license='Original generated artwork'
 else:continue
 manifest['assets'].append(dict(file=relative,source=source,license=license,sha256=hashlib.sha256(file.read_bytes()).hexdigest()))
manifest['assets'].sort(key=lambda x:x['file'])
(root/'asset-sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Assets e fontes locais atualizados.')
