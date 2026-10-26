"""Fetch original upstream assets, resolve Git symlinks and record their provenance."""
import concurrent.futures, hashlib, io, json, pathlib, posixpath, shutil, tarfile, urllib.parse, urllib.request
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'assets'
OUT.mkdir(parents=True, exist_ok=True)
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'OSLINUX-assets'}), timeout=90).read()
tree = json.loads(get('https://api.github.com/repos/ubuntu/yaru/git/trees/master?recursive=1'))
sha = tree['sha']; entries = {x['path']: x for x in tree['tree']}
records = []
def save(name, data, url, license):
    path = OUT / name; path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(data)
    records.append({'file':name, 'source':url, 'license':license, 'sha256':hashlib.sha256(data).hexdigest()})
def yaru(name, path):
    for _ in range(12):
        url = f'https://raw.githubusercontent.com/ubuntu/yaru/{sha}/{path}'
        data = get(url)
        if entries.get(path, {}).get('mode') != '120000': break
        path = posixpath.normpath(posixpath.join(posixpath.dirname(path), data.decode().strip()))
    save(name, data, url, 'CC-BY-SA-4.0')
apps = ['snap-store','file-roller','org.gnome.Calculator','org.gnome.Calendar','org.gnome.Snapshot','org.gnome.Characters','org.gnome.clocks','disk-usage-app','disk-utility-app','org.gnome.Evince','org.gnome.Nautilus','gparted','org.gnome.Yelp','org.gnome.eog','libreoffice-main','libreoffice-calc','libreoffice-draw','libreoffice-impress','libreoffice-writer','log-viewer-app','org.gnome.Rhythmbox3','org.gnome.Settings','org.gnome.Shotwell','software-properties','software-updater','usb-creator-gtk','gnome-system-monitor','org.gnome.Terminal','org.gnome.TextEditor','transmission','org.gnome.Totem']
aliases={'org.gnome.Evince':'evince','org.gnome.eog':'eog','org.gnome.Terminal':'gnome-terminal','org.gnome.Totem':'totem','org.gnome.Snapshot':'cheese'}
replacements={'org.gnome.Evince':'org.gnome.Papers','org.gnome.eog':'org.gnome.Loupe','gnome-system-monitor':'net.nokyan.Resources','org.gnome.Terminal':'org.gnome.Ptyxis','org.gnome.Totem':'org.gnome.Showtime'}
apps=[replacements.get(app,app) for app in apps]
jobs=[]
for app in apps:
    path = next((f'icons/Yaru/{size}/apps/{n}.png' for n in [app,aliases.get(app,app)] for size in ['256x256','128x128','48x48'] if f'icons/Yaru/{size}/apps/{n}.png' in entries),None)
    if not path: raise RuntimeError('Missing original app icon: '+app)
    jobs.append((f'apps/{app}.png',path))
for item in ['user-home','folder','user-trash','user-trash-full','folder-documents','folder-download','folder-pictures','folder-music','folder-videos','user-desktop','folder-publicshare','folder-templates']:
    path=next(p for size in ['256x256','48x48'] for p in entries if p.startswith(f'icons/Yaru/{size}/') and p.endswith(f'/{item}.png'))
    jobs.append((f'places/{item}.png',path))
symbols=['network-wireless-signal-excellent','network-wireless-disabled','audio-volume-high','audio-volume-muted','display-brightness','battery-full','bluetooth-active','airplane-mode','weather-clear-night','notifications-disabled','system-lock-screen','system-shutdown','preferences-system','fingerprint','power-profile-balanced','window-close','window-minimize','window-maximize','go-previous','go-next','go-up','go-home','view-refresh','system-search','list-add','view-more','view-grid','view-list','document-save','folder-new','edit-copy','edit-cut','edit-paste','edit-delete','document-new','application-menu','pan-end','media-playback-start','start-here','text-x-generic','dialog-information','audio-input-microphone']
symbols += ['user-home','user-trash','folder-documents','folder-download','folder-pictures','folder-music','folder-videos','user-desktop','folder-publicshare','folder-templates']
for symbol in symbols:
    name=symbol+'-symbolic.svg'
    paths=[p for p in entries if p.startswith('icons/Yaru/scalable/') and p.endswith('/'+name)]
    if not paths:
        paths=[p for p in entries if '/scalable/' in p and p.endswith('/'+name)]
    if paths: jobs.append((f'symbolic/{symbol}.svg',paths[0]))
    else: print('Symbol not shipped by Yaru:', symbol)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(lambda pair: yaru(*pair),jobs))
for repo, stem in [('Ubuntu-Sans-fonts','UbuntuSans'),('Ubuntu-Sans-Mono-fonts','UbuntuSansMono')]:
    data=json.loads(get(f'https://api.github.com/repos/canonical/{repo}/contents/fonts/variable'))
    font=next(x for x in data if 'Italic' not in x['name'])
    save(f'fonts/{stem}.ttf',get(font['download_url']),font['download_url'],'Ubuntu-Font-License-1.0')
    url=f'https://raw.githubusercontent.com/canonical/{repo}/main/LICENCE.txt'
    save(f'licenses/{stem}.txt',get(url),url,'Ubuntu-Font-License-1.0')
for name,url,license in [
 ('apps/firefox.svg','https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg','Mozilla trademark; MPL-2.0 artwork'),
 ('apps/thunderbird.png','https://www.thunderbird.net/media/img/thunderbird/thunderbird-256.png','Thunderbird trademark; MPL-2.0 artwork'),
 ('licenses/Yaru.txt',f'https://raw.githubusercontent.com/ubuntu/yaru/{sha}/LICENSE_CCBYSA','CC-BY-SA-4.0')]:
    save(name,get(url),url,license)
for suffix,outname in [('warty-final-ubuntu.webp','wallpapers/resolute.webp'),('ubuntu-wallpaper-d.webp','wallpapers/resolute-dark.webp')]:
    url=f'https://meulinux.com/sim-assets/ubuntu/wallpapers/{suffix}'
    save(outname,get(url),url,'Ubuntu wallpaper package; see licenses/wallpapers-copyright.txt')
license_url='https://git.launchpad.net/ubuntu/+source/ubuntu-wallpapers/plain/debian/copyright?h=applied/ubuntu/resolute'
try: save('licenses/wallpapers-copyright.txt',get(license_url),license_url,'Upstream copyright notice')
except Exception as error: print('Wallpaper copyright fetch:',error)
(ROOT/'asset-sources.json').write_text(json.dumps({'yaruCommit':sha,'wallpaperVersion':'26.04.2','assets':sorted(records,key=lambda r:r['file'])},ensure_ascii=False,indent=2),encoding='utf-8')
refs=ROOT/'qa'/'references'; refs.mkdir(parents=True,exist_ok=True)
from PIL import Image
for idx,filename,crop in [(1,'5a9671d8-6647-40e4-b219-90ca82a7dc45',(0,5,1916,914)),(2,'97e75940-6efb-48b4-966d-810aab3db4e6',(0,8,1919,919)),(3,'22afffd1-f15e-45a5-9b3c-7657b4382339',(0,121,1919,1032))]:
    source=pathlib.Path.home()/'AppData/Local/Temp'/f'codex-clipboard-{filename}.png'
    shutil.copy2(source,refs/f'original-{idx}.png')
    Image.open(source).crop(crop).save(refs/f'scene-{idx}.png')
print(f'Downloaded {len(records)} original assets. Yaru {sha}')
