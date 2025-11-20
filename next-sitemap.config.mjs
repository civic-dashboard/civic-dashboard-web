// next-sitemap.config.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getManifestAdditionalPaths() {
  try {
    const manifestPath = path.join(
      __dirname,
      'public',
      'html',
      'manifest.json',
    );
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const files = JSON.parse(raw);

    if (!Array.isArray(files)) return [];

    return files
      .filter((f) => typeof f === 'string' && f.toLowerCase().endsWith('.html'))
      .map((f) => {
        const filePath = path.join(__dirname, 'public', 'html', f);
        let lastmod;
        try {
          const stat = fs.statSync(filePath);
          lastmod = stat.mtime.toISOString();
        } catch {
          // If the file isn't found, skip lastmod
        }
        return {
          loc: `/wiki/${f}`,
          lastmod,
          changefreq: 'weekly',
          priority: 0.6,
        };
      });
  } catch {
    // No manifest or invalid JSON – return empty so build doesn't fail
    return [];
  }
}

const config = {
  siteUrl: 'https://civicdashboard.ca',
  generateRobotsTxt: false,
  sitemapSize: 7000,
  additionalPaths: async () => getManifestAdditionalPaths(),
};

export default config;
