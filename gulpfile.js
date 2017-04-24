var gulp = require('gulp'),
    path = require('path'),
    browserSync = require("browser-sync").create(),
    /* minify css */
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    eslint = require('gulp-eslint'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    htmlreplace = require('gulp-html-replace'),
    del = require('del'),
    webpack = require('webpack-stream'),
    sourcemaps = require('gulp-sourcemaps');


var DEV_OUT_PUT_BASE_PATH = 'dist';

var autoprefixerOptions = {
    browsers: ['last 2 version', '> 10%']
};

/********************* build ***************************/

// Clean
gulp.task('clean:dev', function() {
    return del.sync([DEV_OUT_PUT_BASE_PATH + '/**']);
});

gulp.task('scss', function() {
    return gulp.src(['client/assets/scss/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEV_OUT_PUT_BASE_PATH + '/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src(['client/assets/**/*.css'])
        .pipe(concat('vendor.css'))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(DEV_OUT_PUT_BASE_PATH + '/assets/css'))
        .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
    return gulp.src('client/assets/images/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(DEV_OUT_PUT_BASE_PATH + '/assets/images'));
});

gulp.task('lint', function() {
    var config = {
        "rules": {
            "eqeqeq": "warn",
            "strict": ["warn", "global"],
            "indent": ["warn", 4]
        }
    };
    return gulp.src('client/app/**/*.js')
        .pipe(eslint(config))
        .pipe(eslint.format());
});

gulp.task('dev-build', function() {
    return gulp.src(['client/assets/fonts/**',
            'client/assets/images/**/*', 'client/index.html', 'client/resources/**'
        ], {
            base: './client'
        })
        .pipe(gulp.dest(DEV_OUT_PUT_BASE_PATH))
        .pipe(browserSync.stream());

});

gulp.task('webpack', ['lint'], function() {
    return gulp.src('client/app/main.js')
        .pipe(webpack(require('./webpack.config.js')(false)))
        .pipe(gulp.dest(DEV_OUT_PUT_BASE_PATH + '/app/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Watch
gulp.task('watch', ['clean:dev', 'webpack', 'dev-build', 'scss', 'styles'], function() {
    watchTask();
});

gulp.task('webpack:dev:revision', ['clean:dev', 'webpack', 'dev-build', 'scss', 'styles']);

// Dev task
gulp.task('webpack:dev', ['webpack:dev:revision'], function() {
    browserSync.init({
        port: 8000,
        server: {
            baseDir: "./" + DEV_OUT_PUT_BASE_PATH
        },
        browser: "google-chrome"
    });
    watchTask();
});
gulp.task('default', ['webpack:dev']);


function watchTask() {
    gulp.watch(['client/app/**/*.html', 'client/**/*.js'], ['webpack']);
    gulp.watch(['client/**/*.css'], ['styles']);
    gulp.watch(['client/**/*.scss'], ['scss']);
    gulp.watch(['client/assets/fonts/**', 'client/assets/images/**/*', 'client/index.html'], ['dev-build']);
};


/********************** end build **********************************/


/******************************* unit tests *****************************/


/******************************* end unit tests *****************************/
