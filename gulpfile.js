const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const webpackStream = require('webpack-stream');
const del = require('del');

function styles() {
  return src('src/assets/scss/style.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(dest('src/assets/css'))
    .pipe(browserSync.stream());
}

function cleanDist() {
  return del('dist');
}

function localServer() {
  browserSync.init({
    server: {
      baseDir: 'src/'
    }
  });
}

function scripts() {
  return src('src/js/index.js')
  .pipe(webpackStream({
    mode: 'development',
    output: {
        filename: 'script.min.js'
    },
    watch: false,
    devtool: "source-map",
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                    debug: true,
                    corejs: 3,
                    useBuiltIns: "usage"
                }]]
              }
            }
          }
        ]
      }
    }))
  .pipe(dest('src/js/'))
  .pipe(browserSync.stream());
  
}

function prodScripts() {
  return src('src/js/index.js')
  .pipe(webpackStream({
    mode: 'production',
    output: {
        filename: 'script.min.js'
    },
    watch: false,
    devtool: "source-map",
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                    debug: true,
                    corejs: 3,
                    useBuiltIns: "usage"
                }]]
              }
            }
          }
        ]
      }
    }))
  .pipe(dest('src/js/'));
  
}


function watching() {
  watch(['src/assets/scss/**/*.scss'], styles);
  watch(['src/*.html']).on('change', browserSync.reload);
  watch(['src/js/**/*.js', '!src/js/script.min.js'], scripts);
}

function build() {
  return src([
    'src/assets/css/style.min.css',
    'src/assets/fonts/**/*',
    'src/js/script.min.js',
    'src/*.html'
  ], {base: 'src'})
  .pipe(dest('dist'));
}

exports.styles = styles;
exports.watching = watching;
exports.localServer = localServer;
exports.cleanDist = cleanDist;
exports.scripts = scripts;
exports.prodScripts = prodScripts;
exports.build = series(cleanDist, prodScripts, build);


exports.default = parallel(styles ,localServer, watching, scripts);