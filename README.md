# Rebean

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![build](https://travis-ci.org/rebeanjs/rebean.svg?branch=master)](https://travis-ci.org/rebeanjs/rebean)

Redux and React reusable beans.

## Concept

Redux is a powerful tool - it's able to describe complex state transformations in a very clean way.
Despite this, we still write a basic behavior models in each project instead of reusing them.
That's where idea of reusable redux packages comes from.

## Packages

- [@rebean/snackbar](packages/snackbar)
- [@rebean/async](packages/async)

## Publish

1. Checkout master branch with latest changes:
   ```
   git checkout master
   git fetch origin
   git reset --hard origin/master
   ```
2. Lunch the `yarn lerna:version` command and bump versions.
   CI will publish changes to the NPM automatically 🚀

## License

MIT
