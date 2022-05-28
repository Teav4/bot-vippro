import Api from "../../dist/lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";

export class replyController {
  api: Api
  constructor(api: Api) {
    this.api = api
  }

  sayHello = (msg: IncomingMessage): void => {
    this.api.sendMessage({ body: 'hi' }, msg.threadId)
  }
}
