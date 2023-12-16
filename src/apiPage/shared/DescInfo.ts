import type * as sf from '@that-hatter/scrapi-factory';
import { O, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';

export const descAndGuide = (doc: sf.DescInfo): md.Root =>
  pipe(
    doc.guide,
    O.matchW(
      () => md.root([doc.description]),
      (g) => md.root([doc.description, ...g.children])
    )
  );
