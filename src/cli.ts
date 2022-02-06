#!/usr/bin/env node
import * as fs from 'fs'; // Load fs
import BooruJS, { BooruMappings, MappedBooruNames } from '.'; // Load BooruJS
import * as yargs from 'yargs';
import { resolve } from 'path';
import { Post } from './APIs/ReturnValues';

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
    .option('multi', {
      alias: ['m'],
      describe: 'Download multiple at once',
      type: 'boolean',
    })
    .option('log', {
      alias: ['l'],
      describe: 'Log files being downloaded',
      type: 'boolean',
    })
    .option('dry', {
      alias: ['dry-run'],
      describe: `Don't modify FS`,
      type: 'boolean',
    })
    .option('json', {
      describe: `Write JSON files`,
      type: 'boolean',
    })
    .demandOption(['booru'], 'Please provide a booru to use.')
    .help().argv;
  // @ts-ignore
  let { booru, dir, tags }: Record<string, string> = await args;
  // @ts-ignore
  let { multi, log, dry, json }: Record<string, boolean> = await args;
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
    const download = (post: Post) =>
      new Promise(async res => {
        if (log) console.log('Downloading ' + post.URL);
        const filePath = resolve(
          dir ?? process.cwd(),
          post.id + '-' + post.fileName,
        );
        if (json) {
          return fs.writeFileSync(
            filePath + '.json',
            JSON.stringify(post, null, 2),
          );
        }
        if (!post.URL) return console.warn('Post ' + post.id + ' has no URL');
        try {
          if (!fs.existsSync(filePath) && !dry)
            // for each post
            fs.writeFileSync(
              filePath,
              await post.Download(), // Returns a buffer containing the post
            );
          else if (dry) await post.Download();
        } catch (error) {
          if (!dry)
            fs.writeFileSync(
              resolve(
                dir ?? process.cwd(),
                'error.' + post.id + '-' + post.fileName + '.log',
              ),
              `Error for ${post.URL}:
POST:
${JSON.stringify(post, null, 2)}
ERROR:
${JSON.stringify(error, null, 2)}`,
            );
          console.error(
            'An error ocurred for ' +
              post.id +
              '-' +
              post.fileName +
              ' - See ' +
              resolve(
                dir ?? process.cwd(),
                'error.' + post.id + '-' + post.fileName + '.log',
              ),
          );
        }
        res(void 0);
      });
    const Booru = new BooruJS(BooruMappings[booru]); // Create a Booru Instance (Using booru as an argument would work, ts is just a bitch)
    Booru.Posts(tags ?? '', pages ?? 1).then(
      multi
        ? postList => postList.forEach(download)
        : async postList => {
            for (const k in postList) {
              if (Object.prototype.hasOwnProperty.call(postList, k)) {
                const post = postList[k];
                await download(post);
              }
            }
          },
    );
  } else {
    throw new Error('Booru not found ' + booru);
  }
})();
