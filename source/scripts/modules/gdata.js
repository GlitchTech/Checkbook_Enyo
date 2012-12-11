/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.gdata
 *
 * Helper kind for using Google API. Only for use with Google Spreadsheets.
 * This module assists only with actions that the official Drive API cannot.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 */enyo.kind({
	name: "GTS.gdata",

	/** @public */
	published: {
		/** @lends GTS.Gapi# */

		/**
		 * Most Google APIs require an API key. You can sign up for an API key at the Google APIs Console (https://code.google.com/apis/console/).
		 * @type string
		 * @default ""
		 */
		authKey: "",

		/**
		 * API Client ID
		 * @type string
		 * @default "HOSTED_OR_GOOGLE"
		 */
		acctType: "HOSTED_OR_GOOGLE",

		/**
		 * Scope for current authentication
		 * @type string
		 * @default ""
		 */
		appName: "",

		/**
		 * API version
		 * @type string
		 * @default "3.0"
		 */
		version: "3.0"
	},

	/**
	 * @author http://davidwalsh.name/convert-xml-json
	 */
	xmlToJson: function( xml ) {

		// Create the return object
		var obj = {};

		if( xml.nodeType == 1 ) { // element
		// do attributes

			if( xml.attributes.length > 0 ) {

				obj["@attributes"] = {};

				for ( var j = 0; j < xml.attributes.length; j++ ) {

					var attribute = xml.attributes.item( j );
					obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if( xml.nodeType == 3 ) { // text

			obj = xml.nodeValue;
		}

		// do children
		if( xml.hasChildNodes() ) {

			for( var i = 0; i < xml.childNodes.length; i++ ) {

				var item = xml.childNodes.item( i );
				var nodeName = item.nodeName;

				if( typeof( obj[nodeName] ) == "undefined" ) {

					obj[nodeName] = this.xmlToJson( item );
				} else {

					if( typeof( obj[nodeName].length ) == "undefined" ) {

						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push( old );
					}

					obj[nodeName].push( this.xmlToJson( item ) );
				}
			}
		}

		return obj;
	},

	getSheetSummary: function( sheetKey, options ) {

		if( typeof( sheetKey ) === "undefined" ) {

			options['onError']( "No sheet key defined." );
		}

		var self = this;

		var x = new enyo.Ajax( {
				url: "https://spreadsheets.google.com/feeds/worksheets/" + sheetKey + "/private/full",
				method: "GET",
				handleAs: "xml",
				headers: {
					"GData-Version": this.version,
					"Authorization": this.authKey
				}
			})
			.go()
			.response( function( inSender, xml ) {

					var json = self.xmlToJson( xml );

					options['onSuccess']( inSender, json );
				})
			.error( enyo.bind( this, this.generalFailure, options['onError'] ) );
	},

	getSheetData: function( sheetKey, pageKey, startIndex, maxResults, options ) {

		var self = this;

		var x = new enyo.Ajax( {
				url: "https://spreadsheets.google.com/feeds/list/" + sheetKey + "/" + pageKey + "/private/full?start-index=" + startIndex + "&max-results=" + maxResults,
				method: "GET",
				handleAs: "xml",
				headers: {
					"GData-Version": this.version,
					"Authorization": this.authKey
				}
			})
			.go()
			.response( function( inSender, xml ) {

					var json = self.xmlToJson( xml );

					options['onSuccess']( inSender, json );
				})
			.error( enyo.bind( this, this.generalFailure, options['onError'] ) );
	},

	/** @protected */
	generalFailure: function( callbackFn, failure, timeout ) {
		//inSender, inResponse, inRequest

		var error_str = "";

		if( timeout && timeout === "timeout" ) {

			error_str = "The request timed out. Please check your network connection and try again.";

		} else if( typeof( failure.responseText ) !== "undefined" ) {

			if( failure.responseText.match( "Error=BadAuthentication" ) ) {

				error_str = "Did you enter your username and password correctly?";

			} else if( failure.responseText.match( "Error=CaptchaRequired" ) ) {

				error_str = "Google is requesting that you complete a CAPTCHA Challenge. Please go to <a href='https://www.google.com/accounts/DisplayUnlockCaptcha'>https://www.google.com/accounts/DisplayUnlockCaptcha</a> to complete it.";

			} else if( failure.responseText.match( "Error=NotVerified" ) ) {

				error_str = "The account email address has not been verified. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application.";

			} else if( failure.responseText.match( "Error=TermsNotAgreed" ) ) {

				error_str = "You have not agreed to Google's terms. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application.";

			} else if( failure.responseText.match( "Error=AccountDeleted" ) ) {

				error_str = "The user account has been deleted and is therefore unable to log in.";

			} else if( failure.responseText.match( "Error=AccountDisabled" ) ) {

				error_str = "The user account has been disabled. Please contact Google.";

			} else if( failure.responseText.match( "Error=ServiceDisabled" ) ) {

				error_str = "Your access to the specified service has been disabled. (Your account may still be valid.)";

			} else if( failure.responseText.match( "Error=ServiceUnavailable" ) ) {

				error_str = "The service is not available; try again later.";

			} else if( failure.responseText.match( "Error=Unknown" ) ) {

				error_str = "Unknown Error. Did you enter your username and password correctly?";

			} else {

				error_str = "There has been an error: " + failure.responseText;
			}
		} else {

			error_str = "An unknown error occurred.";
		}

		if( callbackFn && typeof( callbackFn ) === "function" ) {

			callbackFn( error_str );
		}
	}
});
