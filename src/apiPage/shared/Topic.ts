import type * as sf from '@that-hatter/scrapi-factory';
import { O, RA, RNEA, RR, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import path from 'node:path';
import * as BindingInfo from './BindingInfo';

// ----------------------------------------------------------------------------
// linkification
// ----------------------------------------------------------------------------

export const url = (doc: sf.Topic) =>
  pipe(
    doc.filepath,
    // slice to remove the '.yml' extension
    O.map(
      (fp) => '/' + path.join('api', fp.slice(0, -4)).replaceAll('\\', '/')
    ),
    O.getOrElse(() => '#')
  );

export const linkify =
  (content: md.Children<md.Link>) =>
  (doc: sf.Topic): md.Link =>
    md.link(url(doc), O.none, content);

export const linkedNameText = (doc: sf.Topic): md.Link =>
  linkify([md.text(doc.name)])(doc);

export const linkedNameCode = (doc: sf.Topic): md.Link =>
  linkify([md.inlineCode(doc.name)])(doc);

export const tagsSection =
  (doc: Exclude<sf.Topic, sf.Tag>) =>
  (api: sf.API): O.Option<md.Fragment> =>
    pipe(
      doc.tags,
      RA.filterMap((tg) => RR.lookup(tg)(api.tags.record)),
      RA.map(linkedNameText),
      RA.intersperse<md.PhrasingContent>(md.text(', ')),
      RNEA.fromReadonlyArray,
      O.map((p) => [md.thematicBreak, md.paragraph(p)])
    );

// ----------------------------------------------------------------------------
// summary listing
// ----------------------------------------------------------------------------

const summaryListItem = (doc: sf.Topic): md.ListItem =>
  pipe(
    'source' in doc && isAliasCopy(doc)
      ? O.some(aliasSummary(doc))
      : doc.summary,
    O.map((a) =>
      md.paragraph([linkedNameCode(doc), md.text(' - '), ...a.children])
    ),
    O.getOrElse(() => md.paragraph([linkedNameCode(doc)])),
    RNEA.of,
    md.listItem
  );

export const summaryList = (docs: ReadonlyArray<sf.Topic>): O.Option<md.List> =>
  pipe(
    docs,
    RNEA.fromReadonlyArray,
    O.map(RNEA.map(summaryListItem)),
    O.map(md.unorderedList)
  );

export const summaryListWithHeading =
  (hdepth: md.HeadingDepth, title: string) => (docs: ReadonlyArray<sf.Topic>) =>
    pipe(
      summaryList(docs),
      O.map((l) => [md.simpleHeading(hdepth)(title), l] as const)
    );

// ----------------------------------------------------------------------------
// alias shenanigans
// ----------------------------------------------------------------------------

type Aliasable = sf.Constant | sf.Function | sf.Namespace;
type AliasCopy = {
  readonly aliasOf: O.Some<string>;
} & Aliasable;

export const isAliasCopy = <T extends Aliasable>(
  doc: T
): doc is T & AliasCopy => O.isSome(doc.aliasOf);

export const getAliasCopies = <T extends Aliasable>(
  allEntries: ReadonlyArray<T>
) => {
  const aliases = pipe(allEntries, RA.filter(isAliasCopy));
  return ({ name }: T): ReadonlyArray<T & AliasCopy> =>
    pipe(
      aliases,
      RA.filter((a) => a.aliasOf.value === name)
    );
};

export const aliasSummary = (alias: AliasCopy) => {
  const status =
    (alias.status.index === 'stable' ? '' : alias.status.index + ' ') +
    'alias of';
  return md.paragraph([
    md.text(status[0]!.toUpperCase() + status.slice(1)),
    md.link(url(alias), O.none, [md.inlineCode(alias.aliasOf.value)]),
    md.text('.'),
  ]);
};

// TODO: remove this and its calls
export const aliasPage = (alias: AliasCopy): md.Root =>
  md.root([
    md.simpleHeading(1)(alias.name),
    md.paragraph([
      md.text('This is an alias of '),
      md.link(url(alias), O.none, [md.inlineCode(alias.aliasOf.value)]),
      md.text('.'),
    ]),
  ]);

const aliasNameString = (doc: sf.BindingInfo): md.Children<md.Paragraph> => {
  const name = BindingInfo.strikeBasedOnStatus(doc)(md.inlineCode(doc.name));
  if (doc.status.index === 'stable') return [name];
  return [name, ...md.superscript([md.text(doc.status.index)])];
};

export const aliasesSection =
  (allEntries: RR.ReadonlyRecord<string, Aliasable>) =>
  ({ aliases }: Aliasable): O.Option<md.Fragment> =>
    pipe(
      aliases,
      RA.filterMap((a) => RR.lookup(a.name)(allEntries)),
      RA.map(aliasNameString),
      RA.intersperse<md.Children<md.Paragraph>>([md.text(', ')]),
      RA.flatten,
      RNEA.fromReadonlyArray,
      O.map((a) =>
        md.paragraph([md.bold([md.text('aliases:')]), md.text(' '), ...a])
      )
    );
