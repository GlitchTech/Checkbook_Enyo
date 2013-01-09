/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.transactions.recurrence.manager ( Component )
 *
 * Control system for managing recurring transactions. Handles creation, modification, & deletion.
 *	Requires GTS.database to exist in Checkbook.globals.gts_db
 */
enyo.kind( {
	name: "Checkbook.transactions.recurrence.manager",
	kind: "enyo.Component",

	seriesCountLimit: 3,
	seriesDayLimit: 45,

	events: {
		onRequestInsertTransactionSQL: ""
	},

	/**
	 * @public
	 * Compares two recurrence events
	 *
	 * @param {}	r1	recurrence event 1
	 * @param {}	r2	recurrence event 2
	 *
	 * @returns bool	if objects are equal
	 */
	compare: function( r1, r2 ) {

		return( enyo.json.stringify( r1 ) !== enyo.json.stringify( r2 ) );
	},

	/**
	 * @public
	 * Fetches recurrence information from the database
	 *
	 * @param int	id	ID of recurrence event
	 *
	 * @returns {object[]}	Object will all the event information
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	fetch: function( id, options ) {

		if( isNaN( id ) || id < 0 ) {
			//Bad or no id

			if( enyo.isFunction( options.onSuccess ) ) {

				options.onSuccess( {} );
			}

			return;
		}

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "repeats", "*", { "repeatId": id } ),
				{
					"onSuccess": function( results ) {

							if( enyo.isFunction( options.onSuccess ) ) {

								options.onSuccess( results[0] );
							}
						},
					"onError": options.onError
				}
			);
	},

	/**
	 * @public
	 * Handle SQL for repeat events
	 *
	 * @param {object}	data	Object to be readied; Since object, pass by reference situation;
	 * @param [bool]	autoTransfer	Type of autotransfer (0 if none)
	 * @param [bool]	autoTransferLink	Account to transfer to
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if nothing to do.
	 */
	handleRecurrenceSystem: function( data, autoTransfer, autoTransferLink ) {

		var sqlArray = [];

		if( data['rObj'] != false ) {

			if( ( isNaN( data['repeatId'] ) || data['repeatId'] < 0 ) && data['rObj']['frequency'] != "none" ) {
				//New repeating transactions (check/handle)

				data['repeatId'] = data['maxRepeatId'];

				var repeatInsert = {
						"repeatId": data['repeatId'],

						//Repeat settings
						"frequency": data['rObj']['frequency'],//Daily, Weekly, Monthly, Yearly
						"itemSpan": data['rObj']['itemSpan'],//Time between events (every 2 months)
						"daysOfWeek": enyo.json.stringify( ( data['rObj']['frequency'] == "weekly" ) ? data['rObj']['daysOfWeek'] : "" ),//Array for day index else blank

						"endingCondition": data['rObj']['endCondition'],
						"endDate": ( ( data['rObj']['endCondition'] == "date" ) ? data['rObj']['endDate'] : "" ),
						"endCount": ( ( data['rObj']['endCondition'] == "occurences" ) ? data['rObj']['endCount'] : "" ),

						//Initial occurrence is latest and only
						"lastOccurrence": data['date'],
						"currCount": 1,

						//Original data
						"origDate": data['rObj']['startDate'],
						"rep_desc": data['desc'],
						"rep_amount": data['amount'],
						"rep_note": data['note'],
						"rep_category": enyo.json.stringify( data['category'] ),
						"rep_acctId": data['account'],
						"rep_linkedAcctId": data['linkedAccount'],
						"rep_autoTrsnLink": ( ( autoTransfer > 0 && autoTransferLink >= 0 ) ? 1 : 0 ),

						//Sync system information
						"last_sync": "",

						//Temp data
						"maxItemId": ( ( GTS.Object.validNumber( data['linkedAccount'] ) && data['linkedAccount'] >= 0 ) ? data['itemId'] + 2 : data['itemId'] + 1 ),
						"autoTransfer": autoTransfer,
						"autoTransferLink": autoTransferLink
					};

				sqlArray = sqlArray.concat( this.generateSeriesSQL( [ enyo.clone( repeatInsert ) ] ) );

				//Delete temp data from object
				delete repeatInsert['maxItemId'];
				delete repeatInsert['autoTransfer'];
				delete repeatInsert['autoTransferLink'];

				sqlArray.unshift( Checkbook.globals.gts_db.getInsert( "repeats", repeatInsert ) );
			} else if( data['repeatUnlinked'] != 1 ) {
				//If transaction is not 'unlinked' from repeating series

				if( data['rObj']['frequency'] == "none" ) {
					//Delete repeating entry

					sqlArray.push( Checkbook.globals.gts_db.getDelete( "repeats", { "repeatId": data['repeatId'] } ) );

					//Delete future (after curr date) transactions with repeat id except for this one
					var endOfDay = new Date();
					endOfDay.setHours( 23, 59, 59, 999 );

					sqlArray.push(
							new GTS.databaseQuery(
									{
										'sql': "DELETE FROM transactions WHERE itemId != ? AND repeatId = ? AND date > ?" ,
										'values': [ data['itemId'], data['repeatId'], Date.parse( endOfDay ) ]
									}
								)
						);

					//Set repeatId to null
					data['repeatId'] = null;
				} else {
					//Do existing repeating transactions

					//TODO

					//remember to set lastUpdated to null
				}
			}
		}

		delete data['rObj'];
		delete data['maxRepeatId'];

		return sqlArray;
	},

	/**
	 * @public
	 * Checks for repeating transactions and creates new transactions if required
	 *
	 * @param int	[acctId]	specific account to update; if not set will update all accounts
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	updateSeriesTransactions: function( acctId, options ) {

		acctId = acctId || -1;

		var now = new Date();
		var dayStart = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0 );
		var dayLimit = new Date( now.getFullYear(), now.getMonth(), ( now.getDate() + this.seriesDayLimit ), 23, 59, 59, 999 );

		Checkbook.globals.gts_db.query(
				new GTS.databaseQuery(
					{
						'sql': "SELECT * " +
							"FROM repeats " +
							"WHERE " +
								//Account ID
								"( " +
									"rep_acctId = ? " +
									( acctId >= 0 ? "OR 1 = 1 " : "" ) +//Ignore account id if not set
								") " +

								//Under date limit
								"lastOccurrence < ? " +

								//Under count limit
								" AND currCount < ? " +

								//Ending condition checks
								"AND ( " +
										"( " +
											"endingCondition = 'none' " +
										") OR ( " +
											"endingCondition = 'date' " +
											"AND endDate != '' " +
											"AND endDate > lastOccurrence " +
										") OR ( " +
											"endingCondition = 'occurences' " +
											"AND endCount != '' " +
											"AND endCount > currCount " +
										") " +
									") " +

								//Last data update check
								"AND ( " +
									"lastUpdated < ? OR " +
									"lastUpdate IS NULL OR " +
									"lastUpdate = '' " +
								")",
						'values': [
							acctId,
							Date.parse( dayLimit ),
							this.seriesCountLimit,
							Date.parse( dayStart )
						]
					}
				),
				{
					"onSuccess": function( results ) {

						Checkbook.globals.gts_db.queries( this.generateSeriesSQL( results ), options );
					},
					"onError": function() {

						if( enyo.isFunction( options['onError'] ) ) {

							options['onError']();
						}
					}
				}
			);
	},

	/**
	 * @protected
	 * Generates SQL for saving series events
	 *
	 * @param {object}[]	repeatArray	Array of objects with series transaction information
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if nothing to do.
	 */
	generateSeriesSQL: function( repeatArray ) {

		var sql = [];

		if( repeatArray.length > 0 ) {

			//Set max id to build off of; already 1 greater than max id
			var maxItemId = repeatArray[0]['maxItemId'];

			//Current datetime for calculations
			var now = new Date();

			//Cycle variables for content
			var trsnData;
			var serDate;
			var serCount;
			var type;

			//Cycle and create SQL
			for( var i = 0; i < repeatArray.length; i++ ) {

				serDate = new Date( repeatArray[i]['lastOccurrence'] );
				serCount = repeatArray[i]['currCount'];

				//Reduce calls to parse function
				repeatArray[i]['rep_category'] = enyo.json.parse( repeatArray[i]['rep_category'] );
				repeatArray[i]['daysOfWeek'] = enyo.json.parse( repeatArray[i]['daysOfWeek'] );

				while(
						//Under date limit
						Math.floor( ( serDate - new Date( repeatArray[i]['lastOccurrence'] ) ) / ( 1000 * 60 * 60 * 24 ) ) < this.seriesDayLimit

						//Under count limit
						&& ( serCount - repeatArray[i]['currCount'] ) < this.seriesCountLimit

						//Ending condition checks
						&& (
							(
								repeatArray[i]['endingCondition'] == "none"
							) || (
								repeatArray[i]['endingCondition'] == "date"
								&& repeatArray[i]['endDate']
								&& Date.parse( serDate ) <= repeatArray[i]['endDate']
							) || (
								repeatArray[i]['endingCondition'] == "occurences"
								&& repeatArray[i]['endCount']
								&& serCount <= repeatArray[i]['endCount']
							)
						)
					) {

					//Move date to next occurrence
					if( repeatArray[i]['frequency'] == "daily" ) {

						serDate.setDate( serDate.getDate() + 1 * repeatArray[i]['itemSpan'] );
					} else if( repeatArray[i]['frequency'] == "weekly" ) {

						//repeatArray[i]['daysOfWeek'] -- array of days repeat occurs on

						var day = repeatArray[i]['daysOfWeek'].indexOf( serDate.getDay() );

						if( day < 0 || ( day + 1 ) >= repeatArray[i]['daysOfWeek'].length ) {

							while( serDate.getDay() > 0 ) {
								//Increment date until next week (0)

								serDate.setDate( serDate.getDate() + 1 );
							}

							while( serDate.getDay() < 7 && serDate.getDay() != repeatArray[i]['daysOfWeek'][0] ) {
								//Increment date until first event of next week

								serDate.setDate( serDate.getDate() + 1 );
							}

							//Increment date proper number of week spans
							serDate.setDate( serDate.getDate() + ( 7 * ( repeatArray[i]['itemSpan'] - 1 ) ) );
						} else {

							//Now + ( number of days between now and next event day )
							serDate.setDate( serDate.getDate() + ( repeatArray[i]['daysOfWeek'][day + 1] - repeatArray[i]['daysOfWeek'][day] ) );
							day++
						}
					} else if( repeatArray[i]['frequency'] == "monthly" ) {

						serDate.setMonth( serDate.getMonth() + 1 * repeatArray[i]['itemSpan'] );
					} else if( repeatArray[i]['frequency'] == "yearly" ) {

						serDate.setYear( serDate.getFullYear() + 1 * repeatArray[i]['itemSpan'] );
					}

					trsnData = {
						"itemId": maxItemId,

						"account": repeatArray[i]['rep_acctId'],
						"repeatId": repeatArray[i]['repeatId'],

						"desc": repeatArray[i]['rep_desc'],

						"note": repeatArray[i]['rep_note'],
						"date": serDate,

						"amount": repeatArray[i]['rep_amount'],
						"amount_old": "NOT_A_VALUE",

						"linkedRecord": -1,
						"linkedAccount": repeatArray[i]['rep_linkedAcctId'],

						"cleared": false,

						"checkNum": "",

						"category": repeatArray[i]['rep_category'],
						"category2": "",

						"rObj": false,

						"autoTransfer": ( repeatArray[i]['rep_autoTrsnLink'] == 1 ? repeatArray[i]['autoTransfer'] : 0 ),
						"autoTransferLink": ( repeatArray[i]['rep_autoTrsnLink'] == 1 ? repeatArray[i]['autoTransferLink'] : -1 )
					};

					if( GTS.Object.validNumber( repeatArray[i]['rep_linkedAcctId'] ) && repeatArray[i]['rep_linkedAcctId'] >= 0 ) {

						type = "transfer";
					} else if( repeatArray[i]['rep_amount'] < 0 ) {

						type = "expense";
					} else {

						type = "income";
					}

					sql = sql.concat( Checkbook.globals.transactionManager.generateInsertTransactionSQL( { "data": trsnData, "type": type } ) );

					serCount++;
					maxItemId += ( ( GTS.Object.validNumber( repeatArray[i]['linkedAccount'] ) && repeatArray[i]['linkedAccount'] >= 0 ) ? 2 : 1 );
				}

				//update repeat item
				sql.push(
						Checkbook.globals.gts_db.getUpdate(
								"repeats",
								{
									"lastOccurrence": Date.parse( serDate ),
									"currCount": serCount,
									"lastUpdated": Date.parse( new Date() )
								}, {
									"repeatId": repeatArray[i]['repeatId']
								}
							)
					);
			}
		}

		return sql;
	},

	/**
	 * @public
	 * Deletes single recurring event item
	 *
	 * @param int	transactionId	ID of transaction
	 * @param int	recurrenceId	ID of recurrence event
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteOne: function( transactionId, recurrenceId, options ) {

		Checkbook.globals.gts_db.queries(
				[
					//Main Transaction
					Checkbook.globals.gts_db.getDelete(
							"transactions",
							{
								"itemId": transactionId
							}
						),
					//Linked Transaction
					Checkbook.globals.gts_db.getDelete(
							"transactions",
							{
								"linkedRecord": transactionId
							}
						),
					//Split Transactions
					new GTS.databaseQuery(
							{
								'sql': "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )" ,
								'values': [ transactionId, transactionId ]
							}
						),
					//Decrement recurrence count
					new GTS.databaseQuery(
							{
								'sql': "UPDATE repeats SET currCount = MAX( IFNULL( ( SELECT ( sub.currCount - 1 ) FROM repeats sub WHERE sub.repeatId = repeats.repeatId ), 0 ), 0 ) WHERE repeatId = ?" ,
								'values': [ recurrenceId ]
							}
						)
				],
				options
			);
	},

	/**
	 * @public
	 * Deletes single recurring event item
	 *
	 * @param int	transactionId	ID of transaction
	 * @param int	recurrenceId	ID of recurrence event
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteFuture: function( transactionId, recurrenceId, options ) {

		Checkbook.globals.gts_db.queries(
				[
					//Decrement recurrence count
					new GTS.databaseQuery(
							{
								'sql': "UPDATE repeats SET terminated = 1, currCount = MAX( ( ( SELECT sub.currCount FROM repeats sub WHERE sub.repeatId = repeats.repeatId ) - ( SELECT count( * ) FROM transactions WHERE transactions.repeatId = repeats.repeatId ) ), 0 ) WHERE repeatId = ?" ,
								'values': [ recurrenceId ]
							}
						),
					//Delete this and future transactions
					new GTS.databaseQuery(
							{
								'sql': "DELETE FROM transactions WHERE repeatId = ? AND ( itemId = ? OR itemId IN ( SELECT sub.itemId FROM transactions sub WHERE sub.repeatId = transactions.repeatId AND sub.date >= transactions.date ) )" ,
								'values': [ recurrenceId, transactionId ]
							}
						)
				],
				options
			);
	},

	/**
	 * @public
	 * Deletes single recurring event item
	 *
	 * @param int	id	ID of recurrence event
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteAll: function( recurrenceId, options ) {

		Checkbook.globals.gts_db.queries(
				[
					Checkbook.globals.gts_db.getDelete( "transactions", { "repeatId": recurrenceId } ),
					Checkbook.globals.gts_db.getDelete( "repeats", { "repeatId": recurrenceId } )
				],
				options
			);
	}
});
