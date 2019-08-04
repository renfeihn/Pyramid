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
                                // exclude: /node_modules/
                            })
                        }
                    }
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                    loader: 'file-loader',
                    query: {
                        name: '[name].[ext]?[hash]'
                    }
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin("common.css")
        ],
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue'
            }
        },
    };