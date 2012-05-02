/* Copyright © 2011, GlitchTech Science */

/**
 * Checkbook.transactions.manager ( Component )
 *
 * Control system for managing transactions. Handles creation, modification, & deletion.
 *	Requires GTS.database to exist in enyo.application.gts_db
 */
enyo.kind({

	name: "Checkbook.transactions.manager",
	kind: enyo.Component,

	/**
	 * @private recurrence variables
	 */
	seriesCountLimit: 3,
	seriesDayLimit: 45,

	/** @private */
	constructor: function() {

		this.inherited( arguments );

		if( !enyo.application.gts_db ) {

			this.log( "creating database object." );

			var db = new GTS.database( dbArgs );
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
	createTransaction: function( data, type, options ) {

		enyo.application.gts_db.query(
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
	},

	/**
	 * @private
	 * Handles result processing of max ids; Handles running of main query;
	 */
	createTransactionFollower: function( data, type, options, results ) {

		var autoTransfer = data['autoTransfer'];
		var autoTransferLink = data['autoTransferLink'];

		//Set IDs
		data['itemId'] = parseInt( results[0]['maxItemId'] ) + 1;
		data['maxRepeatId'] = parseInt( results[0]['maxRepeatId'] ) + 1;

		//Prepare data
		var sql = this._prepareData( data, type );

		//Handle repeating system
		sql = sql.concat( this._handleRepeatSystem( data, ( ( autoTransfer > 0 && autoTransferLink >= 0 ) ? autoTransferLink : -1 ) ) );

		//Handle split transactions
		sql = sql.concat( this.handleCategoryData( data ) );

		sql.push( enyo.application.gts_db.getInsert( "transactions", data ) );

		if( Object.validNumber( data['linkedRecord'] ) && data['linkedRecord'] >= 0 ) {
			//Set up Linked Transaction

			var linkedData = enyo.clone( data );

			Object.swap( linkedData, 'linkedRecord', 'itemId' );
			Object.swap( linkedData, 'linkedAccount', 'account' );
			linkedData['amount'] = -linkedData['amount'];

			sql.push( enyo.application.gts_db.getInsert( "transactions", linkedData ) );
		}

		if( autoTransfer > 0 && autoTransferLink >= 0 ) {

			sql = sql.concat( this.createAutoTransfer( data, autoTransfer, autoTransferLink ) );
		}

		enyo.application.gts_db.queries(
				sql,
				{
					"onSuccess": function() {

						if( enyo.isFunction( options['onSuccess'] ) ) {

							options['onSuccess']( true );
						}
					},
					"onError": function() {

						if( enyo.isFunction( options['onError'] ) ) {

							options['onError']( false );
						}
					}
				}
			);
	},

	/**
	 * @private
	 * Handles creating auto transfer transaction items; only run from createTransactionFollower
	 */
	createAutoTransfer: function( data, autoTransfer, autoTransferLink ) {

		if( autoTransfer <= 0 || autoTransferLink < 0 ) {
			//Not an autotransfer

			return [];
		}

		var atData = enyo.clone( data );//Don't manipulate origional data

		if( Object.validNumber( atData['linkedRecord'] ) && atData['linkedRecord'] >= 0 ) {

			atData['itemId'] += 2;
		} else {

			atData['itemId'] += 1;
		}

		if( autoTransfer === 1 ) {
			//Transfer remainder of dollar

			if( atData['amount'] >= 0 ) {

				atData['amount'] = Math.round( Math.ceil( atData['amount'] ) * 100 - atData['amount'] * 100 ) / 100;
			} else {

				atData['amount'] = Math.round( Math.floor( atData['amount'] ) * 100 - atData['amount'] * 100 ) / 100;
			}
		} else if( autoTransfer === 2 ) {
			//Transfer additional dollar

			if( atData['amount'] >= 0 ) {

				atData['amount'] = 1;
			} else {

				atData['amount'] = -1;
			}
		} else {

			atData['amount'] = 0;
		}

		if( atData['amount'] == 0 ) {

			return [];
		}

		atData['linkedAccount'] = autoTransferLink;
		atData['linkedRecord'] = atData['itemId'] + 1;

		atData['note'] = atData['desc'];
		atData['desc'] = $L( "Auto Transfer" )

		atData['category'] = $L( "Transfer" );
		atData['category2'] = $L( "Auto Transfer" );

		delete atData['checkNum'];

		var sql = [];

		sql.push( enyo.application.gts_db.getInsert( "transactions", atData ) );

		//Build linked auto transaction
		Object.swap( atData, 'linkedRecord', 'itemId' );
		Object.swap( atData, 'linkedAccount', 'account' );
		atData['amount'] = -atData['amount'];

		sql.push( enyo.application.gts_db.getInsert( "transactions", atData ) );

		return sql;
	},

	/**
	 * @public
	 * Updates transaction from the passed in parameters. Does basic checking on parameters. Returns boolean for success
	 *
	 * @param {object}	data	key: value object of new transaction parameters. Unset parameters will become system defaults
	 * @param {int}	data.itemId	index of transaction to update
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns boolean	via onSuccess
	 */
	updateTransaction: function( data, type, options ) {
		//TODO need a param after options for dealing with series transactions

		enyo.application.gts_db.query(
				new GTS.databaseQuery(
						{
							'sql': "SELECT ( SELECT IFNULL( MAX( repeatId ), 0 ) FROM repeats LIMIT 1 ) AS maxRepeatId;" ,
							'values': []
						}
					),
				{
					"onSuccess": enyo.bind( this, this.updateTransactionFollower, data, type, options )
				}
			);
	},

	/**
	 * @private
	 * Handles result processing of max ids; Handles running of main query;
	 */
	updateTransactionFollower: function( data, type, options, results ) {

		//Set IDs
		if( !data.hasOwnProperty( "itemId" ) || isNaN( data['itemId'] ) || !isFinite( data['itemId'] ) || data['itemId'] < 0 ) {
			//Can't update if itemId is not set; exit;

			if( enyo.isFunction( options['onError'] ) ) {

				options['onError']( false );
			} else if( enyo.isFunction( options['onSuccess'] ) ) {

				options['onSuccess']( false );
			}

			return;
		}

		data['maxRepeatId'] = parseInt( results[0]['maxRepeatId'] ) + 1;

		//Prepare data
		var sql = this._prepareData( data, type );

		//Handle repeating system
		sql = sql.concat( this._handleRepeatSystem( data, -1 ) );

		//Handle split transactions
		sql = sql.concat( this.handleCategoryData( data ) );

		sql.push( enyo.application.gts_db.getUpdate( "transactions", data, { "itemId": data['itemId'] } ) );

		if( Object.validNumber( data['linkedRecord'] ) ) {
			//Transfer Controls

			var linkedData = enyo.clone( data );

			Object.swap( linkedData, 'linkedRecord', 'itemId' );
			Object.swap( linkedData, 'linkedAccount', 'account' );

			linkedData['amount'] = -linkedData['amount'];

			delete linkedData['cleared'];

			sql.push( enyo.application.gts_db.getUpdate( "transactions", linkedData, { "itemId": linkedData['itemId'] } ) );
		}

		enyo.application.gts_db.queries(
				sql,
				{
					"onSuccess": function() {

						if( enyo.isFunction( options['onSuccess'] ) ) {

							options['onSuccess']( true );
						}
					},
					"onError": function() {

						if( enyo.isFunction( options['onError'] ) ) {

							options['onError']( false );
						}
					}
				}
			);
	},

	/**
	 * @public
	 * Checks for repeating transactions
	 *
	 * @param int	[acctId]	specific account to update; if not set will update all accounts
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	updateSeriesTransactions: function( acctId, options ) {

		//this.seriesDayLimit
		//this.seriesCountLimit
/*
get all series WHERE
	lastOccurrence < this.seriesDayLimit in the future AND
	(
		lastUpdated < current day at 00:00:00 OR
		lastUpdate IS NULL OR
		lastUpdate = ''
	) AND (
		(
			endingCondition == 'date' AND
			endDate < this.seriesDayLimit in the future
		) OR (
			endingCondition == 'occurences' AND
			currCout < endCount
		)
	)

///////
Get max trsn id if results.length > 0
///////
loop through series data and create insert statements
*/
	},

	/**
	 * @private
	 * Modifies the data object to be ready for database insertion. Calls split transaction handler if needed.
	 *
	 * @param {object}	data	Object to be readied; Since object, pass by reference situation;
	 * @param {string}	type	Type of transaction; used to determine setting of amount;
	 *
	 * @returns {object[]}	SQL functions to be run.
	 */
	_prepareData: function( data, type ) {

		data['desc'] = ( ( data['desc'] === "" || data['desc'] === null ) ? $L( "Description" ) : data['desc'] );
		data['cleared'] = ( data['cleared'] ? 1 : 0 );

		data['amount'] = ( Object.isNumber( data['amount'] ) ? 0 : Number( data['amount'] ).toFixed( 2 ).valueOf() );

		data['date'] =  Date.parse( data['date'] );

		if( type == 'transfer' ) {

			if( data['amount_old'] !== "NOT_A_VALUE" && data['amount_old'] < 0 ) {
				//Money transferred from here

				data['amount'] = -Math.abs( data['amount'] );
			} else if( data['amount_old'] !== "NOT_A_VALUE" && data['amount_old'] >= 0 ) {
				//Money transferred to here

				data['amount'] = Math.abs( data['amount'] );
			} else {
				//New, money transferred from here

				data['linkedRecord'] = data['itemId'] + 1;
				data['amount'] = -Math.abs( data['amount'] );
			}
		} else if( type == 'income' ) {

			data['amount'] = Math.abs( data['amount'] );
			data['linkedAccount'] = null;
			data['linkedRecord'] = null;
		} else {//type == 'expense'

			data['amount'] = -Math.abs( data['amount'] );
			data['linkedAccount'] = null;
			data['linkedRecord'] = null;
		}

		delete data['amount_old'];
		delete data['autoTransfer'];
		delete data['autoTransferLink'];

		return [];
	},

	/**
	 * @public
	 * Category handler system
	 *
	 * @param {object}	data	Object to be readied; Since object, pass by reference situation;
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if category is not split
	 */
	handleCategoryData: function( data ) {

		var sqlArray = [];

		sqlArray.push(
				new GTS.databaseQuery(
						{
							'sql': "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )" ,
							'values': [
								data['itemId'],
								data['itemId']
							]
						}
					)
			);

		if( data['category'].length > 1 ) {

			//Split category
			for( var i = 0; i < data['category'].length; i++ ) {

				if( data['category'][i]['amount'] === "" || isNaN( data['category'][i]['amount'] ) ) {
					//Skip row

					continue;
				}

				//insert split transaction categories
				if( !data['linkedRecord'] || isNaN( data['linkedRecord'] ) ) {

					sqlArray.push(
							enyo.application.gts_db.getInsert(
									"transactionSplit",
									{
										"genCat": data['category'][i]['category'],
										"specCat": data['category'][i]['category2'],
										"amount": data['category'][i]['amount'],
										"transId": data['itemId']
									}
								)
						);
				} else {
					//amount is neg in source for linked transactions

					sqlArray.push(
							enyo.application.gts_db.getInsert(
									"transactionSplit",
									{
										"genCat": data['category'][i]['category'],
										"specCat": data['category'][i]['category2'],
										"amount": -data['category'][i]['amount'],
										"transId": data['itemId']
									}
								)
						);

					sqlArray.push(
							enyo.application.gts_db.getInsert(
									"transactionSplit",
									{
										"genCat": data['category'][i]['category'],
										"specCat": data['category'][i]['category2'],
										"amount": data['category'][i]['amount'],
										"transId":data['linkedRecord']
									}
								)
						);
				}
			}

			data['category'] = "||~SPLIT~||";
			data['category2'] = "";
		} else if( data['category'].length === 1 ) {
			//Single category

			data['category2'] = data['category'][0]['category2'];
			data['category'] = data['category'][0]['category'];
		} else {
			//Unset data

			data['category'] = $L( "Uncategorized" );
			data['category2'] = $L( "Other" );
		}

		return sqlArray;
	},

	/**
	 * @private
	 * Handle SQL for repeat events
	 *
	 * @param {object}	data	Object to be readied; Since object, pass by reference situation;
	 * @param [int]	autoTransfer	account to auto transfer to (-1 means no transfer)
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if nothing to do.
	 */
	_handleRepeatSystem: function( data, autoTransfer ) {

		var sqlArray = [];

		if( data['repeatUnlinked'] != 1 ) {
			//If transaction is not 'unlinked' from repeating series (or not set yet)

			if( !data['repeatId'] || data['repeatId'] < 0 ) {
				//New repeating transactions (check/handle)

				data['repeatId'] = data['maxRepeatId'];

				var repeatInsert =  {
						"repeatId": data['repeatId'],

						//Repeat settings
						"frequency": data['rObj']['pattern'],//Daily, Weekly, Monthly, Yearly
						"itemSpan": data['rObj']['frequency'],//Time between events (every 2 months)
						"daysOfWeek": ( ( data['rObj']['pattern'] == "weekly" ) ? enyo.json.stringify( data['rObj']['dow'] ) : "" ),//Array for day index else blank

						"endingCondition": data['rObj']['endCondition'],
						"endDate": ( ( data['rObj']['endCondition'] == "date" ) ? data['rObj']['endDate'] : "" ),
						"endCount": ( ( data['rObj']['endCondition'] == "occurences" ) ? data['rObj']['endCount'] : "" ),

						//Initial occurrence is latest and only
						"lastOccurrence": data['date'],
						"currCout": 1,

						//Original data
						"origDate": data['rObj']['startDate'],
						"rep_desc": data['desc'],
						"rep_amount": data['amount'],
						"rep_note": data['note'],
						"rep_category": enyo.json.stringify( data['category'] ),
						"rep_acctId": data['account'],
						"rep_linkedAcctId": data['linkedAccount'],
						"rep_autoTrsnLink": autoTransfer,

						//Sync system information
						"last_sync": ""
					};

				//TODO calculate future repeats (to limit) && update repeatInsert object

				sqlArray.push( enyo.application.gts_db.getInsert( "repeats", repeatInsert ) );
			} else if( data['rObj']['pattern'] == "none" ) {
				//Delete repeating entry

				sqlArray.push( enyo.application.gts_db.getDelete( "repeats", { "repeatId": data['repeatId'] } ) );

				//Delete future (after curr date) transactions with repeat id except for this one
				var endOfDay = new Date();
				endOfDay.setHours( 23, 59, 59, 999 );

				sqlArray.push(
						new GTS.databaseQuery(
								{
									'sql': "DELETE FROM transactions WHERE itemId != ? AND repeatId = ? AND date > ?" ,
									'values': [ data['itemId'], data['repeatId'], endOfDay.getTime() ]
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

		delete data['rObj'];
		delete data['maxRepeatId'];

		/////////////////////////////////
		//Temp while system not completed
		data['repeatId'] = null;
		this.log( sqlArray );
		return [];
		/////////////////////////////////

		return sqlArray;
	},

	/**
	 * @public
	 * Clears a single transaction. Does not changed (if exists) linked transaction's status.
	 *
	 * @param {int}	trsnId	id of transaction to clear
	 * @param {boolean}	cleared	status of cleared value
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	clearTransaction: function( trsnId, cleared, options ) {

		enyo.application.gts_db.query(
				enyo.application.gts_db.getUpdate(
						"transactions",
						{
							"cleared": ( cleared ? 1 : 0 )
						},
						{
							"itemId": trsnId
						}
					),
				options
			);
	},

	/**
	 * @public
	 * Deletes a transaction & (if exists) its linked transaction
	 *
	 * @param {int}	trsnId	id of transaction to deleted
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	deleteTransaction: function( trsnId, options ) {

		enyo.application.gts_db.queries(
				[
					//Main Transaction
					enyo.application.gts_db.getDelete(
							"transactions",
							{
								"itemId": trsnId
							}
						),
					//Linked Transaction
					enyo.application.gts_db.getDelete(
							"transactions",
							{
								"linkedRecord": trsnId
							}
						),
					//Split Transactions
					new GTS.databaseQuery(
							{
								'sql': "DELETE FROM transactionSplit WHERE transId = ? OR transId = ( SELECT itemId FROM transactions WHERE linkedRecord = ? )" ,
								'values': [ trsnId, trsnId ]
							}
						)
				],
				options
			);
	},

	/**
	 * @public
	 * Returns (via onSuccess callback) result object with single transaction.
	 *
	 * @param {int}	transId	id of transaction to retrieve
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns {object} via onSuccess
	 */
	fetchTransaction: function( transId, options ) {

		var qryTransaction = new GTS.databaseQuery(
				{
					"sql": "SELECT" +
						//Expense table data
						" DISTINCT main.itemId, main.desc, main.amount, main.note, main.date, main.account," +
						" main.linkedRecord, main.linkedAccount, main.cleared, main.repeatId, main.checkNum," +

						//Category information (JSON if split)
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" ( '[' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ) AS json FROM transactionSplit ts WHERE ts.transId = main.itemId ORDER BY ts.amount DESC ) ), '{ \"category\": \"?\", \"category2\" : \"?\", \"amount\": \"0\" }' ) || ']' )" +
						" ELSE main.category END ) AS category," +
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" 'PARSE_CATEGORY'" +
						" ELSE main.category2 END ) AS category2" +

						" FROM transactions main" +
						" WHERE main.itemId = ?" +
						" LIMIT 1;",
					"values": [
						transId
					]
				}
			);

		enyo.application.gts_db.query(
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
	 * Returns (via onSuccess callback) result object of transactions.
	 *
	 * @param {object}	accountObj standard account object to retrieve key parameters from
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 * @param {int}	[limit]	limits the number of transactions
	 * @param {int}	[offset]	offset of result set to return
	 *
	 * @returns {object[]}
	 */
	fetchTransactions: function( accountObj, options, limit, offset ) {

		var qryTransactions = new GTS.databaseQuery(
				{
					"sql": "SELECT" +
						//Expense table data
						" DISTINCT main.itemId, main.desc, main.amount, main.note, main.date, main.account," +
						" main.linkedRecord, main.linkedAccount, main.cleared, main.repeatId, main.checkNum," +

						//Category information (JSON if split)
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" ( '[' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ) AS json FROM transactionSplit ts WHERE ts.transId = main.itemId ORDER BY ts.amount DESC ) ), '{ \"category\": \"?\", \"category2\" : \"?\", \"amount\": \"0\" }' ) || ']' )" +
						" ELSE main.category END ) AS category," +
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" 'PARSE_CATEGORY'" +
						" ELSE main.category2 END ) AS category2" +

						" FROM transactions main" +
						" WHERE account = ? ORDER BY " + accountObj['sortQry']
					,
					"values": [
						accountObj['acctId']
					]
				}
			);

		if( limit ) {

			qryTransactions['sql'] += " LIMIT ?"
			qryTransactions['values'].push( limit );
		}

		if( offset ) {

			qryTransactions['sql'] += " OFFSET ?"
			qryTransactions['values'].push( offset );
		}

		enyo.application.gts_db.query(
				qryTransactions,
				{
					"onSuccess": enyo.bind(
							this,
							this.fetchTransactionsFollower,
							accountObj,
							options,
							limit,
							offset
						)
				}
			);
	},

	/** @private fetchTransactionsFollower: handles running balance **/
	fetchTransactionsFollower: function( accountObj, options, limit, offset, resultSet ) {

		if( accountObj['runningBalance'] === 1 ) {

			var compDate;

			if( resultSet.length > 0 && !isNaN( resultSet[0]['date'] ) ) {

				compDate = parseInt( resultSet[0]['date'] );
			} else {

				compDate = Date.parse( new Date() );
			}

			//NEEDS REWORKING: doesn't play nice with pending/cleared order by

			var qryBalance = new GTS.databaseQuery(
					{
						"sql": "",
						"values": [
							accountObj['acctId'],
							compDate
						]
					}
				);

			if( accountObj['sort'] !== 0 && accountObj['sort'] !== 6 && accountObj['sort'] !== 8 ) {
				//All the rest

				qryBalance['sql'] = "SELECT SUM( amount ) AS balanceToDate FROM transactions WHERE account = ? AND date <= ?;";
			} else {
				//"Oldest to Newest, Show Newest", "Cleared first", "Oldest to Newest, Show Oldest"

				qryBalance['sql'] = "SELECT SUM( amount ) AS balanceToDate FROM transactions WHERE account = ? AND date < ?;";
			}

			enyo.application.gts_db.query(
					qryBalance,
					{
						"onSuccess": function( rbResults ) {

								// Call the onSuccess with results
								if( enyo.isFunction( options['onSuccess'] ) ) {

									options['onSuccess']( offset, resultSet, rbResults );
								}
							},
						"onError": options['onError']
					}
				);
		} else if( enyo.isFunction( options['onSuccess'] ) ) {

			options['onSuccess']( offset, resultSet, [] );
		}
	},

	/**
	 * @public
	 * Returns (via onSuccess callback) result object of found transactions.
	 *
	 * @param {string}	whereStrings	string of where queries
	 * @param {string[]}	whereArgs	argument array for whereStrings
	 * @param {string}	sortQry	How to sort results
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 * @param {int}	[limit]	limits the number of transactions
	 * @param {int}	[offset]	offset of result set to return
	 *
	 * @returns {object[]}
	 */
	searchTransactions: function( whereStrings, whereArgs, sortQry, options, limit, offset ) {

		var qryTransactions = new GTS.databaseQuery(
				{
					"sql": "SELECT" +
						//Expense table data
						" DISTINCT main.itemId, main.desc, main.amount, main.note, main.date, main.account," +
						" main.linkedRecord, main.linkedAccount, main.cleared, main.repeatId, main.checkNum," +

						//Account information
						" ( SELECT accts.acctName FROM accounts accts WHERE accts.acctId = main.account ) AS acctName," +
						" ( SELECT accts.acctCategory FROM accounts accts WHERE accts.acctId = main.account ) AS acctCategory," +
						"IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = ( SELECT accts.acctCategory FROM accounts accts WHERE accts.acctId = main.account ) ), 'icon_2.png' ) AS acctCategoryIcon, " +
						" ( SELECT accts.showTransTime FROM accounts accts WHERE accts.acctId = main.account ) AS showTransTime," +
						" ( SELECT accts.enableCategories FROM accounts accts WHERE accts.acctId = main.account ) AS enableCategories," +
						" ( SELECT accts.checkField FROM accounts accts WHERE accts.acctId = main.account ) AS checkField," +
						" ( SELECT accts.hideNotes FROM accounts accts WHERE accts.acctId = main.account ) AS hideNotes," +
						" ( SELECT accts.frozen FROM accounts accts WHERE accts.acctId = main.account ) AS frozen," +

						//Category information (JSON if split)
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" ( '[' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ) AS json FROM transactionSplit ts WHERE ts.transId = main.itemId ORDER BY ts.amount DESC ) ), '{ \"category\": \"?\", \"category2\" : \"?\", \"amount\": \"0\" }' ) || ']' )" +
						" ELSE main.category END ) AS category," +
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" 'PARSE_CATEGORY'" +
						" ELSE main.category2 END ) AS category2" +

						" FROM transactions main" +

						" WHERE " + whereStrings +
						" ORDER BY " + sortQry
					,
					"values": enyo.clone( whereArgs )
				}
			);

		if( limit ) {

			qryTransactions['sql'] += " LIMIT ?"
			qryTransactions['values'].push( limit );
		}

		if( offset ) {

			qryTransactions['sql'] += " OFFSET ?"
			qryTransactions['values'].push( offset );
		}

		enyo.application.gts_db.query(
				qryTransactions,
				options
			);
	},

	/**
	 * @public
	 * Returns (via onSuccess callback) result object of count of found transactions.
	 *
	 * @param {string}	whereStrings	string of where queries
	 * @param {string[]}	whereArgs	argument array for whereStrings
	 * @param {string}	sortQry	How to sort results
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 *
	 * @returns {object[]}
	 */
	searchTransactionsCount: function( whereStrings, whereArgs, sortQry, options ) {

		var qryTransactions = new GTS.databaseQuery(
				{
					"sql": "SELECT COUNT( DISTINCT main.itemId ) AS searchCount" +
						" FROM transactions main" +
						" WHERE " + whereStrings
					,
					"values": enyo.clone( whereArgs )
				}
			);

		enyo.application.gts_db.query(
				qryTransactions,
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
	 * Builds transactionSortOptions
	 *
	 * @param {object}	[options]	Callback functions
	 * @param {function}	[options.onSuccess]
	 * @param {function}	[options.onError]
	 */
	fetchTransactionSorting: function( options ) {

		enyo.application.gts_db.query(
				"SELECT * FROM acctTrsnSortOptn ORDER BY groupOrder ASC, label",
				{
					"onSuccess": enyo.bind( this, this.buildTransactionSorting, options )
				}
			);
	},

	buildTransactionSorting: function( options, results ) {

		this.log();

		var row = null;
		transactionSortOptions = [];

		for( var i = 0; i < results.length; i++ ) {

			var row = results[i];

			if( row ) {

				transactionSortOptions.push(
							{
								icon: "source/images/sort_icons/" + row['sortGroup'].toLowerCase().replace( " ", "" ) + ".png",
								caption: row['label'],
								value: row['sortId'],
								qry: row['qry'],
								sortGroup: row['sortGroup'],
								menuParent: "transactionSortOptions"
							}
					);
			}
		}

		if( enyo.isFunction( options['onSuccess'] ) ) {

			options['onSuccess']();
		}
	},

	/**
	 * @public
	 * Gets max check number
	 *
	 * @param {int}	account id	Account to get the max check number from
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return {int}	(via onSuccess) max check number
	 */
	 fetchMaxCheckNumber: function( acctId, options ) {

		if( !Object.isNumber( acctId ) ) {

			this.log( "No account number specified." );

			if( enyo.isFunction( options['onError'] ) ) {

				options['onError']( "No account specified" );
			}

			return;
		}

		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect( "transactions", [ "MAX( checkNum ) AS maxCheckNum" ], { "account": acctId } ),
				{
					"onSuccess": function( results ) {

						// Call the onSuccess with results
						if( enyo.isFunction( options['onSuccess'] ) ) {

							var num = parseInt( results[0]['maxCheckNum'] );

							if( !isNaN( num ) ) {

								options['onSuccess']( num + 1 );
							} else {

								options['onSuccess']( 1 );
							}
						}
					},
					"onError": options['onError']
				}
			);
	},

	/**
	 * @public
	 * Returns JSON object with category & category 2 data from standard Checkbook DB formatted data
	 *
	 * @param {string}	category	main category string (from database)
	 * @param {string}	category2	secondary category string (from database)
	 *
	 * @return {object}
	 */
	parseCategoryDB: function( category, category2 ) {

		var data;

		if( category2 === 'PARSE_CATEGORY' ) {
			//JSON formatted string [{ category, category2, amount }]

			data = enyo.json.parse( category );
		} else {

			if( category === '' && category2 === '' ) {
				//None set; use default

				category = $L( "Uncategorized" );
				category2 = $L( "Other" );
			} else if( category2 === '' ) {
				//Old Format Category; retain for backwards compatibility

				category2 = category.split( "|", 2 )[1];
				category = category.split( "|", 2 )[0];
			}

			data = [
						{
							"category": category,
							"category2": category2,
							"amount": ""
						}
					];
		}

		return data;
	},

	/**
	 * @public
	 * Creates a display string from category database items
	 *
	 * @param {string}	category	main category string (from database)
	 * @param {string}	category2	secondary category string (from database)
	 * @param {boolean}	[truncate=true]	shorten number of categories displayed
	 * @param {string}	[additionalClasses='small']	shorten number of categories displayed
	 *
	 * @return {string}
	 */
	formatCategoryDisplay: function( category, category2, truncate, additionalClasses ) {

		truncate = ( ( typeof truncate !== 'undefined' ) ? truncate : true );
		additionalClasses = ( ( typeof additionalClasses !== 'undefined' ) ? additionalClasses : 'small' );

		var catDisplayItem;

		if( category2 === 'PARSE_CATEGORY' ) {
			//Build for proper display

			//JSON formatted string [{ category, category2, amount }]
			var catObj = category.evalJSON();
			var leftCol = "";
			var rightCol = "";

			for( var i = 0; i < ( ( catObj.length > 3 && truncate ) ? 2 : catObj.length ); i++ ) {

				leftCol += "<div class='enyo-item " + additionalClasses + "'>" + catObj[i]['category'] + " &raquo; " + catObj[i]['category2'] + "</div>";

				rightCol += "<div class='enyo-item " + additionalClasses + "'>" + formatAmount( catObj[i]['amount'] ) + "</div>";
			}

			catDisplayItem = "<div style='margin-bottom: 0.5em;'>" +
						"<div class='splitCatContainer enyo-hflexbox'>" +
							"<div class='categoryGroup'>" + leftCol + "</div>" +
							"<div class='categoryAmount'>" + rightCol + "</div>" +
						"</div>" +
						( ( catObj.length > 3 && truncate ) ? "<div class='" + additionalClasses + "'>+" + ( catObj.length - 2 ) + " more</div>" : "" ) +
					"</div>";
		} else {

			//Old Format Category
			if( category2 === '' ) {

				category2 = category.split( "|", 2 )[1];
				category = category.split( "|", 2 )[0];
			}

			catDisplayItem = "<span class='" + additionalClasses + "'>" + category + " >> " + category2 + "</span>";
		}

		return( category !== "" ? catDisplayItem : "" );
	}
});
