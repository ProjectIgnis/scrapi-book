import type * as sf from '@that-hatter/scrapi-factory';
import {
  O,
  R,
  RA,
  RNEA,
  RR,
  flow,
  identity,
  pipe,
} from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as BindingInfo from './shared/BindingInfo';
import * as Topic from './shared/Topic';
import * as TopicInfo from './shared/TopicInfo';

type BitConstant = sf.Constant & { readonly value: bigint };
type ValueCellFn<T extends sf.Constant = sf.Constant> = (
  value: T['value']
) => ReadonlyArray<md.TableCell>;

const hexString = (b: bigint) => '0x' + b.toString(16);

const normalValueCell: ValueCellFn = (value) => [
  md.tableCell([md.inlineCode(String(value))]),
];

const bitValueCells: ValueCellFn<BitConstant> = (value) => [
  md.tableCell([md.inlineCode(hexString(value))]),
  md.tableCell([md.inlineCode(String(value))]),
];

const tableRowCells =
  <T extends sf.Constant>(valueCellFn: ValueCellFn<T>) =>
  (ct: T) =>
    pipe(
      Topic.linkedNameCode(ct),
      BindingInfo.strikeBasedOnStatus(ct),
      RNEA.of,
      md.tableCell,
      RNEA.of,
      RNEA.concat(valueCellFn(ct.value)),
      RNEA.concat(
        pipe(
          ct.summary,
          O.chain((par) => RNEA.fromArray(par.children)),
          O.map((chs) => [md.tableCell(chs)]),
          O.getOrElseW(() => [])
        )
      )
    );

const toTableHeadingRow = (strs: ReadonlyArray<string>) =>
  pipe(
    RNEA.of('Constant'),
    RNEA.concat([...strs, 'Summary']),
    RNEA.map(flow(md.text, RNEA.of, md.tableCell)),
    md.tableRow
  );
const normalTableHeading = toTableHeadingRow(['Value']);
const bitmaskTableHeading = toTableHeadingRow(['HEX', 'DEC']);

const table =
  <T extends sf.Constant>(heading: md.TableRow, valueCellFn: ValueCellFn<T>) =>
  (cts: ReadonlyArray<T>) =>
    pipe(
      cts,
      RNEA.fromReadonlyArray,
      O.map(RNEA.map(flow(tableRowCells(valueCellFn), md.tableRow))),
      O.map((rows) => md.table([heading, ...rows]))
    );

export const tables = (
  cts: ReadonlyArray<sf.Constant>,
  en: sf.Enum
): ReadonlyArray<md.Table> =>
  pipe(
    cts,
    RA.partition(
      (ct): ct is BitConstant =>
        en.bitmaskInt && typeof ct.value === 'bigint' && ct.value >= 0
    ),
    ({ left, right }) => [
      table(normalTableHeading, normalValueCell)(left),
      table(bitmaskTableHeading, bitValueCells)(right),
    ],
    RA.filterMap(identity)
  );

const bitValueSection = (n: bigint): md.BlockContent =>
  md.unorderedList([
    md.listItem([
      md.paragraph([
        md.bold([md.text('HEX')]),
        md.text(': '),
        md.inlineCode(hexString(n)),
      ]),
    ]),
    md.listItem([
      md.paragraph([
        md.bold([md.text('DEC')]),
        md.text(': '),
        md.inlineCode(String(n)),
      ]),
    ]),
  ]);

const valueSection = ({ value }: sf.Constant, { bitmaskInt }: sf.Enum) => {
  if (bitmaskInt && typeof value === 'bigint') return bitValueSection(value);
  return pipe(value, String, md.inlineCode, RNEA.of, md.paragraph);
};

const getNamespace = (ct: sf.Constant) => (api: sf.API) =>
  pipe(
    api.namespaces.record,
    RR.lookup(O.isSome(ct.namespace) ? ct.namespace.value : '(Global)')
  );

const namespaceLink = (ct: sf.Constant) =>
  pipe(
    getNamespace(ct),
    R.map(
      O.map((ns) =>
        md.link(
          Topic.url(ns) + '#Constants',
          O.none,
          ns.name === '(Global)'
            ? [md.text('(Global) Constants')]
            : [md.inlineCode(ns.name), md.text(' Constants')]
        )
      )
    )
  );

const enumLink = (ct: sf.Constant) => (api: sf.API) =>
  pipe(
    ct.enum,
    (en) => RR.lookup(en)(api.enums.record),
    O.map((en) => Topic.linkify([md.text(en.name + ' constants')])(en))
  );

const quickLinksSection = (ct: sf.Constant) =>
  pipe(
    [namespaceLink(ct), enumLink(ct)],
    R.sequenceArray,
    R.map((links) =>
      pipe(
        [BindingInfo.sourceLink(ct), ...links],
        RA.filterMap(identity),
        RA.intersperse<md.PhrasingContent>(md.text(' | ')),
        RNEA.fromReadonlyArray,
        O.map(md.superscript),
        O.map(md.paragraph)
      )
    )
  );

const enumNotFoundError = (ct: sf.Constant): md.Root =>
  md.root(
    md.admonition(
      'danger',
      [md.paragraph([md.text('Could not find enum: ' + ct.enum)])],
      'Constant error'
    )
  );

export const page =
  (ct: sf.Constant) =>
  (api: sf.API): md.Root => {
    if (Topic.isAliasCopy(ct)) return Topic.aliasPage(ct);
    return pipe(
      api.enums.record,
      RR.lookup(ct.enum),
      O.map((en) =>
        md.combinedFragments([
          BindingInfo.statusHatnote(ct),
          md.simpleHeading(1)(ct.name),
          quickLinksSection(ct)(api),
          ct.description,
          md.simpleHeading(2)('Value'),
          md.root([valueSection(ct, en)]),
          Topic.aliasesSection(api.constants.record)(ct),
          ct.guide,
          TopicInfo.seeAlsoSection(ct),
          Topic.tagsSection(ct)(api),
        ])
      ),
      O.getOrElse(() => enumNotFoundError(ct))
    );
  };

export const sidebarGroup = (api: sf.API) => ({
  text: 'Constants',
  collapsed: true,
  items: pipe(
    api.enums.array,
    RA.map((en) =>
      pipe(
        api.constants.array,
        RA.filter((c) => c.enum === en.name),
        RA.map((c) => ({
          text: c.partialName,
          link: Topic.url(c),
        })),
        (items) => ({
          text: en.name,
          link: Topic.url(en),
          collapsed: true,
          items,
        })
      )
    )
  ),
});
