# Quantified Self Webpack [![Build Status](https://travis-ci.org/leepuppychow/quantified-self.svg?branch=master)](https://travis-ci.org/leepuppychow/quantified-self)

### Initial Setup
```
git clone https://github.com/leepuppychow/quantified-self
cd quantified-self
npm install
npm start
```
then visit http://localhost:8080

### Running the Server
To see your code in action, fire up a development server with:
```
npm start
```
Once the server is running, visit http://localhost:8080 in your browser.

### Running the Tests
To run the suite in the terminal, just type:
```
npm test
```
To run the suite in the browser, first run the server as usual with
```
npm start
```
then visit http://localhost:8080/webpack-dev-server/test.html


### Making Changes
To build the static files, run:
```
npm run build
```
This must be done before committing and pushing if you want your site to work at github.io.  If you have another service that builds for you, feel free to delete any `*.bundle.js` files and skip this step.
