/* Copyright � 2011-2012, GlitchTech Science */

/**
 * @name Checkbook.accounts.view
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * View pane for Accounts
 *
 * @class
 * @version 2.0 (2012/07/16)
 */
enyo.kind( {
	name: "Checkbook.accounts.view",
	layoutKind: "FittableRowsLayout",

	accounts: [],
	totalBalance: [ 0, 0, 0, 0, 0 ],
	balanceView: 4,

	/**
	 * @private
	 * @type Array
	 * Components of the control
	 */
	components: [
		{
			name: "header",
			kind: "onyx.Toolbar",
			layoutKind: "FittableColumnsLayout",
			components: [
				{
					kind: "enyo.Image",
					src: "assets/dollar_sign_1.png",
					classes: "img-icon",
					style: "margin-right: 0.25em; height: 32px;"
				}, {
					content: "Checkbook",
					classes: "big enyo-text-ellipsis",
					fit: true
				}, {
					name: "balanceMenu",
					kind: "Checkbook.balanceMenu",

					onChange: "handleBalanceButton",

					style: "padding: 0 8px; margin: 0;"
				}
			]
		}, {
			name: "entries",
			kind: "Checkbook.accounts.list",
			fit: true,

			balanceView: 4,

			editMode: false
		}, {
			kind: "onyx.Toolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			classes: "rich-brown",
			components: [
				{
					kind: "onyx.MenuDecorator",
					components: [
						{
							kind: "onyx.IconButton",
							src: "assets/menu_icons/sort.png"
						}, {
							name: "sortMenu",
							kind: "GTS.SelectedMenu",
							floating: true,
							style: "min-width: 225px;",
							components: accountSortOptions
						}
					]
				}, {
					classes: "text-center",
					fit: true,
					components: [
						{
							name: "addAccountButton",
							kind: "onyx.Checkbox",

							onchange: "addAccount",
							classes: "add"
						}, {
							name: "editModeToggle",
							kind: "onyx.Checkbox",

							onchange: "toggleLock",
							classes: "lock"
						}
					]
				}, {
					showing: false,

					kind: "onyx.MenuDecorator",
					components: [
						{
							kind: "onyx.IconButton",
							src: "assets/menu_icons/search.png"
						}, {
							kind: "onyx.Menu",
							floating: true,
							components: [
								{
									content: "Reports",
									menuParent: "searchMenu"
								}, {
									content: "Budget",
									menuParent: "searchMenu"
								}, {
									content: "Search",
									menuParent: "searchMenu"
								}
							]
						}
					]
				}
			]
		},

		{
			kind: "Signals",

			accountChanged: "renderAccountList",
			balanceChanged: "refresh",
			balanceViewChanged: "accountBalanceViewChanged",
			accountBalanceChanged: "accountBalanceChanged"
		}
	],

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		onSelect: "menuItemSelected"
	},

	/**
	 * @protected
	 * @function
	 * @name Checkbook.accounts.view#renderAccountList
	 *
	 * Called to force an update to the account lists and balance.
	 */
	renderAccountList: function() {

		this.accountBalanceForceUpdate();

		this.$['sortMenu'].setValue( Checkbook.globals.prefs['custom_sort'] );
	},

	/**
	 * TODO DEFINITION
	 */
	accountBalanceViewChanged: function( inSender, inEvent ) {

		if( Object.isUndefined( inEvent.index ) || inEvent.index < 0 || inEvent.index >= this.$['entries'].accounts.length ) {

			for( var i = 0; i < this.$['entries'].accounts.length; i++ ) {

				if( this.$['entries'].accounts[i]['acctId'] === inEvent.id ) {

					this.$['entries'].accounts[i]['bal_view'] = inEvent.mode;

					if( enyo.isFunction( inEvent.callbackFn ) ) {

						inEvent.callbackFn( i );
					}
					break;
				}
			}
		} else {

			this.$['entries'].accounts[inEvent.index]['bal_view'] = inEvent.mode;
		}

		this.$['entries'].refresh();
	},

	/**
	 * TODO DEFINITION
	 */
	accountBalanceForceUpdate: function() {

		//build balance object
		Checkbook.globals.accountManager.fetchOverallBalances( {
				"onSuccess": enyo.bind( this, this.buildBalanceButton, enyo.bind( this, this.renderBalanceButton ) )
			});
	},

	/**
	 * TODO DEFINITION
	 */
	accountBalanceChanged: function( inSender, inEvent ) {

		this.log( arguments );
		return;

		if( !Object.isNumber( index ) || index < 0 || index >= this.$['entries'].accounts.length ) {

			return;
		}

		this.$['entries'].accounts[index]['balance0'] = deltaBalanceArr[0];
		this.$['entries'].accounts[index]['balance1'] = deltaBalanceArr[1];
		this.$['entries'].accounts[index]['balance2'] = deltaBalanceArr[2];
		this.$['entries'].accounts[index]['balance3'] = deltaBalanceArr[3];

		this.$['entries'].refresh();
		this.accountBalanceForceUpdate();
	//},

	//accountBalanceChanged: function( inSender, accts, deltaBalanceArr ) {

		var acctIndex = accts['account'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( accts['account'] ) : - 1;

		if( acctIndex >= 0 ) {

			if( accts['accountBal'].length > 0 ) {

				this.$['accounts'].accountBalanceChanged(
						acctIndex,
						accts['accountBal']
					);
			} else {

				Checkbook.globals.accountManager.fetchAccountBalance( accts['account'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['account'], acctIndex ) } );
			}
		}

		var linkedIndex = accts['linkedAccount'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( accts['linkedAccount'] ) : - 1;

		if( linkedIndex >= 0 ) {

			Checkbook.globals.accountManager.fetchAccountBalance( accts['linkedAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['linkedAccount'], linkedIndex ) } );
		}

		var atIndex = accts['atAccount'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( accts['atAccount'] ) : - 1;

		if( atIndex >= 0 ) {

			Checkbook.globals.accountManager.fetchAccountBalance( accts['atAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['atAccount'], atIndex ) } );
		}
	},

	accountBalanceChangedHandler: function( index, results ) {

		if( !Object.isNumber( index ) || index < 0 || index >= this.$['entries'].accounts.length ) {

			return;
		}

		this.$['entries'].accounts[index]['balance0'] = newBal[0];
		this.$['entries'].accounts[index]['balance1'] = newBal[1];
		this.$['entries'].accounts[index]['balance2'] = newBal[2];
		this.$['entries'].accounts[index]['balance3'] = newBal[3];

		this.$['entries'].refresh();
		this.accountBalanceForceUpdate();
	},

	/**
	 * TODO DEFINITION
	 */
	menuItemSelected: function( inSender, inEvent ) {
		//All menu items come here

		if( !inEvent.selected ) {

			return;
		}

		var menuParent = inEvent.selected.menuParent.toLowerCase();

		if( menuParent === "searchmenu" ) {
			//Search Menu

			var item = inEvent.content.toLowerCase();

			if( item === "search" ) {

				this.log( "launch search system (overlay like modify account)" );
			} else if( item === "budget" ) {

				this.log( "launch budget system (overlay like modify account)" );
			} else if( item === "reports" ) {

				this.log( "launch report system (overlay like modify account)" );
			}

			return true;
		} else if( menuParent === "accountsortoptions" ) {
			//Sort Menu

			if( Checkbook.globals.prefs['custom_sort'] === inEvent.selected.value ) {
				//No change, abort
				return;
			}

			Checkbook.globals.prefs['custom_sort'] = inEvent.selected.value;

			Checkbook.globals.gts_db.query(
					new GTS.databaseQuery( { 'sql': "UPDATE prefs SET custom_sort = ?;", 'values': [ Checkbook.globals.prefs['custom_sort'] ] } ),
					{
						"onSuccess": function() {

							Checkbook.globals.accountManager.updateAccountModTime();
							enyo.Signals.send( "accountChanged" );
						}
					}
				);

			return true;
		}
	},

	/** Header Control **/

	/**
	 * TODO DEFINITION
	 */
	buildBalanceButton: function( callbackFn, results ) {

		this.totalBalance = results;

		if( enyo.isFunction( callbackFn ) ) {

			callbackFn();
		}
	},

	/**
	 * TODO DEFINITION
	 */
	renderBalanceButton: function() {

		this.$['balanceMenu'].setChoices(
				[
					{
						content: "Default:",
						balance: this.totalBalance[4],
						value: 4
					}, {
						content: "Available:",
						balance: this.totalBalance[0],
						value: 0
					}, {
						content: "Cleared:",
						balance: this.totalBalance[1],
						value: 1
					}, {
						content: "Pending:",
						balance: this.totalBalance[3],
						value: 3
					}, {
						content: "Final:",
						balance: this.totalBalance[2],
						value: 2
					}
				]
			);

		this.$['balanceMenu'].setValue( this.balanceView );

		this.$['header'].reflow();
	},

	handleBalanceButton: function( inSender, inEvent ) {

		this.balanceView = inEvent.value;

		this.$['entries'].setBalanceView( this.balanceView );
		this.$['entries'].refresh();
	},

	/** Footer Control **/

	/**
	 * TODO DEFINITION
	 */
	addAccount: function() {

		//Prevent user from launching multiple New Account windows
		if( this.$['addAccountButton'].getChecked() && !this.$['addAccountButton'].getDisabled() ) {

			this.$['addAccountButton'].setDisabled( true );

			enyo.Signals.send(
					"modifyAccount",
					{
						name: "newAccount",
						kind: "Checkbook.accounts.modify",
						acctId: -1,
						onFinish: enyo.bind( this, this.addAccountComplete )
					}
				);
		}
	},

	/**
	 * TODO DEFINITION
	 */
	addAccountComplete: function( inSender, inEvent ) {

		this.$['addAccountButton'].setChecked( false );
		this.$['addAccountButton'].setDisabled( false );

		if( inEvent['action'] === 1 && inEvent['actionStatus'] === true ) {

			enyo.Signals.send( "accountChanged" );
		}
	},

	/**
	 * TODO DEFINITION
	 */
	toggleLock: function() {

		if( this.$['editModeToggle'].getChecked() ) {

			this.$['entries'].setEditMode( true );
		} else {

			this.$['entries'].setEditMode( false );
		}
	}
});
