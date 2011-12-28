/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

/**
 * Checkbook.transactionCategory.manager ( Component )
 *
 * Control system for managing transaction categories. Handles creation, modification, & deletion.
 *	Requires GTS.database to exist in enyo.application.gts_db
 */
enyo.kind({

	name: "Checkbook.transactionCategory.manager",
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
	 * Returns (via onSuccess callback) result object of transaction categories.
	 *
	 * @param	options (object)	key: value object of onSuccess callback and onError callback
	 * @param	limit	limits the number of results
	 * @param	offset	offset of result set to return
	 *
	 * @return	results	(array of objects) via onSuccess
	 */
	fetchCategories: function( options, limit, offset ) {

		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect( "transactionCategories", [ "*" ], null, [ "genCat COLLATE NOCASE", "specCat COLLATE NOCASE" ], limit, offset ),
				options
			);
	},

	/**
	 * Creates a new transaction category
	 *
	 * @param	general	new category group
	 * @param	specific	new category item
	 * @param	options (object)	key: value object of onSuccess callback and onError callback
	 */
	createCategory: function( general, specific, options ) {

		this.categoriesChanged();

		var qryCategories = new GTS.databaseQuery(
				{
					"sql": "INSERT INTO transactionCategories( genCat, specCat ) VALUES( ?, ? );",
					"values": [ general, specific ]
				}
			);

		enyo.application.gts_db.query(
				qryCategories,
				options
			);
	},

	/**
	 * Updates transaction category; changes a single item
	 *
	 * @param	id	id to update
	 * @param	general	updated category group
	 * @param	specific	updated category item
	 * @param	oldGeneral	original category group
	 * @param	oldSpecific	original category item
	 * @param	options (object)	key: value object of onSuccess callback and onError callback
	 *
	 * @return	results	(array of objects) via onSuccess
	 */
	editCategory: function( id, general, specific, oldGeneral, oldSpecific, options ) {

		this.categoriesChanged();

		var qryCategories = [
			new GTS.databaseQuery(
					{
						"sql": "UPDATE transactionCategories SET genCat = ?, specCat = ? WHERE catId = ?;",
						"values": [ general, specific, id ]
					}
				),
			new GTS.databaseQuery(
					{
						"sql": "UPDATE transactions SET category = ?, category2 = ? WHERE category = ? AND category2 = ?;",
						"values": [ general, specific, oldGeneral, oldSpecific ]
					}
				),
			new GTS.databaseQuery(
					{
						"sql": "UPDATE transactionSplit SET genCat = ?, specCat = ? WHERE genCat = ? AND specCat = ?;",
						"values": [ general, specific, oldGeneral, oldSpecific ]
					}
				)
			];

		enyo.application.gts_db.queries(
				qryCategories,
				options
			);
	},

	/**
	 * Updates a transaction category group; changes many items
	 *
	 * @param	general	updated category group
	 * @param	oldGeneral	original category group
	 * @param	options (object)	key: value object of onSuccess callback and onError callback
	 *
	 * @return	results	(array of objects) via onSuccess
	 */
	editGroup: function( general, oldGeneral, options ) {

		this.categoriesChanged();

		var qryCategories = [
			new GTS.databaseQuery(
					{
						"sql": "UPDATE transactionCategories SET genCat = ? WHERE genCat = ?;",
						"values": [ general, oldGeneral ]
					}
				),
			new GTS.databaseQuery(
					{
						"sql": "UPDATE transactions SET category = ? WHERE category = ?;",
						"values": [ general, oldGeneral ]
					}
				),
			new GTS.databaseQuery(
					{
						"sql": "UPDATE transactionSplit SET genCat = ? WHERE genCat = ?;",
						"values": [ general, oldGeneral ]
					}
				)
			];

		enyo.application.gts_db.queries(
				qryCategories,
				options
			);
	},

	/**
	 * Deletes a single category
	 *
	 * @param	id	id to update
	 * @param	options (object)	key: value object of onSuccess callback and onError callback
	 *
	 * @return	results	(array of objects) via onSuccess
	 */
	deleteCategory: function( id, options ) {

		this.categoriesChanged();

		var qryCategories = new GTS.databaseQuery(
				{
					"sql": "DELETE FROM transactionCategories WHERE catId = ?;",
					"values": [ id ]
				}
			);

		enyo.application.gts_db.query(
				qryCategories,
				options
			);
	},

	categoriesChanged: function() {

		if( trsnCategories ) {

			this.log( "wiping transaction categories" );
			trsnCategories = null;
		}
	}
});