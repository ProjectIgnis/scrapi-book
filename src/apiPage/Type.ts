import * as sf from '@that-hatter/scrapi-factory';
import {
  Eq,
  O,
  RA,
  RNEA,
  RR,
  memoize,
  pipe,
} from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as Rd from 'fp-ts/Reader';
import * as Comp from './shared/Component';
import * as SignatureInfo from './shared/SignatureInfo';
import * as Topic from './shared/Topic';
import * as TopicInfo from './shared/TopicInfo';

const supertypeString = (tp: sf.Type) =>
  tp.supertype === sf.FUNCTION_TYPE_SYMBOL
    ? O.some('function')
    : tp.supertype === sf.TABLE_TYPE_SYMBOL
    ? O.some('table')
    : tp.supertype;

// ----------------------------------------------------------------------------
// Table Type
// ----------------------------------------------------------------------------

const fieldSectionTitle = (field: sf.TableTypeField) =>
  pipe(
    field.valueType,
    Comp.fullTypeMD,
    Rd.map(
      RNEA.concat<md.PhrasingContent>([
        md.text(' '),
        md.inlineCode(String(field.name)),
      ])
    )
  );

const fieldSection = (hdepth: md.HeadingDepth) => (field: sf.TableTypeField) =>
  pipe(
    fieldSectionTitle(field),
    Rd.map(md.heading(hdepth)),
    Rd.map((heading) => md.listItem([heading, field.description]))
  );

const mappedTypeSectionTitle = (mt: sf.TableTypeMappedType) => (api: sf.API) =>
  pipe(
    Comp.fullTypeMD(mt.valueType)(api),
    RNEA.concat<md.PhrasingContent>([
      md.text(' ['),
      Comp.singleTypeMD(mt.keyType)(api),
      md.text(']'),
    ])
  );

const mappedTypeListItem =
  (hdepth: md.HeadingDepth) => (mt: sf.TableTypeMappedType) =>
    pipe(
      mappedTypeSectionTitle(mt),
      Rd.map(md.heading(hdepth)),
      Rd.map((heading) => md.listItem([heading, mt.description]))
    );

const tableTypeInfoSection = (hdepth: md.HeadingDepth) => (tt: sf.TableType) =>
  pipe(
    Rd.Do,
    Rd.bind('fields', () =>
      Comp.combinedSections(
        hdepth,
        'Fields',
        fieldSection(md.subdepth(hdepth))
      )(tt.fields)
    ),
    Rd.bind('mappedTypes', () =>
      Comp.combinedSections(
        hdepth,
        'Mapped Types',
        mappedTypeListItem(md.subdepth(hdepth))
      )(tt.mappedTypes)
    ),
    Rd.map(({ fields, mappedTypes }) =>
      md.combinedFragments([fields, mappedTypes])
    )
  );

const allValueTypes = memoize(({ name }: sf.TableType) => name)(
  (tt): ReadonlyArray<string> =>
    pipe(
      tt.fields,
      RA.concatW(tt.mappedTypes),
      RA.map(({ valueType }) => valueType),
      RA.flatten,
      RA.uniq<string>(Eq.eqStrict)
    )
);

const allMappedTypeKeys = memoize(({ name }: sf.TableType) => name)(
  (tt): ReadonlyArray<string> =>
    pipe(
      tt.mappedTypes,
      RA.map(({ keyType }) => keyType),
      RA.uniq<string>(Eq.eqStrict)
    )
);

const tableTypePageUniqueSection = (tt: sf.TableType) =>
  pipe(
    tableTypeInfoSection(2)(tt),
    Rd.map((info) => md.combinedFragments([info, tt.guide]))
  );

// ----------------------------------------------------------------------------
// Function Type
// ----------------------------------------------------------------------------

const funcTypeSampleCode = (v: sf.Variant<sf.FunctionType>): md.Code =>
  md.luaCode('function' + SignatureInfo.argsString(v.parameters));

