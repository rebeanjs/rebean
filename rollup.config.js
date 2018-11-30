const typescript = require('rollup-plugin-typescript2');
const sourcemap = require('rollup-plugin-sourcemaps');
const cleaner = require('rollup-plugin-cleaner');

const path = require('path');
const fs = require('fs');
const process = require('process');

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const packagesDirs = getDirectories(__dirname + '/packages');

const validPackages = packagesDirs
  .filter(pkgPath => fs.existsSync(pkgPath + '/package.json'))
  .map(pkgPath => ({ path: path.relative(process.cwd(), pkgPath), meta: require(pkgPath + '/package.json') }))
  .filter((pkg) => pkg.meta.main && pkg.meta.module);

console.log(`${validPackages.length} / ${packagesDirs.length} packages contains valid package.json file`);

const configs = validPackages
  .map((pkg) => ({
    input: pkg.path + '/src/index.ts',
    output: [
      {
        file: pkg.path + '/' + pkg.meta.main,
        format: 'cjs'
      },
      {
        file: pkg.path + '/' + pkg.meta.module,
        format: 'esm'
      }
    ],
    external: Object.keys(
      Object.assign(
        pkg.meta.peerDependencies || {},
        pkg.meta.dependencies || {}
      )
    ),
    plugins: [
      cleaner({
        targets: [
          path.dirname(pkg.path + '/' + pkg.meta.main),
          path.dirname(pkg.path + '/' + pkg.meta.module)
        ]
      }),
      typescript({
        tsconfig: pkg.path + '/tsconfig.json'
      }),
      sourcemap()
    ]
  }));

export default configs;