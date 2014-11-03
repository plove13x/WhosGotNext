WGN.IndexController = Ember.Controller.extend({
	needs: ['session'],
	actions: {
	    createUser: function(){
			var newUserCred = this.getProperties('emailNU', 'passwordNU');
			var credentials = {email: newUserCred.emailNU, password: newUserCred.passwordNU}
			var self = this;
			var handle = this.get('handleNU');

			return new Ember.RSVP.Promise(function(resolve, reject){
          		WGN.ref.createUser(credentials, function(error){
            		if( ! error ){

						WGN.ref.authWithPassword(credentials, function(error, authData){
							var user = self.store.createRecord('user', {
							  id: authData.uid,
							  email: credentials.email,
							  handle: handle,
							});
							user.save();
							localStorage.setItem('currentUser', user);
              				self.set('controllers.session.currentUser', user);
              				// console.log(self.get('controllers.session.currentUser'));
              				resolve(authData);
              				// self.transitionToRoute('courts');	 Will be reg. success page tho!
						});

            		} else {
            			console.log('error!');
            		}
            	});
          		// self.set('email', '');	
          		// self.set('password','');
          		// self.set('handle', '');
	        });
	    },
	    signIn: function(){
	    	var credentials = this.getProperties('email', 'password');
	    	var self = this;
				return new Ember.RSVP.Promise(function(resolve, reject){
					WGN.ref.authWithPassword(credentials, function(error, authData){
						if ( ! error ) {
							self.store.find('user', authData.uid).then(function(user){
								self.set('controllers.session.currentUser', user);
								localStorage.setItem('currentUser', user);
								resolve(authData);
								self.transitionToRoute('courts');	
							});
						} else {
							console.log('error!');
						}
					});	
				});
	    }
	},
});