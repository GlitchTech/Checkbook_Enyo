/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.autocompleteprefs.manager ( Component )
 *
 * Control system for managing custom transaction suggestions. Handles creation, modification, & deletion.
 *	Requires GTS.database to exist in Checkbook.globals.gts_db
 */
enyo.kind( {
	name: "Checkbook.autocompleteprefs.manager",
	kind: enyo.Component,

	/** @protected */
	constructor: function() {

		this.inherited( arguments );

		if( !Checkbook.globals.gts_db ) {

			this.log( "creating database object." );

			var db = new GTS.database( getDBArgs() );
		}
	},

	/**
	 * @public
	 * Creates a new transaction from the passed in parameters. Does basic checking on parameters. Returns boolean for success.
	 *
	 * @param {object}	data key: value object of new transaction parameters. Unset parameters will become system defaults
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns boolean	via onSuccess
	 */
	 /*
	createTransaction: function( data, type, options ) {

		Checkbook.globals.gts_db.query(
				new GTS.databaseQuery(
						{
							'sql': "SELECT ( SELECT IFNULL( MAX( itemId ), 0 ) FROM transactions LIMIT 1 ) AS maxItemId, ( SELECT IFNULL( MAX( repeatId ), 0 ) FROM repeats LIMIT 1 ) AS maxRepeatId;" ,
							'values': []
						}
					),
				{
					"onSuccess": enyo.bind( this, this.createTransactionFollower, data, type, options )
				}
			);
	},*/
});
