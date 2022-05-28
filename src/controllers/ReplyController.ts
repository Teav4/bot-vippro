import { Client } from "pg";
import Api from "../../dist/lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import ReplyModel from "../models/reply.model";

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

    if (text !== null && text.length > 1) this.api.sendMessage({ body: text }, msg.threadId)
  }
}
