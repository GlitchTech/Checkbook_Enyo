/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

/**
 * Checkbook.transactions.manager ( Component )
 *
 * Control system for managing transactions. Handles creation, modification, & deletion.
 *	Requires GTS.database to exist in enyo.application.gts_db
 */
enyo.kind({

	name: "Checkbook.transactions.manager",
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
	 * @public
	 *
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
		//data['repeatId'] = parseInt( results[0]['maxRepeatId'] ) + 1;//Unused at this time

		//Prepare data
		var sql = this._prepareData( data, type );

		//Handle split transactions
		sql = sql.concat( this._handleCategoryData( data ) );

		//Handle repeating system (maybe?)
		sql = sql.concat( this._handleRepeatSystem( data ) );

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
	 *
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

		enyo.application.gts_db.query(
				new GTS.databaseQuery(
						{
							'sql': "SELECT ( SELECT IFNULL( MAX( itemId ), 0 ) FROM transactions LIMIT 1 ) AS maxItemId, ( SELECT IFNULL( MAX( repeatId ), 0 ) FROM repeats LIMIT 1 ) AS maxRepeatId;" ,
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

		//Handle split transactions
		sql = sql.concat( this._handleCategoryData( data ) );

		//Handle repeating system (maybe?)
		sql = sql.concat( this._handleRepeatSystem( data ) );

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
	 * @private
	 * Category handler system
	 *
	 * @param {object}	data	Object to be readied; Since object, pass by reference situation;
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if category is not split
	 */
	_handleCategoryData: function( data ) {

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
	 * Repeat handler system
	 *
	 * @param {object}	data	Object to be readied; Since object, pass by reference situation;
	 *
	 * @returns {object[]}	SQL functions to be run. Returns empty array if nothing to do.
	 */
	_handleRepeatSystem: function( data ) {

		var sqlArray = [];

		/** Handle Repeat data **/
		if( data['repeatId'] < 0 ) {

			//Check & handle new repeating transactions
		} else {

			//Do existing repeating transactions
		}

		delete data['maxRepeatId'];

		/////////////////////////////////
		//Temp while system doesn't exist
		data['repeatId'] = null;
		/////////////////////////////////

		return sqlArray;
	},

	/**
	 * @public
	 *
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
	 *
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
					enyo.application.gts_db.getDelete(
							"transactions",
							{
								"itemId": trsnId
							}
						),
					enyo.application.gts_db.getDelete(
							"transactions",
							{
								"linkedRecord": trsnId
							}
						)
				],
				options
			);
	},

	/**
	 * @public
	 *
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
							" ( '[' || ( SELECT GROUP_CONCAT( ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ), ',' ) FROM transactionSplit ts WHERE ts.transId = main.itemId ) || ']' )" +
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
	 *
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
							" ( '[' || ( SELECT GROUP_CONCAT( ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ), ',' ) FROM transactionSplit ts WHERE ts.transId = main.itemId ) || ']' )" +
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
	 *
	 * Returns (via onSuccess callback) result object of transactions.
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

						//Category information (JSON if split)
						" ( CASE WHEN main.category = '||~SPLIT~||' THEN" +
							" ( '[' || ( SELECT GROUP_CONCAT( ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ), ',' ) FROM transactionSplit ts WHERE ts.transId = main.itemId ) || ']' )" +
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
	 *
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
	 *
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
	 *
	 * Creates a display string from category database items
	 *
	 * @param {string}	category	main category string (from database)
	 * @param {string}	category2	secondary category string (from database)
	 *
	 * @return {string}
	 */
	formatCategoryDisplay: function( category, category2 ) {

		var catDisplayItem;

		if( category2 === 'PARSE_CATEGORY' ) {
			//Build for proper display

			//JSON formatted string [{ category, category2, amount }]
			var catObj = category.evalJSON();

			catDisplayItem = "<div class='splitCatContainer'>";

			for( var i = 0; i < ( catObj.length > 3 ? 2 : catObj.length ); i++ ) {

				catDisplayItem += "<div class='categoryGroup'>" + catObj[i]['category'] + " &raquo; " + catObj[i]['category2'] + "</div>" +
									"<div class='categoryAmount'>" + catObj[i]['amount'] + "</div>";
			}

			if( catObj.length > 3 ) {

				catDisplayItem += "+ " + ( catObj.length - 2 ) + " more";
			}

			catDisplayItem += "</div>";
		} else {

			//Old Format Category
			if( category2 === '' ) {

				category2 = category.split( "|", 2 )[1];
				category = category.split( "|", 2 )[0];
			}

			catDisplayItem = category + " >> " + category2;
		}

		return( category !== "" ? catDisplayItem : "" );
	}
});