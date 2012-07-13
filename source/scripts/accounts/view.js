/* Copyright © 2011-2012, GlitchTech Science */

/**
 * TODO DEFINITION
 */
enyo.kind( {
	name: "Checkbook.accounts.view",
	layoutKind: "FittableRowsLayout",

	accounts: [],
	totalBalance: [ 0, 0, 0, 0, 0 ],
	balanceView: 4,

	/**
	 * TODO DEFINITION
	 */
	events: {
		onModify: "",//Add/Edit Account
		onView: "",//View Account
		onChanged: "",//Edit made
		onDelete: ""//Deletion made
	},

	/**
	 * TODO DEFINITION
	 */
	components: [
		{
			name: "header",
			kind: "onyx.Toolbar",
			layoutKind: "FittableColumnsLayout",
			components: [
				{
					kind: enyo.Image,
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

			editMode: false,

			onView: "doView",
			onModify: "doModify",
			onChanged: "accountChanged",
			onDelete: "accountDeleted"
		}, {
			kind: "onyx.MoreToolbar",
			classes: "rich-brown text-center",
			components: [
				{
					kind: "onyx.IconButton",
					src: "assets/menu_icons/sort.png",

					ontap: "showSort"
				}, {
					name: "addAccountButton",
					kind: "onyx.Checkbox",

					onchange: "addAccount",
					classes: "add"
				}, {
					name: "editModeToggle",
					kind: "onyx.Checkbox",

					onchange: "toggleLock",
					classes: "lock"
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
			name: "sortMenu",
			//kind: "Checkbook.selectedMenu",
			components: accountSortOptions
		}
	],

	/**
	 * TODO DEFINITION
	 */
	handlers: {
		onSelect: "menuItemSelected"
	},

	/**
	 * TODO DEFINITION
	 */
	renderAccountList: function() {

		this.accountBalanceForceUpdate();
		this.$['entries'].renderAccountList();
	},

	/**
	 * TODO DEFINITION
	 */
	accountBalanceViewChanged: function( index, id, mode, callbackFn ) {

		if( !index || index < 0 || index >= this.$['entries'].accounts.length ) {

			for( var i = 0; i < this.$['entries'].accounts.length; i++ ) {

				if( this.$['entries'].accounts[i]['acctId'] === id ) {

					this.$['entries'].accounts[i]['bal_view'] = mode;

					if( enyo.isFunction( callbackFn ) ) {

						callbackFn( i );
					}
					break;
				}
			}
		} else {

			this.$['entries'].accounts[index]['bal_view'] = mode;
		}

		this.$['entries'].refresh();
	},

	/**
	 * TODO DEFINITION
	 */
	accountChanged: function( inSender, account ) {

		this.doChanged( account );
		this.accountBalanceForceUpdate();
	},

	/**
	 * TODO DEFINITION
	 */
	accountDeleted: function( inSender, inEvent ) {

		this.doDelete( inEvent );
		this.accountBalanceForceUpdate();

		return true;
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
	accountBalanceChanged: function( index, deltaBalanceArr ) {

		if( !Object.isNumber( index ) || index < 0 || index >= this.$['entries'].accounts.length ) {

			return;
		}

		this.$['entries'].accounts[index]['balance0'] = deltaBalanceArr[0];
		this.$['entries'].accounts[index]['balance1'] = deltaBalanceArr[1];
		this.$['entries'].accounts[index]['balance2'] = deltaBalanceArr[2];
		this.$['entries'].accounts[index]['balance3'] = deltaBalanceArr[3];

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
		} else if( menuParent === "accountsortoptions" ) {
			//Sort Menu

			if( Checkbook.globals.prefs['custom_sort'] === inEvent.content ) {
				//No change, abort
				return;
			}

			Checkbook.globals.prefs['custom_sort'] = inEvent.content;

			Checkbook.globals.gts_db.query(
					new GTS.databaseQuery( { 'sql': "UPDATE prefs SET custom_sort = ?;", 'values': [ Checkbook.globals.prefs['custom_sort'] ] } ),
					{
						"onSuccess": enyo.bind( this, this.renderAccountList )
					}
				);
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
						caption: "Default:",
						balance: this.totalBalance[4],
						value: 4
					}, {
						caption: "Available:",
						balance: this.totalBalance[0],
						value: 0
					}, {
						caption: "Cleared:",
						balance: this.totalBalance[1],
						value: 1
					}, {
						caption: "Pending:",
						balance: this.totalBalance[3],
						value: 3
					}, {
						caption: "Final:",
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
	showSort: function( inSender ) {

		this.$['sortMenu'].openAtControl( inSender, Checkbook.globals.prefs['custom_sort'] );
	},

	/**
	 * TODO DEFINITION
	 */
	addAccount: function() {

		//Prevent user from launching multiple New Account windows
		if( this.$['addAccountButton'].getChecked() && !this.$['addAccountButton'].getDisabled() ) {

			this.$['addAccountButton'].setDisabled( true );

			enyo.asyncMethod(
					this,
					this.doModify,
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

			this.log( "New account created" );

			this.renderAccountList();
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
