const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



module.exports = env => {
   const plugins=[
        new MiniCssExtractPlugin({
          filename: '[name].bundle.css',
          chunkFilename: '[id].css'
        }),
        new webpack.HotModuleReplacementPlugin()
      ]
      if (env.NODE_ENV === 'development') {
        // only enable hot in development
        plugins.push(new webpack.HotModuleReplacementPlugin());
      }
  return {
    plugins,
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js'
    },
    devServer: {
        static: {
          directory: path.resolve(__dirname, "dist"),
        },
        client: {
          logging: "none",
          overlay: false,
        },
        compress: true,
        open: true,
        hot: true,
        port: 3000,
      },
    module: {
      rules: [
        {
          test: /\.(svg|png|jpe?g|gif)$/i,
          exclude: /node_modules/,
          use: {
              loader: "file-loader",
          },
      },
        {
          test: /\.(jsx|js)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  "targets": "defaults" 
                }],
                '@babel/preset-react'
              ]
            }
          }]
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: [
            
             MiniCssExtractPlugin.loader,
          
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ]
        }
      ]
    }
  }
}