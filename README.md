<h1 align="center">scrapi-book</h1>
<p align="center">
  <img src="/docs/public/ignis_logo.png" width="200" height="184"/>
</p>
<p align="center">
  <strong>EDOPro Scripting Guides and Reference</strong>
</p>

A [vitepress](https://vitepress.dev/) website containing tutorials,
guides, and an API reference for EDOPro scripting.
The reference pages are generated from the documentation files
in [scrapiyard](https://github.com/ProjectIgnis/scrapiyard).

## Contribute

Every page in the site has an "Edit this page" link which will open the corresponding
file on github in edit mode. For now, we recommend
[helping edit the API doc entries](https://github.com/ProjectIgnis/scrapiyard/blob/master/v1-nification.md)
rather than the "Getting Started" and "Guides" pages.

## Building/Previewing Locally

- Clone the repos:
  - `git clone https://github.com/ProjectIgnis/scrapiyard`
  - `git clone https://github.com/ProjectIgnis/scrapi-book`

> NOTE: For now, it's important that they're in the same folder for `scrapi-book` to find the doc files.
> Later, there will be an option to specify the local directory or remote repo of scrapiyard.

- Navigate into book: `cd scrapi-book`
- Install dependencies: `npm i`
- Run any of the following:
  - `npm run book:preview` for a basic preview
  - `npm run book:dev` to start a dev server on `http://localhost:5173/scrapi-book/`
    that hot-reloads when files are edited (this does not include editing the yaml files in scrapiyard).
  - `npm run book:build` to generate all the website files. This will take more time than `preview` or `dev`. The output will be under `/docs/.vitepress/dist`.
