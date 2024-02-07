#!/usr/bin/env node
const Bundle = require('bare-bundle')
const fs = require('fs')
const path = require('path')

const filename = process.argv[2]
if (!filename) throw new Error('Usage: extract-bare-bundle filename')

const b = Bundle.from(fs.readFileSync(filename))

for (const key of b._files.keys()) {
  const filename = path.join('.', key)
  const dirname = path.dirname(filename)

  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filename, b.read(key))
}
