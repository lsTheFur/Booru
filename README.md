# BooruJS [![Node.js CI](https://github.com/lsTheFur/Booru/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/lsTheFur/Booru/actions/workflows/node.js.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/9d21026aba66eb06d304/maintainability)](https://codeclimate.com/github/lsTheFur/Booru/maintainability) [![npm version](https://badge.fury.io/js/boorujs.svg)](https://npm.im/boorujs)

BooruJS is a NodeJS Booru Library.

## Documentation

TBA

## TS (/JS) Examples

### Importing

```ts
import { Booru as BooruJS, Post } from 'boorujs';
```

### Creating a Booru Instance

```ts
const Booru = new BooruJS(
  'gelbooru',
  process.env.API_Key, // optional
  process.env.API_User, // optional, required if API_Key is specified
);
```

### Getting Posts

```ts
const tags = 'some_tag rating:safe 2girls !some_tag_to_exclude'; // Tags to filter by
const pageCount = 5; // Amount of pages to get
const posts: Post[] = await Booru.Posts(tags, pageCount);
```

### Downloading Posts

```ts
posts.forEach(async (post: Post) => {
  require('fs').writeFileSync(post.fileName, await post.Download());
  // or
  await post.DownloadToFile(post.fileName);
});
```

### Final Application

```ts
import { Booru as BooruJS, Post } from 'boorujs'; // Import BooruJS
const Booru = new BooruJS(
  'gelbooru', // Use Gelbooru
  process.env.API_Key, // optional
  process.env.API_User, // optional, required if API_Key is specified
);
const tags = 'some_tag rating:safe 2girls !some_tag_to_exclude'; // Tags to filter by
const pageCount = 5; // Amount of pages to get
(async () => {
  // All code in this should be run asynchronously
  const posts: Post[] = await Booru.Posts(tags, pageCount);
  posts.forEach(async (post: Post) => {
    await post.DownloadToFile(post.fileName);
  });
})();
```

Here's that same code but way smaller (please dont use the below):

```ts
new (require('boorujs'))('gelbooru', process.env.API_Key, process.env.API_User)
  .Posts('rating:safe', 5)
  .then(posts =>
    posts.forEach(async post => await post.DownloadToFile(post.fileName)),
  );
```

## CLI

### Installation

```bash
# PNPM (pnpm.io | recommended)
pnpm i -g boorujs
# Yarn
yarn global add boorujs
# NPM
npm i -g boorujs
```

### Usage

```
boorujs [args]

Options:
  -b, --booru                Booru to use ('list' for list)             [string]
  -p, --pages                The amount of pages           [number] [default: 1]
  -t, --dir, --target, --to  Where to download files to  [string] [default: cwd]
  -q, --tags, --query        Tags to search for           [string] [default: ""]
  -m, --multi                Download multiple at once                 [boolean]
  -l, --log                  Log files being downloaded                [boolean]
      --dry, --dry-run       Don't modify FS                           [boolean]
      --json                 Write BooruJS API Output                  [boolean]
      --src                  Get Github Repository link                [boolean]
  -v, --version              Show version number                       [boolean]
  -h, --help                 Show help                                 [boolean]
```

## Credits

The majority of the code was written by me.<br/>
The ATF, Moebooru, and MyImouto Adapters, aswell as portions of the src/index.ts file, were written by a friend of mine (who prefers to stay anonymous), specifically for this project.<br/>
For interacting with APIs, we use [Axios](https://axios-http.com). Without axios, BooruJS wouldn't be possible.<br/>
For the CLI, we use [Yargs](https://yargs.js.org/), which made parsing shit way easier. Without yargs, I likely would not have made a CLI at all.
