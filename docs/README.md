# Starting your front-end project with PLON

1. Create directory in your project where you put front-end files.

2. Copy the following files to created directory:
    * package.json
    * gulpfile.js
    * gulpconfig.js
    * .eslintrc
    * assets/styles/base/
    * assets/styles/work/
    * assets/styles/_settings.scss
    * assets/styles/layout.scss
    * assets/scripts/ _select only those jQ plugins you want_

3. Open your system command line (e.g. Windows CMD) and install required node packages with command `$ npm install`

4. Edit _gulpconfig.js_ file to provide options that suits your project. This action is optional.

5. Now you can just run gulp commands from command line. Full list of commands are available [here](/docs/gulp.md).

6. By default your CSS and JS output files will be placed in `assets/` directory.