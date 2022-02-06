import { Post } from './ReturnValues';

export interface BaseAPI extends Record<any, any> {
  constructor:
    | ((BaseURL: string, APIKey?: string, UserID?: string) => any)
    | any;
  Posts: (tags: string, pages: number) => Promise<Post[]>;
  Post: (id: number) => Promise<Post>;
}
export default class BaseAPIClass implements BaseAPI {
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
