"""Bundle the isolated room interaction study for local visual review.

This does not change index.html or deploy anything. The room, font, styles and
interaction code are embedded; music remains opt-in from its credited source.
"""
from pathlib import Path
import base64
import mimetypes
import re

root = Path(__file__).resolve().parent
dist = root / 'dist'
site = 'https://josh-gier-after-hours.joshuagier.chatgpt.site'
source = (dist / 'room-study.html').read_text()

def inline_asset(path):
    file = dist / path.lstrip('/')
    mime = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(file.read_bytes()).decode()

def stylesheet(match):
    path = match.group(1).split('?')[0]
    if path in ['/showcase.css', '/mac-desktop.css']:
        return ''
    css = (dist / path.lstrip('/')).read_text()
    css = re.sub(r"url\(['\"]?(/assets/[^)'\"]+)['\"]?\)",
                 lambda m: 'url("' + inline_asset(m.group(1)) + '")', css)
    return '<style>\n' + css + '\n</style>'

source = re.sub(r'<link rel="stylesheet" href="([^"]+)">', stylesheet, source)
source = source.replace('href="/assets/bedroom.webp"', 'href="' + inline_asset('/assets/bedroom.webp') + '"')
source = source.replace('src="/assets/bedroom.webp"', 'src="' + inline_asset('/assets/bedroom.webp') + '"')
source = re.sub(r'\s*<script type="module" src="/room-study.js"></script>', '', source)
code = '\n'.join((dist / name).read_text() for name in ['screens.js', 'sound.js', 'room-study.js'])
code = re.sub(r'^import .*?;\n', '', code, flags=re.M)
code = re.sub(r'^export ', '', code, flags=re.M)
code = code.replace('/index.html#', site + '/#')
source = source.replace('href="/index.html"', 'href="' + site + '"')
source = source.replace('</body>', '<script>\n' + code + '\n</script>\n</body>')
license_text = (dist / 'assets/chicago-font-license.txt').read_text()
source = source.replace('<head>', '<head>\n<!--\nRoom interaction study.\nChiKareGo2 font recreation by Giles Booth, distributed with System.css.\nSource: https://github.com/sakofchit/system.css\n' + license_text + '\n-->')
output = dist / 'room-study-portable.html'
output.write_text(source)
print(f'{output}: {output.stat().st_size:,} bytes')
