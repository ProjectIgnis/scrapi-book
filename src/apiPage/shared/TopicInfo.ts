import type * as sf from '@that-hatter/scrapi-factory';
import { O, RNEA, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';

const seeAlsoListItem = (sl: sf.SuggestedLink): md.ListItem => {
  const link = md.link(sl.link, O.none, [md.text(sl.name)]);
  return pipe(
    sl.message,
    O.map((message) =>
      md.paragraph([link, md.text(' - '), ...message.children])
    ),
    O.getOrElse(() => md.paragraph([link])),
    RNEA.of,
    md.listItem
  );
};

export const seeAlsoSection = (doc: sf.TopicInfo): O.Option<md.Fragment> =>
  pipe(
    doc.suggestedLinks,
    RNEA.fromReadonlyArray,
    O.map(RNEA.map(seeAlsoListItem)),
    O.map(md.unorderedList),
    O.map((list) =>
      md.combinedFragments([
        md.thematicBreak,
        md.simpleHeading(2)('See Also'),
        list,
      ])
    )
  );
