import request from 'request'
import fs from 'fs'
import path from 'path'

export function getFileStreamFromURL(remoteUrl: string, extension?: string): Promise<fs.ReadStream> {
  const ext = extension || remoteUrl.slice(-4)
  
  return new Promise((resolve) => {
    const filePath =  path.join(__dirname, '..', '..', 'files', Date.now().toString()+ext)

    request(remoteUrl)
      .pipe(fs.createWriteStream(filePath))
      .on('close', () => {
        const stream = fs.createReadStream(filePath)
        resolve(stream)
      })

  })
}
