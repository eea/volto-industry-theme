{
  "name": "<%= addonName %>",
  "version": "0.1.0",
  "description": "<%= addonName %>: Volto add-on",
  "main": "src/index.js",
  "author": "European Environment Agency: IDM2 A-Team",
  "license": "MIT",
  "homepage": "https://github.com/eea/<%= name %>",
  "keywords": [
    "volto-addon",
    "volto",
    "plone",
    "react"
  ],
  "repository": {
    "type": "git",
    "url": "git@github.com:eea/<%= name %>.git"
  },
  "dependencies": {
    "@cypress/code-coverage": "^3.9.5",
    "babel-plugin-transform-class-properties": "^6.24.1"
  },
  "devDependencies": {
    "@cypress/code-coverage": "^3.9.5",
    "babel-plugin-transform-class-properties": "^6.24.1"
  },
  "scripts": {
    "release": "release-it",
    "bootstrap": "npm install -g ejs; npm link ejs; node bootstrap",
    "test": "make test",
    "test:fix": "make test-update",
    "pre-commit": "yarn stylelint:fix && yarn prettier:fix && yarn lint:fix",
    "stylelint": "if [ -d ./project ]; then ./project/node_modules/stylelint/bin/stylelint.js --allow-empty-input 'src/**/*.{css,less}'; else ../../../node_modules/stylelint/bin/stylelint.js --allow-empty-input 'src/**/*.{css,less}'; fi",
    "stylelint:overrides": "if [ -d ./project ]; then ./project/node_modules/.bin/stylelint --syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides'; else ../../../node_modules/.bin/stylelint --syntax less --allow-empty-input 'theme/**/*.overrides' 'src/**/*.overrides'; fi",
    "stylelint:fix": "yarn stylelint --fix && yarn stylelint:overrides --fix",
    "prettier": "if [ -d ./project ]; then ./project/node_modules/.bin/prettier --single-quote --check 'src/**/*.{js,jsx,json,css,less,md}'; else ../../../node_modules/.bin/prettier --single-quote --check 'src/**/*.{js,jsx,json,css,less,md}'; fi",
    "prettier:fix": "if [ -d ./project ]; then ./project/node_modules/.bin/prettier --single-quote --write 'src/**/*.{js,jsx,json,css,less,md}'; else ../../../node_modules/.bin/prettier --single-quote --write 'src/**/*.{js,jsx,json,css,less,md}'; fi",
    "lint": "if [ -d ./project ]; then ./project/node_modules/eslint/bin/eslint.js --max-warnings=0 'src/**/*.{js,jsx}'; else ../../../node_modules/eslint/bin/eslint.js --max-warnings=0 'src/**/*.{js,jsx}'; fi",
    "lint:fix": "if [ -d ./project ]; then ./project/node_modules/eslint/bin/eslint.js --fix 'src/**/*.{js,jsx}'; else ../../../node_modules/eslint/bin/eslint.js --fix 'src/**/*.{js,jsx}'; fi",
    "i18n": "mv .i18n.babel.config.js babel.config.js; rm -rf build/messages && NODE_ENV=production node src/i18n.js; mv babel.config.js .i18n.babel.config.js",
    "cypress:run": "if [ -d ./project ]; then ./project/node_modules/cypress/bin/cypress run; else ../../../node_modules/cypress/bin/cypress run; fi",
    "cypress:open": "if [ -d ./project ]; then ./project/node_modules/cypress/bin/cypress open; else ../../../node_modules/cypress/bin/cypress open; fi"
  }
}
