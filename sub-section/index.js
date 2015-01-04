'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require('underscore');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var SubSectionGenerator = module.exports = function SubSectionGenerator(args, options, config) {

	yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(SubSectionGenerator, yeoman.generators.NamedBase);

SubSectionGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	cgUtils.askForDir('sub-section', this, null, true, cb);
};

SubSectionGenerator.prototype.files = function files() {

	this.ctrlname = this.name;
	cgUtils.processTemplates(this.name, this.dir, 'sub-section', this, null, null, this.module);
	var partialUrl = this.dir + this.name + '.html';

	//fixed for both slashes windows or unix style directory divider
	partialUrl = partialUrl.substr(4);

	cgUtils.injectRoute(this.module.file, this.config.get('uirouter'), this.name, this.name, partialUrl, this);

	var sections = this.config.get('sub-sections');
	if (!sections) {
		sections = [];
	}



	//added code to maintain linux/windows compatiblility
	var normalizedDir = this.dir.replace('\\','/');
	normalizedDir = normalizedDir.substring(0,normalizedDir.length-1)+'/';
	sections.push({
		name: _.camelize(this.name),
		dir: normalizedDir
	});
	this.config.set('sub-sections', sections);
	this.config.save();

};