[![Build Status](https://travis-ci.org/davesantos/jekyll-starter.svg?branch=master)](https://travis-ci.org/davesantos/jekyll-starter)
[![devDependencies Status](https://david-dm.org/davesantos/jekyll-starter/dev-status.svg)](https://david-dm.org/davesantos/jekyll-starter?type=dev)

Jekyll Starter
===
Setting up a Jekyll site from scratch takes quite a bit of a setup time. This project mitigates that issue without a theme dependancy.

## Installation

Install gems defined in the `Gemfile`

```sh
gem install bundler # If you don't have bundler already installed
bundle install
```
then install Node.js packages from `package.json`

```
npm install
```
## Deploy

```
gulp
```
## Features

- Hot-reloading with [BrowserSync](https://browsersync.io/)
- Navigation generator include
- Easy Image include
- Add custom CSS or entire stylesheets to any page through front-matter

### Dependancies

- [Normalize.css](https://necolas.github.io/normalize.css/)

