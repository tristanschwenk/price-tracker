# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.0.6 - 2020-05-05
### Added
- Form button to submit Post for api support

## v0.0.5 - 2020-05-03
### Added
- Vue script for front
- Chart Library for price tracking

### Changed
- Edit Main page:
  - Added style to whole main section
  - Added style to chart 
  - Change some general style on the page

### Removed
- remove `app.js` file (see **ADDED**)

## v0.0.4 - 2020-04-29
### Added
- SCSS style sheet compiled in CSS
- Normalize CSS
- Images for main page

### Changed
- Edit Main page:
  - Created all sections as seen in template
  - Sidebar with content and style
  - Profile div with content and style
  - Card div with cont 
  - Chart with structure
  - Left sidebar with structure

## v0.0.3 - 2020-04-26
### Removed
- Remove `mongoose` folder
- Remove `index.js` file (see **CHANGED**)

### Changed
- Rename `index2.js` to `index.js`

## v0.0.2 - 2020-04-26
### Added
- CHANGELOG.md file
- .nvmrc - Define node version to 15.2.1
- .eslintrc.js - Airbnb style configuration
- .env - Define env vars
- Insert product with price or if the product already exists, push new price

### Changed
- Product model: `prices` `value` from `number` to `string`

## v0.0.1 - 2020-04-23
### Added
- Scapper:
  - Product model
  - Input url format check
  - Fetch ASIN, name, price
  - Insert product in BDD 