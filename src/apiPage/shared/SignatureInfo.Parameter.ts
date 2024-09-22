import type * as sf from '@that-hatter/scrapi-factory';
import {
  O,
  R,
  RA,
  RNEA,
  flow,
  identity,
  pipe,
} from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as Comp from './Component';

// string used in the signature line for one parameter,
// also used as the heading for each parameter section
const partialSignature = (param: sf.Parameter) =>
  pipe(
    param.type,
    Comp.fullTypeMD,
    R.map(RNEA.concatW([md.text(' '), md.inlineCode(param.name)]))
  );
const partialSignatureWithDefault = (param: sf.Parameter) =>
  pipe(
    partialSignature(param),
    R.map((sig) =>
      pipe(
        param.defaultValue,
        O.map(String),
        O.map(md.inlineCode),
        O.map((def) => [...sig, md.text(' = '), def]),
        O.chain(RNEA.fromArray),
        O.getOrElse(() => sig)
      )
    )
  );

const partialSignaturesWithCommas = flow(
  RA.map(partialSignatureWithDefault),
  R.sequenceArray,
  R.map(
    RA.intersperse<RNEA.ReadonlyNonEmptyArray<md.PhrasingContent>>([
      md.text(', '),
    ])
  ),
  R.map(RA.flatten)
);

export const combinedPartialSignatures = flow(
  RA.partition((pm: sf.Parameter) => pm.required),
  ({ right: req, left: opt }) => [req, opt],
  RA.map(partialSignaturesWithCommas),
  R.sequenceArray,
  R.map(([req, opt]): ReadonlyArray<md.PhrasingContent> => {
    if (!opt || opt.length === 0) return req ?? [];

    const optWithBrackets = [md.text('['), ...opt, md.text(']')];
    if (!req || req.length === 0) return optWithBrackets;

    return [...req, md.text(', '), ...optWithBrackets];
  })
);

const preDescription = (param: sf.Parameter): O.Option<md.Paragraph> =>
  pipe(
    param.defaultValue,
    O.map((def) => [
      md.text('Defaults to '),
      md.inlineCode(String(def)),
      md.text('.'),
    ]),
    O.getOrElseW(() => []),
    param.required
      ? identity
      : (pre) => [md.text(pre.length > 0 ? 'Optional. ' : 'Optional.'), ...pre],
    RNEA.fromReadonlyArray,
    O.map(md.italic),
    O.map(RNEA.of),
    O.map(md.paragraph)
  );

const section = (hdepth: md.HeadingDepth) => (param: sf.Parameter) =>
  pipe(
    partialSignature(param),
    R.map(md.heading(hdepth)),
    R.map((heading) =>
      pipe(
        preDescription(param),
        O.map((preDesc) => md.listItem([heading, preDesc, param.description])),
        O.getOrElse(() => md.listItem([heading, param.description]))
      )
    )
  );

export const combinedSections = (hdepth: md.HeadingDepth) =>
  Comp.combinedSections(hdepth, 'Parameters', section(md.subdepth(hdepth)));
