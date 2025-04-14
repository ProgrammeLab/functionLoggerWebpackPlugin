## function logger

### useage

webpack.config.js

> add function-logger-webpack-plugin

```js
const path = require("path");
const FunctionLoggerPlugin = require('function-logger-webpack-plugin').default

module.exports = {
  ...,
  plugins: [new FunctionLoggerPlugin()],
};

```
