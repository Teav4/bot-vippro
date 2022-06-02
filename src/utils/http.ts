import request from 'request'
import fs from 'fs'
import path from 'path'

export function getFileStreamFromURL(remoteUrl: string, extension?: string): Promise<fs.ReadStream> {
  const ext = extension || remoteUrl.slice(-4)
  const assetsDir = path.join(__dirname, '..', '..', '..', 'files')
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir)
  }

  return new Promise((resolve) => {
    const filePath =  path.join(assetsDir, Date.now().toString()+ext)

    request(remoteUrl)
      .pipe(fs.createWriteStream(filePath))
      .on('close', () => {
        const stream = fs.createReadStream(filePath)
        resolve(stream)
      })

  })
}
