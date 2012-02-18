/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

/**
 * Checkbook.accounts.list ( Component )
 *
 * Account list display system
 *	Requires GTS.database to exist in enyo.application.gts_db
 *	Requires Checkbook.accounts.manager
 */

enyo.kind({
	name: "Checkbook.accounts.list",
	kind: enyo.VFlexBox,

	accounts: [],

	flex: 1,

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
			kind: "ReorderableVirtualList",

			flex: 1,

			onReorder: "reorder",
			onSetupRow: "handleSetupRow",

			components: [
				{
					name: "accountItem",
					className: "norm-row account-item",

					kind: enyo.SwipeableItem,
					layoutKind: enyo.VFlexLayout,

					tapHighlight: true,
					onclick: "accountTapped",
					onConfirm: "accountDeleted",

					components: [
						{
							name: "catDivider",
							kind: enyo.Divider,
							showing: false,
							onclick: "dividerTapped"
						}, {
							kind: enyo.HFlexBox,
							className: "account",
							align: "center",
							components: [
								{
									name: "icon",
									kind: enyo.Image,
									className: "accountIcon"
								}, {
									name: "iconLock",
									kind: enyo.Image,
									src: "source/images/padlock_1.png",
									className: "accountLockIcon unlocked"
								}, {
									name: "name",
									className: "enyo-text-ellipsis accountName",
									flex: 1
								}, {
									name: "balance"
								}
							]
						}, {
							name: "note",
							allowHtml: true,
							className: "note smaller enyo-text-ellipsis"
						}
					]
				}
			]
		},

		{
			name: "loadingScrim",
			kind: enyo.Scrim,
			layoutKind: enyo.VFlexLayout,
			align: "center",
			pack: "center",
			showing: true,
			components: [
				{
					kind: "xSpinnerLarge",
					showing: true
				}
			]
		}
	],

	rendered: function() {

		this.log();

		this.$['entries'].setReorderable( this.reorderable );

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

		enyo.application.accountManager.fetchAccounts(
				{
					"onSuccess": enyo.bind( this, this.dataResponse )
				}
			);
	},

	dataResponse: function( results ) {

		this.accounts = enyo.clone( results );

		//Reload list
		this.punt();

		//Hide loading scrim; heartbeat delay
		enyo.nextTick(
				this.$['loadingScrim'],
				this.$['loadingScrim'].hide
			);
	},

	punt: function() {

		this.$['entries'].punt();
	},

	refresh: function() {

		this.$['entries'].refresh();
	},

	dividerTapped: function( inSender, inEvent ) {
		//Not allowed, block action

		inEvent.stopPropagation();
	},

	accountTapped: function( inSender, inEvent, rowIndex ) {
		//Row Tapped

		var row = this.accounts[rowIndex];

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
							onFinish: enyo.bind( this, this.editAccountComplete, rowIndex )
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

				enyo.application.security.authUser(
						row['acctName'] + " " + $L( "PIN Code" ),
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
			enyo.application.accountManager.fetchAccount(
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
						enyo.application.gts_db.getUpdate(
								"accounts",
								{ "sect_order": i },
								{ "rowid": this.accounts[i]['acctId'] }
							)
					);
			}

			if( enyo.application.checkbookPrefs['custom_sort'] !== 1 ) {

				enyo.application.checkbookPrefs['custom_sort'] = 1;

				qryOrder.push( new GTS.databaseQuery( { 'sql': "UPDATE prefs SET custom_sort = ?;", 'values': [ enyo.application.checkbookPrefs['custom_sort'] ] } ) );
			}

			enyo.application.gts_db.queries( qryOrder );

			this.refresh();
		}
	},

	accountDeleted: function( inSender, rowIndex ) {
		//Row deleted

		enyo.application.accountManager.deleteAccount(
				this.accounts[rowIndex]['acctId'],
				{
					"onSuccess": enyo.bind( this, this.accountDeletedSuccess, this.accounts[rowIndex]['acctId'] )
				}
			);
	},

	accountDeletedSuccess: function( acctId ) {

		this.doDelete( acctId );
		this.renderAccountList();
	},

	/** List Display **/

	setupRow: function( inSender, inIndex ) {

		var row = this.accounts[inIndex];

		if( row ) {

			//this.$['accountItem'].addRemoveClass( "alt-row", ( inIndex % 2 === 0 ) );
			//this.$['accountItem'].addRemoveClass( "norm-row", ( inIndex % 2 !== 0 ) );

			row['index'] = inIndex;

			this.$['accountItem'].addRemoveClass( "hiddenAccount", ( row['hidden'] === 2 ) );
			this.$['accountItem'].addRemoveClass( "maskedAccount", ( row['hidden'] === 1 ) );

			this.$['icon'].setSrc( "source/images/" + row['acctCategoryIcon'] );
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
					enyo.application.checkbookPrefs['custom_sort'] === 0 ||
					enyo.application.checkbookPrefs['custom_sort'] === 3
				) && (
					inIndex <= 0 ||
					row['acctCategory'] !== this.accounts[inIndex - 1]['acctCategory']
				) ) {

				this.$['catDivider'].setShowing( true );
				this.$['catDivider'].setCaption( row['acctCategory'] );
			} else {

				this.$['catDivider'].setShowing( false );
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