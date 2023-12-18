import type * as sf from '@that-hatter/scrapi-factory';
import { O, RA, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as BindingInfo from './shared/BindingInfo';
import * as DescInfo from './shared/DescInfo';
import * as Topic from './shared/Topic';
import * as TopicInfo from './shared/TopicInfo';

type WithNamespace = sf.Function | sf.Constant;

const isNamespace =
  (ns: sf.Namespace) =>
  (doc: WithNamespace): boolean =>
    O.isSome(doc.namespace)
      ? ns.name === doc.namespace.value
      : ns.name === '(Global)';

const membersSummaryList = (
  nm: sf.Namespace,
  hdepth: md.HeadingDepth,
  title: string,
  docs: ReadonlyArray<WithNamespace>
): O.Option<md.Fragment> =>
  pipe(
    docs,
    RA.filter(isNamespace(nm)),
    Topic.summaryListWithHeading(hdepth, title)
  );

export const page =
  (nm: sf.Namespace) =>
  (api: sf.API): md.Root => {
    if (Topic.isAliasCopy(nm)) return Topic.aliasPage(nm);
    return md.combinedFragments([
      BindingInfo.statusHatnote(nm),
      md.simpleHeading(1)(nm.name),
      DescInfo.descAndGuide(nm),
      Topic.aliasesSection(api.namespaces.record)(nm),
      membersSummaryList(nm, 2, 'Functions', api.functions.array),
      TopicInfo.seeAlsoSection(nm),
      Topic.tagsSection(nm)(api),
    ]);
  };

export const sidebarGroup = (api: sf.API) => ({
  text: 'Functions',
  collapsed: true,
  items: pipe(
    api.namespaces.array,
    RA.filter((ns) => !Topic.isAliasCopy(ns)),
    RA.map((ns) => ({
      text: ns.name,
      link: Topic.url(ns),
    }))
  ),
});
