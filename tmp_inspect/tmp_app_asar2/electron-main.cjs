// Bootstrap CommonJS file to dynamically import the ESM main process file
const path = require('path')
const { pathToFileURL } = require('url')

(async () => {
  try {
    const target = path.join(__dirname, 'electron-main.js')
    await import(pathToFileURL(target).href)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
