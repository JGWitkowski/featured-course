var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function() {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      PORT: 8003
    },
    ignore: ['./node_modules/**']
  })
  .on('restart', function(){
    console.log('server has been restarted');
  });
});