/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.encryption ( Component )
 *
 * Control system for encryption of strings using stored spike.
 *	Requires gts.database to exist in Checkbook.globals.gts_db
 *
 * @see http://code.google.com/p/crypto-js/
 */
enyo.kind( {
	name: "Checkbook.encryption",
	kind: enyo.Component,

	/**
	 * @public encryptString
	 *
	 * Encrypts the string using the spike stored in the database. If spike is not found, a blank string is returned
	 *
	 * @param	string	string to encrypt
	 * @param	callbackFn (function)	function to call on complete
	 *
	 * @return	string	encrypted string returned via callbackFn
	 */
	encryptString: function( string, callbackFn ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "prefs", [ "spike" ], null ),
				{
					"onSuccess": enyo.bind( this, this.encryptStringSuccess, string, callbackFn ),
					"onError": enyo.bind( this, this.encryptStringFailure, string, callbackFn )
				}
			);
	},

	/** @protected */
	encryptStringSuccess: function( string, callbackFn, results ) {

		if( enyo.isFunction( callbackFn ) ) {

			if( results.length > 0 && enyo.isString( string ) && string.length > 0 ) {

				callbackFn( CryptoJS.AES.encrypt( string, results[0]['spike'] ) + "" );
			} else {

				callbackFn( "" );
			}
		}
	},

	/** @protected */
	encryptStringFailure: function( string, callbackFn, results ) {

		if( enyo.isFunction( callbackFn ) ) {

			callbackFn( "" );
		}
	},

	/**
	 * @public decryptString
	 *
	 * Decrypts the string using the spike stored in the database. If spike is not found, a blank string is returned
	 *
	 * @param	string	string to decrypt
	 * @param	callbackFn (function)	function to call on complete
	 *
	 * @return	string	decrypted string returned via callbackFn
	 */
	decryptString: function( string, callbackFn ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "prefs", [ "spike" ], null ),
				{
					"onSuccess": enyo.bind( this, this.decryptStringSuccess, string, callbackFn ),
					"onError": enyo.bind( this, this.decryptStringFailure, string, callbackFn )
				}
			);
	},

	/** @protected */
	decryptStringSuccess: function( string, callbackFn, results ) {

		if( enyo.isFunction( callbackFn ) ) {

			if( results.length > 0 && enyo.isString( string ) && string.length > 0 ) {

				callbackFn( CryptoJS.AES.decrypt( string, results[0]['spike'] ).toString( CryptoJS.enc.Utf8 ) );
			} else {

				callbackFn( "" );
			}
		}
	},

	/** @protected */
	decryptStringFailure: function( string, callbackFn, results ) {

		if( enyo.isFunction( callbackFn ) ) {

			callbackFn( "" );
		}
	}
});
