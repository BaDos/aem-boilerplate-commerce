const fetch = require('node-fetch');

function toClassName(name) {
  return typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

async function fetchPlaceholders(basePath, prefix = 'default') {
  return new Promise((resolve) => {
    fetch(`${basePath}${prefix === 'default' ? '' : prefix}/placeholders.json`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return {};
      })
      .then((json) => {
        const placeholders = {};
        json.data
          .filter((placeholder) => placeholder.Key)
          .forEach((placeholder) => {
            placeholders[toCamelCase(placeholder.Key)] = placeholder.Text;
          });
        resolve(placeholders);
      })
      .catch(() => {
        // error loading placeholders
        resolve({});
      });
  });
}

async function fetchPlaceholdersForLocale(basePath, langCode) {
  let placeholders = null;
  if (!langCode) {
    placeholders = await fetchPlaceholders(basePath);
  } else {
    placeholders = await fetchPlaceholders(basePath, `/${langCode.toLowerCase()}`);
  }

  return placeholders;
}

module.exports = {
  fetchPlaceholdersForLocale,
};
