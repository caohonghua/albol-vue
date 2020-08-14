"use strict";

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "",
  indexPath: "index.html",
  filenameHashing: true,
  pages: undefined,
  lintOnSave: false,
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: true,
  crossorigin: undefined,
  integrity: false,
  devServer: {
    host: "localhost",
    port: 9527,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ["js", "vue"],
      alias: {
        "@/": resolve("src/")
      }
    }
  }
};
