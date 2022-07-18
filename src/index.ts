import ATFAPI from './Adapters/ATF';
import BaseAdapter from './Adapters/BaseAdapter';
import E6API from './Adapters/E621';
import GelbooruAPI from './Adapters/gelbooru';
import MoebooruAPI from './Adapters/moebooru';
import MyImoutoAPI from './Adapters/myimouto';
import { Post as _Post } from './Adapters/ReturnValues';
import { Mappings } from './Mappings';
/**
 * @alias require('boorujs/Mappings').Mappings
 * @alias import BooruMappings from 'boorujs/Mappings';
 * @notice Importing from here might be deprecated in 1.0.0, moving to boorujs/Mappings is strongly recommended
 */
export const BooruMappings = Mappings;
/**
 * @name Post
 * @description An API/Adapter/Booru-independent Post. Adapters convert post-related API calls to this.
 */
export type Post = _Post;
/**
 * @name mappedBoorus
 * @description A list of boorus with built-in mappings. For other boorus, you will need to provide a BooruInput.
 */
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
/**
 * @name BooruTypes
 * @description List of built-in booru types.
 */
export type BooruTypes = 'gelbooru' | 'myimouto' | 'moebooru' | 'atf' | 'e621';
/**
 * @name BooruInput
 * @description Describes required information about a given booru
 */
export interface BooruInput {
  /**
   * @name BooruType
   * @description What type of booru software does said URL run? (i.e. gelbooru)
   * @type {BooruTypes} Booru Type
   */
  BooruType: BooruTypes;
  /**
   * @name BooruURL
   * @description The booru's URL. Non-https:// URLs are strongly discouraged. Trailing /s aren't supported.
   */
  BooruURL: `https://${string}`;
}
export const MappedBooruNames = [];
for (const booruName in Mappings)
  MappedBooruNames.push(booruName);

/**
 * @name Adapters
 * @description List of adapters.
 * @info You **can** add your own adapters, and then use them in BooruInputs, however it's strongly suggested to make a PR instead, and contribute to BooruJS
 */
export const Adapters: Record<BooruTypes, typeof BaseAdapter> = {
  'gelbooru': GelbooruAPI,
  'moebooru': MoebooruAPI,
  'myimouto': MyImoutoAPI,
  'atf': ATFAPI,
  'e621': E6API,
};
/**
 * @name BooruConstructorInput
 * @description Input to a BooruConstructor.
 * @type {BooruInput | mappedBoorus}
 * @see {BooruInput}
 * @see {mappedBoorus}
 */
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
  /**
   * @name Data
   * @description Basic information about the booru
   * @internal
   */
  Data: BooruInput;
  /**
   * @name Adapter
   * @description The adapter the booru is using.
   * @internal
   */
  Adapter: BaseAdapter;

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
    this.Adapter = new Adapters[this.Data.BooruType](
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
  Posts(tags: string, pages = 1): Promise<Post[]> {
    return this.Adapter.Posts(tags, pages);
  }
  /**
   * @deprecated (Not actually deprecated, just a warning) This will error on many booru types, usage is discouraged
   *
   * @param id Post ID
   * @returns {Promise<Post>} Post
   */
  PostFromID(id: number): Promise<Post> {
    return this.Adapter.Post(id);
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
  async Posts(tags: string, pagesPerBooru = 1): Promise<Post[]> {
    const posts: Post[] = [];
    for (const k in this.Boorus)
      if (Object.prototype.hasOwnProperty.call(this.Boorus, k)) {
        const Booru = this.Boorus[k];
        const v = await Booru.Posts(tags, pagesPerBooru);
        posts.push(...v);
      }

    return posts;
  }
}
export default Booru;
