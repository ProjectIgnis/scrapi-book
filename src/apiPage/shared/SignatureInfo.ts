import type * as sf from '@that-hatter/scrapi-factory';
import {
  Eq,
  R,
  RA,
  RNEA,
  flow,
  memoize,
  pipe,
  string,
} from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as Parameter from './SignatureInfo.Parameter';
import * as Return from './SignatureInfo.Return';

const fullSignature = (sig: sf.Variant<sf.SignatureInfo>, name: string) =>
  pipe(
    R.Do,
    R.bind('params', () => Parameter.combinedPartialSignatures(sig.parameters)),
    R.bind('returns', () => Return.combinedPartialSignatures(sig.returns)),
    R.map(
      ({ params, returns }): RNEA.ReadonlyNonEmptyArray<md.PhrasingContent> => [
        md.text(name + '('),
        ...params,
        md.text(') → '),
        ...returns,
      ]
    )
  );

export const argsString = flow(
  RA.map(({ name }: sf.Parameter) => name),
  RA.intercalate(string.Monoid)(','),
  string.parenthesized
);

const synopsis = <T extends sf.SignatureInfo>(
  doc: sf.Variant<T>,
  name: string,
  sampleFn: (t: sf.Variant<T>) => md.Code
) =>
  pipe(
    fullSignature(doc, name),
    R.map((sig) => [md.paragraph(sig), sampleFn(doc)])
  );

export const mainSection = <T extends sf.SignatureInfo & sf.DescInfo>(
  doc: T,
  name: string,
  sampleFn: (t: sf.Variant<T>) => md.Code,
  hdepth: md.HeadingDepth
): R.Reader<sf.API, md.Fragment> =>
  pipe(
    R.Do,
    R.bind('synopsis', () => synopsis(doc, name, sampleFn)),
    R.bind('params', () =>
      Parameter.combinedSections(md.subdepth(hdepth))(doc.parameters)
    ),
    R.bind('returns', () =>
      Return.combinedSections(md.subdepth(hdepth))(doc.returns)
    ),
    R.map(({ synopsis, params, returns }) =>
      md.combinedFragments([
        md.simpleHeading(hdepth)('Signature'),
        ...synopsis,
        params,
        returns,
        doc.guide,
      ])
    )
  );

const overloadSection = <T extends sf.SignatureInfo>(
  doc: sf.Overload,
  name: string,
  sampleFn: (t: sf.Variant<T>) => md.Code,
  hdepth: md.HeadingDepth
): R.Reader<sf.API, md.Fragment> =>
  pipe(
    R.Do,
    R.bind('synopsis', () => synopsis(doc, name, sampleFn)),
    R.bind('params', () =>
      Parameter.combinedSections(md.subdepth(hdepth))(doc.parameters)
    ),
    R.bind('returns', () =>
      Return.combinedSections(md.subdepth(hdepth))(doc.returns)
    ),
    R.map(({ synopsis, params, returns }) =>
      md.combinedFragments([
        md.simpleHeading(hdepth)('Overload'),
        ...synopsis,
        doc.description,
        params,
        returns,
        doc.guide,
      ])
    )
  );

export const combinedOverloadSections = <T extends sf.SignatureInfo>(
  doc: T,
  name: string,
  sampleFn: (t: sf.Variant<T>) => md.Code,
  hdepth: md.HeadingDepth
): R.Reader<sf.API, md.Fragment> =>
  pipe(
    doc.overloads,
    RA.map((ov) => overloadSection(ov, name, sampleFn, hdepth)),
    R.sequenceArray,
    R.map(md.combinedFragments)
  );

type SigWithName = sf.SignatureInfo & { readonly name: string };
const allComponentTypes = (compFn: 'parameters' | 'returns') =>
  memoize((doc: SigWithName) => doc.name)(
    (doc): ReadonlyArray<string> =>
      pipe(
        doc.overloads,
        RA.prependW(doc),
        RA.flatMap((ov): ReadonlyArray<sf.Parameter | sf.Return> => ov[compFn]),
        RA.flatMap(({ type }) => type),
        RA.uniq<string>(Eq.eqStrict)
      )
  );

export const allParamTypes = allComponentTypes('parameters');
export const allReturnTypes = allComponentTypes('returns');
