'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var cgUtils = require('../utils.js');

var CgangularGenerator = module.exports = function CgangularGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.config.set('partialDirectory','partial/');
        this.config.set('directiveDirectory','directive/');
        this.config.set('filterDirectory','filter/');
        this.config.set('serviceDirectory','service/');
        this.config.set('sub-sectionDirectory','/')
        var inject = {
            js: {
                file: 'index.html',
                marker: cgUtils.JS_MARKER,
                template: '<script src="<%= filename %>"></script>'
            },
            scss: {
                relativeToModule: true,
                file: '<%= module %>.scss',
                marker: cgUtils.SCSS_MARKER,        
                template: '@import "<%= filename %>";'
            }
        };
        this.config.set('inject',inject);
        this.config.save();
        this.installDependencies({ skipInstall: options['skip-install'], callback: options.callback});
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CgangularGenerator, yeoman.generators.Base);

CgangularGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    if(this.options.appoptions===undefined || this.options.appoptions.name===undefined){
        var prompts = [{
            name: 'appname',
            message: 'What would you like the angular app/module name to be?',
            default: path.basename(process.cwd())
        }];

        this.prompt(prompts, function (props) {
            this.appname = props.appname;
            cb();
        }.bind(this));
    }else{
        this.appname = this.options.appoptions.name;
        cb();
    }

};

CgangularGenerator.prototype.askForUiRouter = function askFor() {
    var cb = this.async();

    if(this.options.appoptions===undefined || this.options.appoptions.uirouter===undefined){
        var prompts = [{
            name: 'router',
            type:'list',
            message: 'Which router would you like to use?',
            default: 0,
            choices: ['Standard Angular Router','Angular UI Router [optimized]']
        }];

        this.prompt(prompts, function (props) {
            if (props.router === 'Angular UI Router [optimized]') {
                this.uirouter = true;
                this.routerJs = 'bower_components/angular-ui-router/release/angular-ui-router.js';
                this.routerModuleName = 'ui.router';
                this.routerViewDirective = 'ui-view';
            } else {
                this.uirouter = false;
                this.routerJs = 'bower_components/angular-route/angular-route.js';
                this.routerModuleName = 'ngRoute';
                this.routerViewDirective = 'ng-view';
            }
            this.config.set('uirouter',this.uirouter);
            cb();
        }.bind(this));
    }else{
        if(this.options.appoptions.uirouter){
            this.uirouter = true;
            this.routerJs = 'bower_components/angular-ui-router/release/angular-ui-router.js';
            this.routerModuleName = 'ui.router';
            this.routerViewDirective = 'ui-view';
        } else {
            this.uirouter = false;
            this.routerJs = 'bower_components/angular-route/angular-route.js';
            this.routerModuleName = 'ngRoute';
            this.routerViewDirective = 'ng-view';
        }

        this.config.set('uirouter',this.uirouter);
        cb();
    }

};

CgangularGenerator.prototype.app = function app() {
    this.directory('skeleton/','./');
};
