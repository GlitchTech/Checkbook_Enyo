/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.accounts.list ( Component )
 *
 * Account list display system
 *	Requires GTS.database to exist in Checkbook.globals.gts_db
 *	Requires Checkbook.accounts.manager
 */

enyo.kind({
	name: "Checkbook.accounts.list",
	kind: "enyo.Scroller",
	fit: true,

	style: "position: relative;",

	accounts: [],

	events: {
		onSetupRow: ""
	},

	published: {
		//pageSize: 15,
		balanceView: 4,

		editMode: false,
		reorderable: true,

		horizontal: "hidden"
	},

	components: [
		{
			name: "entries",
			kind: "enyo.Repeater",

			classes: "enyo-fit",

			//onReorder: "reorder",
			onSetupItem: "handleSetupRow",

			components: [
				{
					name: "accountItem",
					classes: "bordered norm-row account-item",

					kind: "onyx.Item",//SwipeableItem
					tapHighlight: true,

					ontap: "accountTapped",
					onDelete: "accountDeleted",

					components: [
						{
							name: "catDivider",
							kind: "GTS.Divider",
							ontap: "dividerTapped"
						}, {
							layoutKind: "",
							classes: "account",
							components: [
								{
									name: "icon",
									kind: enyo.Image,
									classes: "accountIcon"
								}, {
									name: "iconLock",
									kind: enyo.Image,
									src: "assets/padlock_1.png",
									classes: "accountLockIcon unlocked"
								}, {
									name: "name",
									classes: "text-ellipsis accountName"
								}, {
									name: "balance",
									classes: "right"
								}
							]
						}, {
							name: "note",
							allowHtml: true,
							classes: "note smaller text-ellipsis"
						}
					]
				}
			]
		},

		{
			name: "loadingScrim",
			kind: onyx.Scrim,
			classes: "onyx-scrim-translucent",
			showing: true
		}, {
			name: "loadingSpinner",
			kind: "jmtk.Spinner",
			color: "#284907",
			diameter: "90",
			shape: "spiral",

			style: "z-index: 2; position: absolute; width: 90px; height: 90px; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
		},

		{
			kind: "Signals",

			accountChanged: "renderAccountList",
			balanceChanged: "refresh",
			accountBalanceChanged: "accountBalanceChanged"
		}
	],

	rendered: function() {

		this.log();

		//this.$['entries'].setReorderable( this.reorderable );

		this.inherited( arguments );
	},

	/** Event Handlers **/

	handleSetupRow: function( inSender, inEvent ) {

		if( enyo.isFunction( this.doSetupRow ) && this.onSetupRow !== "" ) {

			return( this.doSetupRow( inEvent ) );
		} else {

			return( this.setupRow( inSender, inEvent ) );
		}
	},

	/** List Control **/

	renderAccountList: function() {

		this.log();

		this.accounts = [];

		Checkbook.globals.accountManager.fetchAccounts(
				{
					"onSuccess": enyo.bind( this, this.dataResponse )
				}
			);
	},

	dataResponse: function( results ) {

		this.log();

		this.accounts = enyo.clone( results );

		//Reload list
		this.punt();

		//Hide loading items; heartbeat delay
		enyo.asyncMethod(
				this.$['loadingScrim'],
				this.$['loadingScrim'].hide
			);
		enyo.asyncMethod(
				this.$['loadingSpinner'],
				this.$['loadingSpinner'].hide
			);
	},

	punt: function() {

		this.log();

		this.refresh();
	},

	refresh: function() {

		this.log();

		this.$['entries'].setCount( this.accounts.length );
	},

	renderRow: function( index ) {

		if( typeof( index ) !== "undefined" && !isNaN( index ) ) {

			this.$['entries'].renderRow( index );
		}
	},

	/**
	 * TODO DEFINITION
	 */
	accountBalanceChanged: function( inSender, inEvent ) {

		if( !inEvent || !inEvent['accounts'] ) {
			//No data, full rebuild

			this.renderAccountList();
			return;
		}

		inEvent = inEvent['accounts'];

		if( typeof( inEvent['account'] ) === "undefined" && typeof( inEvent['linkedAccount'] ) === "undefined" && typeof( inEvent['atAccount'] ) === "undefined" ) {
			//No data, full rebuild

			this.renderAccountList();
			return;
		}

		if( typeof( inEvent['account'] ) !== "undefined" ) {
			//Main Account

			var acctIndex = inEvent['account'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( inEvent['account'] ) : - 1;

			if( acctIndex >= 0 ) {

				if( typeof( inEvent['accountBal'] ) !== "undefined" && inEvent['accountBal'].length > 0 ) {

					this.accountBalanceChangedHandler( acctIndex, inEvent['accountBal'] );
				} else {

					Checkbook.globals.accountManager.fetchAccountBalance(
							inEvent['account'],
							{
								"onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, acctIndex )
							}
						);
				}
			}
		}

		if( typeof( inEvent['linkedAccount'] ) !== "undefined" ) {
			//Linked Account

			var linkedIndex = inEvent['linkedAccount'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( inEvent['linkedAccount'] ) : - 1;

			if( linkedIndex >= 0 ) {

				Checkbook.globals.accountManager.fetchAccountBalance( inEvent['linkedAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, linkedIndex ) } );
			}
		}

		if( typeof( inEvent['atAccount'] ) !== "undefined" && inEvent['linkedAccount'] != inEvent['atAccount'] ) {
			//Auto-Transfer Account

			var linkedIndex = inEvent['atAccount'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( inEvent['atAccount'] ) : - 1;

			if( linkedIndex >= 0 ) {

				Checkbook.globals.accountManager.fetchAccountBalance( inEvent['atAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, linkedIndex ) } );
			}
		}
	},

	/**
	 * @protected
	 * @function
	 * @name Checkbook.accounts.view#accountBalanceChangedHandler
	 *
	 * Handles updating specific item in account listing
	 *
	 * @param int	index	Index of account
	 * @param [obj]	results	Result set from DB
	 */
	accountBalanceChangedHandler: function( index, results ) {

		if( typeof( results ) === "undefined" || isNaN( index ) || index < 0 || index >= this.accounts.length ) {

			return;
		}

		this.accounts[index]['balance0'] = results['balance0'];
		this.accounts[index]['balance1'] = results['balance1'];
		this.accounts[index]['balance2'] = results['balance2'];
		this.accounts[index]['balance3'] = results['balance3'];

		this.renderRow( index );
	},

	dividerTapped: function( inSender, inEvent ) {
		//Not allowed, block action

		inEvent.preventDefault();
		return true;
	},

	accountTapped: function( inSender, inEvent ) {
		//Row Tapped

		var row = this.accounts[inEvent.index];

		if( row ) {

			var nextAction;
			var nextActionEvent = {};

			if( this.editMode ) {
				//Edit Account

				nextAction = "modifyAccount";
				nextActionEvent = {
						name: "editAccount",
						kind: "Checkbook.accounts.modify",
						acctId: this.accounts[inEvent.index]['acctId'],
						onFinish: enyo.bind( this, this.editAccountComplete, inEvent.index )
					};
			} else {
				//View Account

				nextAction = "viewAccount";
				nextActionEvent = {
						account: row
					};
			}

			if( row['acctLocked'] == 1 ) {

				Checkbook.globals.security.authUser(
						row['acctName'] + " " + "PIN Code",
						row['lockedCode'],
						{
							"onSuccess": function() {

								enyo.Signals.send( nextAction, nextActionEvent );
							}
						}
					);
			} else {

				enyo.Signals.send( nextAction, nextActionEvent );
			}
		}

		return true;
	},

	editAccountComplete: function( rowIndex, inSender, inEvent ) {

		this.log();

		if( inEvent.action === 1 && inEvent.actionStatus === true ) {

			var self = this;

			//Let transactions page know
			Checkbook.globals.accountManager.fetchAccount(
					this.accounts[rowIndex]['acctId'],
					{
						"onSuccess": function() {

							enyo.Signals.send( "accountChanged", { "accountId": self.accounts[rowIndex]['acctId'] } );
						}
					}
				);
		} else if( inEvent.action === 2 ) {

			this.log( "Account deleted" );

			enyo.Signals.send( "accountChanged", { "accountId": this.accounts[rowIndex]['acctId'], "deleted": true } );
		}
	},

	reorder: function( inSender, toIndex, fromIndex ) {
		//Row moved

		if( toIndex != fromIndex && toIndex > -1 && toIndex < this.accounts.length ) {

			var temp = this.accounts.splice( fromIndex, 1 );
			var bottom = this.accounts.slice( toIndex );

			this.accounts.length = toIndex;
			this.accounts.push.apply( this.accounts, temp );
			this.accounts.push.apply( this.accounts, bottom );

			var qryOrder = [];

			for( var i = 0; i < this.accounts.length; i++ ) {

				qryOrder.push(
						Checkbook.globals.gts_db.getUpdate(
								"accounts",
								{ "sect_order": i },
								{ "rowid": this.accounts[i]['acctId'] }
							)
					);
			}

			if( Checkbook.globals.prefs['custom_sort'] !== 1 ) {

				Checkbook.globals.prefs['custom_sort'] = 1;

				qryOrder.push( new GTS.databaseQuery( { 'sql': "UPDATE prefs SET custom_sort = ?;", 'values': [ Checkbook.globals.prefs['custom_sort'] ] } ) );
			}

			Checkbook.globals.gts_db.queries( qryOrder );

			this.refresh();
		}
	},

	accountDeleted: function( inSender, inEvent ) {
		//Row deleted

		var self = this;

		Checkbook.globals.accountManager.deleteAccount(
				this.accounts[inEvent.index]['acctId'],
				{
					"onSuccess": function() {

		this.log();

						enyo.Signals.send( "accountChanged", { "accountId": self.accounts[inEvent.index]['acctId'], "deleted": true } );
					}
				}
			);

		return true;
	},

	/** List Display **/

	setupRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var item = inEvent.item;
		var row = this.accounts[index];

		if( row ) {

			row['index'] = index;

			item.$['accountItem'].addRemoveClass( "alt-row", ( row['index'] % 2 === 0 ) );
			item.$['accountItem'].addRemoveClass( "norm-row", ( row['index'] % 2 !== 0 ) );

			item.$['accountItem'].addRemoveClass( "hiddenAccount", ( row['hidden'] === 2 ) );
			item.$['accountItem'].addRemoveClass( "maskedAccount", ( row['hidden'] === 1 ) );

			item.$['icon'].setSrc( "assets/" + row['acctCategoryIcon'] );
			item.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 ) );

			item.$['name'].setContent( row['acctName'] );

			//Header balance view - override account default setting

			var view = ( this.balanceView === 4 ? row['bal_view'] : this.balanceView );

			switch( view ) {
				case 0:
					row['balance'] = row['balance0'];
					break;
				case 1:
					row['balance'] = row['balance1'];
					break;
				case 2:
					row['balance'] = row['balance2'];
					break;
				case 3:
					row['balance'] = row['balance3'];
					break;
				default:
					row['balance'] = 0;
			}

			row['balance'] = prepAmount( row['balance'] );

			item.$['balance'].setContent( formatAmount( row['balance'] ) );
			item.$['balance'].addRemoveClass( "positiveBalance", ( row['balance'] > 0 ) );
			item.$['balance'].addRemoveClass( "negativeBalance", ( row['balance'] < 0 ) );
			item.$['balance'].addRemoveClass( "neutralBalance", ( row['balance'] == 0 ) );

			item.$['note'].setContent( row['acctNotes'].replace( /\n/, "<br />" ) );

			//proper sort mode && difference between categories
			var showDivider = (
					( Checkbook.globals.prefs['custom_sort'] === 0 || Checkbook.globals.prefs['custom_sort'] === 3 ) &&
					( row['index'] <= 0 || row['acctCategory'] !== this.accounts[row['index'] - 1]['acctCategory'] )
				);

			item.$['catDivider'].setContent( row['acctCategory'] );
			item.$['catDivider'].canGenerate = showDivider;

/*
				"acctId"
				"acctName"
				"acctNotes"
				"acctCategory"
				"acctCategoryIcon"
				"balance"
				"balanceColor"
				"sort"
				"defaultAccount"
				"frozen"
				"hidden"
				"acctLocked"
				"lockedCode"
				"transDescMultiLine"
				"showTransTime"
				"useAutoComplete"
				"atmEntry"
				"auto_savings"
				"auto_savings_link"
				"bal_view"
				"runningBalance"
				"checkField"
				"hideNotes"
				"enableCategories"
				"hide_cleared"
*/
			return true;
		}
	}
});
