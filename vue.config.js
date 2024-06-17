// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
// const TerserPlugin = require('terser-webpack-plugin');
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const AutoDllPlugin = require('autodll-webpack-plugin');

// const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : '/',
    outputDir: 'dzjzzz',
    lintOnSave: false,
    productionSourceMap: false,
    // configureWebpack: (config) => {
    //     const pluginsCommon = [·
    //         new webpack.DefinePlugin({
    //             __BUILD_CONFIG__: {
    //                 __ISMOCK__: false,
    //             },
    //         }),
    //     ];
    //     const puluginsPrd = [
    //         new BundleAnalyzerPlugin({
    //             analyzerMode: 'static',
    //         }),
    //         new CompressionWebpackPlugin({
    //             cache: true,
    //             filename: '[path].gz[query]',
    //             algorithm: 'gzip',
    //             test: /\.(js|css)(\?.*)?$/,
    //             threshold: 10240,
    //             minRatio: 0.8,
    //         }),
    //     ];
    //     const pluginsDev = [
    //         new AutoDllPlugin({
    //             filename: '[name].dll.js',
    //             debug: true,
    //             inject: true,
    //             entry: {
    //                 vendor: ['vue', 'vue-router', 'vuex'],
    //             },
    //         }),
    //     ];
    //     const pluginEditor = [
    //         new webpack.ProgressPlugin({
    //             'window.Quill': 'quill/dist/quill.js',
    //         }),
    //     ];
    //     if (process.env.NODE_ENV === 'production') {
    //         //为生产环境修改配置
    //         config.plugins = [
    //             ...config.plugins,
    //             ...pluginsCommon,
    //             ...pluginsDev,
    //             ...pluginEditor,
    //         ];
    //     }
    // },
    // chainWebpack: config => {
    //     config
    //       .plugin('html')
    //       .tap(args => {
    //         args[0].title= '你想设置的title名字'
    //         return args
    //       })
    //   }
    chainWebpack: (config) => {
        // set svg-sprite=loader
        config.plugin('html')
        .tap(args => {
          args[0].title= '卷宗制作'
          return args
        }),
        config.module
            .rule('svg')
            .exclude.add(path.resolve('src/assets/icons/svg'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve('src/assets/icons/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end();
        // config.optimization.runtimeChunk(true);
        // config.optimization.minimizer([
        //     new TerserPlugin({
        //         cache: true,
        //         parallel: true,
        //         sourceMap: false,
        //         terserOptions: {
        //             mangle: {
        //                 safari10: true,
        //             },
        //             compress: {
        //                 pure_funcs: ['console.log'],
        //                 warnings: false,
        //                 drop_debugger: true,
        //                 drop_console: false,
        //             },
        //         },
        //     }),
        // ]);
        config.resolve.alias
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('styles', resolve('src/styles'))
            .set('utils', resolve('src/utils'))
            .set('anyChat', resolve('public/anyChat/logicfunc.js'));

        // config.pluggins.delete('prefetch');
    },
    // css: {
    //     modules: false,
    //     // extract:true,
    //     sourceMap: false,
    //     loaderOptions: {

    //     },
    // },
        // devServer: {
    //     proxy: {
    //       ws:false,
    //     },
    // },
    // devServer: {
    //   host: '0.0.0.0',
    //   // https:true,
    //   port: 8080,
    //   client: {
    //     webSocketURL: `ws://10.172.30.105:8080/szjz/websocket/${sessionStorage.getItem('rybm')}`,
    //   },
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   }
    // }, 
    // devServer: {
    //     open: true,
    //     hotOnly: true,
    //     compress: true,
    //     proxy: {
    //         'devApi': {
    //             target: 'http://30.23.6.11:8080',//开发环境
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/devApi': '',
    //             },
    //         },
    //     },
    // },
    //第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
          preProcessor: 'less',
          patterns: [
            path.resolve(__dirname, 'src/styles/variables.less'),
          ]
        }
    },
}
// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies:true,
//   lintOnSave:false, //关闭哦语法检查
//   devServer: {
//     host: '0.0.0.0',
//     // https:true,
//     port: 8080,
//     client: {
//       webSocketURL: 'ws://10.172.30.105:8080/szjz/websocket/4403000001',
//     },
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     }
//   }, 
// })