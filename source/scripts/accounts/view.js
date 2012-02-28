/* Copyright © 2011, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.accounts.view",
	kind: enyo.SlidingView,

	accounts: [],
	totalBalance: [ 0, 0, 0, 0, 0 ],
	balanceView: 4,

	events: {
		onModify: "",//Add/Edit Account
		onView: "",//View Account
		onChanged: "",//Edit made
		onDelete: ""//Deletion made
	},

	components: [
		{
			kind: enyo.PageHeader,
			components: [
				{
					kind: enyo.Image,
					src: "source/images/dollar_sign_1.png",
					className: "img-icon",
					style: "margin-right: 0.25em;"
				}, {
					content: $L( "Checkbook" ),
					className: "big enyo-text-ellipsis",
					style: "margin-top: -6px;",
					flex: 1
				}, {
					name: "overallBalance",
					kind: enyo.Button,
					content: "Balance",
					style: "padding: 0 8px; margin: 0;",
					onclick: "balanceButtonClicked"
				}
			]
		}, {
			name: "entries",
			kind: "Checkbook.accounts.list",
			flex: 1,
			balanceView: 4,

			editMode: false,

			onView: "doView",
			onModify: "doModify",
			onChanged: "accountChanged",
			onDelete: "accountDeleted"
		}, {
			kind: enyo.Toolbar,
			className: "rich-brown",
			components: [
				{
					kind: enyo.ToolButtonGroup,
					components: [
						{
							onclick: "showSort",
							icon: "source/images/menu_icons/sort.png",
							className: "enyo-grouped-toolbutton-dark"
						}
					]
				}, {
					kind: enyo.Spacer
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							name: "addAccountButton",
							onclick: "addAccount",
							toggling: true,
							icon: "source/images/menu_icons/new.png",
							className: "enyo-grouped-toolbutton-dark"
						}, {
							name: "editModeToggle",
							toggling: true,
							onclick: "toggleLock",
							icon: "source/images/menu_icons/lock.png",
							className: "enyo-grouped-toolbutton-dark"
						}
					]
				}, {
					kind: enyo.Spacer
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							showing: false,

							onclick: "showSearch",
							icon: "source/images/menu_icons/search.png",
							className: "enyo-grouped-toolbutton-dark"
						}
					]
				}
			]
		},

		{
			name: "balanceMenu",
			kind: "Checkbook.balanceMenu",
			onMenuItemClick: "menuItemClick"
		}, {
			name: "sortMenu",
			kind: "Checkbook.selectedMenu",
			components: accountSortOptions
		}, {
			name: "searchMenu",
			kind: "GTS.menu",
			components: [
				{
					caption: "Reports",
					menuParent: "searchMenu"
				}, {
					caption: "Budget",
					menuParent: "searchMenu"
				}, {
					caption: "Search",
					menuParent: "searchMenu"
				}
			]
		}
	],

	renderAccountList: function() {

		this.accountBalanceForceUpdate();
		this.$['entries'].renderAccountList();
	},

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

	accountChanged: function( inSender, account ) {

		this.doChanged( account );
		this.accountBalanceForceUpdate();
	},

	accountDeleted: function( inSender, account ) {

		this.doDelete( account );
		this.accountBalanceForceUpdate();
	},

	accountBalanceForceUpdate: function() {

		//build balance object
		enyo.application.accountManager.fetchOverallBalances( {
				"onSuccess": enyo.bind( this, this.buildBalanceButton, enyo.bind( this, this.renderBalanceButton ) )
			});
	},

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

	menuItemClick: function() {
		//All menu items come here

		//Normally 0 is spot of inSender; for Checkbook.balanceMenu 1 is spot of inSender
		var inSender = arguments[arguments.length === 2 ? 0 : 1];

		if( inSender.menuParent.toLowerCase() === "searchmenu" ) {
			//Search Menu

			if( inSender.value.toLowerCase() === "search" ) {

				this.log( "launch search system (overlay like modify account)" );
			} else if( inSender.value.toLowerCase() === "budget" ) {

				this.log( "launch budget system (overlay like modify account)" );
			} else if( inSender.value.toLowerCase() === "reports" ) {

				this.log( "launch report system (overlay like modify account)" );
			}
		} else if( inSender.menuParent.toLowerCase() === "accountsortoptions" ) {
			//Sort Menu

			if( enyo.application.checkbookPrefs['custom_sort'] === inSender.value ) {
				//No change, abort
				return;
			}

			enyo.application.checkbookPrefs['custom_sort'] = inSender.value;

			enyo.application.gts_db.query(
					new GTS.databaseQuery( { 'sql': "UPDATE prefs SET custom_sort = ?;", 'values': [ enyo.application.checkbookPrefs['custom_sort'] ] } ),
					{
						"onSuccess": enyo.bind( this, this.renderAccountList )
					}
				);
		} else if( inSender.menuParent.toLowerCase() === "balancemenu" ) {
			//Balance Menu

			this.balanceView = inSender.value;
			this.$['entries'].setBalanceView( inSender.value );
			this.$['entries'].refresh();

			this.renderBalanceButton();
		}
	},

	/** Header Control **/
	buildBalanceButton: function( callbackFn, results ) {

		this.totalBalance = results;

		if( enyo.isFunction( callbackFn ) ) {

			callbackFn();
		}
	},

	renderBalanceButton: function() {

		var balanceColor = "neutralBalance";
		if( this.totalBalance[this.balanceView] > 0 ) {

			balanceColor = "positiveBalance";
		} else if( this.totalBalance[this.balanceView] < 0 ) {

			balanceColor = "negativeBalance";
		}

		this.$['overallBalance'].setCaption( formatAmount( this.totalBalance[this.balanceView] ) );
		this.$['overallBalance'].setClassName( "enyo-button " + balanceColor );
	},

	balanceButtonClicked: function( inSender ) {

		this.$['balanceMenu'].setItems(
				[
					{
						caption: "Default:",
						balance: this.totalBalance[4],
						menuParent: "balanceMenu",
						value: 4
					}, {
						caption: "Available:",
						balance: this.totalBalance[0],
						menuParent: "balanceMenu",
						value: 0
					}, {
						caption: "Cleared:",
						balance: this.totalBalance[1],
						menuParent: "balanceMenu",
						value: 1
					}, {
						caption: "Pending:",
						balance: this.totalBalance[3],
						menuParent: "balanceMenu",
						value: 3
					}, {
						caption: "Final:",
						balance: this.totalBalance[2],
						menuParent: "balanceMenu",
						value: 2
					}
				],
				this.balanceView
			);

		this.$['balanceMenu'].openAtControl( inSender );
	},

	/** Footer Control **/
	showSort: function( inSender ) {

		this.$['sortMenu'].openAtControl( inSender, enyo.application.checkbookPrefs['custom_sort'] );
	},

	addAccount: function() {

		//Prevent user from launching multiple New Account windows
		if( this.$['addAccountButton'].getDepressed() && !this.$['addAccountButton'].getDisabled() ) {

			this.$['addAccountButton'].setDisabled( true );

			enyo.nextTick(
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

	addAccountComplete: function( inSender, action, actionStatus ) {

		this.$['addAccountButton'].setDepressed( false );
		this.$['addAccountButton'].setDisabled( false );

		if( action === 1 && actionStatus === true ) {

			this.log( "New account created" );

			this.renderAccountList();
		}
	},

	toggleLock: function() {

		if( this.$['editModeToggle'].getDepressed() ) {

			this.$['editModeToggle'].setIcon( "source/images/menu_icons/unlock.png" );
			this.$['entries'].setEditMode( true );
		} else {

			this.$['editModeToggle'].setIcon( "source/images/menu_icons/lock.png" );
			this.$['entries'].setEditMode( false );
		}
	},

	showSearch: function( inSender ) {

		this.$['searchMenu'].openAtControl( inSender );
	}
});