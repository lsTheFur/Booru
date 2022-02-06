import axios from 'axios';
import SHA1 from '../../SHA1';
import BaseAPI, { BaseRTPost } from '../baseAPI';
import { Post } from '../ReturnValues';
const ratings: Record<'s' | 'q' | 'e', 'safe' | 'questionable' | 'explicit'> = {
  s: 'safe',
  q: 'questionable',
  e: 'explicit',
};
export interface APIPost {
  // ID
  id: number;
  // MD5
  md5: string;
  // Image Data
  file_url: string;
  large_file_url: string;
  preview_file_url: string;
  image_width: number;
  image_height: number;
  // Tags
  tag_string: string;
  tag_string_general: string;
  tag_string_charater: string;
  tag_string_copyright: string;
  tag_string_artist: string;
  ta_string_meta: string;
  // Source
  source?: string;
  // Score
  score?: number;
  down_score?: number;
  up_score?: number;
  // Favourites
  fav_count?: number;
  // Rating
  rating?: 's' | 'q' | 'e';
  // Other meta
  created_at: number;
  updated_at: number;
  uploader_id: number;
  file_size: number;
  status: 'active' | string;
  parent_id: number | null;
  author: string;
  frames: string[];
  frames_string: number[];
  is_note_locked: boolean;
  is_flagged: boolean;
  is_deleted: boolean;
  approver_id: number | null;
  file_ext: string;
}
class ReturnedPost extends BaseRTPost implements Post {
  static fromAPIPost(post: APIPost) {
    const rtpost = new ReturnedPost();
    rtpost.id = post.id;
    rtpost.Score = Number(post.score);
    rtpost.Rating = ratings[post.rating];
    rtpost.Source = post.source;
    rtpost.fileName = post.source?.split('/').pop().split('?').shift() ?? '';
    rtpost.URL = encodeURI(post.file_url);
    rtpost.Tags = post.tag_string;
    rtpost.Raw = post;
    if (rtpost.URL === 'null') rtpost.URL = null;
    return rtpost;
  }
}
export default class ATFAPI extends BaseAPI {
  constructor(BaseURL: string, LOGIN?: string, PSWD_HASH?: string) {
    super(BaseURL, LOGIN, PSWD_HASH);
    if (LOGIN && PSWD_HASH) {
      this.GlobalApiUrlArgs += `&login=${LOGIN}&password_hash=${SHA1(
        PSWD_HASH,
      )}`;
    }
  }
  GlobalApiUrlArgs: string = '';
  BaseURL: string;
  _getURL(args: string) {
    return this.BaseURL + args + this.GlobalApiUrlArgs;
  }
  async _API_Posts(tags: string, page: number = 0) {
    return (
      await axios({
        url: this._getURL('/posts.json?page=' + page + '&tags=' + tags),
        responseType: 'json',
      })
    ).data;
  }
  async _Posts(tags: string, page: number = 0) {
    const RawPostData: APIPost[] = await this._API_Posts(tags, page);
    const Posts: ReturnedPost[] = [];
    RawPostData.forEach(v => Posts.push(ReturnedPost.fromAPIPost(v)));
    return Posts;
  }
  async Posts(tags: string = '', pages: number = 2) {
    const Posts: ReturnedPost[] = [];
    let page = 0;
    while (page < pages) {
      const d = await this._Posts(tags, page);
      if (d.length === 0) break;
      d.forEach(v => Posts.push(v));
      page++;
    }
    return Posts;
  }
  async _API_Post(id: number) {
    return (
      await axios({
        url: this._getURL('/posts/' + id + '.json'),
        responseType: 'json',
      })
    ).data;
  }
  async Post(id: number) {
    const post: APIPost = await this._API_Post(id);
    return ReturnedPost.fromAPIPost(post);
  }
}
