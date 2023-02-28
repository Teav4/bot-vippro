import request from 'request-promise'
import qs from 'querystring'

export interface YandePost {
  id: number,
  tags: string,
  created_at: number,
  updated_at: number,
  creator_id: number,
  approver_id: null|string,
  author: string,
  change: number,
  source: string,
  score: number,
  md5: string,
  file_size: number,
  file_ext: string,
  file_url: string,
  is_shown_in_index: boolean,
  preview_url: string,
  preview_width: number,
  preview_height: number,
  actual_preview_width: number,
  actual_preview_height: number,
  sample_url: string,
  sample_width: number,
  sample_height: number,
  sample_file_size: number,
  jpeg_url: string,
  jpeg_width: number,
  jpeg_height: number,
  jpeg_file_size: number,
  rating: string,
  is_rating_locked: boolean,
  has_children: boolean,
  parent_id: null|string,
  status: string,
  is_pending: boolean,
  width: number,
  height: number,
  is_held: boolean,
  frames_pending_string: string,
  frames_pending: Array<unknown>,
  frames_string: string,
  frames: Array<unknown>,
  is_note_locked: boolean,
  last_noted_at: number,
  last_commented_at: number,
}

export class YandeClient {

  popularByDate = async (day: number, month: number, year: number, tags: string[], page: number): Promise<YandePost[]> => {
    const url = `https://yande.re/post?`+ qs.stringify({
      day,
      month,
      year,
      tags,
      page,
    })
    const html = await request(url)

    const posts = html.split('\n')
      .map((row: string) => row.trim())
      .filter((row: string) => row.indexOf('Post.register({') === 0)
      .map((row: string) => row.slice(0, row.length-1).replace('Post.register(', ''))
      .map((row: string) => JSON.parse(row))

    return posts
  }

}
