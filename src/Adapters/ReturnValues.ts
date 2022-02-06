export interface Post extends Record<string, any> {
  /**
   * @name id
   * @description The ID of the post
   */
  id: number;
  /**
   * @name fileName
   * @description The name of the file on the server
   */
  fileName: string;
  /**
   * @name URL
   * @description The URL of the file
   */
  URL: string;
  /**
   * @name Download
   * @description Downloads the image
   * @returns {Buffer} Raw Image Data
   */
  Download: () => Promise<Buffer>;
  /**
   * @name Source
   * @description Source(s) of the post
   */
  Source?: string | string[];
  /**
   * @name Score
   * @description Post's score
   */
  Score?: number;
  /**
   * @name Rating
   * @description Post's rating
   */
  Rating: 'explicit' | 'questionable' | 'safe';
  /**
   * @name Tags
   * @description Post's tags
   */
  Tags: string;
  /**
   * @name Raw
   * @description Raw API return value
   */
  Raw: Record<any, any>;
}
export type PostList = Post[];
