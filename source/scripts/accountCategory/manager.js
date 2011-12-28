/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

/**
 * Checkbook.accountCategory.manager ( Component )
 *
 * Control system for managing account categories. Handles creation, modification, & deletion.
 *	Requires GTS.database to exist in enyo.application.gts_db
 */
enyo.kind({

	name: "Checkbook.accountCategory.manager",
	kind: enyo.Component,

	/** @private */
	constructor: function() {

		this.inherited( arguments );

		if( !enyo.application.gts_db ) {

			this.log( "creating database object." );

			var db = new GTS.database( dbArgs );
		}
	},

	/**
	 * Returns (via onSuccess callback) result object of account categories.
	 *
	 * @param {object}	options	Callback functions
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 * @param {int}	limit	limits the number of results
	 * @param {int}	offset	offset of result set to return
	 *
	 * @return {object[]}	results	via onSuccess
	 */
	fetchCategories: function( options, limit, offset ) {

		//rowid, name, catOrder, icon, color, view_status
		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect( "accountCategories", [ "rowid", "*" ], null, [ "catOrder", "name COLLATE NOCASE" ], limit, offset ),
				options
			);
	},

	/**
	 * Determines number of categories that share the same name but not the same id.
	 *
	 * @param {string}	name	name of account category to match
	 * @param {int}	id	id of category to not match
	 * @param {object}	options	Callback functions
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 *
	 * @return {object[]}	results	via onSuccess
	 */
	fetchMatchingCount: function( name, id, options ) {

		//rowid, name, catOrder, icon, color, view_status
		enyo.application.gts_db.query(
				new GTS.databaseQuery(
						{
							"sql": "SELECT COUNT( name ) AS nameCount FROM accountCategories WHERE name LIKE ? AND rowid != ?;",
							"values": [ name, id ]
						}
					),
				{
					"onSuccess": function( results ) {

							var count = -1;

							try {

								count = results[results.length - 1]['nameCount'];
							} catch( err ) {}

							if( enyo.isFunction( options.onSuccess ) ) {

								options.onSuccess( count );
							}
						},
					"onError": ( enyo.isFunction( options.onError ) ? options.onError : null )
				}
			);
	},

	/**
	 * Creates a new account category
	 *
	 * @param	data	key: value object of data to insert
	 * @param {object}	options	Callback functions
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 */
	createCategory: function( data, options ) {

		enyo.application.gts_db.query(
				enyo.application.gts_db.getInsert( "accountCategories", data ),
				{
					"onSuccess": enyo.bind( this, this.createCategoryFollower, options ),
					"onError": options['onError']
				}
			);
	},

	/**
	 * @private
	 * Handles positioning the new category at the end of the list
	 */
	createCategoryFollower: function( options ) {

		enyo.application.accountManager.updateAccountModTime();

		enyo.application.gts_db.query(
				new GTS.databaseQuery(
						{
							'sql': "UPDATE accountCategories SET catOrder = ( SELECT IFNULL( MAX( catOrder ) + 1, 0 ) FROM accountCategories LIMIT 1 ) WHERE rowid = ?;",
							'values': [ enyo.application.gts_db.lastInsertRowId ]
						}
				),
				options
			);
	},

	/**
	 * Updates account category; changes a single item
	 *
	 * @param {int}	id
	 * @param {string}	name
	 * @param {string}	icon
	 * @param {string}	color
	 * @param {string}	oldName
	 * @param {object}	options	Callback functions
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 */
	editCategory: function( id, name, icon, color, oldName, options ) {

		enyo.application.accountManager.updateAccountModTime();

		var qryCategories = [
				enyo.application.gts_db.getUpdate( "accountCategories", { "name": name, "icon": icon, "color": color }, { "rowid": id } ),
				enyo.application.gts_db.getUpdate( "accounts", { "acctCategory": name }, { "acctCategory": oldName } ),
			];

		enyo.application.gts_db.queries(
				qryCategories,
				options
			);
	},

	/**
	 * Deletes a single category
	 *
	 * @param {int}	id
	 * @param {object}	options	Callback functions
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 */
	deleteCategory: function( id, name, options ) {

		enyo.application.accountManager.updateAccountModTime();

		enyo.application.gts_db.query(
				enyo.application.gts_db.getDelete( "accountCategories", { "rowid": id, "name": name } ),
				options
			);
	},

	/**
	 * Adjusts category order in database
	 *
	 * @param {object[]}	inCats	Categories to update
	 * @param {int}	inCats.rowId
	 * @param {string}	inCats.name
	 * @param {int}	inCats.catOrder
	 * @param {object}	options	Callback functions
	 * @param {function}	[options.onSuccess]	callback function for a successful fetch
	 * @param {function}	[options.onError]	callback function for an unsuccessful fetch
	 */
	reorderCategories: function( inCats, options ) {

		enyo.application.accountManager.updateAccountModTime();

		var qryOrder = [];

		for( var i = 0; i < inCats.length; i++ ) {

			qryOrder.push(
					enyo.application.gts_db.getUpdate(
							"accountCategories",
							{ "catOrder": i },
							{ "rowid": inCats[i]['rowid'] }
						)
				);
		}

		enyo.application.gts_db.queries( qryOrder, options );
	}
});