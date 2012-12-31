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
//	layoutKind: "FittableRowsLayout",
	classes: "v-box",//don't want to use this here, but FittableRowsLayout is causing trouble

	accounts: [],
	totalBalance: [ 0, 0, 0, 0, 0 ],
	balanceView: 4,

	/**
	 * @protected
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
			classes: "box-flex-1",

			balanceView: 4,

			editMode: false,

			onLoadStart: "showLoading",
			onLoadStop: "hideLoading"
		}, {
			kind: "onyx.MoreToolbar",
			classes: "rich-brown",
			components: [
				/*
				planned design once search system is functional
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
							kind: "onyx.IconButton",
							src: "assets/menu_icons/new.png",

							ontap: "addAccount",
							classes: "add"
						}, {
							name: "editModeToggle",
							kind: "onyx.ToggleIconButton",
							src: "assets/menu_icons/lock.png?1=2",

							ontap: "toggleLock"
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
				}*/
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
							kind: "onyx.Button",

							ontap: "addAccount",

							classes: "padding-none",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/new.png"
								}
							]
						}
					]
				}, {
					components: [
						{
							name: "editModeToggle",
							kind: "onyx.ToggleIconButton",
							src: "assets/menu_icons/lock.png?1=2",

							ontap: "toggleLock"
						}
					]
				}
			]
		},

		{
			name: "loadingScrim",
			kind: "onyx.Scrim",
			classes: "onyx-scrim-translucent",

			showing: true,
			style: "z-index: 1000;"
		}, {
			name: "loadingSpinner",
			kind: "onyx.Spinner",
			style: "size-double",

			showing: false,
			style: "z-index: 10001; position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
		},

		{
			kind: "Signals",

			accountChanged: "renderAccountList",
			accountSortOptionChanged: "updateSortMenu",
			balanceViewChanged: "accountBalanceViewChanged",
			accountBalanceChanged: "accountBalanceForceUpdate"
		}
	],

	/**
	 * @protected
	 * List of events to handle
	 */
	handlers: {
		onSelect: "menuItemSelected"
	},

	/**
	 * @protected
	 * @name Checkbook.accounts.view#renderAccountList
	 *
	 * Called to force an update to the account lists and balance.
	 */
	renderAccountList: function() {

		this.accountBalanceForceUpdate();
		this.updateSortMenu();
	},

	/**
	 * @protected
	 * @name Checkbook.accounts.view#showLoading
	 *
	 * Shows scrim & spinner.
	 */
	showLoading: function() {

		this.$['loadingScrim'].show();
		this.$['loadingSpinner'].show();
	},

	/**
	 * @protected
	 * @name Checkbook.accounts.view#hideLoading
	 *
	 * Hides scrim & spinner.
	 */
	hideLoading: function() {

		this.$['loadingScrim'].hide();
		this.$['loadingSpinner'].hide();
	},

	/**
	 * TODO DEFINITION
	 */
	accountBalanceViewChanged: function( inSender, inEvent ) {

		if( typeof( inEvent.index ) === "undefined" || inEvent.index < 0 || inEvent.index >= this.$['entries'].accounts.length ) {

			for( var i = 0; i < this.$['entries'].accounts.length; i++ ) {

				if( this.$['entries'].accounts[i]['acctId'] === inEvent.id ) {

					this.$['entries'].accounts[i]['bal_view'] = inEvent.mode;
					inEvent.index = i;
					break;
				}
			}
		} else {

			this.$['entries'].accounts[inEvent.index]['bal_view'] = inEvent.mode;
		}

		this.$['entries'].refresh();

		if( enyo.isFunction( inEvent.callbackFn ) ) {

			inEvent.callbackFn( inEvent.index );
		}
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
							enyo.Signals.send( "accountSortChanged" );
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
	updateSortMenu: function() {

		this.$['sortMenu'].setValue( Checkbook.globals.prefs['custom_sort'] );
	},

	/**
	 * TODO DEFINITION
	 */
	addAccount: function() {

		//Prevent user from launching multiple New Account windows
		if( !this.$['addAccountButton'].getDisabled() ) {

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

		this.$['addAccountButton'].setDisabled( false );

		if( inEvent['action'] === 1 && inEvent['actionStatus'] === true ) {

			enyo.Signals.send( "accountChanged" );
		}
	},

	/**
	 * TODO DEFINITION
	 */
	toggleLock: function() {

		if( this.$['editModeToggle'].getActive() ) {

			this.$['entries'].setEditMode( true );
		} else {

			this.$['entries'].setEditMode( false );
		}
	}
});
