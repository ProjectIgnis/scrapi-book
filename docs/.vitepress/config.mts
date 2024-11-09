import { defineConfig } from 'vitepress';
import apiSidebar from './apiSidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'scrapi-book',
  description: 'EDOPro Scripting Guides and Reference',

  base: '/scrapi-book/',
  head: [['link', { rel: 'icon', href: '/scrapi-book/ignis_logo.png' }]],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/setup' },
      { text: 'Guides', link: '/guides/general/cdb' },
      { text: 'API', link: '/api/namespaces/(Global)' },
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Prerequisites and Setup', link: '/getting-started/setup' },
            { text: 'Your First Card', link: '/getting-started/first-card' },
            {
              text: 'Reading Card Scripts',
              link: '/getting-started/reading-card-scripts',
            },
            {
              text: 'A Note on Customs',
              link: '/getting-started/custom-cards',
            },
            { text: 'Beginner Tips', link: '/getting-started/beginner-tips' },
          ],
        },
      ],
      '/guides/': [
        {
          text: 'General',
          items: [
            { text: 'Card Database', link: '/guides/general/cdb' },
            { text: 'Archetypes', link: '/guides/general/archetype' },
            { text: 'Counters', link: '/guides/general/counter' },
            { text: 'Banlists', link: '/guides/general/banlist' },
            {
              text: 'Remote Repositories',
              link: '/guides/general/remote-repo',
            },
          ],
        },
        {
          text: 'Scripts',
          items: [
            { text: 'Global Effects', link: '/guides/scripting/global-effect' },
            { text: 'Debugging', link: '/guides/scripting/debug' },
            { text: 'The s table', link: '/guides/scripting/s-table' },
            {
              text: 'External Scripts',
              link: '/guides/scripting/external-script',
            },
            { text: 'Puzzles', link: '/guides/scripting/puzzle' },
          ],
        },
      ],

      '/api/': apiSidebar,
    },

    outline: {
      label: 'Contents',
      level: [1, 4],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ProjectIgnis/scrapi-book' },
      {
        icon: 'discord',
        link: 'https://discord.com/channels/170601678658076672/208066323429720064',
      },
    ],

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            processTerm: (term_, fieldName) => {
              const term = term_.toLowerCase();
              if (fieldName !== 'title') return term;

              const terms: string[] = [term];
              for (let i = 0; i <= term.length - 2; i++)
                terms.push(term.slice(i));

              return terms;
            },
          },
          searchOptions: {
            fuzzy: false,
            prefix: true,
            boost: { title: 5, text: 1, titles: 1 },
            processTerm: (term) => term.toLowerCase(),
            boostTerm: (_, i) => (i === 0 ? 2 : 1),
          },
        },
      },
    },

    editLink: {
      pattern: ({ filePath }) =>
        filePath.startsWith('api')
          ? `https://github.com/ProjectIgnis/scrapiyard/edit/master/${filePath.slice(
              0,
              -3
            )}.yml`
          : `https://github.com/ProjectIgnis/scrapi-book/edit/master/docs/${filePath}`,
    },
  },
});
