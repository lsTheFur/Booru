import axios from 'axios';
import BaseAPI, { BaseRTPost } from '../baseAPI';
import { Post } from '../ReturnValues';
export interface APIPost {
  /** Directory (OLD API) */
  directory?: number;
  // ID
  id: number;
  // MD5
  md5: string;
  // Image Name
  image: string;
  // Image Data
  file_url: string;
  width: number;
  height: number;
  // Tags
  tags: string;
  // Preview Data
  preview_url: string;
  preview_height: number;
  preview_width: number;
  // Source
  source?: string;
  // Score
  score?: number;
  // Rating
  rating?: 'safe' | 'questionable' | 'explicit';
}
class ReturnedPost extends BaseRTPost implements Post {
  static fromAPIPost(post: APIPost, gelAPI?: GelbooruAPI) {
    const rtpost = new ReturnedPost();
    rtpost.id = post.id;
    rtpost.Score = post.score;
    rtpost.Rating = post.rating;
    rtpost.Source = post.source;
    rtpost.URL = post.file_url;
    rtpost.fileName = post.image;
    rtpost.Tags = post.tags;
    rtpost.Raw = post;
    if (rtpost.URL === 'null') rtpost.URL = null;
    if (!rtpost.URL && post.directory && post.image && gelAPI)
      rtpost.URL = `${gelAPI.BaseURL}/images/${post.directory}/${post.image}`;
    return rtpost;
  }
}
export default class GelbooruAPI extends BaseAPI {
  constructor(BaseURL: string, API?: string, USER?: string) {
    super(BaseURL, API, USER);
    if (API && USER) {
      this.GlobalApiUrlArgs += `&api_key=${API}&user_id=${USER}`;
    }
  }
  GlobalApiUrlArgs: string = '';
  BaseURL: string;
  _getURL(args: string) {
    return this.BaseURL + '?json=1&' + args + this.GlobalApiUrlArgs;
  }
  async _API_Posts(tags: string, page: number = 0) {
    const a = (
      await axios({
        url: this._getURL(
          'page=dapi&s=post&q=index&limit=100&pid=' + page + '&tags=' + tags,
        ),
        responseType: 'json',
      })
    ).data;
    return a;
  }
  async _Posts(tags: string, page: number = 0) {
    const aaa = await this._API_Posts(tags, page);
    const RawPostData: APIPost[] = aaa.post ?? aaa; // 0.2.0 use an array directly, 0.2.5 (probs also a few versions before that) use a table including post instead
    if (!RawPostData || !RawPostData[0]) return []; // Cannot parse, return nothingness
    const Posts: ReturnedPost[] = [];
    RawPostData.forEach(v => Posts.push(ReturnedPost.fromAPIPost(v, this)));
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
