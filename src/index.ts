import ATFAPI from './Adapters/ATF';
import BaseAPIClass from './Adapters/baseAPI';
import E6API from './Adapters/E621';
import GelbooruAPI from './Adapters/gelbooru';
import MoebooruAPI from './Adapters/moebooru';
import MyImoutoAPI from './Adapters/myimouto';
import { Post as _Post } from './Adapters/ReturnValues';
export type Post = _Post;
export type mappedBoorus =
  | 'gelbooru'
  | 'rule34'
  | 'konachan'
  | 'safebooru'
  | 'lolibooru'
  | 'tbib'
  /**
   * @name thebigimageboard
   * @description Alias for tbib
   */
  | 'thebigimageboard'
  | 'yandere'
  // | 'hypnohub' // broken
  | 'atf'
  | 'realbooru'
  | 'e621';

// Support for Derpibooru might be added some time | Danbooru will be supported once i can be bothered
// For Shimmie2 support, upvote issues like https://github.com/shish/shimmie2/issues/788 | I'm not parsing a dynamic HTML site any time soon, I CBA.
export type BooruTypes = 'gelbooru' | 'myimouto' | 'moebooru' | 'atf' | 'e621';
interface BooruInput {
  BooruType: BooruTypes;
  BooruURL: string;
}
export const BooruMappings: Record<mappedBoorus, BooruInput> = {
  // Booru List provided generously by several of my friends
  gelbooru: {
    BooruType: 'gelbooru',
    BooruURL: 'https://gelbooru.com',
  },
  // down at the time of commenting
  // hypnohub: {
  //   BooruType: 'myimouto',
  //   BooruURL: 'https://hypnohub.net',
  // },
  atf: {
    BooruType: 'atf',
    BooruURL: 'https://booru.allthefallen.moe',
  },
  lolibooru: {
    BooruType: 'myimouto',
    BooruURL: 'https://lolibooru.moe',
  },
  e621: {
    BooruType: 'e621',
    BooruURL: 'https://e621.net',
  },
  rule34: {
    BooruType: 'gelbooru',
    BooruURL: 'https://api.rule34.xxx',
  },
  konachan: {
    BooruType: 'moebooru',
    BooruURL: 'https://konachan.com',
  },
  realbooru: {
    BooruType: 'gelbooru',
    BooruURL: 'https://realbooru.com',
  },
  safebooru: {
    BooruType: 'gelbooru',
    BooruURL: 'https://safebooru.org',
  },
  thebigimageboard: {
    BooruType: 'gelbooru',
    BooruURL: 'https://tbib.org',
  },
  tbib: {
    BooruType: 'gelbooru',
    BooruURL: 'https://tbib.org',
  },
  yandere: {
    BooruType: 'moebooru',
    BooruURL: 'https://yande.re',
  },
};
export const MappedBooruNames = [];
for (const booruName in BooruMappings) {
  MappedBooruNames.push(booruName);
}
const APIClasses: Record<BooruTypes, typeof BaseAPIClass> = {
  gelbooru: GelbooruAPI,
  moebooru: MoebooruAPI,
  myimouto: MyImoutoAPI,
  atf: ATFAPI,
  e621: E6API,
};
type BooruConstructorInput = BooruInput | mappedBoorus;
/**
 * @name Booru
 * @description A BooruJS Instance
 *
 * @param {BooruConstructorInput} booru Which booru to use? (Mapped Booru | Booru Information Table)
 * @param {string?} Key API Key
 * @param {string?} UserID User ID / Username (depends on API)
 *
 * @class
 */
export class Booru {
  Data: BooruInput;
  API: BaseAPIClass;

  /**
   * @name Booru
   * @description A BooruJS Instance Constructor
   *
   * @param {BooruConstructorInput} booru Which booru to use? (Mapped Booru | Booru Information Table)
   * @param {?string} Key API Key
   * @param {?string} UserID User ID / Username (depends on API)
   *
   * @constructor
   */
  constructor(booru: BooruConstructorInput, Key?: string, UserID?: string) {
    this.Data = BooruMappings[booru.toString()] ?? booru;
    this.API = new APIClasses[this.Data.BooruType](
      this.Data.BooruURL,
      Key,
      UserID,
    );
  }
  /**
   * @description Get posts from booru
   * @param {string} tags Which tags to search for (nothing = front page posts)
   * @param {number?} pages Amount of pages to fetch
   * @returns {Promise<Post[]>} Posts
   */
  Posts(tags: string, pages: number = 1): Promise<Post[]> {
    return this.API.Posts(tags, pages);
  }
  /**
   * @deprecated (Not actually deprecated, just a warning) This will error on many booru types, usage is discouraged
   *
   * @param id Post ID
   * @returns {Promise<Post>} Post
   */
  PostFromID(id: number): Promise<Post> {
    return this.API.Post(id);
  }
}

/**
 * @name MultiBooru
 * @description Combine multiple boorus into one class
 * @experimental Hightly Experimental
 */
export class MultiBooru {
  /**
   * List of booru instances
   */
  Boorus: Booru[];
  /**
   * @see Booru
   * @param {BooruConstructorInput[]} boorus BooruConstructorInputs
   */
  constructor(boorus: BooruConstructorInput[]) {
    boorus.forEach(v => this.Boorus.push(new Booru(v)));
  }
  /**
   * @param {string} tags Which tags to search for (nothing = front page posts)
   * @param {number?} pagesPerBooru Amount of pages to fetch, per booru
   * @returns {Promise<Post[]>} Posts
   */
  async Posts(tags: string, pagesPerBooru: number = 1): Promise<Post[]> {
    const posts: Post[] = [];
    for (const k in this.Boorus) {
      if (Object.prototype.hasOwnProperty.call(this.Boorus, k)) {
        const Booru = this.Boorus[k];
        const v = await Booru.Posts(tags, pagesPerBooru);
        posts.push(...v);
      }
    }
    return posts;
  }
}
export default Booru;
