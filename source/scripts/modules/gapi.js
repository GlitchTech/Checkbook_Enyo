/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.gapi
 *
 * Helper kind for using Google API (gapi)
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 */
enyo.kind({
	name: "GTS.Gapi",
	kind: enyo.Component,

	/** @public */
	published: {
		/** @lends GTS.Gapi# */

		/**
		 * Most Google APIs require an API key. You can sign up for an API key at the Google APIs Console (https://code.google.com/apis/console/).
		 * @type string
		 * @default ""
		 */
		apiKey: "",

		/**
		 * API Client ID
		 * @type string
		 * @default ""
		 */
		clientId: "",
		/**
		 * Scope for current authentication
		 * @type [string]
		 * @default []
		 */
		scope: []
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.Gapi# */

		/**
		 * Base library loaded
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onReady: ""
	},

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		// Run our default construction
		this.inherited( arguments );

		this._binds = {
				"_handleAuthResult": enyo.bind( this, this.handleAuthResult )
			};
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.Gapi#create
	 *
	 * Called by Enyo when created. Loaded base Google API if needed.
	 */
	create: function() {

		this.inherited( arguments );

		if( !this.isGapiReady() ) {

			this.loadGapi();
		} else {

			this.doReady();
			this.apiKeyChanged();
		}
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#isGapiReady
	 *
	 * Checks if gapi is ready
	 *
	 * @return boolean
	 */
	isGapiReady: function() {

		return !( typeof( gapi ) === 'undefined' );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#loadGapi
	 *
	 * Fetch gapi
	 */
	loadGapi: function() {

		new enyo.JsonpRequest( {
				url: "https://apis.google.com/js/client.js",
				callbackName: "onload"
			})
			.go()
			.response( this, "gapiLoaded" );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#gapiLoaded
	 *
	 * Handler for loading gapi
	 */
	gapiLoaded: function() {

		if( this.apiKey != "" ) {

			this.apiKeyChanged();
		}

		this.doReady();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.Gapi#apiKeyChanged
	 *
	 * Called by Enyo when this.apiKey is changed by host.
	 */
	apiKeyChanged: function() {

		gapi.client.setApiKey( this.apiKey );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.Gapi#loadModule
	 *
	 * Loads the specified module.
	 *
	 * @param {string} name	name of the API
	 * @param {integer} version	version of the API
	 *
	 * @param {object} [options]	Callback functions
	 * @param {function [options.onSuccess]	execute once the details of the API have been loaded
	 * @param {function} [options.onError]	executre if API is unable to load
	 */
	loadModule: function( name, version, options ) {

		if( !this.isGapiReady() ) {

			options.onError( { "message": "Google API not ready yet." } );

			return;
		}

		if( typeof( gapi.client[name] ) === "undefined" ) {

			gapi.client.load( name, ( "v" + version ), options.onSuccess );
		} else {

			if( enyo.isFunction( options.onSuccess ) ) {

				options.onSuccess();
			}
		}
	},

	auth: function() {

		gapi.auth.authorize( { "client_id": this.clientId, "scope": this.scope.join( " " ), "immediate": true }, this._binds['_handleAuthResult'] );
	},

	handleAuthResult: function( authResult ) {

		this.log( arguments );

		var authorizeButton = document.getElementById( "authorize-button" );

		if( authResult && !authResult.error ) {

			authorizeButton.style.visibility = "hidden";

			this.log( "AUTHED" );
		} else {

			authorizeButton.style.visibility = "";
			authorizeButton.onclick = handleAuthClick;
		}
	},

	handleAuthClick: function() {

		gapi.auth.authorize( { "client_id": this.clientId, "scope": this.scope.join( " " ), "immediate": false }, this._binds['_handleAuthResult'] );
		return false;
	}
});
