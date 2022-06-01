import { ReadStream } from 'fs'
import qs from 'querystring'
import { GOOGLE_TTS_URL } from '../constants/api.constants'
import { getFileStreamFromURL } from '../utils/http'

export async function googleTTS(text: string): Promise<ReadStream> {
  const params = qs.stringify({
    ie: 'UTF-8',
    q: text,
    tl: 'vi',
    client: 'tw-ob'
  })
  const url = `${GOOGLE_TTS_URL}?${params}`
  
  return await getFileStreamFromURL(url, '.mp3')
}
