import type * as sf from '@that-hatter/scrapi-factory';
import { O, RA, RNEA, RR, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import path from 'node:path';
import * as BindingInfo from './BindingInfo';

// ----------------------------------------------------------------------------
// linkification
// ----------------------------------------------------------------------------

const aliasPath = (doc: AliasCopy) => {
  if (doc.doctype === 'constant') return doc.enum + '/' + doc.partialName;
  if (doc.doctype === 'namespace') return doc.name;
  return (
    (O.isSome(doc.namespace) ? doc.namespace.value + '/' : '') + doc.partialName
  );
};

export const mainUrl = (doc: sf.Topic) =>
  pipe(
    doc.filepath,
    // slice to remove the '.yml' extension
    O.map(
      (fp) => '/' + path.join('api', fp.slice(0, -4)).replaceAll('\\', '/')
    ),
    O.getOrElse(() => '#')
  );

export const url = (doc: sf.Topic) =>
  'source' in doc && isAliasCopy(doc)
    ? '/api/' + doc.doctype + 's/' + aliasPath(doc)
    : mainUrl(doc);

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
    doc.summary,
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

export const aliasPage = (alias: AliasCopy): md.Root =>
  md.root([
    md.simpleHeading(1)(alias.name),
    md.paragraph([
      md.text('This is an alias of '),
      md.link(mainUrl(alias), O.none, [md.inlineCode(alias.aliasOf.value)]),
      md.text('.'),
    ]),
  ]);

const aliasNameString = (doc: sf.BindingInfo): md.PhrasingContent =>
  BindingInfo.strikeBasedOnStatus(doc)(md.text(doc.name));

export const aliasesSection =
  (allEntries: RR.ReadonlyRecord<string, Aliasable>) =>
  ({ aliases }: Aliasable): O.Option<md.Fragment> =>
    pipe(
      aliases,
      RA.filterMap((a) => RR.lookup(a.name)(allEntries)),
      RA.map(aliasNameString),
      RA.intersperse<md.PhrasingContent>(md.text(', ')),
      RNEA.fromReadonlyArray,
      O.map((a) =>
        md.paragraph([md.bold([md.text('aliases:')]), md.text(' '), ...a])
      )
    );
