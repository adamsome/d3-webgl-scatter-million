# D3 WebGL Scatterplot React

[Demo](https://d3-webgl.vercel.app)

Demonstrates rendering up to 1 million data points in a scatterplot using D3 WebGL rendering. Uses the following:

- [D3 v5.7.2](https://d3js.org) for rendering the chart axes and colors
  - [D3FC v15.0.4](https://d3fc.io) for its high-level abstraction for WebGL rendering
- [React v17.0.1](https://reactjs.org)
- [Tailwind CSS v2.1.1](https://tailwindcss.com/) for CSS utility
- [TypeScript v4.1.3](https://www.typescriptlang.org) for build-time type safety
  - [ESLint v7.19.0](https://eslint.org) for JavaScript & TypeScript linting
  - [Prettier v2.0.2](https://prettier.io/) for code fo srmatting
  - [Husky v4.3.8](https://github.com/typicode/husky) for code linting and formatting in git hooks
  - [Lint Staged v10.0.10](https://github.com/okonet/lint-staged) for linting staged files in git hooks

## Run in development mode

```bash
npm install
npm run dev
```

## Run in production mode

```bash
npm install
npm run build
npm run start
```

_Note: Requires [Node](https://nodejs.org/en/) v12+ to run._
