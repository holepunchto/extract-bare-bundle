#!/usr/bin/env node
const Bundle = require('bare-bundle')
const fs = require('fs')
const path = require('path')

const filename = process.argv[2]
if (!filename) throw new Error('Usage: extract-bare-bundle filename')
const host = process.argv[3] || process.platform + '-' + process.arch

const b = Bundle.from(fs.readFileSync(filename))

for (const key of b._files.keys()) {
  const filename = path.join('.', key)
  const dirname = path.dirname(filename)

  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filename, b.read(key))
}

for (const [key, map] of Object.entries(b.resolutions)) {
  const addon = map['bare:addon']
  if (!addon) continue
  const dirname = path.join('.', key, 'prebuilds', host)
  const addonPath = path.resolve(path.join(filename, addon))
  const nonHoistedPath = path.join(dirname, addon.split('/').pop().replace(/@[^.]+/g, ''))
  fs.mkdirSync(dirname, { recursive: true })
  try {
    fs.unlinkSync(nonHoistedPath)
  } catch {}
  fs.copyFileSync(addonPath, nonHoistedPath)
}
