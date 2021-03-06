/* Copyright © 2013, GlitchTech Science */

/**
 * Checkbook.transactions.recurrence.manager ( Component )
 *
 * Control system for managing recurring transactions. Handles creation, modification, & deletion.
 *	Requires gts.database to exist in Checkbook.globals.gts_db
 */
enyo.singleton({
	name: "Checkbook.transactions.recurrence.manager",
	kind: "enyo.Component",

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

		if(
			( gts.Object.isUndefined( r1 ) && !gts.Object.isUndefined( r2 ) ) ||
			( !gts.Object.isUndefined( r1 ) && gts.Object.isUndefined( r2 ) ) ) {
			//One is undefined. Not equal

			return false;
		}

		var match = true;

		match = match && ( r1['frequency'] === r2['frequency'] );
		match = match && ( r1['itemSpan'] === r2['itemSpan'] );
		match = match && ( enyo.json.stringify( r1['daysOfWeek'] ) === enyo.json.stringify( r2['daysOfWeek'] ) );
		match = match && ( r1['endingCondition'] === r2['endingCondition'] );

		if( match && ( r1['endingCondition'] == "date" || r2['endingCondition'] == "date" ) ) {

			var d1 = gts.Object.isDate( r1['endDate'] ) ? r1['endDate'] : new Date( r1['endDate'] );
			var d2 = gts.Object.isDate( r2['endDate'] ) ? r2['endDate'] : new Date( r2['endDate'] );

			match = match && ( d1 === d2 );
		}

		if( match && ( r1['endingCondition'] == "occurences" || r2['endingCondition'] == "occurences" ) ) {

			match = match && ( r1['endCount'] === r2['endCount'] );
		}

		return match;
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
	 * Fetches recurrence summary from the database
	 *
	 * @param int	id	ID of recurrence event
	 *
	 * @returns string	String description of recurrence
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	fetchSummary: function( id, options ) {

		if( isNaN( id ) || id < 0 ) {
			//Bad or no id

			if( enyo.isFunction( options.onSuccess ) ) {

				options.onSuccess( "" );
			}

			return;
		}

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "repeats", "*", { "repeatId": id } ),
				{
					"onSuccess": function( results ) {

							if( enyo.isFunction( options.onSuccess ) ) {

								if( results.length <= 0 ) {

									options.onSuccess( "" );
									return;
								}

								var results = enyo.clone( results[0] );

								var summary = "Repeats every " + ( results['itemSpan'] > 1 ? results['itemSpan'] + " " : "" );

								switch( results['frequency'] ) {
									case "daily":
										summary += "day" + ( results['itemSpan'] > 1 ? "s" : "" );
										break;
									case "weekly":
										var dowDate = new Date( 2011, 4, 1 );//Sunday, May 1, 2011

										var days = enyo.json.parse( results['daysOfWeek'] );
										var dow = [];
										var dowCheck = [];

										for( i = 0; i < 7; i++ ) {

											if( days.indexOf( i ) >= 0 ) {

												dow.push( dowDate.format( { format: "EEEE" } ) );
												dowCheck[i] = dowDate.format( { format: "EEEE" } );
											} else {
												dowCheck[i] = "";
											}

											dowDate.setDate( dowDate.getDate() + 1 );
										}

										if( dowCheck[1] != "" && dowCheck[2] != "" && dowCheck[3] != "" && dowCheck[4] != "" && dowCheck[5] != "" ) {

											dow.splice( dow.indexOf( dowCheck[1] ), 1 );
											dow.splice( dow.indexOf( dowCheck[2] ), 1 );
											dow.splice( dow.indexOf( dowCheck[3] ), 1 );
											dow.splice( dow.indexOf( dowCheck[4] ), 1 );
											dow.splice( dow.indexOf( dowCheck[5] ), 1 );

											dow.push( "Weekdays" );
										}

										if( dowCheck[0] != "" && dowCheck[6] != "" ) {

											dow.splice( dow.indexOf( dowCheck[0] ), 1 );
											dow.splice( dow.indexOf( dowCheck[6] ), 1 );

											dow.push( "Weekends" );
										}

										var dowStr = dow.join( ", " );

										if( dow.length > 1 ) {

											dowStr = dowStr.substr( 0, dowStr.lastIndexOf( ", " ) ) + ( dow.length > 2 ? "," : "" ) + " and " + dowStr.substr( dowStr.lastIndexOf( ", " ) + 2 );
										}

										summary += "week" + ( results['itemSpan'] > 1 ? "s" : "" ) + " on " + dowStr;
										break;
									case "monthly":
										summary += "month" + ( results['itemSpan'] > 1 ? "s" : "" ) + " on the " + this.dateSuffix( this.date.getDate() );
										break;
									case "yearly":
										summary += "year" + ( results['itemSpan'] > 1 ? "s" : "" ) + " on " + this.date.format( { format: "MMMM" } ) + " " + this.dateSuffix( this.date.getDate() );
										break;
									default:
										summary += "span" + ( results['itemSpan'] > 1 ? "s" : "" );
								}

								options.onSuccess( summary );
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

		var sql = [];

		if( data['rObj'] != false ) {

			if( ( isNaN( data['repeatId'] ) || data['repeatId'] < 0 ) && data['rObj']['frequency'] != "none" ) {
				//New recurrence event (check/handle)

				data['repeatId'] = data['maxRepeatId'];

				if( data['rObj']['frequency'] == "weekly" && data['rObj']['daysOfWeek'].length == 0 ) {
					//Bad data, abort

					return [];
				}

				var repeatInsert = {
						"repeatId": data['repeatId'],

						//Repeat settings
						"frequency": data['rObj']['frequency'],//Daily, Weekly, Monthly, Yearly
						"itemSpan": data['rObj']['itemSpan'],//Time between events (every 2 months)
						"daysOfWeek": enyo.json.stringify( ( data['rObj']['frequency'] == "weekly" ) ? data['rObj']['daysOfWeek'] : "" ),//Array for day index else blank

						"endingCondition": data['rObj']['endingCondition'],
						"endDate": ( ( data['rObj']['endingCondition'] == "date" ) ? data['rObj']['endDate'] : "" ),
						"endCount": ( ( data['rObj']['endingCondition'] == "occurences" ) ? data['rObj']['endCount'] : "" ),

						//Initial occurrence is latest and only
						"lastOccurrence": data['date'],
						"currCount": 1,

						//Original data
						"origDate": data['rObj']['origDate'],
						"rep_desc": data['desc'],
						"rep_amount": data['amount'],
						"rep_note": data['note'],
						"rep_category": enyo.json.stringify( data['category'] ),
						"rep_acctId": data['account'],
						"rep_linkedAcctId": data['linkedAccount'],
						"rep_autoTrsnLink": ( ( autoTransfer > 0 && autoTransferLink >= 0 ) ? autoTransfer : 0 ),
						"rep_autoTrsnLinkAcct": ( ( autoTransfer > 0 && autoTransferLink >= 0 ) ? autoTransferLink : "" ),

						//Sync system information
						"last_sync": "",

						//Temp data
						"maxItemId": ( ( gts.Object.validNumber( data['linkedAccount'] ) && data['linkedAccount'] >= 0 ) ? data['itemId'] + 2 : data['itemId'] + 1 )
					};

				sql = sql.concat( this.generateSeriesSQL( [ enyo.clone( repeatInsert ) ] ) );

				//Delete temp data from object
				delete repeatInsert['maxItemId'];

				sql.unshift( Checkbook.globals.gts_db.getInsert( "repeats", repeatInsert ) );
			} else if( !( isNaN( data['repeatId'] ) || data['repeatId'] < 0 ) && data['repeatUnlinked'] != 1 && data['terminated'] != 1 ) {
				//Existing recurrence event

				if( data['rObj']['frequency'] == "none" ) {
					//End recurrence event

					sql.push( this._getDeleteFutureSQL( data['itemId'], data['repeatId'], true ) );
				} else {
					//Modify recurrence event

					var repeatData = {
							"repeatId": data['repeatId'],

							//Repeat settings
							"frequency": data['rObj']['frequency'],//Daily, Weekly, Monthly, Yearly
							"itemSpan": data['rObj']['itemSpan'],//Time between events (every 2 months)
							"daysOfWeek": enyo.json.stringify( ( data['rObj']['frequency'] == "weekly" ) ? data['rObj']['daysOfWeek'] : "" ),//Array for day index else blank

							"endingCondition": data['rObj']['endingCondition'],
							"endDate": ( ( data['rObj']['endingCondition'] == "date" ) ? data['rObj']['endDate'] : "" ),
							"endCount": ( ( data['rObj']['endingCondition'] == "occurences" ) ? data['rObj']['endCount'] : "" ),

							//Initial occurrence is latest and only
							"lastOccurrence": data['date'],
							"currCount": data['rObj']['currCount'],

							//Original data
							"origDate": data['rObj']['origDate'],
							"rep_desc": data['desc'],
							"rep_amount": data['amount'],
							"rep_note": data['note'],
							"rep_category": enyo.json.stringify( data['category'] ),
							"rep_acctId": data['account'],
							"rep_linkedAcctId": data['linkedAccount'],
							"rep_autoTrsnLink": ( ( autoTransfer > 0 && autoTransferLink >= 0 ) ? autoTransfer : 0 ),
							"rep_autoTrsnLinkAcct": ( ( autoTransfer > 0 && autoTransferLink >= 0 ) ? autoTransferLink : "" ),

							//Sync system information
							"last_sync": "",

							//Termination
							"terminated": 0,

							//Temp data
							"maxItemId": ( ( gts.Object.validNumber( data['linkedAccount'] ) && data['linkedAccount'] >= 0 ) ? data['maxItemId'] + 1 : data['maxItemId'] )
						};

					sql = sql.concat( this._getDeleteFutureSQL( data['itemId'], repeatData['repeatId'], true ) );//Delete only future

					sql = sql.concat( this.generateSeriesSQL( [ enyo.clone( repeatData ) ] ) );//Make new

					//Delete temp data from object
					delete repeatData['maxItemId'];
					delete repeatData['lastOccurrence'];
					delete repeatData['currCount'];

					//Update
					sql.push( Checkbook.globals.gts_db.getUpdate( "repeats", repeatData, { "repeatId": repeatData['repeatId'] } ) );
				}
			}
		}

		delete data['rObj'];
		delete data['maxItemId'];
		delete data['maxRepeatId'];

		return sql;
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

		var now = new Date();
		var dayLimit = new Date( now.getFullYear(), now.getMonth(), ( now.getDate() + Checkbook.globals.prefs['seriesDayLimit'] ), 23, 59, 59, 999 );

		acctId = acctId || -1;

		Checkbook.globals.gts_db.query(
				new gts.databaseQuery(
					{
						'sql': "SELECT ( SELECT IFNULL( MAX( itemId ), 0 ) FROM transactions LIMIT 1 ) AS maxItemId, *, ( ( SELECT count( * ) FROM transactions WHERE transactions.repeatId = repeats.repeatId AND transactions.linkedAccount IS NULL AND transactions.date > ? ) +  ( SELECT count( * ) FROM transactions WHERE transactions.repeatId = repeats.repeatId AND transactions.linkedAccount IS NOT NULL AND transactions.date > ? ) / 2 ) AS futureCount " +
							"FROM repeats " +
							"WHERE " +
								//Account ID
								"( " +
									"rep_acctId = ? " +
									( acctId < 0 ? "OR 1 = 1 " : "" ) +//Ignore account id if not set
								") " +

								//Under date limit
								"AND lastOccurrence < ? " +

								//Under count limit
								"AND futureCount < ? " +

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

								//Terminated Check
								"AND terminated != 1",
						'values': [
							Date.parse( now ),
							Date.parse( now ),
							acctId,
							Date.parse( dayLimit ),
							Checkbook.globals.prefs['seriesCountLimit']
						]
					}
				),
				{
					"onSuccess": enyo.bind( this, this._updateSeriesTransactionsHandler, options ),
					"onError": options['onError']
				}
			);
	},

	/** @protected */
	_updateSeriesTransactionsHandler: function( options, results ) {

		if( results.length > 0 ) {

			var max = parseInt( results[0]['maxItemId'] ) + 1;

			Checkbook.globals.gts_db.queries( this.generateSeriesSQL( results, max ), options );
		} else if( enyo.isFunction( options['onSuccess'] ) ) {

			options['onSuccess']();
		}
	},

	/**
	 * @protected
	 * Generates SQL for saving series events
	 *
	 * @param {object}[]	repeatArray	Array of objects with series transaction information
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if nothing to do.
	 */
	generateSeriesSQL: function( repeatArray, maxItemId ) {

		var sql = [];

		if( repeatArray.length > 0 ) {

			//Set max id to build off of; already 1 greater than max id
			var maxItemId = maxItemId || repeatArray[0]['maxItemId'];

			//Current datetime for calculations
			var now = new Date();

			//Cycle variables for content
			var trsnData, origDate, lastOccurrence, serDate, serCount, futureCount, type;

			//Cycle and create SQL
			for( var i = 0; i < repeatArray.length; i++ ) {

				origDate = new Date( parseInt( repeatArray[i]['origDate'] ) );
				lastOccurrence = new Date( parseInt( repeatArray[i]['lastOccurrence'] ) );
				serDate = new Date( parseInt( repeatArray[i]['lastOccurrence'] ) );
				serCount = repeatArray[i]['currCount'];
				futureCount = repeatArray[i]['futureCount'];

				//Reduce calls to parse function
				var category = enyo.json.parse( repeatArray[i]['rep_category'] );
				var daysOfWeek = enyo.json.parse( repeatArray[i]['daysOfWeek'] );

				this.log( repeatArray[i]['testCount'] );

				while(
						//Under date limit
						Math.floor( ( serDate - lastOccurrence ) / ( 1000 * 60 * 60 * 24 ) ) < Checkbook.globals.prefs['seriesDayLimit']

						//Under count limit
						&& futureCount < Checkbook.globals.prefs['seriesCountLimit']

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

						var day = daysOfWeek.indexOf( serDate.getDay() );

						if( day < 0 || ( day + 1 ) >= daysOfWeek.length ) {

							while( serDate.getDay() > 0 ) {
								//Increment date until next week (0)

								serDate.setDate( serDate.getDate() + 1 );
							}

							while( serDate.getDay() < 7 && serDate.getDay() != daysOfWeek[0] ) {
								//Increment date until first event of next week

								serDate.setDate( serDate.getDate() + 1 );
							}

							//Increment date proper number of week spans
							serDate.setDate( serDate.getDate() + ( 7 * ( repeatArray[i]['itemSpan'] - 1 ) ) );
						} else {

							//Now + ( number of days between now and next event day )
							serDate.setDate( serDate.getDate() + ( daysOfWeek[day + 1] - daysOfWeek[day] ) );
						}
					} else if( repeatArray[i]['frequency'] == "monthly" ) {

						//Get larger day of month
						var dom = Math.max( serDate.getDate(), origDate.getDate() );

						//Advance month by itemSpan
						serDate.setDate( 1 );
						serDate.setMonth( serDate.getMonth() + 1 * repeatArray[i]['itemSpan'] );

						//Restore day of month
						serDate.setDate( Math.min( dom, serDate.daysInMonth() ) );
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

						"category": category,
						"category2": "",

						"rObj": false,

						"autoTransfer": repeatArray[i]['rep_autoTrsnLink'],
						"autoTransferLink": ( repeatArray[i]['rep_autoTrsnLink'] > 0 ? repeatArray[i]['rep_autoTrsnLinkAcct'] : -1 )
					};

					if( gts.Object.validNumber( repeatArray[i]['rep_linkedAcctId'] ) && repeatArray[i]['rep_linkedAcctId'] >= 0 ) {

						type = "transfer";
					} else if( repeatArray[i]['rep_amount'] < 0 ) {

						type = "expense";
					} else {

						type = "income";
					}

					sql = sql.concat( Checkbook.transactions.manager.generateInsertTransactionSQL( { "data": trsnData, "type": type } ) );

					serCount++;
					futureCount++;
					maxItemId += ( ( gts.Object.validNumber( trsnData['linkedAccount'] ) && trsnData['linkedAccount'] >= 0 ) ? 2 : 1 );

					if( trsnData['autoTransfer'] > 0 && trsnData['autoTransferLink'] >= 0 ) {

						maxItemId += 2;
					}
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

			if( sql.length > 0 ) {

				Checkbook.accounts.manager.updateAccountModTime();
			}
		}

		return sql;
	},

	/**
	 * @public
	 * Adjusts termination status
	 *
	 * @param int	recurrenceId	ID of recurrence event
	 * @param boolean	terminated	Is recurrence terminated
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	setTermination: function( recurrenceId, terminated, options ) {

		Checkbook.globals.gts_db.queries( Checkbook.globals.gts_db.getUpdate( "repeats", { "terminated": ( terminated ? 1 : 0 ) }, { "repeatId": recurrenceId } ), options );
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
					new gts.databaseQuery(
							{
								'sql': "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )" ,
								'values': [ transactionId, transactionId ]
							}
						),
					//Decrement recurrence count
					new gts.databaseQuery(
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
	 * Deletes single recurring event item and all that follow it
	 *
	 * @param int	transactionId	ID of transaction
	 * @param int	recurrenceId	ID of recurrence event
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteFuture: function( transactionId, recurrenceId, options ) {

		Checkbook.globals.gts_db.queries( this._getDeleteFutureSQL( transactionId, recurrenceId ), options );
	},

	/**
	 * @public
	 * Deletes all following event items
	 *
	 * @param int	transactionId	ID of transaction
	 * @param int	recurrenceId	ID of recurrence event
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteOnlyFuture: function( transactionId, recurrenceId, options ) {

		Checkbook.globals.gts_db.queries( this._getDeleteFutureSQL( transactionId, recurrenceId, true ), options );
	},

	/** @protected */
	_getDeleteFutureSQL: function( transactionId, recurrenceId, onlyFuture ) {

		var deleteArgs;

		if( onlyFuture ) {

			deleteArgs = [ recurrenceId, transactionId ];
		} else {

			deleteArgs = [ recurrenceId, transactionId, transactionId ];
		}

		return( [
				//Decrement recurrence count
				new gts.databaseQuery(
						{
							'sql': "UPDATE repeats SET terminated = 1, currCount = MAX( ( ( SELECT sub.currCount FROM repeats sub WHERE sub.repeatId = repeats.repeatId ) - ( SELECT count( * ) FROM transactions WHERE transactions.repeatId = repeats.repeatId AND transactions.date " + ( onlyFuture ? ">" : ">=" ) + " ( SELECT trsn.date FROM transactions trsn WHERE trsn.itemId = ? ) ) ), 0 ) WHERE repeatId = ?" ,
							'values': [ transactionId, recurrenceId ]
						}
					),
				//Delete this and future transactions
				new gts.databaseQuery(
						{
							'sql': "DELETE FROM transactions WHERE repeatId = ? AND ( " + ( onlyFuture ? "" : "itemId = ? OR " ) + "itemId IN ( SELECT sub.itemId FROM transactions sub WHERE sub.repeatId = transactions.repeatId AND sub.date " + ( onlyFuture ? ">" : ">=" ) + " ( SELECT sub2.date FROM transactions sub2 WHERE sub2.itemId = ? ) ) )",
							'values': deleteArgs
						}
					)
			]);
	},

	/**
	 * @public
	 * Deletes all recurring event items
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
