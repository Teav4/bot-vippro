import { Client } from "pg";
import Api from "../../lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import ReplyModel from "../models/reply.model";
import ImageModel from "../models/image.model";
import B2ArtModel from "../models/b2art.model";
import { getFileStreamFromURL } from '../utils/http'
import { validURL } from '../utils/validate';
import { YandeClient } from '../services/yandeClient'
import { YANDE_RE, EMOJI_RELOAD, EMOJI_DONE, EMOJI_UP } from '../constants/reply.constants'
import { getEmojiByNumber } from "../utils/command";
import { googleTTS } from "../services/textToSpeed";
import { getListArt } from "../services/b2";
import config from "../../config/index.config";
import { youtubeDl } from "../services/youtubeDl";

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

  randomB2 = async (msg: IncomingMessage): Promise<void> => {
    const b2ArtModel = new B2ArtModel(this.db)
    const imageUrl = await b2ArtModel.getRandomImage()
    console.log({ imageUrl })
    if (null !== imageUrl) {
      const imageStream = await getFileStreamFromURL(imageUrl, imageUrl.slice(imageUrl.lastIndexOf('.'), imageUrl.length))
      this.api.sendMessage({
        attachment: [imageStream],
      }, msg.threadId)
    }

  }

  update = async (msg: IncomingMessage, tags: string[] = []): Promise<void> => {
    const yandeClient = new YandeClient()
    const imageModel = new ImageModel(this.db)
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_RELOAD)
    await imageModel.resetDB()

    const today = new Date(Date.now())
    const to = 4
  
    for(let i=0; i<to; ++i) {
      await this.api.sendMessageReaction(msg.threadId, msg.messageId, getEmojiByNumber(to-i))
      const todayImage = await yandeClient.popularByDate(today.getDate(), today.getMonth()+1, today.getFullYear(), tags)
      await Promise.all(todayImage.map(async post => await imageModel.insertImage(YANDE_RE, post.sample_url, JSON.stringify(post.tags.split(' ')), JSON.stringify(post))))  
      today.setDate(today.getDate()-1)
    }

    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)
  }

  updateB2 = async (msg: IncomingMessage): Promise<void> => {
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_RELOAD)
    const arts = await getListArt()
    const b2ArtModel = new B2ArtModel(this.db)
    
    await b2ArtModel.resetDB()
    await Promise.all(arts.files.map(async art => await b2ArtModel.insertImage(art.fileName, `${config.B2_BASE_CDN}/${art.fileName}`)))
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)
  }

  textToSpeed = async (msg: IncomingMessage, args: string[]): Promise<void> => {
    const text = args.join(' ')
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_RELOAD)
    const stream = await googleTTS(text)
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_UP)

    await this.api.sendMessage({
      attachment: [stream],
    }, msg.threadId)
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)
  }

  youtubeDl = async (msg: IncomingMessage, args: string[]): Promise<void> => {
    const text = args.join(' ')
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_RELOAD)
    const stream = await youtubeDl(text)
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_UP)

    await this.api.sendMessage({
      attachment: [stream],
    }, msg.threadId)
    await this.api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)
  }

}
