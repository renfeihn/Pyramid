const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports =
    {
        entry: {
            main: './src/main.js',
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/dist/',
            filename: 'build.js'
        },
        externals: {},
        module: {
            loaders: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                loader: 'css-loader',
                                fallbackLoader: 'vue-style-loader'
                            })
                        }
                    }
                },
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    query: {compact: true}
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin("common.css"),
            new CopyWebpackPlugin([
                {from: './src/assets/img', to: './'}
            ])
        ],
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue'
            }
        },
    }