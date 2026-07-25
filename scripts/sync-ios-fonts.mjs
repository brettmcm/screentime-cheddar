#!/usr/bin/env node
/**
 * Converts @screentime/cheddar-ds woff2 fonts into named static TTFs for iOS.
 * Requires: pip install -r scripts/requirements-fonts.txt
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dsFonts = path.join(root, 'node_modules/@screentime/cheddar-ds/dist/fonts')
const outDir = path.join(
  root,
  'apps/ios/Packages/CheddarDS/Sources/CheddarDS/Resources/Fonts',
)

fs.mkdirSync(outDir, { recursive: true })

const py = `
from fontTools.ttLib.woff2 import decompress
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
import tempfile, os, shutil, urllib.request, sys

ds, out = sys.argv[1], sys.argv[2]
for f in os.listdir(out):
    os.remove(os.path.join(out, f))
tmp = tempfile.mkdtemp()

def set_names(font, family, style, ps):
    name = font['name']
    for rec in list(name.names):
        if rec.nameID in (1,2,3,4,6,16,17):
            name.names.remove(rec)
    def add(nid, string):
        name.setName(string, nid, 3, 1, 0x409)
        name.setName(string, nid, 1, 0, 0)
    add(1, family); add(2, style); add(3, f'1.000;CDS;{ps}')
    add(4, f'{family} {style}' if style != 'Regular' else family)
    add(6, ps); add(16, family); add(17, style)

mona_ttf = os.path.join(tmp, 'mona.ttf')
decompress(os.path.join(ds, 'mona-sans-latin-wght-normal.woff2'), mona_ttf)
mona = TTFont(mona_ttf)
for weight, style, ps, filename in [
    (500, 'Medium', 'MonaSans-Medium', 'MonaSans-Medium.ttf'),
    (600, 'SemiBold', 'MonaSans-SemiBold', 'MonaSans-SemiBold.ttf'),
    (700, 'Bold', 'MonaSans-Bold', 'MonaSans-Bold.ttf'),
]:
    inst = instancer.instantiateVariableFont(mona, {'wght': weight}, inplace=False)
    set_names(inst, 'Mona Sans', style, ps)
    for tag in ('fvar','avar'):
        if tag in inst: del inst[tag]
    inst.save(os.path.join(out, filename))
    print('Wrote', filename)

for src, style, ps, filename in [
    ('oswald-latin-400-normal.woff2', 'Regular', 'Oswald-Regular', 'Oswald-Regular.ttf'),
    ('oswald-latin-500-normal.woff2', 'Medium', 'Oswald-Medium', 'Oswald-Medium.ttf'),
]:
    ttf = os.path.join(tmp, filename)
    decompress(os.path.join(ds, src), ttf)
    font = TTFont(ttf)
    set_names(font, 'Oswald', style, ps)
    font.save(os.path.join(out, filename))
    print('Wrote', filename)

dest = os.path.join(out, 'Oswald-SemiBold.ttf')
try:
    urllib.request.urlretrieve(
        'https://github.com/googlefonts/OswaldFont/raw/main/fonts/ttf/Oswald-SemiBold.ttf',
        dest,
    )
    f = TTFont(dest)
    set_names(f, 'Oswald', 'SemiBold', 'Oswald-SemiBold')
    f.save(dest)
    print('Wrote Oswald-SemiBold.ttf')
except Exception as e:
    print('Oswald SemiBold fallback:', e)
    shutil.copy(os.path.join(out,'Oswald-Medium.ttf'), dest)
    f = TTFont(dest)
    set_names(f, 'Oswald', 'SemiBold', 'Oswald-SemiBold')
    f.save(dest)
shutil.rmtree(tmp)
`

execFileSync('python3', ['-c', py, dsFonts, outDir], { stdio: 'inherit' })
