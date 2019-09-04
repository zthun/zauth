const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function config(env) {
  const dir = path.resolve(__dirname, path.dirname(pkg.browser));
  const file = path.basename(pkg.browser);

  const cfg = {
    entry: './src/index.tsx',
    output: {
      path: dir,
      filename: file
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['awesome-typescript-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    optimization: {
      usedExports: true
    },
    devServer: {
      contentBase: dir,
      compress: false,
      port: 4200
    }
  }

  if (env.production) {
    cfg.mode = 'production';
    delete cfg.devtool;
    delete cfg.optimization;
    delete cfg.devServer;
  }

  return cfg;
}

module.exports = config;