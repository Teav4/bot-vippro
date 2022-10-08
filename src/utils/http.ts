import fs from 'fs'
import path from 'path'
import EasyDl from 'easydl'

export function getFileStreamFromURL(remoteUrl: string, extension?: string): Promise<fs.ReadStream> {
  const ext = extension || remoteUrl.slice(-4)
  const assetsDir = path.join(__dirname, '..', '..', '..', 'files')
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir)
  }

  return new Promise((resolve) => {
    const filePath =  path.join(assetsDir, Date.now().toString()+ext)

    new EasyDl(
      remoteUrl,
      filePath,
      { connections: 5, maxRetry: 3 }
    )
    .wait()
    .then(() => {
      const stream = fs.createReadStream(filePath)
      resolve(stream)
    })
  })
}
