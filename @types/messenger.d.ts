module Msgr {

  type Attachment = {

  }

  type Mention = {

  }

  type Message = {
    type: number,
    senderId: number,
    body: string,
    threadId: string,
    messageId: string,
    attachments: Attachment[],
    mentions: Mention[],
    timestamp: number,
    isGroup: boolean

  }

}
