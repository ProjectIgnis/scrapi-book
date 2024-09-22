import type * as sf from '@that-hatter/scrapi-factory';
import { O, pipe } from '@that-hatter/scrapi-factory/fp';
import * as md from '@that-hatter/scrapi-factory/markdown';

export const isDeprecated = ({ status }: sf.BindingInfo) =>
  status.index === 'deprecated';

export const isDeleted = ({ status }: sf.BindingInfo) =>
  status.index === 'deleted';

export const isUnstable = ({ status }: sf.BindingInfo) =>
  status.index !== 'stable';

export const strikeBasedOnStatus =
  (doc: sf.BindingInfo) => (content: md.PhrasingContent) =>
    isDeprecated(doc) || isDeleted(doc) ? md.strike([content]) : content;

const statusMessages: Readonly<Record<string, string>> = {
  unstable:
    ' It may be modified or deleted without notice.' +
    ' Unstable versions will not be documented when modified or deleted.',
  deleted:
    ' It is no longer available, and attempting to use it will result in errors.',
  deprecated: '',
};

export const statusHatnote = ({ doctype, status }: sf.Topic & sf.BindingInfo) =>
  pipe(
    status.message,
    O.filter(() => status.index !== 'stable'),
    O.map((msg) =>
      md.paragraph([
        md.text(`This ${doctype} is ${status.index}. `),
        ...msg.children,
        md.text(statusMessages[status.index] ?? ''),
      ])
    ),
    O.map((msg) =>
      md.admonition(
        status.index === 'deleted' ? 'danger' : 'warning',
        [msg],
        status.index.toUpperCase()
      )
    )
  );

export const sourceLink = (doc: sf.BindingInfo) =>
  pipe(
    doc.source,
    O.map((src) => md.link(src, O.none, [md.text('Source Code')]))
  );
