/* global Ember, WGN */

(function(){
'use strict';


	WGN.ApplicationController = Ember.Controller.extend({
		needs: ['session'],
		currentUser: Ember.computed.alias('controllers.session.currentUser'),
		actions: {
		    signOut: function(){
		    	WGN.ref.unauth();
		    	console.log('Trying to sign you out...');
				localStorage.removeItem('firebaseToken');
  				this.set('controllers.session.currentUser', null);
				this.transitionToRoute('index');

		    }
		}
	});


})();