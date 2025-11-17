module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` files.
    packageFilter: (pkg) => {
      // jest-environment-jsdom is isomorphic, meaning it works in both the browser and node.
      // Unfortunately, some packages require node-specific APIs, so we need to tell Jest to use the node environment for those.
      const isApiTest = /tests\/api/.test(path);
      if (isApiTest) {
        pkg.main = pkg.main || 'index.js';
        pkg.browser = undefined;
      }
      return pkg;
    },
  });
};
