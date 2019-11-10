// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-mocha-reporter'),
            require('karma-notify-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../../coverage/genese-angular'),
            reports: ['html', 'lcovonly', 'text-summary', 'clover'],
            fixWebpackSourcePaths: true,
            thresholds: {
                statements: 60,
                lines: 60,
                branches: 50,
                functions: 50
            }
        },
        reporters: ['mocha', 'notify'],
        port: 9876,
        colors: true,
        logLevel: config.DEBUG,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false,
        restartOnFileChange: true
    });
};
