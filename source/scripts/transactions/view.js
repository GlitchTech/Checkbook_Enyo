/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.view",
	layoutKind: "FittableRowsLayout",

	account: {},

	/**
	 * @protected
	 * @type Array
	 * Components of the control
	 */
	components: [
		{
			name: "header",
			kind: "onyx.Toolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			noStretch: true,
			components: [
				{//Swap between icon for account & spinner when loading data in the background.
					name: "acctTypeIcon",
					kind: "enyo.Image",
					src: "assets/dollar_sign_1.png",
					classes: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					name: "loadingSpinner",
					kind: "onyx.Spinner",
					showing: false,
					classes: " img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					name: "acctName",
					content: "Checkbook",
					classes: "enyo-text-ellipsis",
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
			kind: "Checkbook.transactions.list",

			fit: true,
			classes: "checkbook-stamp",
			style: "position: relative;",

			ondragstart: "listDrag",
			ondrag: "listDrag",
			ondragfinish: "listDrag",

			onLoadingStart: "showLoadingIcon",
			onLoadingFinish: "hideLoadingIcon",

			onScrimShow: "showLoadingScrim",
			onScrimHide: "hideLoadingScrim"
		}, {
			name: "footer",
			kind: "onyx.MoreToolbar",
			classes: "deep-green",
			components: [
				{
					name: "backButton",
					kind: "onyx.Button",
					classes: "padding-none transparent",
					ontap: "fireBack",
					components: [
						{
							kind: "onyx.Icon",
							src: "assets/menu_icons/back.png"
						}
					]
				},{
					kind: "onyx.MenuDecorator",
					components: [
						{
							kind: "onyx.Button",
							classes: "padding-none transparent",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/sort.png"
								}
							]
						}, {
							name: "sortMenu",
							kind: "gts.SelectedMenu",
							floating: true,
							scrim: true,
							scrimclasses: "onyx-scrim-translucent",

							onChange: "transactionSortingChanged",

							style: "min-width: 225px;"
						}
					]
				}, {
					classes: "text-center",
					fit: true,
					components: [
						{
							name: "addIncomeButton",
							kind: "onyx.Button",

							ontap: "addIncome",
							classes: "margin-half-left margin-half-right padding-none transparent",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/income.png"
								}
							]
						}, {
							name: "addTransferButton",
							kind: "onyx.Button",

							ontap: "addTransfer",
							classes: "margin-half-left margin-half-right padding-none transparent",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/transfer.png"
								}
							]
						}, {
							name: "addExpenseButton",
							kind: "onyx.Button",

							ontap: "addExpense",
							classes: "margin-half-left margin-half-right padding-none transparent",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/expense.png"
								}
							]
						}
					]
				}, {
					kind: "onyx.MenuDecorator",
					components: [
						{
							kind: "onyx.Button",
							classes: "padding-none transparent",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/search.png"
								}
							]
						}, {
							kind: "onyx.Menu",
							floating: true,
							scrim: true,
							scrimclasses: "onyx-scrim-translucent",
							onSelect: "footerMenuSelected",
							components: [
								{
									content: "Refresh"
								}, {
									showing: false,
									classes: "onyx-menu-divider"
								}, {
									showing: false,
									content: "Reports"
								}, {
									showing: false,
									content: "Budget"
								}, {
									showing: false,
									content: "Search"
								}, {
									showing: false,
									classes: "onyx-menu-divider"
								}, {
									showing: false,
									content: "Purge"
								}, {
									showing: false,
									content: "Combine"
								}, {
									showing: false,
									content: "Clear Multiple"
								}
							]
						}
					]
				}
			]
		},

		{
			name: "loadingScrim",
			kind: "onyx.Scrim",
			classes: "onyx-scrim-translucent",

			style: "z-index: 1000;",

			components: [
				{
					kind: "onyx.Spinner",
					style: "size-double",

					style: "position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
				}
			]
		},

		{
			kind: "Signals",

			viewAccount: "viewAccount",
			accountChanged: "accountChanged",
			accountBalanceChanged: "balanceChanged"
		}
	],

	/**
	 * @protected
	 * @function
	 * @name gts.SelectorBar#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.$['header'].hide();
		this.$['footer'].hide();
	},

	/**
	 * @protected
	 * @function
	 * @name Checkbook.transactions.view#listDrag
	 *
	 * Prevent panels from interfering with swipe to delete
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	listDrag: function( inSender, inEvent ) {

		inEvent.preventDefault();
		return true;
	},

	accountChanged: function( inSender, inEvent ) {

		if( inEvent && inEvent.deleted && this.getAccountId() === inEvent.accountId ) {

			this.unloadSystem();
		} else {

			this.reloadSystem();
		}
	},

	viewAccount: function( inSender, inEvent ) {

		if( !inEvent['account'] || !inEvent['account']['acctId'] ) {

			this.unloadSystem();
			return;
		}

		this.$['backButton'].setShowing( enyo.Panels.isScreenNarrow() );
		this.showLoadingScrim();

		if( !this.account['acctId'] ) {

			this.$['header'].show();
			this.$['footer'].show();
		}

		if( inEvent['force'] || !this.account['acctId'] || this.account['acctId'] !== inEvent['account']['acctId'] ) {

			//Make a clone; else unable to modify account
			this.account = enyo.clone( inEvent['account'] );
			this.$['entries'].account = enyo.clone( this.account );

			this.$['acctName'].setContent( this.account['acctName'] );
			this.$['acctTypeIcon'].setSrc( "assets/" + this.account['acctCategoryIcon'] );

			this.renderBalanceButton();
			this.renderSortButton();

/*
				acctId
				acctName
				acctNotes
				acctCategory
				acctCategoryIcon
				balance
				balanceColor
				sort
				defaultAccount
				frozen
				hidden
				index
				acctLocked
				lockedCode
				transDescMultiLine
				showTransTime
				useAutoComplete
				atmEntry
				auto_savings
				auto_savings_link
				bal_view
				runningBalance
				checkField
				hideNotes
				enableCategories
				itemCount
				balance0
				balance1
				balance3
				balance2
				sortQry
*/
			this.$['entries'].reloadSystem();

			if( this.account['frozen'] === 1 ) {

				this.$['addIncomeButton'].setDisabled( true );
				this.$['addTransferButton'].setDisabled( true );
				this.$['addExpenseButton'].setDisabled( true );
			} else {

				this.$['addIncomeButton'].setDisabled( false );
				this.$['addTransferButton'].setDisabled( false );
				this.$['addExpenseButton'].setDisabled( false );
			}
		}

		this.hideLoadingScrim();

		this.$['header'].reflow();
		this.$['footer'].reflow();
		this.reflow();
	},

	getAccountId: function() {

		return this.account['acctId'];
	},

	setAccountIndex: function( index ) {

		this.account['index'] = index;
	},

	unloadSystem: function() {

		this.account = {};

		this.$['entries'].unloadSystem();

		this.$['header'].hide();
		this.$['footer'].hide();
	},

	reloadSystem: function() {

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		this.$['entries'].reloadSystem();

		this.balanceChanged();
	},

	balanceChanged: function( inSender, inEvent ) {

		var accounts = {
				"sendSignal": false
			};

		if( !inEvent || !inEvent['accounts'] || !inEvent['accounts']['account'] ) {

			accounts['account'] = this.account['acctId'];
		} else {

			enyo.mixin( accounts, inEvent['accounts'] );
		}

		if( typeof( accounts['accountBal'] ) !== "undefined" && accounts['accountBal'].length === 4 ) {

			var results = {
					"balance0": accounts['accountBal'][0],
					"balance1": accounts['accountBal'][1],
					"balance2": accounts['accountBal'][2],
					"balance3": accounts['accountBal'][3]
				};

			this.balanceChangedHandler( accounts, results );
		} else {

			this.balanceChangedHandler( accounts );
		}
	},

	balanceChangedHandler: function( accounts, results ) {

		if( !accounts ) {

			accounts = {
					"account": this.account['acctId'],
					"linkedAccount": -1
				};
		}

		if( !results ) {
			//If not called with results of new balance, fetch them

			Checkbook.globals.accountManager.fetchAccountBalance( this.account['acctId'], { "onSuccess": enyo.bind( this, this.balanceChangedHandler, accounts ) } );
			return;
		}

		//Update current account's balance
		this.account['balance0'] = prepAmount( results['balance0'] );
		this.account['balance1'] = prepAmount( results['balance1'] );
		this.account['balance2'] = prepAmount( results['balance2'] );
		this.account['balance3'] = prepAmount( results['balance3'] );

		this.renderBalanceButton();

		if( accounts['account'] == this.account['acctId'] ) {
			//current account is main account of transaction

			accounts['accountBal'] = {
					"balance0": this.account['balance0'],
					"balance1": this.account['balance1'],
					"balance2": this.account['balance2'],
					"balance3": this.account['balance3']
				};
		} else {

			accounts['accountBal'] = {};
		}

		if( typeof( accounts['sendSignal'] ) !== "undefined" && accounts['sendSignal'] === false ) {
			//sendSignal is defined AND set to false

			return;
		}

		enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );
	},

	/* Header Control */

	renderBalanceButton: function() {

		this.$['balanceMenu'].setChoices(
				[
					{
						content: "Available:",
						balance: this.account['balance0'],
						value: 0,
					}, {
						content: "Cleared:",
						balance: this.account['balance1'],
						value: 1
					}, {
						content: "Pending:",
						balance: this.account['balance3'],
						value: 3
					}, {
						content: "Final:",
						balance: this.account['balance2'],
						value: 2
					}
				]
			);

		this.$['balanceMenu'].setValue( this.account['bal_view'] );

		this.$['header'].reflow();
	},

	handleBalanceButton: function( inSender, inEvent ) {

		if( this.account['bal_view'] === inEvent.value ) {
			//No change, abort

			return true;
		}

		this.account['bal_view'] = inEvent.value;

		Checkbook.globals.accountManager.updateAccountBalView(
				this.account['acctId'],
				this.account['bal_view'],
				{
					"onSuccess": enyo.bind( this, this.renderBalanceButton )
				}
			);

		enyo.Signals.send(
				"balanceViewChanged",
				{
					"index": this.account['index'],
					"id": this.account['acctId'],
					"mode": this.account['bal_view'],
					"callbackFn": enyo.bind( this, this.setAccountIndex )
				}
			);

		return true;
	},

	/* Loading Indicators */

	showLoadingIcon: function() {

		this.$['acctTypeIcon'].hide();
		this.$['loadingSpinner'].show();
	},

	hideLoadingIcon: function() {

		this.$['loadingSpinner'].hide();
		this.$['acctTypeIcon'].show();
	},

	showLoadingScrim: function() {

		this.$['loadingScrim'].show();
	},

	hideLoadingScrim: function() {

		this.$['loadingScrim'].hide();
	},

	/* Footer Control */

	fireBack: function() {

		enyo.Signals.send( "onbackbutton" );
		return true;
	},

	renderSortButton: function() {

		if( transactionSortOptions.length <= 0 ) {

			Checkbook.globals.transactionManager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	buildTransactionSorting: function() {

		if( enyo.isArray( transactionSortOptions ) ) {

			this.$['sortMenu'].setChoices( transactionSortOptions );

			this.$['sortMenu'].setValue( this.account['sort'] );
		}
	},

	transactionSortingChanged: function( inSender, inEvent ) {

		if( this.account['sort'] === inEvent.value ) {
			//No change, abort

			return true;
		}

		this.account['sort'] = inEvent.value;
		this.account['sortQry'] = inEvent.qry;

		Checkbook.globals.accountManager.updateAccountSorting(
				this.account['acctId'],
				this.account['sort']
			);

		this.$['entries'].account = enyo.clone( this.account );

		this.$['entries'].reloadSystem();

		return true;
	},

	addIncome: function() {

		this.newTransaction( "Income" );
	},

	addTransfer: function() {

		this.newTransaction( "Transfer" );
	},

	addExpense: function() {

		this.newTransaction( "Expense" );
	},

	footerMenuSelected: function( inSender, inEvent ) {

		if( inEvent.content.toLowerCase() === "refresh" ) {

			var acctId = this.account['acctId'];
			this.$['entries'].rememberScrollPosition();

			Checkbook.globals.transactionManager.$['recurrence'].updateSeriesTransactions(
					acctId,
					{
						"onSuccess": function() {

							Checkbook.globals.accountManager.fetchAccount(
									acctId,
									{
										"onSuccess": function( account ) {

											enyo.Signals.send( "viewAccount", { "account": account, "force": true } );
										}
									}
								);
						}
					}
				);
		} else if( inEvent.content.toLowerCase() === "budget" ) {

			this.log( "Budget system go" );
			//enyo.Signals.send( "showBudget", { "acctId": this.account['acctId'] } );
		} else if( inEvent.content.toLowerCase() === "reports" ) {

			this.log( "Report system go" );
			//enyo.Signals.send( "showReport", { "acctId": this.account['acctId'] } );
		} else if( inEvent.content.toLowerCase() === "search" ) {

			this.log( "Search system go" );
			//enyo.Signals.send( "showSearch", { "acctId": this.account['acctId'] } );
		} else {

			this.log( inEvent.selected );
		}

		return true;
	},

	/* Transaction & List Control */

	newTransaction: function( type ) {

		//Prevent user from launching multiple New Transaction windows
		if( !( this.$['addIncomeButton'].getDisabled() || this.$['addTransferButton'].getDisabled() || this.$['addExpenseButton'].getDisabled() ) ) {

			this.toggleCreateButtons();
			this.showLoadingScrim();

			enyo.Signals.send(
					"modifyTransaction",
					{
						name: "createTransaction",
						kind: "Checkbook.transactions.modify",
						accountObj: this.account,
						trsnObj: {},
						transactionType: type.toLowerCase(),
						onFinish: enyo.bind( this, this.addTransactionComplete )
					}
				);
		}
	},

	addTransactionComplete: function( inSender, inEvent ) {

		if( inEvent['modifyStatus'] === 1 ) {

			delete inEvent['modifyStatus'];

			this.balanceChangedHandler( inEvent );

			//Reload full list
			this.account['itemCount']++;
			this.$['entries'].setItemCount( this.account['itemCount'] );
			this.$['entries'].reloadSystem();
		}

		this.toggleCreateButtons();
		enyo.asyncMethod( this, this.hideLoadingScrim );
	},

	toggleCreateButtons: function() {

		if( this.$['addIncomeButton'].getDisabled() ) {

			this.$['addIncomeButton'].setDisabled( false );
			this.$['addTransferButton'].setDisabled( false );
			this.$['addExpenseButton'].setDisabled( false );
		} else {

			this.$['addIncomeButton'].setDisabled( true );
			this.$['addTransferButton'].setDisabled( true );
			this.$['addExpenseButton'].setDisabled( true );
		}
	}
});