const funcTypePageUniqueSection =
  (ft: sf.FunctionType) =>
  (api: sf.API): md.Fragment =>
    md.combinedFragments([
      SignatureInfo.mainSection(ft, 'function', funcTypeSampleCode, 2)(api),
      SignatureInfo.combinedOverloadSections(
        ft,
        'function',
        funcTypeSampleCode,
        2
      )(api),
    ]);

// ----------------------------------------------------------------------------
// Type
// ----------------------------------------------------------------------------

const usageListing =
  (tp: sf.Type) =>
  <T extends sf.Topic>(
    xs: ReadonlyArray<T>,
    compFn: (x: T) => O.Option<string> | ReadonlyArray<string>,
    heading: string
  ): O.Option<md.Fragment> =>
    pipe(
      xs,
      RA.filter((x) => {
        const comp = compFn(x);
        return comp instanceof Array
          ? comp.includes(tp.name)
          : O.isSome(comp) && comp.value === tp.name;
      }),
      Topic.summaryListWithHeading(3, heading),
      O.map((content) => md.collapsible(heading, content))
    );

const supertypeSection = (api: sf.API) => (t: sf.Type) =>
  pipe(
    supertypeString(t),
    O.flatMap((st) => RR.lookup(st)(api.types.record)),
    O.map((st) =>
      md.paragraph(
        md.superscript([md.text('subtype of '), Topic.linkedNameText(st)])
      )
    )
  );

const isFunctionType = (t: sf.Type): t is sf.FunctionType =>
  t.supertype === sf.FUNCTION_TYPE_SYMBOL;

const isTableType = (t: sf.Type): t is sf.TableType =>
  t.supertype === sf.TABLE_TYPE_SYMBOL;

const getFunctionTypes = memoize((_: ReadonlyArray<sf.Type>) => 'functions')(
  RA.filter(isFunctionType)
);

const getTableTypes = memoize((_: ReadonlyArray<sf.Type>) => 'tables')(
  RA.filter(isTableType)
);

const getOtherTypes = memoize((_: ReadonlyArray<sf.Type>) => 'others')(
  RA.filter((t) => typeof t.supertype !== 'symbol')
);

export const page =
  (tp: sf.Type) =>
  (api: sf.API): md.Root => {
    const functionTypes = getFunctionTypes(api.types.array);
    const tableTypes = getTableTypes(api.types.array);
    const usageList = usageListing(tp);
    return md.combinedFragments([
      md.simpleHeading(1)(tp.name),
      supertypeSection(api)(tp),
      tp.description,
      usageList(api.types.array, supertypeString, 'Subtypes'),
      usageList(
        api.functions.array,
        SignatureInfo.allParamTypes,
        'Functions that use this type as parameter'
      ),
      usageList(
        api.functions.array,
        SignatureInfo.allReturnTypes,
        'Functions that return this type'
      ),
      usageList(
        functionTypes,
        SignatureInfo.allParamTypes,
        'Function Types that use this type as parameter'
      ),
      usageList(
        functionTypes,
        SignatureInfo.allReturnTypes,
        'Function Types that return this type'
      ),
      usageList(
        tableTypes,
        allValueTypes,
        'Table Types with field values of this type'
      ),
      usageList(
        tableTypes,
        allMappedTypeKeys,
        'Table Types that use this type as index'
      ),
      tp.supertype === sf.TABLE_TYPE_SYMBOL
        ? tableTypePageUniqueSection(tp)(api)
        : tp.supertype === sf.FUNCTION_TYPE_SYMBOL
        ? funcTypePageUniqueSection(tp)(api)
        : tp.guide,
      TopicInfo.seeAlsoSection(tp),
      Topic.tagsSection(tp)(api),
    ]);
  };

export const sidebarGroup = {
  text: 'Types',
  link: '/api/types/__index',
};

export const indexPage = (docs: ReadonlyArray<sf.Type>) =>
  md.combinedFragments([
    Topic.summaryListWithHeading(1, 'Types')(getOtherTypes(docs)),
    Topic.summaryListWithHeading(2, 'Function Types')(getFunctionTypes(docs)),
    Topic.summaryListWithHeading(2, 'Table Types')(getTableTypes(docs)),
  ]);
