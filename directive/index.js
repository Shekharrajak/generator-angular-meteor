var yeoman = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var _ = require('underscore.string');
var _i = require('underscore.inflection');
var genUtils = require('../util.js');

module.exports = yeoman.generators.Base.extend({
  init: function() {
    this.argument('compname', {type: String, required: false});
    this.compname = _.slugify(_.humanize(this.compname));
  },
  info: function() {
    //this.log(this.yeoman);
  },
  checkForConfig: function() {
    var cb = this.async();
    if(this.config.get('filters')) {
      this.filters = this.config.get('filters');
      this.filters.appname = this.config.get('appname') + 'App';
      this.filters.projectname = this.config.get('appname');
      this.filters.compname = _.camelize(this.compname);
      this.filters.compnameSingular = _i.singularize(this.compname);
      this.filters.compnameSlugged = this.compname;
      this.filters.compnameCapped = _.capitalize(this.filters.compname);
    }
    else {
      this.log('Cannot find the config file (.yo-rc.json)');
      return;
    }
    cb();
  },
  askFor: function() {
    var cb = this.async();
    this.prompt([{
      name: 'dir',
      message: 'Where would you like to create this directive?',
      default: '/client/components'
    }, {
      type:'confirm',
      name: 'complex',
      message: 'Does this directive need an external html file?',
      default: true
    }], function (answers) {
        this.filters.dir = answers.dir.replace(/\/$/, '').replace(/^\//, '');
        this.filters.complex = !!answers.complex;
      cb();
      }.bind(this));
  },
  write: function() {
    this.sourceRoot(path.join(__dirname, './templates/') + (this.filters.complex ? 'complex' : 'simple'));
    this.filters.dir = this.filters.dir + '/' + this.filters.compname;
    this.destinationRoot(path.join(process.cwd(), this.filters.dir));
    genUtils.write(this, this.filters);
  }
});