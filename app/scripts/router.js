// $(document).ready(function(){
'use strict';

// var self = this;

WGN.Router.map(function(){
	this.route('index', {path: '/'});
	this.route('welcome', {path:'/welcome'});
	this.route('editProfile', {path:'/editProfile'});
	this.resource('courts', {path:'/courts'});
});

WGN.IndexRoute = Ember.Route.extend({

});

WGN.EditProfileRoute = Ember.Route.extend({
	model: function(){
		// return this.store.find('user', localStorage.getItem('currentUser').id;
		return this.store.find('user', this.controllerFor('session').get('currentUser').id);
		console.log(this.model);
		// return this.store.find('user', this.get('controllers.session.currentUser').id);
	}
});

// });