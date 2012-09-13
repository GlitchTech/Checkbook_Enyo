enyo.kind({
	name: "Checkbook.gdata",
	kind: "enyo.Component",

	/**
	 * @private
	 * @constructor
	 */
	constructor: function() {
		//rewrite to add options check, see database.json

		this.inherited( arguments );

		this._acctType = "HOSTED_OR_GOOGLE";
		this._appName = "com.glitchtechscience.checkbook";
		this._version = "3.0";
	},

	setAuthKey: function( key ) {

		this.authKey = key;
	},

	fetch_spreadsheet_summary: function( sheetKey, options ) {

		if( typeof( sheetKey ) === "undefined" ) {

			options['onError']( "No sheet key defined." );
		}

		var x = new enyo.Ajax( {
				url: "https://spreadsheets.google.com/feeds/worksheets/" + sheetKey + "/private/full?alt=json",
				method: "GET",
				headers: {
					"GData-Version": this._version,
					"Authorization": this.authKey
				}
			})
			.go()
			.response( options['onSuccess'] )
			.error( enyo.bind( this, this.general_failure, options['onError'] ) );
	},

	fetch_spreadsheet_data: function( sheetKey, pageKey, startIndex, maxResults, options ) {

		var sheetsRequest = new Ajax.Request(
				"https://spreadsheets.google.com/feeds/list/" + sheetKey + "/" + pageKey + "/private/full?alt=json&start-index=" + startIndex + "&max-results=" + maxResults,
				{
					method: 'get',
					evalJSON: 'false',
					requestHeaders: {
						"GData-Version": this._version,
						"Authorization": this.authKey
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],//Integrate into model? line 502
					onFailure: this.general_failure.bind( this, options['onError'] )
				});
	},

	upload_spreadsheet: function( docTitle, docContent, options ) {

		//Convert key: value array

		var sheetsRequest = new Ajax.Request(
				"https://docs.google.com/feeds/upload/create-session/default/private/full?convert=false",
				{
					method: 'post',
					contentType: 'text/csv',
					'Content-Length': 0,
					postBody: '',
					requestHeaders: {
						'GData-Version': this._version,
						'Authorization': this.authKey,
						'Slug': docTitle,
						'X-Upload-Content-Type': 'text/csv',
						'X-Upload-Content-Length': 0//**TOTAL LENGTH OF DATA IN BYTES => ( string.length * 2 )
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],
					onFailure: this.general_failure.bind( this, options['onError'] )
				}
			);
	},

	upload_spreadsheet_2: function( docTitle, docContent, options, response ) {

		this.log( "REQUEST RETURNED" );
		this.log( "|" + response + "|" );

		//https://code.google.com/apis/documents/docs/3.0/developers_guide_protocol.html#ResumableUpload
	},

	upload_file: function( docTitle, docContent, options ) {

		var atomFeed = "<?xml version='1.0' encoding='UTF-8'?>" +
						'<entry xmlns="http://www.w3.org/2005/Atom">' +
						'<category scheme="http://schemas.google.com/g/2005kind"' +
						' term="http://schemas.google.com/docs/2007spreadsheet"/>' +
						'<title>' + docTitle.cleanString() + '</title>' +
						'</entry>';

		var postBody = '--END_OF_PART\r\n' +
						'Content-Type: application/atom+xml;\r\n\r\n' +
						atomFeed + '\r\n' +
						'--END_OF_PART\r\n' +
						'Content-Type: ' + 'text/csv' + '\r\n\r\n' +
						docContent + '\r\n' +
						'--END_OF_PART--\r\n';

		var sheetsRequest = new Ajax.Request(
				"https://docs.google.com/feeds/documents/private/full",
				{
					method: 'post',
					contentType: 'multipart/related; boundary=END_OF_PART',
					postBody: postBody,
					Slug: docTitle,
					"GData-Version": this._version,//Must be here to function, else ERR404
					requestHeaders: {
						"Authorization": this.authKey
					},
					timeout: options['timeout'],
					onSuccess: options['onSuccess'],
					onFailure: this.general_failure.bind( this, options['onError'] )
				}
			);
	},

	general_failure: function( callbackFn, failure, timeout ) {
		//inSender, inResponse, inRequest

		var error_str = "";

		if( timeout && timeout === "timeout" ) {

			error_str = "The request timed out. Please check your network connection and try again.";

		} else if( failure.responseText.match( "Error=BadAuthentication" ) ) {

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

		if( callbackFn && typeof( callbackFn ) === "function" ) {

			callbackFn( error_str );
		}
	}
});
