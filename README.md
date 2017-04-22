Jekyll Starter
===
Setting up a Jekyll site from scratch takes quite a bit of a setup time. This project mitigates that problem without a theme dependancy.

[![Build Status](https://travis-ci.org/davesantos/jekyll-starter.svg?branch=master)](https://travis-ci.org/davesantos/jekyll-starter)

## Installation

1. Fork or clone the repository
2. Install ruby gems: `bundle install`
3. Install node packages: `npm install`
4. Type `gulp` to run

Install gems defined in the `Gemfile`

```
gem install jekyll bundler
bundle install
```
then install Node.js packages from `package.json`

```
npm install
```

## Features

- Navigation generator include
- Easy Image include
- Add custom CSS or entire stylesheets to any page through front-matter

### Included Tools

- [Bourbon](http://bourbon.io/)
- [Modernizr](https://modernizr.com/)
- [Normalize.css](https://necolas.github.io/normalize.css/)
- [Susy](http://susy.oddbird.net/)

## Test on a local server

```
gulp
```

## License

MIT
