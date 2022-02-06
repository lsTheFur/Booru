import axios from 'axios';
import SHA1 from '../../SHA1';
import BaseAPI from '../baseAPI';
import { Post } from '../ReturnValues';
import * as fs from 'fs';
import * as path from 'path';
const x = JSON.parse(
  fs.readFileSync(
    path.resolve(__filename, '..', '..', '..', '..', 'package.json'),
    'utf-8',
  ),
);
const wait = (a: number) => new Promise(r => setTimeout(r, a));
const ratings: Record<'s' | 'q' | 'e', 'safe' | 'questionable' | 'explicit'> = {
  s: 'safe',
  q: 'questionable',
  e: 'explicit',
};
interface APIPost {
  // ID
  id: number;
  // File
  file: {
    width: number;
    height: number;
    ext: string;
    size: number;
    md5: string;
    url: string;
  };
  // Score
  score: {
    up: number;
    down: number;
    total: number;
  };
  // Tags
  tags: {
    general: string[];
    species: string[];
    character: string[];
    copyright: string[];
    artist: string[];
    invalid: string[];
    lore: string[];
    meta: string[];
  };
  // Change Seq
  change_seq: number;
  // Flags
  flags: {
    pending: boolean;
    flagged: boolean;
    note_locked: boolean;
    status_locked: boolean;
    rating_locked: boolean;
    deleted: boolean;
  };
  // Rating
  rating: 's' | 'q' | 'e';
  // Favourite Count
  fav_count: number;
  // Sources
  sources: string[];
  // Pools
  pools: any[]; // dk the type rn
  // Relationships
  relationships: any; // dk the type
  // IDs
  approver_id: number;
  uploader_id: number;
  description: string;
  // Is Favourited
  is_favourited: boolean;
  // Has Notes
  has_notes: boolean;
}
class ReturnedPost implements Post {
  // ID
  id: number;
  // file_url
  URL: string;
  // rating
  Rating: 'explicit' | 'questionable' | 'safe';
  // score
  Score: number;
  // source
  Source?: string;
  // image
  fileName: string;
  // tags
  Tags: string;
  // raw API return
  Raw = {};
  ///// METHODS
  async Download() {
    if (!this.URL)
      throw new Error('No URL returned from API. Cannot Download.');
    return (
      await axios({
        url: this.URL,
        responseType: 'arraybuffer',
      })
    ).data;
  }
  static fromAPIPost(post: APIPost) {
    const rtpost = new ReturnedPost();
    rtpost.id = post.id;
    rtpost.Score = post.score.total;
    rtpost.URL = encodeURI(post.file.url);
    rtpost.Rating = ratings[post.rating];
    rtpost.Source = post.sources[0];
    rtpost.Tags = '';
    for (const k in post.tags) {
      rtpost.Tags += post.tags[k];
    }
    rtpost.fileName = rtpost.URL.split('\\').join('/').split('/').pop();
    //////
    rtpost.Raw = post;
    if (rtpost.URL === 'null') rtpost.URL = null;
    return rtpost;
  }
}
export default class E6API extends BaseAPI {
  constructor(BaseURL: string, LOGIN?: string, API_KEY?: string) {
    super(BaseURL, LOGIN, API_KEY);
    this.BaseURL = BaseURL;
    if (LOGIN && API_KEY) {
      this.GlobalApiUrlArgs += `&login=${LOGIN}&api_key=${API_KEY}`;
    }
    this.GlobalApiUrlArgs += `&_client=BooruJS`;
  }
  GlobalApiUrlArgs: string = '';
  BaseURL: string;
  _getURL(args: string) {
    return this.BaseURL + args + this.GlobalApiUrlArgs;
  }
  async _API_Posts(tags: string, page: number = 0) {
    return (
      await axios({
        url: this._getURL(
          '/posts.json?limit=320&page=' + page + '&tags=' + tags,
        ),
        responseType: 'json',
        headers: {
          'user-agent': 'BooruJS/' + x.version,
        },
      })
    ).data;
  }
  async _Posts(tags: string, page: number = 0) {
    const RawPostData: APIPost[] = (await this._API_Posts(tags, page)).posts;
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
      await wait(1000);
    }
    return Posts;
  }
  async _API_Post(id: number) {
    return (
      await axios({
        url: this._getURL('/posts/' + id + '.json'),
        responseType: 'json',
        headers: {
          'user-agent': 'BooruJS/' + x.version,
        },
      })
    ).data;
  }
  async Post(id: number) {
    const post: APIPost = await this._API_Post(id);
    return ReturnedPost.fromAPIPost(post);
  }
}
