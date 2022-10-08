import youtubedl from 'youtube-dl-exec'
import { ReadStream } from 'fs'
import { getFileStreamFromURL } from '../utils/http'

export async function youtubeDl(sourceUrl: string): Promise<ReadStream> {
  
  const result = await youtubedl(sourceUrl, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: [
      'referer:youtube.com',
      'user-agent:googlebot'
    ]
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { url } = result['requested_formats'].find(i => i.resolution === 'audio only')
  return await getFileStreamFromURL(url, '.mp3')
}
