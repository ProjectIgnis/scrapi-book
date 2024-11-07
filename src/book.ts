import * as sf from '@that-hatter/scrapi-factory';
import { O, R, RA, TE, flow, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as Constant from './apiPage/Constant';
import * as Enum from './apiPage/Enum';
import * as Function from './apiPage/Function';
import * as Namespace from './apiPage/Namespace';
import * as Tag from './apiPage/Tag';
import * as Type from './apiPage/Type';
import * as Topic from './apiPage/shared/Topic';

const writeFileTask = TE.tryCatchK(
  (filepath: string, content: string) =>
    fs
      .mkdir(path.dirname(filepath), { recursive: true })
      .then(() => fs.writeFile(filepath, content)),
  (err) => String(err instanceof Error ? err.message : err)
);

type APIPage<T extends sf.Topic> = {
  readonly topic: T;
  readonly content: string;
  readonly link: string;
};

const generatePageFile = (page: APIPage<sf.Topic>) =>
  writeFileTask(
    path.join(process.cwd(), 'docs', page.link + '.md'),
    page.content
  );

const generateAPIPages = <T extends sf.Topic>(
  pageFn: (t: T) => R.Reader<sf.API, md.Root>
) =>
  flow(
    RA.filterMap((topic: T) => {
      if ('source' in topic && Topic.isAliasCopy(topic)) return O.none;
      return pipe(
        topic,
        pageFn,
        R.map(md.compile),
        R.map(
          (content): APIPage<sf.Topic> => ({
            topic,
            content,
            link: Topic.url(topic),
          })
        ),
        O.some
      );
    }),
    R.sequenceArray,
    R.map(RA.map(generatePageFile))
  );

const createSidebar = (api: sf.API) => [
  Namespace.sidebarGroup(api),
  Enum.sidebarGroup(api),
  {
    text: 'Types',
    link: '/api/types/__index',
  },
  {
    text: 'Tags',
    link: '/api/tags/__index',
  },
];

const generateSidebarFile = (api: sf.API) =>
  writeFileTask(
    path.join(process.cwd(), 'docs', '.vitepress', 'apiSidebar.json'),
    JSON.stringify(createSidebar(api), null, 2)
  );

const generateTypesIndexFile = (api: sf.API) =>
  writeFileTask(
    path.join(process.cwd(), 'docs', 'api', 'types', '__index.md'),
    md.compile(Type.indexPage(api.types.array))
  );

const generateTagsIndexFile = (api: sf.API) =>
  writeFileTask(
    path.join(process.cwd(), 'docs', 'api', 'tags', '__index.md'),
    md.compile(Tag.indexPage(api.tags.array))
  );

const generateFiles = (api: sf.API) =>
  TE.sequenceArray([
    ...generateAPIPages(Constant.page)(api.constants.array)(api),
    ...generateAPIPages(Enum.page)(api.enums.array)(api),
    ...generateAPIPages(Function.page)(api.functions.array)(api),
    ...generateAPIPages(Namespace.page)(api.namespaces.array)(api),
    ...generateAPIPages(Tag.page)(api.tags.array)(api),
    ...generateAPIPages(Type.page)(api.types.array)(api),
    generateSidebarFile(api),
    generateTypesIndexFile(api),
    generateTagsIndexFile(api),
  ]);

const program = pipe(
  {
    ...sf.DEFAULT_OPTIONS,
    directory: path.join(process.cwd(), '..', 'scrapiyard', 'api'),
  },
  sf.loadYard,
  TE.chainW(({ api }) => generateFiles(api)),
  TE.tapError((err) => {
    const errStr = JSON.stringify(err, null, 2);
    // eslint-disable-next-line functional/no-expression-statements
    console.error(errStr);
    return writeFileTask(path.join(process.cwd(), '..', 'error.json'), errStr);
  })
);

// eslint-disable-next-line functional/no-expression-statements
void program();
