import * as path from 'path';
import * as fs from 'fs';
import Booru, { BooruTypes, Post } from '.';
import BooruMappings from './Mappings';

console.log('/// Starting Test ///');

// Get all possible boorus
const boorus: Booru[] = [];
for (const BooruName in BooruMappings) {
  boorus.push(new Booru(BooruMappings[BooruName]));
}
(async () => {
  // Get 1 post from each booru by rating
  for (const booruPos in boorus) {
    const booru = boorus[booruPos];
    let posts: Post[];
    try {
      posts = await booru.Posts('rating:safe', 1); // get any type of post
    } catch (error) {
      if (error.data) console.error('Getting posts failed with: ' + error.data);
      else throw error;
    }
    if (!posts[0]) {
      console.log(posts);
      throw new Error(
        '(raw posts array above) !posts[0] for booru ' +
          booru.Data.BooruType +
          ' > ' +
          booru.Data.BooruURL,
      );
    }
    if (!(posts[0].id && Number(posts[0].id) > 0))
      throw new Error(
        'no post id or invalid post id for booru ' +
          booru.Data.BooruType +
          ' > ' +
          booru.Data.BooruURL,
      );
    if (posts[0].Rating !== 'safe')
      throw new Error(
        'Post not safe when sending rating:safe for booru ' +
          booru.Data.BooruType +
          ' > ' +
          booru.Data.BooruURL,
      );
    console.log(
      'Success for generic post lookup for ' +
        booru.Data.BooruType +
        ' > ' +
        booru.Data.BooruURL,
    );
  }
  // Get 1 tagged post from each booru
  for (const booruPos in boorus) {
    const booru = boorus[booruPos];
    const posts = await booru.Posts('censored', 1); // get only tagged with censored
    if (!posts[0])
      throw new Error(
        'cannot find post for booru ' +
          booru.Data.BooruType +
          ' > ' +
          booru.Data.BooruURL +
          ' for tag censored',
      );
    if (!posts[0].Tags.includes('censored'))
      throw new Error(
        "post doesn't contain tag for booru " +
          booru.Data.BooruType +
          ' > ' +
          booru.Data.BooruURL,
      );
    console.log(
      'Success for tag post lookup for ' +
        booru.Data.BooruType +
        ' > ' +
        booru.Data.BooruURL,
    );
  }
  // Download Test
  let booruTypes: BooruTypes[] = [];
  for (const booruPos in boorus) {
    const booru = boorus[booruPos];
    if (!booruTypes.includes(booru.Data.BooruType)) {
      booruTypes.push(booru.Data.BooruType);
      console.log(
        'Trying to download image for ' +
          booru.Data.BooruType +
          ' > ' +
          booru.Data.BooruURL,
      );
      const posts = await booru.Posts('rating:safe', 1);
      if (!posts[0])
        throw new Error(
          'cannot find post for booru ' +
            booru.Data.BooruType +
            ' > ' +
            booru.Data.BooruURL +
            ' for rating safe',
        );
      let i = 0;
      const v = async () => {
        let post = posts[i];
        if (!post.URL) {
          i++;
          return await v();
        }
        await post.Download();
        const file = path.resolve('__test_image.' + post.fileName);
        await post.DownloadToFile(file);
        fs.unlinkSync(file);
        console.log(
          'Success for downloading from ' +
            booru.Data.BooruType +
            ' > ' +
            booru.Data.BooruURL,
        );
      };
      await v();
    }
  }

  console.log('/// Test Completed ///');
})().catch(v => {
  console.error('/// An error has ocurred ///');
  console.error(v);
  process.exit(1);
});
