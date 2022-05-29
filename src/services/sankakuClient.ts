import request from "request-promise";
import { Options, RequestPromise } from 'request-promise'
import jwtDecode from "jwt-decode";

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

interface SearchIllustConfigProps {
  order_by?: 'popularity'|'date'|'quality'|'random'|'recently_favorited'|'recently_voted';
  limit?: number;
  tags?: string[];
  rating?: {
    g?: boolean;
    r15?: boolean;
    r18?: boolean;
  }
}

interface ExtraHeaderProps {
  [key: string]: string;
}

interface UserProps {
  username: string;
  password: string;
}

interface DecodeAccessTokenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exp: any
}

export class SankakuClient {
  extraHeader = {}
  accessToken = ''
  user: UserProps = { username: '', password: '' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: any

  constructor (extraHeader: ExtraHeaderProps) {
    this.extraHeader = extraHeader
  }

  decodeAccessToken(): DecodeAccessTokenProps {
    return jwtDecode(this.accessToken)
  }

  async post(options: Options): Promise<RequestPromise> {
    if (this.accessToken && Date.now() >= this.decodeAccessToken().exp *1000) {
      await this.login(this.user)
    }

    const config = {
      ...options,
      headers: {
        authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
        ...this.extraHeader,
        ...options.headers,
        ...{
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0',
        }
      }
    }
    
    return request(config)
  }

  async login(user: UserProps): Promise<void> {
    const req = await this.post({
      url: 'https://capi-v2.sankakucomplex.com/auth/token',
      method: 'POST',
      body: {
        login: user.username,
        password: user.password,
      },
      json: true,
    })

    this.accessToken = req.access_token;
    this.userInfo = req.current_user;
    this.user.username = user.username;
    this.user.password = user.password;
  }

  async logout(): Promise<void> {
    this.accessToken = ''
    this.user.username = ''
    this.user.password = ''
    this.userInfo = {}

    await this.post({
      url: 'https://capi-v2.sankakucomplex.com/auth/logout',
      method: 'POST'
    })

  }

  async getUserInfo(username: string = this.userInfo.name): Promise<unknown> {
    const req = await this.post({
      url: `https://capi-v2.sankakucomplex.com/users/name/${username}`,
      method: 'GET',
      qs: {
        lang: 'en',
      },
      json: true,
    })
    this.userInfo = req.user

    return req
  }

  async searchIllust(config: SearchIllustConfigProps): Promise<imageProps[]> {
    const orderBy = config.order_by || 'date'
    const limit = config.limit || 40
    const tags = config.tags || []
    // const rating = config.rating || { g: true, r15: true, r18: true }
    const r18 = config?.rating?.r18 === undefined ? true : config.rating.r18
    const g = config?.rating?.g === undefined ? true : config.rating.g
    const r15 = config?.rating?.r15 === undefined ? true : config.rating.r15

    if (orderBy !== 'date') tags.push(`order:${orderBy}`)
    if (g) tags.push(`rating:q`);
    if (r15) tags.push(`rating:s`);
    if (r18) tags.push(`rating:e`);

    const tagsQs = tags.join(' ')

    const req = await this.post({
      url: 'https://capi-v2.sankakucomplex.com/posts/keyset',
      method: 'GET',
      headers: {
          dnd: 1,
          origin: 'https://beta.sankakucomplex.com',
          referer: 'https://beta.sankakucomplex.com/',
          accept: 'application/vnd.sankaku.api+json;v=2'
      },
      qs: {
          lang: 'en',
          limit: limit,
          next: '',
          prev: '',
          hide_posts_in_books: 'in-larger-tags',
          default_threshold: 1,
          tags: tagsQs
      },
      json: true,
    })

    return req.data
  }

}
