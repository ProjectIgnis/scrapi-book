import type * as sf from '@that-hatter/scrapi-factory';
import { O, R, RA, RNEA, RR, flow, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';
import * as Topic from './Topic';

export const singleTypeMD = (nm: string) => (api: sf.API) =>
  pipe(
    api.types.record,
    RR.lookup(nm),
    O.map(Topic.linkedNameText),
    O.getOrElseW(() => md.text(nm))
  );

export const fullTypeMD = flow(
  RNEA.map(singleTypeMD),
  R.sequenceArray,
  R.map(RA.intersperse<md.PhrasingContent>(md.text('|'))),
  R.map((a) => a as RNEA.ReadonlyNonEmptyArray<md.PhrasingContent>)
);

export const combinedSections = <T>(
  hdepth: md.HeadingDepth,
  title: string,
  sectionFn: (t: T) => R.Reader<sf.API, md.ListItem>
) =>
  flow(
    RA.map(sectionFn),
    R.sequenceArray,
    R.map(RNEA.fromReadonlyArray),
    R.map(
      O.map(
        (a): md.Fragment => [
          md.simpleHeading(hdepth)(title),
          md.unorderedList(a),
        ]
      )
    )
  );
