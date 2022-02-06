import axios from 'axios';
import { Post } from './ReturnValues';

export interface BaseAdapter extends Record<any, any> {
  constructor:
    | ((BaseURL: string, APIKey?: string, UserID?: string) => any)
    | any;
  Posts: (tags: string, pages: number) => Promise<Post[]>;
  Post: (id: number) => Promise<Post>;
}
export class BaseRTPost implements Post {
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
    const post: Post = {
      Rating: 'explicit',
      id: 0,
      Tags: '',
      URL: '',
      fileName: '',
      Download: async () => {
        return Buffer.from('');
      },
      Raw: {},
    };
    return post;
  }
}
