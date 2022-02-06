import axios from 'axios';
import { writeFileSync } from 'fs';
import * as node_path from 'path';
import { Post } from './ReturnValues';

export interface BaseAdapter extends Record<any, any> {
  constructor:
    | ((BaseURL: string, APIKey?: string, UserID?: string) => any)
    | any;
  Posts: (tags: string, pages: number) => Promise<Post[]>;
  Post: (id: number) => Promise<Post>;
}
/**
 * @name BaseReturnedPost
 * @description The base class for a returned post.
 */
export class BaseRTPost implements Post {
  /**
   * @name id
   * @description The post's ID
   */
  id: number;
  /**
   * @name URL
   * @description The post's file's URL
   */
  URL: string;
  /**
   * @name Rating
   * @description How "family-friendly" it is
   */
  Rating: 'explicit' | 'questionable' | 'safe';
  /**
   * @name Score
   * @description The user-rating for the post
   */
  Score: number;
  /**
   * @name Source
   * @description Source(s) of the post
   */
  Source?: string | string[];
  /**
   * @name fileName
   * @description The file's name, as returned by the API.
   * If none is returned, everything following the last / in the URL is used
   */
  fileName: string;
  /**
   * @name Tags
   * @description A space-seperated list of tags
   */
  Tags: string;
  /**
   * @name Raw
   * @description The raw API Response
   */
  Raw = {};
  ///// METHODS
  /**
   * @name Download
   * @description Downloads the file at Post.URL into memory. Resolves with the response.
   *
   * @returns {Promise<Buffer>} Raw File Data
   */
  async Download(): Promise<Buffer> {
    if (!this.URL)
      throw new Error('No URL returned from API. Cannot Download.');
    return (
      await axios({
        url: this.URL,
        responseType: 'arraybuffer',
      })
    ).data;
  }
  /**
   * @name DownloadToFile
   * @description Downloads the file at Post.URL to file `file`.
   *
   * @param {string} path The to download the file to.
   *
   * @returns {Promise<void>}
   */
  async DownloadToFile(path: string): Promise<void> {
    writeFileSync(node_path.resolve(path), await this.Download());
  }
}
export default class BaseAdapterClass implements BaseAdapter {
  BaseURL: string;
  /**
   * @param BaseURL URL of the booru
   * @param KEY API Key / Password (for password (for Moebooru and Myimouto, it should be the unhashed password, however it should be the raw string that is hashed))
   * @param USER Username for API Key
   */
  constructor(BaseURL: string, Key?: string, USER?: string) {
    this.BaseURL = BaseURL;
  }
  async Posts(tags: string = '', pages: number = 2) {
    const Posts: Post[] = [];
    return Posts;
  }
  async Post(id: number) {
    const post: Post = new BaseRTPost();
    return post;
  }
}
