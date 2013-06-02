/* Copyright © 2013, GlitchTech Science */

enyo.singleton({
	name: "Checkbook.budget.manager",
	kind: enyo.Component,

	/**
	 * @public
	 *
	 * Creates a new budget item from the passed in parameters. Does basic checking on parameters. Returns boolean for success.
	 *
	 * @param {object}	data key: value object of new budget item parameters. Unset parameters will become system defaults
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns boolean	via onSuccess
	 */
	createBudget: function( data, options ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getInsert( "budgets", data ),
				{
					"onSuccess": enyo.bind( this, this.createBudgetFollower, options )
				}
			);
	},

	/** @protected */
	createBudgetFollower: function( options ) {

		console.log( arguments );

		var id = Checkbook.globals.gts_db.lastInsertId();

		if( id ) {

			Checkbook.globals.gts_db.query(
					new gts.databaseQuery( {
							sql: "UPDATE budgets SET budgetOrder = ( SELECT IFNULL( MAX( budgetOrder ) + 1, 0 ) FROM budgets LIMIT 1 ) WHERE budgetId = ?;",
							values: [ id ]
						}),
					options
				);
		} else if( enyo.isFunction( options['onSuccess'] ) ) {

			options['onSuccess']();
		}
	},

	/**
	 * @public
	 *
	 * Updates a budget item from the passed in parameters. Does basic checking on parameters. Returns boolean for success.
	 *
	 * @param {object}	data key: value object of budget item parameters. Unset parameters will become system defaults
	 * @param {int}	data.budgetId	index of budget item to update
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns boolean	via onSuccess
	 */
	updateBudget: function( data, options ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getUpdate( "budgets", data, { "budgetId": data['budgetId'] } ),
				options
			);
	},

	/**
	 * @public
	 *
	 * Deletes a transaction & (if exists) its linked transaction
	 *
	 * @param {int}	trsnId	id of transaction to deleted
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteBudget: function( budgetId, options ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getDelete(
						"budgets",
						{
							"budgetId": budgetId
						}
					),
				options
			);
	},

	/**
	 * @public
	 *
	 * Returns (via onSuccess callback) result object with overall budget status & counts
	 *
	 * @param {int}	startTime	time for span to start (UNIX timestamp)
	 * @param {int}	endTime	time for span to start (UNIX timestamp)
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns {object} via onSuccess
	 */
	fetchOverallBudget: function( startTime, endTime, options ) {

		var qryTransaction = new gts.databaseQuery(
				{
					"sql": "SELECT" +
						" COUNT( budgetId ) AS budgetCount," +
						" IFNULL(" +
								" SUM( spending_limit ), 0" +
							" ) AS spending_limit," +

						" IFNULL( SUM( " +
							" IFNULL( ( " +
									"SELECT ABS( SUM( ex.amount ) ) FROM transactions ex WHERE ex.category LIKE budgets.category AND ex.category2 LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? " +
								"), 0 ) + ( IFNULL( ( " +
									"SELECT ABS( SUM( ts.amount ) ) FROM transactions ex LEFT JOIN transactionSplit ts ON ts.transId = ex.itemId WHERE ts.genCat LIKE budgets.category AND ts.specCat LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? " +
								"), 0 ) ) " +
							"), 0 ) AS spent" +

						" FROM budgets;",
					"values": [ startTime, endTime, startTime, endTime ]
				}
			);

		Checkbook.globals.gts_db.query(
				qryTransaction,
				{
					"onSuccess": function( results ) {

						// Call the onSuccess with result
						if( enyo.isFunction( options['onSuccess'] ) ) {

							options['onSuccess']( results[0] );
						}
					},
					"onError": options['onError']
				}
			);
	},

	/**
	 * @public
	 *
	 * Returns (via onSuccess callback) result object with single budget item.
	 *
	 * @param {int}	budgetId	id of budget item to retrieve
	 * @param {int}	startTime	time for span to start (UNIX timestamp)
	 * @param {int}	endTime	time for span to start (UNIX timestamp)
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns {object} via onSuccess
	 */
	fetchBudget: function( budgetId, startTime, endTime, options ) {

		var qryTransaction = new gts.databaseQuery(
				{
						"sql": "SELECT *, " +
								"( IFNULL( ( " +
										"SELECT ABS( SUM( ex.amount ) ) FROM transactions ex WHERE ex.category LIKE budgets.category AND ex.category2 LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? " +
									"), 0 ) + ( IFNULL( ( " +
										"SELECT ABS( SUM( ts.amount ) ) FROM transactions ex LEFT JOIN transactionSplit ts ON ts.transId = ex.itemId WHERE ts.genCat LIKE budgets.category AND ts.specCat LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? " +
									"), 0 ) ) ) AS spent" +
							" FROM budgets" +
							" WHERE budgetId = ?" +
							" ORDER BY " + budgetSortOptions[sort]['query'] +
							" LIMIT 1;",
						"values": [
							startTime,
							endTime,
							startTime,
							endTime,
							budgetId
						]
				}
			);

		Checkbook.globals.gts_db.query(
				qryTransaction,
				{
					"onSuccess": function( results ) {

						// Call the onSuccess with result
						if( enyo.isFunction( options['onSuccess'] ) ) {

							options['onSuccess']( results[0] );
						}
					},
					"onError": options['onError']
				}
			);
	},

	/**
	 * @public
	 *
	 * Returns (via onSuccess callback) result object with budget items.
	 *
	 * @param {int}	startTime	time for span to start (UNIX timestamp)
	 * @param {int}	endTime	time for span to start (UNIX timestamp)
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 * @param {int}	[sort=0]	sort mode
	 * @param {int}	[limit=100]	limits the number of accounts
	 * @param {int}	[offset=0]	offset of result set to return
	 *
	 * @returns {object} via onSuccess
	 */
	fetchBudgets: function( startTime, endTime, options, sort, limit, offset ) {

		sort = ( gts.Object.validNumber( sort ) ? sort : 0 );
		limit = ( gts.Object.validNumber( limit ) ? limit : 100 );
		offset = ( gts.Object.validNumber( offset ) ? offset : 0 );

		Checkbook.globals.gts_db.query(
				new gts.databaseQuery(
					{
						"sql": "SELECT *, " +
								"( IFNULL( ( " +
										"SELECT ABS( SUM( ex.amount ) ) FROM transactions ex WHERE ex.category LIKE budgets.category AND ex.category2 LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? " +
									"), 0 ) + ( IFNULL( ( " +
										"SELECT ABS( SUM( ts.amount ) ) FROM transactions ex LEFT JOIN transactionSplit ts ON ts.transId = ex.itemId WHERE ts.genCat LIKE budgets.category AND ts.specCat LIKE budgets.category2 AND CAST( ex.date AS INTEGER ) >= ? AND CAST( ex.date AS INTEGER ) <= ? " +
									"), 0 ) ) ) AS spent" +
							" FROM budgets" +
							" ORDER BY " + budgetSortOptions[sort]['query'] +
							" LIMIT ?" +
							" OFFSET ?;",
						"values": [
							startTime,
							endTime,
							startTime,
							endTime,
							limit,
							offset
						]
					}
				),
				options
			);
	}
});
