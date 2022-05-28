import { Client } from "pg";
import Api from "../../dist/lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import ReplyModel from "../models/reply.model";
import { getFileStreamFromURL } from '../utils/http'
import { validURL } from '../utils/validate';

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
}
