const { sync } = require('resolve');
const { readFileSync, existsSync } = require('fs');
const { dirname, resolve, parse } = require('path');

// Get the module mappings out of the tsconfig path aliases.
// Store them in a map with the alias as key and the path as value
const moduleMappings = new Map();
const { compilerOptions } = JSON.parse(
  readFileSync(resolve('tsconfig.json'), 'utf-8'),
);

for (const [key, value] of Object.entries(compilerOptions.paths)) {
  // As the paths are an array in the tsConfig use the first one for resolving.
  moduleMappings.set(key, dirname(value[0]));
}

/**
 * Try to resolve a folder or filename as js file or as barrel file.
 * @param {string} fileName
 */
function resolveModuleFileName(fileName) {
  const absolutePath = resolve(fileName);

  if (existsSync(`${absolutePath}.js`)) {
    return `${absolutePath}.js`;
  }

  if (existsSync(`${absolutePath}/index.js`)) {
    return `${absolutePath}/index.js`;
  }
}

/**
 * Try to resolve a moduleId based on the tsconfig path aliases.
 * @param {string} moduleId
 */
function resolvePath(moduleId) {
  if (moduleMappings.has(moduleId)) {
    return resolveModuleFileName(moduleMappings.get(moduleId));
  }

  const item = [...moduleMappings.keys()].find((item) =>
    moduleId.startsWith(item),
  );

  if (item) {
    return resolveModuleFileName(
      moduleId.replace(item, moduleMappings.get(item)),
    );
  }
}

/**
 * The jest default resolver function.
 *
 * @callback defaultResolver
 * @param {*} request
 * @param {*} options
 */
/**
 * A Custom resolver for modules and files that is used for bazel jest
 * @param {string} moduleId The moduleId or filepath that should be resolved
 * @param {Object} options
 * @param {string} options.basedir
 * @param {defaultResolver} options.defaultResolver
 * @param {string} options.extensions
 * @param {string} options.moduleDirectory
 * @param {string} options.paths
 * @param {string} options.rootDir
 */
function main(moduleId, options) {
  const { basedir, extensions, moduleDirectory, paths } = options;

  const resolveOpts = {
    basedir,
    extensions,
    moduleDirectory,
    paths,
    preserveSymlinks: true,
  };

  // resolve workspace imports with the tsconfig path aliases
  if (moduleId.includes('@dynatrace')) {
    const resolved = resolvePath(moduleId);
    // if undefined it might be a published @dynatrace import that has to be resolved
    // via the node_modules with the `sync` operation later on
    if (resolved) {
      return resolved;
    }
  }

  try {
    return sync(moduleId, resolveOpts);
  } catch (e) {
    const parsed = parse(moduleId);
    const directoryNamedId = moduleId + path.sep + parsed.name;
    return resolve.sync(directoryNamedId, resolveOpts);
  }
}

module.exports = main;
