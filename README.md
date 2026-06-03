# Frontend Webpack Template

A clean starter template for small frontend projects that use **npm** and **Webpack**. It gives you a ready-to-run dev server, production builds, HTML generation, CSS loading, basic asset handling, ESLint and Prettier setup, and a minimal `src/` structure.

This template is intentionally lightweight: no framework, test runner, TypeScript, or Sass by default. Add those pieces only when a project actually needs them.

## Included

- Webpack 5 with separate common, development, and production configs
- Local development through Webpack Dev Server
- HTML generation from `src/template.html`
- CSS loading with `normalize.css` and a starter `style.css`
- Basic image asset handling
- Optional GitHub Pages deployment through `gh-pages`
- ESLint with recommended JavaScript rules
- Prettier for consistent code formatting

## Project Structure

```text
frontend-webpack-template/
├── src/
│   ├── index.js
│   ├── template.html
│   └── styles/
│       ├── normalize.css
│       └── style.css
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── eslint.config.js
├── .prettierignore
├── package.json
└── README.md
```

## Getting Started

If this repository is marked as a GitHub template, click **Use this template** and create a new repository from it.

You can also clone it directly:

```bash
git clone https://github.com/soikat27/frontend-webpack-template.git
cd frontend-webpack-template
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build in `dist/`.
- `npm run deploy` builds the project and publishes `dist/` to GitHub Pages.
- `npm run lint` checks JavaScript files with ESLint.
- `npm run lint:fix` runs ESLint and auto-fixes issues where possible.
- `npm run format` formats project files with Prettier.
- `npm run format:check` checks formatting without changing files.

## Linting and Formatting

This template uses **ESLint** for linting and **Prettier** for formatting. Configuration lives in the project so every clone uses the same rules:

- `eslint.config.js` — ESLint rules and ignored paths
- `.prettierignore` — files Prettier should skip (for example `dist/` and `node_modules/`)

Run checks from the terminal:

```bash
npm run lint
npm run format
```

For editor support, install the ESLint and Prettier extensions in VS Code or Cursor. The extensions should detect the packages and config files in this repo. Use the project setup as the source of truth rather than relying only on global editor settings.

## Webpack Configs

- `webpack.common.js` contains shared settings: entry point, HTML plugin, CSS loader, HTML loader, and asset rules.
- `webpack.dev.js` adds development mode, dev server settings, and development source maps.
- `webpack.prod.js` adds production mode, hashed output filenames, asset output naming, and disables production source maps.

## Deployment

The deploy script runs:

```bash
npm run build && gh-pages -d dist
```

That builds the project, then publishes the generated `dist/` folder to a `gh-pages` branch. Before deploying a project made from this template, update the `homepage` field in `package.json` to match the final repository URL.

## Customizing the Template

After creating a new project from this template:

- Update the document title in `src/template.html`
- Add your app logic to `src/index.js`
- Add project styles in `src/styles/style.css`
- Update package metadata in `package.json`
- Remove scripts or dependencies you do not need

## Author

- **Soikat Saha**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
