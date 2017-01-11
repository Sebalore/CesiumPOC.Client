const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: [
    `webpack-dev-server/client?http://${process.env.npm_package_config_host}:${process.env.npm_package_config_port}`, 
    'webpack/hot/only-dev-server', 
    'react-hot-loader/patch', 
    './src/index.jsx' 
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
    sourcePrefix: ''
  },

  // eslint configuration
  eslint: {
    configFile: './.eslintrc'
  },

  plugins: [
    new webpack.SourceMapDevToolPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html', // Load a custom template
      inject: 'body' // Inject all scripts into the body
    })
  ],
  module: {
    unknownContextCritical: false,
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.jsx?/,
        loaders: [
          'react-hot-loader/webpack', 'babel-loader'
        ],
        exclude: '/node_modules/'
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader',
        exclude: '/node_modules/'
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(ico|jpg|jpeg|png|gif)$/i,
        loaders: ['file-loader'],
        exclude: '/node_modules/'
      }, {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ],
    exclude: path.join(__dirname, 'node_modules')
  }
}
