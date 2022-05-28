import request from 'request'
import fs from 'fs'
import path from 'path'

export function getFileStreamFromURL(remoteUrl: string): Promise<fs.ReadStream> {
  return new Promise((resolve) => {
    const filePath =  path.join(__dirname, '..', '..', 'files', Date.now().toString()+remoteUrl.slice(-4))

    request(remoteUrl)
      .pipe(fs.createWriteStream(filePath))
      .on('close', () => {
        const stream = fs.createReadStream(filePath)
        resolve(stream)
      })

  })
}
