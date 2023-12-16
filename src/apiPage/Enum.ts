import type * as sf from '@that-hatter/scrapi-factory';
import { RA, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as Constant from './Constant';
import * as Desc from './shared/DescInfo';
import * as Topic from './shared/Topic';
import * as PageInfo from './shared/TopicInfo';

export const page =
  (en: sf.Enum) =>
  (api: sf.API): md.Root =>
    md.combinedFragments([
      md.simpleHeading(1)(en.name),
      Desc.descAndGuide(en),
      ...pipe(
        api.constants.array,
        RA.filter((ct) => ct.enum === en.name),
        (cts) => Constant.tables(cts, en)
      ),
      PageInfo.seeAlsoSection(en),
      Topic.tagsSection(en)(api),
    ]);
