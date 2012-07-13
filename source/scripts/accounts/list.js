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

		onView: "",
		onModify: "",
		onChanged: "",
		onDelete: ""
	},

	published: {
		//pageSize: 15,
		balanceView: 4,

		editMode: false,
		reorderable: true
	},

	components: [
		{
			name: "entries",
			kind: "enyo.List",

			classes: "enyo-fit",

			onReorder: "reorder",
			onSetupItem: "handleSetupRow",

			components: [
				{
					name: "accountItem",
					classes: "bordered norm-row account-item",

					kind: "onyx.SwipeableItem",

					ontap: "accountTapped",
					onConfirm: "accountDeleted",

					components: [
						{
							name: "catDivider",
							kind: enyo.Divider,
							showing: false,
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
		}
	],

	rendered: function() {

		this.log();

		//this.$['entries'].setReorderable( this.reorderable );

		this.inherited( arguments );
	},

	/** Event Handlers **/

	handleSetupRow: function() {

		if( enyo.isFunction( this.doSetupRow ) && this.onSetupRow !== "" ) {

			return( this.doSetupRow.apply( this, arguments ) );
		} else {

			return( this.setupRow.apply( this, arguments ) );
		}
	},

	/** List Control **/

	renderAccountList: function() {

		this.accounts = [];

		Checkbook.globals.accountManager.fetchAccounts(
				{
					"onSuccess": enyo.bind( this, this.dataResponse )
				}
			);
	},

	dataResponse: function( results ) {

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

		this.$['entries'].setCount( this.accounts.length );
		this.refresh();
	},

	refresh: function() {

		this.$['entries'].refresh();
	},

	dividerTapped: function( inSender, inEvent ) {
		//Not allowed, block action

		inEvent.preventDefault();
		return true;
	},

	accountTapped: function( inSender, inEvent ) {
		//Row Tapped

		var row = this.accounts[inEvent.rowIndex];

		if( row ) {

			var nextAction;

			if( this.editMode ) {
				//Edit Account

				nextAction = enyo.bind(
						this,
						this.doModify,
						{
							name: "editAccount",
							kind: "Checkbook.accounts.modify",
							acctId: row['acctId'],
							onFinish: enyo.bind( this, this.editAccountComplete, inEvent.rowIndex )
						}
					);
			} else {
				//View Account

				nextAction = enyo.bind(
						this,
						this.doView,
						row
					);
			}

			if( row['acctLocked'] == 1 ) {

				Checkbook.globals.security.authUser(
						row['acctName'] + " " + "PIN Code",
						row['lockedCode'],
						{
							"onSuccess": nextAction
						}
					);
			} else {

				nextAction();
			}
		}
	},

	editAccountComplete: function( rowIndex, inSender, action, actionStatus ) {

		if( action === 1 && actionStatus === true ) {

			this.log( "Account edited" );

			//Let transactions page know
			Checkbook.globals.accountManager.fetchAccount(
					this.accounts[rowIndex]['acctId'],
					{
						"onSuccess": enyo.bind( this, this.doChanged )
					}
				);

			this.renderAccountList();
		} else if( action === 2 ) {

			this.log( "Account deleted" );

			this.doDelete( this.accounts[rowIndex]['acctId'] );

			this.renderAccountList();
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

	accountDeleted: function( inSender, rowIndex ) {
		//Row deleted

		this.log( arguments );

		Checkbook.globals.accountManager.deleteAccount(
				this.accounts[rowIndex]['acctId'],
				{
					"onSuccess": enyo.bind( this, this.accountDeletedSuccess, this.accounts[rowIndex]['acctId'] )
				}
			);

		return true;
	},

	accountDeletedSuccess: function( acctId ) {

		this.log();

		this.doDelete( acctId );
		this.renderAccountList();
	},

	/** List Display **/

	setupRow: function( inSender, inEvent ) {

		var index = inEvent.index;

		var row = this.accounts[index];

		if( row ) {

			//this.$['accountItem'].addRemoveClass( "alt-row", ( index % 2 === 0 ) );
			//this.$['accountItem'].addRemoveClass( "norm-row", ( index % 2 !== 0 ) );

			row['index'] = index;

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
			this.$['balance'].addRemoveClass( "positiveFunds", ( row['balance'] > 0 ) );
			this.$['balance'].addRemoveClass( "negativeFunds", ( row['balance'] < 0 ) );
			this.$['balance'].addRemoveClass( "neutralFunds", ( row['balance'] == 0 ) );

			this.$['note'].setContent( row['acctNotes'] );

			//proper sort mode && difference between categories
			if( (
					Checkbook.globals.prefs['custom_sort'] === 0 ||
					Checkbook.globals.prefs['custom_sort'] === 3
				) && (
					index <= 0 ||
					row['acctCategory'] !== this.accounts[index - 1]['acctCategory']
				) ) {

				this.$['catDivider'].show();
				this.$['catDivider'].setContent( row['acctCategory'] );
			} else {

				this.$['catDivider'].hide();
			}

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
