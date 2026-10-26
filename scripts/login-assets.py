from pathlib import Path
import hashlib,json,posixpath,urllib.request
root=Path(__file__).resolve().parents[1];manifestPath=root/'asset-sources.json'
manifest=json.loads(manifestPath.read_text(encoding='utf-8-sig'));sha=manifest['yaruCommit']
for file,url,license in [
 ('symbolic/avatar-default.svg',f'https://raw.githubusercontent.com/ubuntu/yaru/{sha}/icons/Yaru/scalable/status/avatar-default-symbolic.svg','CC-BY-SA-4.0'),
 ('ubuntu-wordmark.svg','https://commons.wikimedia.org/wiki/Special:FilePath/Ubuntu%20logo%20light-on-dark.svg','Ubuntu trademark, Canonical; original brand asset')]:
 for _ in range(10):
  data=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'OSLINUX'}),timeout=30).read()
  if data.lstrip().startswith(b'<'):break
  url=urllib.parse.urljoin(url,data.decode().strip())
 (root/'public/assets'/file).write_bytes(data)
 manifest['assets']=[entry for entry in manifest['assets'] if entry['file']!=file]+[dict(file=file,source=url,license=license,sha256=hashlib.sha256(data).hexdigest())]
manifestPath.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Avatar Yaru e marca oficial Ubuntu salvos localmente.')
