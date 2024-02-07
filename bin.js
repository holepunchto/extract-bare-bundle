#!/usr/bin/env node
const Bundle = require('bare-bundle')
const fs = require('fs')
const path = require('path')

const isWindows = process.platform === 'win32'
const host = process.platform + '-' + process.arch
const filename = process.argv[2]
if (!filename) throw new Error('Usage: extract-bare-bundle filename')

const b = Bundle.from(fs.readFileSync(filename))

for (const key of b._files.keys()) {
  const filename = path.join('.', key)
  const dirname = path.dirname(filename)

  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filename, b.read(key))
}

if (!isWindows) {
  for (const [key, map] of Object.entries(b.resolutions)) {
    const addon = map['bare:addon']
    if (!addon) continue
    const dirname = path.join('.', key, 'prebuilds', host)
    const addonPath = path.resolve(path.join(filename, addon))
    const symlinkPath = path.join(dirname, addon.split('/').pop().replace(/@[^.]+/g, ''))
    fs.mkdirSync(dirname, { recursive: true })
    try {
      fs.unlinkSync(symlinkPath)
    } catch {}
    fs.symlinkSync(addonPath, symlinkPath)
  }
}
