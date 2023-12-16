import type * as sf from '@that-hatter/scrapi-factory';
import { O, RA, RNEA, flow, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as R from 'fp-ts/Reader';
import * as Comp from './Component';

// string used in the signature line for one return,
// also used as the heading for each return section
const partialSignature = (ret: sf.Return) =>
  pipe(
    ret.type,
    Comp.fullTypeMD,
    R.map(
      RNEA.concatW(O.isSome(ret.name) ? [md.inlineCode(ret.name.value)] : [])
    )
  );

export const combinedPartialSignatures = flow(
  RA.map(partialSignature),
  R.sequenceArray,
  R.map(
    flow(
      RA.flatten,
      RA.intersperse<md.PhrasingContent>(md.text(', ')),
      RNEA.fromReadonlyArray,
      O.getOrElse((): md.Children<md.Paragraph> => [md.text('nil')])
    )
  )
);

const section = (hdepth: md.HeadingDepth) => (ret: sf.Return) =>
  pipe(
    partialSignature(ret),
    R.map(md.heading(hdepth)),
    R.map((heading) => md.listItem([heading, ret.description]))
  );

export const combinedSections = (hdepth: md.HeadingDepth) =>
  Comp.combinedSections(hdepth, 'Returns', section(md.subdepth(hdepth)));
