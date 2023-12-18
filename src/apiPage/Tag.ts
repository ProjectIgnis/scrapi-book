import type * as sf from '@that-hatter/scrapi-factory';
import { O, RA, flow, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as DescInfo from './shared/DescInfo';
import * as Topic from './shared/Topic';

export const listPage = (tags: ReadonlyArray<sf.Tag>): O.Option<md.Root> =>
  pipe(tags, Topic.summaryListWithHeading(1, 'Tags'), O.map(md.root));

const taggedTopicsListing =
  (tag: sf.Tag) =>
  (heading: string, topics: ReadonlyArray<Exclude<sf.Topic, sf.Tag>>) =>
    pipe(
      topics,
      RA.filter((a) => a.tags.includes(tag.name)),
      Topic.summaryListWithHeading(2, heading)
    );

export const page =
  (tag: sf.Tag) =>
  (api: sf.API): md.Root => {
    const topicList = taggedTopicsListing(tag);
    return md.combinedFragments([
      md.simpleHeading(1)(tag.name),
      DescInfo.descAndGuide(tag),
      topicList('Namespaces', api.namespaces.array),
      topicList('Enums', api.enums.array),
      topicList('Functions', api.functions.array),
      topicList('Constants', api.constants.array),
      topicList('Types', api.types.array),
    ]);
  };

export const sidebarGroup = (api: sf.API) => ({
  text: 'Tags',
  collapsed: true,
  items: pipe(
    api.tags.array,
    RA.map((t) => ({ text: t.name, link: Topic.url(t) }))
  ),
});

export const indexPage = flow(
  Topic.summaryListWithHeading(1, 'Tags'),
  RA.of,
  md.combinedFragments
);
