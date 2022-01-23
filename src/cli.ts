#!/usr/bin/env node
import * as fs from 'fs'; // Load fs
import BooruJS, { BooruMappings, MappedBooruNames } from '.'; // Load BooruJS
import * as yargs from 'yargs';
import { resolve } from 'path';

(async () => {
  const args = yargs // Load args
    .scriptName('boorujs')
    .usage('$0 [args]')
    .option('booru', {
      alias: 'b',
      describe: "Booru to use ('list' for list)",
      // choices: MappedBooruNames,
      type: 'string',
    })
    .option('pages', {
      alias: 'p',
      describe: 'The amount of pages',
      default: 1,
      type: 'number',
    })
    .option('dir', {
      alias: ['target', 'to', 't'],
      describe: 'Where to download files to',
      default: process.cwd(),
      defaultDescription: 'cwd',
      type: 'string',
    })
    .option('tags', {
      alias: ['query', 'q'],
      describe: 'Tags to search for',
      default: '',
      type: 'string',
    })
    .demandOption(['booru'], 'Please provide a booru to use.')
    .help().argv;
  // @ts-ignore
  let { booru, dir, tags }: Record<string, string> = await args;
  booru = booru.toLowerCase();
  // @ts-ignore
  const { pages }: number = await args;

  if (booru.toLowerCase() === 'list') {
    console.log('List of supported & mapped boorus:');
    const v = process.argv;
    v.shift();
    v.shift();
    MappedBooruNames.forEach(name => {
      if (name != 'thebigimageboard')
        console.log(
          '- %s %s (ie boorujs %s)',
          name,
          ' '.repeat(15 - name.length),
          '--booru ' + name,
        );
    });
    return;
  }
  if (BooruMappings[booru]) {
    const Booru = new BooruJS(BooruMappings[booru]); // Create a Booru Instance (Using booru as an argument would work, ts is just a bitch)
    Booru.Posts(tags ?? '', pages ?? 1).then(
      (
        postList, // gets all posts with the tag astolfo
      ) =>
        postList.forEach(async post => {
          console.log(post.URL);
          try {
            // for each post
            fs.writeFileSync(
              resolve(dir ?? process.cwd(), post.id + '-' + post.fileName),
              await post.Download(), // Returns a buffer containing the post
            ); // download posts
          } catch (error) {
            console.error(error);
          }
        }),
    );
  } else {
    throw new Error('Booru not found ' + booru);
  }
})();
