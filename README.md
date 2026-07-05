# Codex Proxy for All Models - Landing Page

This is the landing page and documentation site for the [Codex Proxy for All Models](https://github.com/kyoo-147/codex_proxy_for_all_models) open-source project.

It is built with [Astro](https://astro.build/) and Tailwind CSS v4, focusing on performance, excellent SEO, and a premium developer experience.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:4321` in your browser.

3. **Build for production**
   ```bash
   npm run build
   ```
   This generates static files in the `dist/` directory.

4. **Preview the production build locally**
   ```bash
   npm run preview
   ```

## 🛠 Tech Stack

- **Framework**: Astro (Static Site Generation)
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter & JetBrains Mono (Google Fonts)
- **Icons**: Lucide Icons
- **SEO**: @astrojs/sitemap, optimized Open Graph & Twitter meta tags.

## 📦 Deployment

This project is configured to be automatically built and deployed via GitHub Actions to GitHub Pages.
When you push to the `main` branch, the `.github/workflows/deploy-website.yml` workflow will automatically build the `website` directory and deploy it to the `gh-pages` branch.
