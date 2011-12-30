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

	trsnCategories: null,

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
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 * @param	{int}	[limit]	limits the number of results
	 * @param	{int}	[offset]	offset of result set to return
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
	 * Builds this.trsnCategories object
	 *
	 * @param	{string}	general	general category to fetch children
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 * @param	{int}	[limit]	limits the number of results
	 * @param	{int}	[offset]	offset of result set to return
	 */
	load: function( currentCategory, options, limit, offset ) {

		if( !offset || !limit || !currentCategory ) {
			//Start fresh

			if( this.trsnCategories ) {

				this.log( "transaction categories already built" );

				callbackFn();
				return;
			}

			offset = 0;
			limit = 100;
			currentCategory = null;

			this.trsnCategories = {
					mainCats: [],
					subCats: {}
				};
		}

		this.fetchCategories(
				{
					"onSuccess": enyo.bind( this, this._loadHandler, currentCategory, options, limit, offset ),
					"onError": options['onError']
				},
				limit,
				offset
			);
	},

	/** @private */
	_loadHandler: function( currentCategory, options, limit, offset, results ) {

		for( var i = 0; i < results.length; i++ ) {

			var row = results[i];

			if( !currentCategory || currentCategory !== row['genCat'] ) {

				if( row['genCat'] !== "" ) {

					this.trsnCategories['mainCats'].push( { "content": row['genCat'], "parent": "" } );
				}

				currentCategory = row['genCat'];
				this.trsnCategories['subCats'][currentCategory] = [];
			}

			this.trsnCategories['subCats'][currentCategory].push( { "content": row['specCat'], "parent": currentCategory } );
		}

		if( results.length < limit ) {

			if( enyo.isFunction( options['onSuccess'] ) ) {

				options['onSuccess']();
			}
		} else {

			this.load( currentCategory, options, ( offset + limit ), limit );
		}
	},

	/**
	 * Creates a new transaction category
	 *
	 * @param	{string}	general	new category group
	 * @param	{string}	specific	new category item
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
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
	 * @param	{int}	id	id to update
	 * @param	{string}	general	updated category group
	 * @param	{string}	specific	updated category item
	 * @param	{string}	oldGeneral	original category group
	 * @param	{string}	oldSpecific	original category item
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
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
	 * @param	{string}	general	updated category group
	 * @param	{string}	oldGeneral	original category group
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
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
	 * @param	{int}	id	id to update
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
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

		if( this.trsnCategories ) {

			this.log( "wiping transaction categories" );
			this.trsnCategories = null;
		}
	}
});