from pathlib import Path
from PIL import Image,ImageDraw,ImageChops,ImageStat
import json,math
root=Path(__file__).resolve().parents[1];out=root/'qa/evidence'
scores=[]
for number,name in [(1,'desktop'),(2,'apps'),(3,'firefox-quick-settings')]:
 reference=Image.open(root/f'qa/references/scene-{number}.png').convert('RGB');actual=Image.open(out/f'{name}.png').convert('RGB')
 assert reference.size==actual.size,(name,reference.size,actual.size)
 overlay=Image.blend(reference,actual,.5);overlay.save(out/f'{name}-overlay.png')
 comparison=Image.new('RGB',(reference.width*2,reference.height+40),'white');comparison.paste(reference,(0,40));comparison.paste(actual,(reference.width,40));draw=ImageDraw.Draw(comparison);draw.text((20,12),'REFERENCIA DO USUARIO',fill='#202035');draw.text((reference.width+20,12),'OSLINUX - PT-BR + TRILHA',fill='#202035');comparison.save(out/f'{name}-comparison.png')
 scores.append(dict(scene=name,resolution=reference.size,meanAbsoluteRGBDifference=round(sum(ImageStat.Stat(ImageChops.difference(reference,actual)).mean)/3,3)))
(out/'comparison-metrics.json').write_text(json.dumps(scores,indent=2))
for start,end,label in [(1,6,'slides-contact-1'),(7,11,'slides-contact-2')]:
 sheet=Image.new('RGB',(1368,math.ceil((end-start+1)/2)*410),'#e5e2ef');draw=ImageDraw.Draw(sheet)
 for position,number in enumerate(range(start,end+1)):
  im=Image.open(out/f'slide-{number:02}.png');im.thumbnail((668,376));x=(position%2)*684+8;y=(position//2)*410+25;sheet.paste(im,(x,y));draw.text((x,y-17),f'SLIDE {number}',fill='#202035')
 sheet.save(out/f'{label}.png')
actual=Image.open(out/'firefox-quick-settings.png');reference=Image.open(root/'qa/references/scene-3.png')
for label,box in [('firefox',(464,112,1404,752)),('quick',(1568,38,1912,388)),('dock',(0,0,66,911))]:
 a=actual.crop(box);r=reference.crop(box);canvas=Image.new('RGB',(a.width*2,a.height+25),'white');canvas.paste(r,(0,25));canvas.paste(a,(a.width,25));draw=ImageDraw.Draw(canvas);draw.text((5,5),'REFERENCIA',fill='black');draw.text((a.width+5,5),'OSLINUX',fill='black');canvas.save(out/f'crop-{label}.png')
print(json.dumps(scores))
