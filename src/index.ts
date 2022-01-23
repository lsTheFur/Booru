import ATFAPI from './APIs/ATF';
import BaseAPIClass from './APIs/baseAPI';
import E6API from './APIs/E621';
import GelbooruAPI from './APIs/gelbooru';
import MoebooruAPI from './APIs/moebooru';
import MyImoutoAPI from './APIs/myimouto';
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

// Support for Shimmie2 & Derpibooru might be added some time | Danbooru will be supported once i can be bothered
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
export class Booru {
  Data: BooruInput;
  API: BaseAPIClass;

  constructor(booru: BooruInput | mappedBoorus, Key?: string, UserID?: string) {
    this.Data = BooruMappings[booru.toString()] ?? booru;
    this.API = new APIClasses[this.Data.BooruType](
      this.Data.BooruURL,
      Key,
      UserID,
    );
  }
  Posts(tags: string, pages = 1) {
    return this.API.Posts(tags, pages);
  }
  /**
   * @deprecated (Not actually deprecated, just a warning) This will error on moebooru and myimouto
   *
   * @param id Post ID
   * @returns Post
   */
  PostFromID(id: number) {
    return this.API.Post(id);
  }
}

export class MultiBooru {
  Boorus: Booru[];
  constructor(boorus: BooruInput[]) {
    boorus.forEach(v => this.Boorus.push(new Booru(v)));
  }
}
export default Booru;
