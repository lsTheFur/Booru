# BooruJS [![Node.js CI](https://github.com/lsTheFur/Booru/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/lsTheFur/Booru/actions/workflows/node.js.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/9d21026aba66eb06d304/maintainability)](https://codeclimate.com/github/lsTheFur/Booru/maintainability) [![npm version](https://badge.fury.io/js/boorujs.svg)](https://npm.im/boorujs)

BooruJS is a NodeJS Booru Library.

## CLI Usage

TBA

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

## Credits

Disclaimer: I worked on this with someone who prefers to stay anonymous.<br/>
**I did not write the ATF, Moebooru and MyImouto adapters myself.**<br/>
These were written by said anonymous person for this project.<br/>
I am publishing these with their permission.
