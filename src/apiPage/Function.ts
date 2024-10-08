import type * as sf from '@that-hatter/scrapi-factory';
import { O, R, RA, RNEA, RR, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as BindingInfo from './shared/BindingInfo';
import * as SignatureInfo from './shared/SignatureInfo';
import * as Topic from './shared/Topic';
import * as TopicInfo from './shared/TopicInfo';

type ParamSplit = Readonly<[sf.Parameter, ReadonlyArray<sf.Parameter>]>;

const isColonCallable =
  (fn: sf.Function) =>
  ([{ type }]: ParamSplit): boolean =>
    type.length === 1 &&
    O.isSome(fn.namespace) &&
    RNEA.head(type) === fn.namespace.value;

const colonCallSample =
  (fn: sf.Function) =>
  ([fst, rest]: ParamSplit): string =>
    fst.name + ':' + fn.partialName + SignatureInfo.argsString(rest);

// dot notation (or just using the name if there's no module)
const dotCallSample =
  (fn: sf.Function, v: sf.Variant<sf.Function>) => (): string =>
    fn.name + SignatureInfo.argsString(v.parameters);

const sampleCodeFn =
  (fn: sf.Function) =>
  (v: sf.Variant<sf.Function>): md.Code =>
    pipe(
      RNEA.fromReadonlyArray(v.parameters),
      O.map(RNEA.unprepend),
      O.filter(isColonCallable(fn)),
      O.match(dotCallSample(fn, v), colonCallSample(fn)),
      md.luaCode
    );

const usageExamplesLink = (fn: sf.Function) =>
  O.some(
    md.link(
      'https://github.com/search?q=repo%3AProjectIgnis%2FCardScripts+' +
        encodeURIComponent(fn.partialName) +
        '&type=code',
      O.none,
      [md.text('Usage Examples')]
    )
  );

const getNamespace = (fn: sf.Function) => (api: sf.API) =>
  pipe(
    api.namespaces.record,
    RR.lookup(O.isSome(fn.namespace) ? fn.namespace.value : '(Global)')
  );

const namespaceLink = (fn: sf.Function) =>
  pipe(
    getNamespace(fn),
    R.map(
      O.map((ns) =>
        md.link(
          Topic.url(ns) + '#Functions',
          O.none,
          ns.name === '(Global)'
            ? [md.text('(Global) Functions')]
            : [md.inlineCode(ns.name), md.text(' Functions')]
        )
      )
    )
  );

const quickLinksSection = (fn: sf.Function) =>
  pipe(
    namespaceLink(fn),
    R.map((ns) =>
      pipe(
        [BindingInfo.sourceLink(fn), usageExamplesLink(fn), ns],
        RA.compact,
        RA.intersperse<md.PhrasingContent>(md.text(' | ')),
        RNEA.fromReadonlyArray,
        O.map(md.superscript),
        O.map(md.paragraph)
      )
    )
  );

export const page =
  (fn: sf.Function) =>
  (api: sf.API): md.Root => {
    if (Topic.isAliasCopy(fn)) return Topic.aliasPage(fn);
    const sampleFn = sampleCodeFn(fn);
    return md.combinedFragments([
      BindingInfo.statusHatnote(fn),
      md.simpleHeading(1)(fn.name),
      quickLinksSection(fn)(api),
      fn.description,
      Topic.aliasesSection(api.functions.record)(fn),
      SignatureInfo.mainSection(fn, fn.name, sampleFn, 2)(api),
      SignatureInfo.combinedOverloadSections(fn, fn.name, sampleFn, 2)(api),
      TopicInfo.seeAlsoSection(fn),
      Topic.tagsSection(fn)(api),
    ]);
  };
