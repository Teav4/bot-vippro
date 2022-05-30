import Api from "../../dist/lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import { getFileStreamFromURL } from '../utils/http'
import { imageProps, SankakuClient } from "../services/sankakuClient";
import { randomOfList } from '../utils/random'

export class sankakuController {
  api: Api
  client: SankakuClient
  
  constructor(api: Api, client: SankakuClient) {
    this.api = api   
    this.client = client
  }

  dailyGenshin = async (msg: IncomingMessage): Promise<void> => {
    this.api.sendMessageReaction(msg.threadId, msg.messageId, '👀')
    
    const today = new Date(Date.now())
    today.setSeconds(0,0)
    today.setDate(today.getDate()-1)
    const todayTag = `date:${today.toISOString().split(':')[0]}:00`
    today.setDate(today.getDate()-1)
    const yesterdayTag = `date:${today.toISOString().split(':')[0]}:00`
    
    const result = await this.client.searchIllust({ 
      tags: [
        'high_resolution', '-sex', '-vagina', '-large_filesize', '-male', 
        `${yesterdayTag}..${todayTag}`
      ], 
      limit: 60, 
      order_by: 'popularity' 
    })

    const randomImage = [randomOfList(result)]

    const imageUrls: string[] = randomImage.map((item: imageProps) => item.sample_url)

    const streams = await Promise.all(imageUrls.map(async url => {
      const response = await getFileStreamFromURL(url, '.jpg')
      return response
    }))

    this.api.sendMessage({
      attachment: [...streams], 
    }, msg.threadId)
  
    return
  }

}

