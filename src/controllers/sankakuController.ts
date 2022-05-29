import Api from "../../dist/lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import { getFileStreamFromURL } from '../utils/http'
import request from 'request-promise'

export interface tagProps {
  "id": number;
  "name_en": string;
  "name_ja": string;
  "type": number;
  "count": number;
  "post_count": number;
  "pool_count": number;
  "locale": string;
  "rating": string;
  "version": number;
  "tagName": string;
  "total_post_count": number;
  "total_pool_count": number;
  "name": string;
}

export interface imageProps {
  "id": number;
  "rating": string;
  "status": string;
  "author": {
    "id": number;
    "name": string;
    "avatar": string;
    "avatar_rating": string;
  },
  "sample_url": string;
  "sample_width": number;
  "sample_height": number;
  "preview_url": string;
  "preview_width": number;
  "preview_height": number;
  "file_url": string;
  "width": number;
  "height": number;
  "file_size": number;
  "file_type": string;
  "created_at": {
    "json_class": string;
    "s": number;
    "n": number;
  },
  "has_children": boolean;
  "has_comments": boolean;
  "has_notes": boolean;
  "is_favorited": boolean;
  "user_vote": null;
  "md5": string;
  "parent_id": null;
  "change": number;
  "fav_count": number;
  "recommended_posts": number;
  "recommended_score": number;
  "vote_count": number;
  "total_score": number;
  "comment_count": null;
  "source": string;
  "in_visible_pool": boolean;
  "is_premium": boolean;
  "is_rating_locked": boolean;
  "is_note_locked": boolean;
  "is_status_locked": boolean;
  "redirect_to_signup": boolean;
  "sequence": null;
  "tags": tagProps[]
}

export class sankakuController {
  api: Api
  
  constructor(api: Api) {
    this.api = api
  }

  dailyGenshin = async (msg: IncomingMessage): Promise<void> => {
    const url = 'https://quick.teav4.com/random_today'
    const result = JSON.parse(await request(url))
    const imageUrls: string[] = result.map((item: imageProps) => item.sample_url)
    console.log(imageUrls)
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

