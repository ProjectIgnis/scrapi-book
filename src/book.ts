import * as sf from '@that-hatter/scrapi-factory';
import { R, RA, TE, flow, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import fs from 'fs';
import path from 'path';
import * as Constant from './apiPage/Constant';
import * as Enum from './apiPage/Enum';
import * as Function from './apiPage/Function';
import * as Namespace from './apiPage/Namespace';
import * as Tag from './apiPage/Tag';
import * as Type from './apiPage/Type';
import * as Topic from './apiPage/shared/Topic';

type APIPage<T extends sf.Topic> = {
  readonly topic: T;
  readonly content: string;
  readonly link: string;
};

const prepareAPIPages = <T extends sf.Topic>(
  pageFn: (t: T) => R.Reader<sf.API, md.Root>
) =>
  flow(
    RA.map((topic: T) =>
      pipe(
        pageFn(topic),
        R.map(md.compile),
        R.map((content) => ({
          topic,
          content,
          link: Topic.url(topic),
        }))
      )
    ),
    R.sequenceArray
  );

const createSidebar = (api: sf.API) => [
  Namespace.sidebarGroup(api),
  Enum.sidebarGroup(api),
  Type.sidebarGroup(api),
  Tag.sidebarGroup(api),
];

const writeFileTask = TE.tryCatchK(
  (filepath: string, content: string) =>
    fs.promises
      .mkdir(path.dirname(filepath), { recursive: true })
      .then(() => fs.promises.writeFile(filepath, content)),
  (err) => String(err instanceof Error ? err.message : err)
);

const generatePageFile = (page: APIPage<sf.Topic>) =>
  writeFileTask(
    path.join(process.cwd(), 'docs', page.link + '.md'),
    page.content
  );

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
  pipe(
    [
      ...prepareAPIPages(Constant.page)(api.constants.array)(api),
      ...prepareAPIPages(Enum.page)(api.enums.array)(api),
      ...prepareAPIPages(Function.page)(api.functions.array)(api),
      ...prepareAPIPages(Namespace.page)(api.namespaces.array)(api),
      ...prepareAPIPages(Tag.page)(api.tags.array)(api),
      ...prepareAPIPages(Type.page)(api.types.array)(api),
    ],
    RA.map(generatePageFile),
    RA.append(generateSidebarFile(api)),
    RA.append(generateTypesIndexFile(api)),
    RA.append(generateTagsIndexFile(api)),
    TE.sequenceArray
  );

const program = pipe(
  sf.loadYard(sf.DEFAULT_OPTIONS),
  TE.chainW(({ api }) => generateFiles(api)),
  TE.tapError((err) => {
    const errStr = JSON.stringify(err, null, 2);
    // eslint-disable-next-line functional/no-expression-statements
    console.log(errStr);
    return writeFileTask(path.join(process.cwd(), '..', 'error.json'), errStr);
  })
);

// eslint-disable-next-line functional/no-expression-statements
void program();
