const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";

module.exports = {
  publicPath: "./",
  // publicPath: '/environment',
  assetsDir: "./static",
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.5.209:8090",
        // target: "http://127.0.0.1:8090",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack: config => {
    config.node
      .set("fs", "empty")
      .end()
      .resolve.alias.set("cesium", path.resolve(__dirname, cesiumSource))
      .end()
      .end()
      .amd({
        toUrlUndefined: true
      })
      .module.set("unknownContextCritical", false)
      .rule()
      .include.add(path.resolve(__dirname, cesiumSource))
      .end()
      .post()
      .pre()
      .test(/\.js$/)
      .use("strip")
      .loader("strip-pragma-loader")
      .options({
        pragmas: {
          debug: false
        }
      })
      .end()
      .end();
  },
  configureWebpack: config => {
    let plugins = [];
    if (process.env.NODE_ENV === "production") {
      plugins = [
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify("static")
        }),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, "Assets"), to: "static/Assets" }
        ]),
        new CopyWebpackPlugin([
          {
            from: path.join(cesiumSource, "ThirdParty"),
            to: "static/ThirdParty"
          }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, "Widgets"), to: "static/Widgets" }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, cesiumWorkers), to: "static/Workers" }
        ])
      ];
    } else {
      plugins = [
        new webpack.DefinePlugin({
          CESIUM_BASE_URL: JSON.stringify("")
        }),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, "Assets"), to: "Assets" }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, "ThirdParty"), to: "ThirdParty" }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, "Widgets"), to: "Widgets" }
        ]),
        new CopyWebpackPlugin([
          { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" }
        ])
      ];
    }
    return {
      plugins: plugins
    };
  }
};
