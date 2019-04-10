/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
  build: 'build',
  html: {
    src: 'src/*.html',
    build: 'build/'
  },
  styles: {
    src: 'src/scss/main.scss',
    build: 'build/css/',
    watch: 'src/scss/**/*.scss'
  },
  scripts: {
    src: 'src/js/',
    build: 'build/js/',
    watch: 'src/js/**/*.js'
  },
  img: {
    src: 'src/img/**/*.{png,jpg,svg}',
    build: 'build/img/'
  },
  webp: {
    src: 'src/img/raster/*.{png,jpg}',
    build: 'build/img/webp'
  },
  svg: 'src/img/vector/sprite/*.svg',
  fonts: {
    src: 'src/fonts/**/*.*',
    build: 'build/fonts/'
  }
};

const gulp = require('gulp'); // подключение gulp
const sass = require('gulp-sass'); // плагин для компиляции scss в css
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer'); // плагин для автоматического добавления префиксов в css
const cleanCSS = require('gulp-clean-css'); // плагин для минификации css
const concat = require('gulp-concat'); // плагин для обьединения файлов
const uglify = require('gulp-uglify'); // плагин для минификации js
const rename = require("gulp-rename"); // плагин для переименования файлов
const del = require('del'); // плагин для удаления файлов и каталогов
const browserSync = require('browser-sync').create(); // плагин для создания локального сервера
const imagemin = require('gulp-imagemin'); // плагин для минификации изображений
const webp = require('gulp-webp'); // плагин для конвертации png & jpg в webp
const cheerio = require('gulp-cheerio'); // плагин для удаления атрибутов svg
const cache = require('gulp-cache'); // Подключаем библиотеку кеширования
const replace = require('gulp-replace');
const svgstore = require('gulp-svgstore'); // плагин для создания svg спрайтов
const svgmin = require("gulp-svgmin"); // плагин для минификации svg
const gulpPosthtml = require('gulp-posthtml');
const include = require('posthtml-include') // подключает файлы в html
const ghpages = require('gh-pages');


function html() {
  return gulp.src(path.html.src) // путь к html файлам
    .pipe(gulpPosthtml([
      include()
    ]))
    .pipe(gulp.dest(path.build))
    .pipe(browserSync.stream());
}

// сборка стилей
function styles() {
  return gulp.src(path.styles.src) // путь к главному файлу SCSS
    .pipe(sass.sync().on('error', sass.logError)) // полученный контент прогоняем через обработчик SASS
    .pipe(autoprefixer({ // добавляем префиксы
      browsers: ['>0.1%'],
      cascade: false
    }))
    .pipe(gulp.dest(path.styles.build)) //обработанный контент выгружаем в папку build/css
    .pipe(cleanCSS({ // минифицируем css
      level: 2
    }))
    .pipe(rename({ // переименовываем файл
      suffix: '.min' //добавляем суффикс .min
    }))
    .pipe(gulp.dest(path.styles.build)) // выгружаем в папку build/css
    .pipe(browserSync.stream());
}

const jsFiles = [
  path.scripts.src + 'main.js'
];

// сборка скриптов
function scripts() {
  return gulp.src(jsFiles) // указываем откуда брать js файлы
    .pipe(concat('main.js')) // объединяем js файлы в один
    .pipe(gulp.dest(path.scripts.build)) // выгружаем в папку build/js
    .pipe(uglify({ // минифицируем js
      toplevel: true
    }))
    .pipe(rename({
      suffix: '.min' //добавляем суффикс .min
    }))
    .pipe(gulp.dest(path.scripts.build)) // выгружаем в папку build/js
    .pipe(browserSync.stream());
}

// оптимизация (сжатие) изображение
function images() {
  return gulp.src(path.img.src) // путь ко всем изображениям
    .pipe(cache(imagemin([ // минифицируем изображения
      imagemin.optipng({
        optimizationLevel: 3 // безопасное сжатие
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ])))
    .pipe(gulp.dest(path.img.build)); // выгружаем минифицированные изображения в build/img
}

// создаем версии изображений в формате WebP
function webpImg() {
  return gulp.src(path.webp.src)
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest(path.webp.build));
}

function svg() {
  return gulp.src(path.svg) // указываем путь к svg файлам
    .pipe(svgmin({
      plugins: [{
        removeViewBox: false
      }]
    })) // минимизируем svg перед созданием спрайта
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    // .pipe(replace('&gt;', '>'))
    .pipe(svgstore({ // создаем спрайт
      inlineSvg: true // уберет из файла все не нужное (doctype, xml и прочее)
    }))
    .pipe(rename('sprite.svg')) // перименовываем svg
    .pipe(gulp.dest(path.img.build + 'vector')); // выгружаем в папку build/img
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "build/"
    },
    // tunnel: true
  });
  gulp.watch(path.html.src, html); // Наблюдение за html файлами
  gulp.watch(path.styles.watch, styles).on('change', browserSync.reload); // Наблюдение за scss файлами
  gulp.watch(path.scripts.watch, scripts); // Наблюдение за js файлами
}

function copy() {
  return gulp.src([
      path.fonts.src
    ], {
      base: "src"
    })
    .pipe(gulp.dest(path.build));
}

function clean() {
  return del(path.build);
}

function clearCache() {
  return cache.clearAll();
}

gulp.task('copy', copy)
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('images', images);
gulp.task('webpImg', webpImg);
gulp.task('svg', svg);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('clearCache', clearCache);

gulp.task('build', gulp.series(clean, copy, webpImg, images, svg, html,
  gulp.parallel(styles, scripts)));
// gulp.series -  запускает задачи последовательно
// gulp.parallel -  запускает задачи ассинхронно (две задачи выполняются паралельно)

gulp.task('dev', gulp.series('build', 'watch'));

ghpages.publish('build', function(err) {});
