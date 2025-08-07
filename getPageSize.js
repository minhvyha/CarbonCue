const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

const totalSizes = {
  html: 0,
  js: 0,
  css: 0,
  image: 0,
  other: 0,
};

function classifyResource(contentType) {
  if (!contentType) return 'other';
  if (contentType.includes('text/html')) return 'html';
  if (contentType.includes('application/javascript') || contentType.includes('text/javascript')) return 'js';
  if (contentType.includes('text/css')) return 'css';
  if (contentType.startsWith('image/')) return 'image';
  return 'other';
}

async function getResourceSize(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    const size = response.data.length;
    const type = classifyResource(response.headers['content-type']);
    totalSizes[type] += size;

    console.log(`📦 ${url} → ${formatBytes(size)} [${type}]`);
    return size;
  } catch (err) {
    console.warn(`❌ Failed to fetch ${url}: ${err.message}`);
    return 0;
  }
}

async function getPageResourcesSize(pageUrl) {
  try {
    const response = await axios.get(pageUrl);
    const html = response.data;
    const htmlSize = html.length;
    totalSizes.html += htmlSize;

    console.log(`📄 HTML size: ${formatBytes(htmlSize)} [html]`);

    const $ = cheerio.load(html);
    const baseUrl = new URL(pageUrl);
    const resourceUrls = new Set();

    // Collect resource URLs
    $('img[src], script[src], link[rel="stylesheet"][href]').each((_, el) => {
      const attr = el.name === 'link' ? 'href' : 'src';
      const rawUrl = $(el).attr(attr);
      if (rawUrl) {
        try {
          const fullUrl = new URL(rawUrl, baseUrl).href;
          resourceUrls.add(fullUrl);
        } catch (e) {
          console.warn(`⚠️ Skipping invalid URL: ${rawUrl}`);
        }
      }
    });

    // Download each resource
    for (const url of resourceUrls) {
      await getResourceSize(url);
    }

    // Report totals
    console.log('\n📊 Total Size Breakdown:');
    for (const [type, size] of Object.entries(totalSizes)) {
      console.log(`- ${type.toUpperCase()}: ${formatBytes(size)}`);
    }

    const total = Object.values(totalSizes).reduce((sum, val) => sum + val, 0);
    console.log(`\n✅ Total size of page and resources: ${formatBytes(total)}`);
  } catch (err) {
    console.error(`Failed to fetch page: ${err.message}`);
  }
}

function formatBytes(bytes) {
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

// Run with a URL argument
const inputUrl = process.argv[2];
if (!inputUrl) {
  console.log('Usage: node getPageSize.js <URL>');
  process.exit(1);
}

getPageResourcesSize(inputUrl);
