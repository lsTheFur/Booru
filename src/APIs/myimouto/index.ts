import axios from 'axios';
import SHA1 from '../../SHA1';
import BaseAPI, { BaseRTPost } from '../baseAPI';
import { Post } from '../ReturnValues';
const ratings: Record<'s' | 'q' | 'e', 'safe' | 'questionable' | 'explicit'> = {
  s: 'safe',
  q: 'questionable',
  e: 'explicit',
};
interface APIPost {
  // ID
  id: number;
  // MD5
  md5: string;
  // Image Data
  file_url: string;
  width: number;
  height: number;
  // JPEG Image
  jpeg_url: string;
  jpeg_width: number;
  jpeg_height: number;
  jpeg_file_size: number;
  // Tags
  tags: string;
  // Preview Data
  preview_url: string;
  preview_height: number;
  preview_width: number;
  // Source
  source?: string;
  // Score
  score?: string;
  // Rating
  rating?: 's' | 'q' | 'e';
  // Other meta
  created_at: number;
  creator_id: number;
  file_size: number;
  status: 'active' | string;
  parent_id: number | null;
  author: string;
  frames: string[];
  frames_string: number[];
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
    rtpost.Tags = post.tags;
    rtpost.Raw = post;
    if (rtpost.URL === 'null') rtpost.URL = null;
    return rtpost;
  }
}
export default class MyImoutoAPI extends BaseAPI {
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
        url: this._getURL('/post/index.json?page=' + page + '&tags=' + tags),
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
    if (1 - 1 === 0)
      throw new Error('Waiting for myimouto to implement this :/');
    // make ts a happy bitch
    return (
      await axios({
        url: this._getURL('page=dapi&s=post&q=index&limit=1&id=' + id),
        responseType: 'json',
      })
    ).data;
  }
  async Post(id: number) {
    const post: APIPost[] = (await this._API_Post(id)).post;
    return ReturnedPost.fromAPIPost(post[0]);
  }
}
