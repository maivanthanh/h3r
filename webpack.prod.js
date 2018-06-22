var prod = require('./webpack.common.js');
prod.mode = "production";
prod.devtool = 'source-map';
prod.performance = { hints: false }
module.exports = prod;
