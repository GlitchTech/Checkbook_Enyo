/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.accounts.manager ( Component )
 *
 * Control system for managing accounts. Handles creation, modification, & deletion.
 *
 * @requires webOS enyo
 * @requires Prototype JS
 * @requires GTS.database to exist in Checkbook.globals.gts_db
 * @requires Checkbook.encrypt
 */
enyo.kind({

	name: "Checkbook.accounts.manager",
	kind: enyo.Component,

	components: [
		{
			name: "cryptoSystem",
			kind: "Checkbook.encryption"
		}
	],

	/**
	 * @protected
	 *
	 * @type {int}	lastModified	unix timestamp
	 * @type {int}	lastBuild	unix timestamp
	 * @type {int}	defaultAccountIndex	Default account index in accounts or accountList
	 * @type {object[]}	accounts	Array of account objects
	 * @type {object[]}	accountsList	Array of simplified account objects
	 * @type {int[]}	idTable	Used as a lookup table for the index of a specific account id
	 */
	accountObject: {
		lastModified: 0,
		lastBuild: -1,
		defaultAccountIndex: -1,

		accounts: [],
		accountsList: [],
		idTable: [],

		processing: false,
		processingQueue: []
	},

	/**
	 * @protected
	 */
	constructor: function() {

		this.inherited( arguments );

		//Create DB Object if not build.
		if( !Checkbook.globals.gts_db ) {

			this.log( "creating database object." );

			var db = new GTS.database( dbArgs );
		}

		// Setup listing of bound methods
		this.bound = {
			_errorHandler: enyo.bind( this, this._errorHandler )
		};
	},

	/**
	 * @public
	 *
	 * Creates a new account from the passed in parameters. Does basic checking on parameters. Returns boolean for success.
	 *
	 * @param {object}	data	key: value object of new account parameters. Unset parameters will become system defaults
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return {boolean}	via onSuccess
	 */
	createAccount: function( data, options ) {

		enyo.mixin( data, { "sect_order": [ "( SELECT IFNULL( MAX( sect_order ), 0 ) FROM accounts )", true ] } );

		this._prepareDataObject( data );

		this.$['cryptoSystem'].encryptString(
				data['lockedCode'],
				enyo.bind( this, this._createAccountFollower, data, options )
			);
	},

	/**
	 * @protected
	 */
	_createAccountFollower: function( data, options, code ) {

		if( data['auto_savings'] == 0 || !Object.isNumber( data['auto_savings_link'] ) || data['auto_savings_link'] < 0 ) {
			//Linking turned off || No account linked

			data['auto_savings'] = 0;
			data['auto_savings_link'] = -1;
		}

		if( data['acctLocked'] == 0 || code == "" || !code ) {
			//Set to off or no code

			data['acctLocked'] = 0;
			data['lockedCode'] = "";
		} else {

			data['acctLocked'] = 1;
			data['lockedCode'] = code;
		}

		var queries = [ Checkbook.globals.gts_db.getInsert( "accounts", data ) ];

		if( data['defaultAccount'] === 1 ) {
			//Set all other accounts as non-defaults. Use unshift to call before insert.

			queries.unshift( Checkbook.globals.gts_db.getUpdate( "accounts", { "defaultAccount": 0 }, { "0": "0" } ) );
		}

		Checkbook.globals.gts_db.queries(
				queries,
				this._prepareModOptions( options )
			);
	},

	/**
	 * @public
	 *
	 * Updates account from the passed in parameters. Does basic checking on parameters. Returns boolean for success
	 *
	 * @param {object}	data	key: value object of new account parameters. Unset parameters will become system defaults
	 * @param {int}	acctId	index of account to update
	 * @param {boolean}	pinChanged	true if the PIN is changed from what it was
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return {boolean}	via onSuccess
	 */
	updateAccount: function( data, acctId, pinChanged, options ) {

		this._prepareDataObject( data );

		this.$['cryptoSystem'].encryptString(
				data['lockedCode'],
				enyo.bind( this, this._updateAccountFollower, data, acctId, pinChanged, options )
			);
	},

	/**
	 * @protected
	 */
	_updateAccountFollower: function( data, acctId, pinChanged, options, code ) {

		if( data['auto_savings'] == 0 || !Object.isNumber( data['auto_savings_link'] ) || data['auto_savings_link'] < 0 ) {
			//Linking turned off || No account linked

			data['auto_savings'] = 0;
			data['auto_savings_link'] = -1;
		}

		if( data['acctLocked'] == 0 || code == "" || !code ) {
			//Set to off or no code

			data['acctLocked'] = 0;
			data['lockedCode'] = "";
		} else if( pinChanged ) {
			//Pin has been changed, encrypt new version

			data['acctLocked'] = 1;
			data['lockedCode'] = code;
		}//else don"t change things

		var queries = [ Checkbook.globals.gts_db.getUpdate( "accounts", data, { "acctId": acctId } ) ];

		if( data['defaultAccount'] === 1 ) {
			//Set all other accounts as non-defaults. Use unshift to call before update.

			queries.unshift( Checkbook.globals.gts_db.getUpdate( "accounts", { "defaultAccount": 0 } ) );
		}

		Checkbook.globals.gts_db.queries(
				queries,
				this._prepareModOptions( options )
			);
	},

	/**
	 * @public
	 *
	 * Updates account balance view mode
	 *
	 * @param {int}	acctId	index of account to update
	 * @param {int}	bal_view	new balanace view mode
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 */
	updateAccountBalView: function( acctId, bal_view, options ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getUpdate(
						"accounts",
						{
							"bal_view": bal_view
						},
						{
							"rowid": acctId
						}
					),
				this._prepareModOptions( options )
			);
	},

	/**
	 * @public
	 *
	 * Updates account balance view mode
	 *
	 * @param {int}	acctId	index of account to update
	 * @param {int}	sort	new sort mode
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 */
	updateAccountSorting: function( acctId, sort, options ) {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getUpdate(
						"accounts",
						{
							"sort": sort
						},
						{
							"rowid": acctId
						}
					),
				this._prepareModOptions( options )
			);
	},

	/**
	 * @public
	 *
	 * Deletes account
	 *
	 * @param {int}	acctId	index of account to retrieve
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return {boolean}	via onSuccess
	 */
	deleteAccount: function( acctId, options ) {

		var queries = [
				Checkbook.globals.gts_db.getDelete( "transactions", { "account": acctId } ),
				Checkbook.globals.gts_db.getDelete( "repeats", { "rep_acctId": acctId } ),

				Checkbook.globals.gts_db.getUpdate( "transactions", { "linkedAccount": "", "linkedRecord": "" }, { "linkedAccount": acctId } ),
				Checkbook.globals.gts_db.getUpdate( "repeats", { "rep_linkedAcctId": "" }, { "rep_linkedAcctId": acctId } ),

				Checkbook.globals.gts_db.getDelete( "accounts", { "acctId": acctId } )
			];

		Checkbook.globals.gts_db.queries(
				queries,
				this._prepareModOptions( options )
			);
	},

	/**
	 * @public
	 *
	 * Changes default account to indicated id. Use -1 to indicate no default account
	 *
	 * @param {int}	acctId	index of account to retrieve
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 */
	updateDefaultAccount: function( acctId, options ) {

		var queries = [
				Checkbook.globals.gts_db.getUpdate( "accounts", { "defaultAccount": 0 }, null ),
				Checkbook.globals.gts_db.getUpdate( "accounts", { "defaultAccount": 1 }, { "acctId": acctId } )
			];

		var index = this.fetchAccountIndex( acctId );
		if( index >= 0 ) {

			this.accountObject.defaultAccountIndex = index;
		} else {

			this.updateAccountModTime();
		}

		Checkbook.globals.gts_db.queries(
				queries,
				options
			);
	},

	/**
	 * @public
	 *
	 * Returns (via onSuccess callback) object with default account or null.
	 *
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return	{object}	results via onSuccess
	 */
	fetchDefaultAccount: function( options ) {

		if( this.accountObject.lastModified <= this.accountObject.lastBuild ) {
			//Use the active memory account list

			if( enyo.isFunction( options['onSuccess'] ) ) {

				if( Object.isNumber( this.accountObject.defaultAccountIndex ) && this.accountObject.defaultAccountIndex >= 0 ) {

					options['onSuccess']( this.accountObject.accounts[this.accountObject.defaultAccountIndex] );
				} else {

					options['onSuccess']();
				}
			}
		} else {

			options = this._getOptions( options );
			this.accountObject.processingQueue.push( { "source": "fetchDefaultAccount", "func": enyo.bind( this, this.fetchDefaultAccount, options ) } );

			if( !this.accountObject.processing ) {

				this.accountObject.processing = true;
				this._buildAccountObjects( options['onError'] );
			}
		}
	},

	/**
	 * @public
	 *
	 * Retrieves account index
	 *
	 * @param {int}	acctId	index of account to retrieve
	 *
	 * @return	{object}	index of account id
	 */
	fetchAccountIndex: function( acctId ) {

		if( this.accountObject.lastModified <= this.accountObject.lastBuild ) {
			//Use the active memory account list

			return( this.accountObject.idTable.indexOf( acctId ) );
		}

		return -1;
	},

	/**
	 * @public
	 *
	 * Retrieves single account
	 *
	 * @param {int}	acctId	index of account to retrieve
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return	{object}	data key: value object containing account information, undefined if none found via onSuccess
	 */
	fetchAccount: function( acctId, options ) {

		if( this.accountObject.lastModified <= this.accountObject.lastBuild ) {
			//Use the active memory account list

			var index = this.fetchAccountIndex( acctId );

			if( index >= 0 && enyo.isFunction( options['onSuccess'] ) ) {

				options['onSuccess']( this.accountObject.accounts[index] );
			} else if( enyo.isFunction( options['onError'] ) ) {

				options['onError']();
			}
		} else {

			this.accountObject.processingQueue.push( { "source": "fetchAccount", "func": enyo.bind( this, this.fetchAccount, acctId, options ) } );

			if( !this.accountObject.processing ) {

				this.accountObject.processing = true;
				this._buildAccountObjects( this._getOptions( options )['onError'] );
			}
		}
	},

	/**
	 * @public
	 *
	 * Retrieves single account's balance
	 *
	 * @param {int}	acctId	index of account to retrieve
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return {object}	data	key: value object containing account information, undefined if none found via onSuccess
	 */
	fetchAccountBalance: function( acctId, options ) {

		var today = new Date();
		var now = Date.parse( today );
		today.setHours( 23, 59, 59, 999 );
		today = Date.parse( today );

		var qryAccountBalance = new GTS.databaseQuery(
				{
					"sql": "SELECT " +

							//bal_view = 0
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId " +
								"AND ( " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) " +
								") ), 0 ) AS balance0, " +

							//bal_view = 1
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId " +
								"AND ( " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) " +
								") AND transactions.cleared = 1 ), 0 ) AS balance1, " +

							//bal_view = 3
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId " +
								"AND transactions.cleared = 0 ), 0 ) AS balance3, " +

							//bal_view = 2
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) AS balance2 " +

						"FROM accounts " +
						"WHERE acctId = ?"
					,
					"values": [
						now,
						today,
						now,
						today,
						acctId
					]
				}
			);

		Checkbook.globals.gts_db.query(
				qryAccountBalance,
				{
					"onSuccess": function( results ) {

						// Call the onSuccess with results
						if( enyo.isFunction( options['onSuccess'] ) ) {

							results = results[0];

							results['balance0'] = Math.round( results['balance0'] * 100 ) / 100;
							results['balance1'] = Math.round( results['balance1'] * 100 ) / 100;
							results['balance2'] = Math.round( results['balance2'] * 100 ) / 100;
							results['balance3'] = Math.round( results['balance3'] * 100 ) / 100;

							options['onSuccess']( results );
						}
					},
					"onError": options['onError']
				}
			);
	},

	/**
	 * @public
	 *
	 * Returns (via onSuccess callback) result object of accounts.
	 *
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 * @param {int}	[limit]	limits the number of accounts
	 * @param {int}	[offset]	offset of result set to return
	 *
	 * @return {object[]}	results	via onSuccess
	 */
	fetchAccounts: function( options, limit, offset ) {

		if( this.accountObject.lastModified <= this.accountObject.lastBuild ) {
			//Use the active memory account list

			if( enyo.isFunction( options['onSuccess'] ) ) {

				options['onSuccess']( this.accountObject.accounts.slice( ( Object.isNumber( offset ) ? offset : 0 ), limit ) );
			}
		} else {

			options = this._getOptions( options );
			this.accountObject.processingQueue.push( { "source": "fetchAccounts", "func": enyo.bind( this, this.fetchAccounts, options, limit, offset ) } );

			if( !this.accountObject.processing ) {

				this.accountObject.processing = true;
				this._buildAccountObjects( options['onError'] );
			}
		}
	},

	/**
	 * @public
	 *
	 * Returns query object for selecting accounts from a popup list
	 *
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 * @param {int}	[limit]	limits the number of accounts
	 * @param {int}	[offset]	offset of result set to return
	 *
	 * @return {object[]}	results	via onSuccess
	 */
	fetchAccountsList: function( options, limit, offset ) {

		if( this.accountObject.lastModified <= this.accountObject.lastBuild ) {
			//Use the active memory account list

			if( enyo.isFunction( options['onSuccess'] ) ) {

				options['onSuccess']( this.accountObject.accountsList.slice( ( Object.isNumber( offset ) ? offset : 0 ), limit ) );
			}
		} else {

			this.accountObject.processingQueue.push( { "source": "fetchAccountsList", "func": enyo.bind( this, this.fetchAccountsList, options, limit, offset ) } );

			if( !this.accountObject.processing ) {

				this.accountObject.processing = true;
				this._buildAccountObjects( options['onError'] );
			}
		}
	},

	/**
	 * @public
	 *
	 * Returns array of balances for all accounts
	 *
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return	{float[]}	results	via onSuccess
	 */
	fetchOverallBalances: function( options ) {

		var today = new Date();
		var now = Date.parse( today );
		today.setHours( 23, 59, 59, 999 );
		today = Date.parse( today );

		var qryAccounts = new GTS.databaseQuery(
				{
					"sql": "SELECT " +
							//0: Available
							"SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) ) AS balance0, " +
							//1: Cleared
							"SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND transactions.cleared = 1 ), 0 ) ) AS balance1, " +
							//2: Final
							"SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) ) AS balance2, " +
							//3: Pending
							"SUM( IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND transactions.cleared = 0 ), 0 ) ) AS balance3, " +
							//4: Default
							"SUM( " +
								"CASE " +
									"WHEN bal_view = 0 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) " +
									"WHEN bal_view = 1 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND ( ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND transactions.cleared = 1 ), 0 ) " +
									"WHEN bal_view = 2 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) " +
									"WHEN bal_view = 3 THEN IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId AND transactions.cleared = 0 ), 0 ) " +
									"ELSE 0 " +
								"END " +
							") AS stdBal " +
						"FROM accounts " +
						"WHERE hidden = 0"
					,
					"values": [
						now,
						today,
						now,
						today,
						now,
						today,
						now,
						today
					]
				}
			);

		Checkbook.globals.gts_db.query(
				qryAccounts,
				{
					"onSuccess": enyo.bind( this, this.fetchOverallBalancesHandler, options['onSuccess'] ),
					"onError": options['onError']
				}
			);
	},

	/**
	 * @protected
	 */
	fetchOverallBalancesHandler: function( callbackFn, results ) {

		var totalBalance = [ 0, 0, 0, 0, 0 ];

		if( results.length > 0 ) {

			var row = results[0];

			totalBalance[0] = row['balance0'];
			totalBalance[1] = row['balance1'];
			totalBalance[2] = row['balance2'];
			totalBalance[3] = row['balance3'];
			totalBalance[4] = row['stdBal'];
		}

		if( enyo.isFunction( callbackFn ) ) {

			callbackFn( totalBalance );
		}
	},

	/**
	 * @protected
	 *
	 * Builds accountObject
	 * @see this#_buildAccountObjectsHandler
	 *
	 * @param {function} [onError]
	 * @param {int}	[limit=100]	limits the number of accounts
	 * @param {int}	[offset=0]	offset of result set to return
	 */
	_buildAccountObjects: function( onError, limit, offset ) {

		limit = ( Object.isNumber( limit ) ? limit : 100 );
		offset = ( Object.isNumber( offset ) ? offset : 0 );

		if( offset <= 0 ) {

			this.accountObject.defaultAccountIndex = -1;
			this.accountObject.idTable = [];
			this.accountObject.accounts = [];
			this.accountObject.accountsList = [];
		}

		var today = new Date();
		var now = Date.parse( today );
		today.setHours( 23, 59, 59, 999 );
		today = Date.parse( today );

		var qryAccounts = new GTS.databaseQuery(
				{
					"sql": "SELECT *, " +
							//Transaction Sorting
							"( SELECT qry FROM acctTrsnSortOptn WHERE sortId = accounts.sort ) AS sortQry, " +
							//Transaction row count
							"IFNULL( ( SELECT COUNT( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) AS itemCount, " +

							//Category information
							"IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ), 'icon_2.png' ) AS acctCategoryIcon, " +
							"( SELECT accountCategories.color FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCategoryColor, " +
							"( SELECT accountCategories.catOrder FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCatOrder, " +
							"( SELECT accountCategories.rowid FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCatId, " +

							//bal_view = 0
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId " +
								"AND ( " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) " +
								") ), 0 ) AS balance0, " +

							//bal_view = 1
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId " +
								"AND ( " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR " +
									"( CAST( transactions.date AS INTEGER ) <= ? AND showTransTime = 0 ) " +
								") AND transactions.cleared = 1 ), 0 ) AS balance1, " +

							//bal_view = 3
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId " +
								"AND transactions.cleared = 0 ), 0 ) AS balance3, " +

							//bal_view = 2
							"IFNULL( ( SELECT SUM( transactions.amount ) FROM transactions WHERE transactions.account = accounts.acctId ), 0 ) AS balance2 " +

						"FROM accounts " +
						"ORDER BY " + accountSortOptions[Checkbook.globals.prefs['custom_sort']]['query'] +
						" LIMIT ? OFFSET ?"
					,
					"values": [
						now,
						today,
						now,
						today,
						limit,
						offset
					]
				}
			);

		Checkbook.globals.gts_db.query(
				qryAccounts,
				{
					"onSuccess": enyo.bind( this, this._buildAccountObjectsHandler, onError, limit, offset ),
					"onError": onError
				}
			);
	},

	/**
	 * @protected
	 *
	 * Parses query data from _buildAccountObjects
	 * @see this#_buildAccountObjects
	 *
	 * @param {function} onError (may be undefined, but required)
	 * @param {int}	limit	limits the number of accounts
	 * @param {int}	offset	offset of result set to return
	 * @param {object[]}	results	SQL result data
	 */
	_buildAccountObjectsHandler: function( onError, limit, offset, results ) {

		this.log( limit, offset, results.length );

		for( var i = 0; i < results.length; i++ ) {

			var row = enyo.clone( results[i] );

			if( row['defaultAccount'] == 1 ) {

				this.accountObject.defaultAccountIndex = offset + i;
			}

			this.accountObject.idTable[offset + i] = row['acctId'];

			this.accountObject.accountsList[offset + i] = {
					"content": row['acctName'],
					"icon": "assets/" + row['acctCategoryIcon'],
					"color": row['acctCategoryColor'],
					"value": row['acctId'],

					components: [
						{
							kind: "onyx.Icon",
							src: "assets/" + row['acctCategoryIcon'],
							classes: "margin-right img-icon"
						}, {
							content: row['acctName']
						}
					]
				};

			this.accountObject.accounts[offset + i] = row;
		}

		if( limit > results.length ) {
			//Complete

			while( this.accountObject.processingQueue.length > 0 ) {

				var obj = this.accountObject.processingQueue.shift();

				if( enyo.isFunction( obj['func'] ) ) {

					enyo.asyncMethod(
							null,
							obj['func']
						);
				}
			}

			this.accountObject.lastBuild = Date.parse( new Date() );
			this.accountObject.processing = false;
			this.accountObject.processingQueue = [];
		} else {
			//Fetch more

			this._buildAccountObjects( onError, limit, ( offset + limit ) );
		}
	},

	/**
	 * @protected
	 *
	 * Sets booleans to integers & undefineds to empty
	 *
	 * @param / @return	{object}	data key: value object; pass by reference item
	 */
	_prepareDataObject: function( data ) {

		for( key in data ) {

			if( typeof( data[key] ) === "boolean" ) {

				data[key] = data[key] ? 1 : 0;
			} else if( typeof( data[key] ) === "undefined" ) {

				data[key] = "";
			}
		}
	},

	/**
	 * @protected
	 *
	 * Merge user options into the standard set
	 *
	 * @param userOptions ( object, required ): options passed by the user
	 */
	_getOptions: function( userOptions ) {

		var opts = {
			"onSuccess": this._emptyFunction,
			"onError": this.bound._errorHandler
		};

		if( typeof( userOptions ) === 'undefined' ) {

			userOptions = {};
		}

		enyo.mixin( opts, userOptions );

		return opts;
	},

	/**
	 * @protected
	 *
	 * Adjusts the options object passed in to update the account timestamp first then continue
	 *
	 * @param {object}	[options]	contains callback functions
	 * @param {function} [options.onSuccess]	Called when database operation is successful
	 * @param {function} [options.onError]	Called when error occurs in database operation
	 *
	 * @return {object}	contains callback functions
	 * @see params for this#_prepareModOptions
	 */
	_prepareModOptions: function( userOpts ) {

		var opts = {};

		if( userOpts && enyo.isFunction( userOpts['onSuccess'] ) ) {

			opts['onSuccess'] = enyo.bind( this, function() {

					this.updateAccountModTime();
					userOpts['onSuccess']( true );//Breaks, why?
				});
		} else {

			opts['onSuccess'] = enyo.bind( this, this.updateAccountModTime );
		}

		if( userOpts && enyo.isFunction( userOpts['onError'] ) ) {

			opts['onError'] = userOpts['onError'];
		} else {

			delete opts['onError'];
		}

		return opts;
	},

	/**
	 * @public
	 *
	 * updates app variable to now; used as reference for updating panes based on last action time; do not use freely!
	 */
	updateAccountModTime: function() {

		this.accountObject.lastModified = Date.parse( new Date() );
	},

	/**
	 * @protected
	 */
	_emptyFunction: function() {},

	/**
	 * @protected
	 * Used to report generic errors
	 */
	_errorHandler: function() {
		// If a transaction error ( rather than an executeSQL error ) there might only be one parameter

		if( arguments.length <= 0 ) {

			return;
		}

		enyo.error( 'Account Control Error: ' + Object.toJSON( arguments ) );

		if( Checkbook.globals.criticalError ) {
			//Popup alert of error

			Checkbook.globals.criticalError.load( null, 'Account Control Error: ' + Object.toJSON( arguments ), null );
			//Check preferances & notify GTS if required.
		}
	}
});
