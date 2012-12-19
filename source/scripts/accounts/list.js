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

	fit: true,
	style: "position: relative;",

	accounts: [],

	events: {
		onSetupRow: "",

		onLoadStart: "",
		onLoadStop: ""
	},

	published: {
		balanceView: 4,

		editMode: false,
		reorderable: true,

		horizontal: "hidden"
	},

	components: [
		{
			name: "entries",
			kind: "enyo.List",

			fit: true,
			classes: "enyo-fit",

			reorderable: true,
			enableSwipe: true,

			onSetupItem: "handleSetupRow",
			onReorder: "listReorder",
			onSetupReorderComponents: "setupReorderComponents",
			onSetupPinnedReorderComponents: "setupPinnedReorderComponents",
			onSetupSwipeItem: "setupSwipeItem",
			onSwipeComplete: "swipeComplete",

			components: [
				{
					name: "accountItem",
					classes: "bordered norm-row account-item",

					kind: "GTS.Item",
					tapPulse: false,
					tapHighlight: false,

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
									kind: "enyo.Image",
									classes: "accountIcon"
								}, {
									name: "iconLock",
									kind: "enyo.Image",
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
			],

			reorderComponents: [
				{
					name: "reorderContent",
					classes: "deep-green-trans account padding-std",
					components: [
						{
							classes: "h-box box-align-center",
							components: [
								{
									name: "reorderIcon",
									kind: "enyo.Image",
									classes: "accountIcon"
								}, {
									name: "reorderName",
									classes: "text-ellipsis accountName box-flex-1"
								}
							]
						}, {
							name: "reorderCategory",
							classes: "smaller"
						}
					]
				}
			],

			pinnedReorderComponents: [
				{
					name: "pinnedReorderItem",
					classes: "rich-brown-trans h-box box-align-center account padding-std",
					components: [
						{
							classes: "box-flex-1",
							components: [
								{
									classes: "h-box box-align-center",
									components: [
										{
											name: "pinIcon",
											kind: "enyo.Image",
											classes: "accountIcon"
										}, {
											name: "pinName",
											classes: "text-ellipsis accountName box-flex-1"
										}
									]
								}, {
									name: "pinCategory",
									classes: "smaller"
								}
							]
						}, {
							kind: "onyx.Button",
							ontap: "dropPinnedRow",
							content: "Drop"
						}
					]
				}
			],

			swipeableComponents: [
				{
					name: "swipeItem",
					style: "background-color: rgba( 0, 160, 40, 0.8 ); color: white;",
					classes: "enyo-fit",
					components: [
						{
							name: "swipeTitle",
							style: "font-size: 30px; font-weight: bold; color: #fff; line-height: 80px; text-transform: capitalize;",
							classes: "text-center padding-none margin-none"
						}
					]
				}
			]
		},

		{
			kind: "Signals",

			accountChanged: "renderAccountList",
			balanceChanged: "refresh",
			accountBalanceChanged: "accountBalanceChanged"
		}
	],

	/** List Control **/

	renderAccountList: function() {

		this.log();

		this.doLoadStart();

		this.accounts = [];

		Checkbook.globals.accountManager.fetchAccounts(
				{
					"onSuccess": enyo.bind( this, this.dataResponse )
				}
			);
	},

	dataResponse: function( results ) {

		this.accounts = enyo.clone( results );

		this.refresh();

		enyo.asyncMethod( this, this.doLoadStop );
	},

	refresh: function() {

		this.log();

		this.$['entries'].setCount( this.accounts.length );
		this.$['entries'].refresh();
	},

	renderRow: function( index ) {

		if( typeof( index ) !== "undefined" && !isNaN( index ) ) {

			this.$['entries'].renderRow( index );
		}
	},

	/** List Events **/

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

	setupReorderComponents: function( inSender, inEvent ) {

		var row = this.accounts[inEvent.index];

		if( row ) {

			this.$['reorderName'].setContent( row['acctName'] );
			this.$['reorderCategory'].setContent( row['acctCategory'] );
			this.$['reorderIcon'].setSrc( "assets/" + row['acctCategoryIcon'] );
		}
	},

	listReorder: function( inSender, inEvent ) {

		this.log( arguments );
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

	setupPinnedReorderComponents: function( inSender, inEvent ) {

		var row = this.accounts[inEvent.index];

		if( row ) {

			this.$['pinName'].setContent( row['acctName'] );
			this.$['pinCategory'].setContent( row['acctCategory'] );
			this.$['pinIcon'].setSrc( "assets/" + row['acctCategoryIcon'] );
		}
	},

    //* Called when the "Drop" button is pressed on the pinned placeholder row
    dropPinnedRow: function (inSender, inEvent) {

        this.$['entries'].dropPinnedRow( inEvent );
    },

	setupSwipeItem: function( inSender, inEvent ) {

		this.log( arguments );
	},

	swipeComplete: function( inSender, inEvent ) {

		this.log( arguments );
	},

	accountDeleted: function( inSender, inEvent ) {
		//Row deleted

		var self = this;

		Checkbook.globals.accountManager.deleteAccount(
				this.accounts[inEvent.index]['acctId'],
				{
					"onSuccess": function() {

						enyo.Signals.send( "accountChanged", { "accountId": self.accounts[inEvent.index]['acctId'], "deleted": true } );
					}
				}
			);

		return true;
	},

	/**
	 * @protected
	 * @name Checkbook.accounts.view#handleSetupRow
	 *
	 * Determines row rendering handler
	 *
	 * @param {inSender}
	 * @param {inEvent}
	 */
	handleSetupRow: function( inSender, inEvent ) {

		if( enyo.isFunction( this.doSetupRow ) && this.onSetupRow !== "" ) {

			return( this.doSetupRow( inEvent ) );
		} else {

			return( this.setupRow( inSender, inEvent ) );
		}
	},

	/**
	 * @protected
	 * @name Checkbook.accounts.view#setupRow
	 *
	 * Renders each list item row (unless overridden from parent)
	 *
	 * @param {inSender}
	 * @param {inEvent}
	 */
	setupRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var row = this.accounts[index];

		if( row ) {

			row['index'] = index;

			this.$['accountItem'].addRemoveClass( "alt-row", ( row['index'] % 2 === 0 ) );
			this.$['accountItem'].addRemoveClass( "norm-row", ( row['index'] % 2 !== 0 ) );

			this.$['accountItem'].addRemoveClass( "hiddenAccount", ( row['hidden'] === 2 ) );
			this.$['accountItem'].addRemoveClass( "maskedAccount", ( row['hidden'] === 1 ) );

			this.$['icon'].setSrc( "assets/" + row['acctCategoryIcon'] );
			this.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 ) );

			this.$['name'].setContent( row['acctName'] );

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

			this.$['balance'].setContent( formatAmount( row['balance'] ) );
			this.$['balance'].addRemoveClass( "positiveBalance", ( row['balance'] > 0 ) );
			this.$['balance'].addRemoveClass( "negativeBalance", ( row['balance'] < 0 ) );
			this.$['balance'].addRemoveClass( "neutralBalance", ( row['balance'] == 0 ) );

			this.$['note'].setContent( row['acctNotes'].replace( /\n/, "<br />" ) );

			//proper sort mode && difference between categories
			var showDivider = (
					( Checkbook.globals.prefs['custom_sort'] === 0 || Checkbook.globals.prefs['custom_sort'] === 3 ) &&
					( row['index'] <= 0 || row['acctCategory'] !== this.accounts[row['index'] - 1]['acctCategory'] )
				);

			this.$['catDivider'].setContent( row['acctCategory'] );
			this.$['catDivider'].canGenerate = showDivider;

			return true;
		}
	},

	/** Other Events **/

	/**
	 * @protected
	 *
	 * Update balance for recently changed account.
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

				if( typeof( inEvent['accountBal'] ) !== "undefined" && GTS.Object.size( inEvent['accountBal'] ) > 0 ) {

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
	}
});
