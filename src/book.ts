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

const prepareAll = <T extends sf.Topic>(
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
  Function.sidebarGroup(api),
  Constant.sidebarGroup(api),
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

const generateFiles = (api: sf.API) =>
  pipe(
    [
      ...prepareAll(Constant.page)(api.constants.array)(api),
      ...prepareAll(Enum.page)(api.enums.array)(api),
      ...prepareAll(Function.page)(api.functions.array)(api),
      ...prepareAll(Namespace.page)(api.namespaces.array)(api),
      ...prepareAll(Tag.page)(api.tags.array)(api),
      ...prepareAll(Type.page)(api.types.array)(api),
    ],
    RA.map(generatePageFile),
    RA.append(generateSidebarFile(api)),
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
