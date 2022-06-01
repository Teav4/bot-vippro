import { Client } from "pg";
import Api from "../../dist/lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import ReplyModel from "../models/reply.model";
import ImageModel from "../models/image.model";
import { getFileStreamFromURL } from '../utils/http'
import { validURL } from '../utils/validate';
import { YandeClient } from '../services/yandeClient'
import { YANDE_RE, EMOJI_RELOAD, EMOJI_DONE } from '../constants/reply.constants'
import { getEmojiByNumber } from "../utils/command";

export class replyController {
  api: Api
  db: Client
  
  constructor(api: Api, db: Client) {
    this.api = api
    this.db = db
  }
  
  sayHello = (msg: IncomingMessage): void => {
    this.api.sendMessage({ body: 'hi' }, msg.threadId)
  }
  
  fromDb = async (msg: IncomingMessage): Promise<void> => {
    const replyModel = new ReplyModel(this.db);
    const text = await replyModel.resolveMessage(msg.body)

    if (text !== null && text.length > 1) {
      
      if (text.indexOf('$image$') > -1) {
        const urls = text.split('$image$').filter(url => validURL(url))
        
        if (urls.length > 0) {

          const streams = await Promise.all(urls.map(async url => {
            const response = await getFileStreamFromURL(url)
            return response
          }))

          this.api.sendMessage({
            attachment: [...streams], 
          }, msg.threadId)
          return
        }
      }
      
      this.api.sendMessage({ body: text }, msg.threadId)
    }

  }

  randomImage = async (msg: IncomingMessage): Promise<void> => {
    const imageModel = new ImageModel(this.db)
    const imageUrl = await imageModel.getRandomImage()

    if (null !== imageUrl) {
      const imageStream = await getFileStreamFromURL(imageUrl)
      this.api.sendMessage({
        attachment: [imageStream],
      }, msg.threadId)
    }

  }

  update = async (msg: IncomingMessage): Promise<void> => {
    const yandeClient = new YandeClient()
    const imageModel = new ImageModel(this.db)
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_RELOAD)
    await imageModel.resetDB()

    const today = new Date(Date.now())
    const to = 4
  
    for(let i=0; i<to; ++i) {
      await this.api.sendMessageReaction(msg.threadId, msg.messageId, getEmojiByNumber(to-i))
      const todayImage = await yandeClient.popularByDate(today.getDate(), today.getMonth()+1, today.getFullYear())
      await Promise.all(todayImage.map(async post => await imageModel.insertImage(post.sample_url, YANDE_RE, JSON.stringify(post.tags.split(' ')), JSON.stringify(post))))  
      today.setDate(today.getDate()-1)
    }

    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)
  }

}
