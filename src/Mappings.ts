import { BooruInput, mappedBoorus } from '.';

/**
 * @name Mappings
 * @description List of Booru to Booru Information Mappings
 */
export const Mappings: Record<mappedBoorus, BooruInput> = {
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
export default Mappings;
