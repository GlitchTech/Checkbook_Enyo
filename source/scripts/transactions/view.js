/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.view",
	kind: enyo.SlidingView,

	transactions: [],
	account: {},

	events: {
		onModify: "",//Add/Edit Transaction
		onChanged: "",//Edit Made
		onBalanceViewChanged: "",//Balance mode changed

		onBudgetView: "",//Show Budget Pane
		onSearchView: "",//Show Search Pane
	},

	components: [
		{
			kind: enyo.PageHeader,
			components: [
				{//Swap between icon for account & spinner when loading data in the background.
					showing: true,

					name: "acctTypeIcon",
					kind: enyo.Image,
					src: "assets/dollar_sign_1.png",
					className: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					showing: false,

					name: "loadingSpinner",
					kind: "GTS.Spinner",
					className: "img-icon",
					style: "margin: 0px 15px 5px 0;"
				}, {
					name: "acctName",
					content: "Checkbook",
					className: "bigger enyo-text-ellipsis",
					style: "margin-top: -6px;",
					flex: 1
				}, {
					name: "balanceButton",
					kind: enyo.Button,
					style: "padding: 0 8px; margin: 0;",
					caption: "Balance",
					onclick: "balanceButtonClicked"
				}
			]
		}, {
			name: "entries",
			kind: enyo.VirtualList,

			flex: 1,
			className: "checkbook-stamp",

			onSetupRow: "transactionBuildRow",
			onAcquirePage: "transactionFetchGroup",

			components: [
				{
					kind: enyo.SwipeableItem,

					tapHighlight: true,
					onclick: "transactionTapped",
					onmousehold: "transactionHeld",
					onConfirm: "transactionDeleted",

					style: "padding-right: 20px; padding-left: 30px;",

					//Vertical Layout
					components: [
						{
							name: "mainBody",
							layoutKind: enyo.HFlexLayout,
							className: "transactionItemTop",

							components: [
								{
									flex: 1,
									//Vertical Layout
									components: [
										{
											name: "desc",
											className: "description enyo-text-ellipsis bold"
										}, {
											name: "time",
											className: "date smaller"
										}
									]
								}, {
									//Vertical Layout
									style: "text-align: right;",

									components: [
										{
											name: "amount"
										}, {
											name: "runningBal"
										}
									]
								}, {
									name: "cleared",
									onclick: "transactionCleared",
									kind: enyo.CheckBox,

									style: "margin-left: 15px;"
								}
							]
						}, {
							name: "category",
							allowHtml: true
						}, {
							name: "checkNum",
							className: "small"
						}, {
							name: "note",
							className: "small",
							allowHtml: true
						}
					]
				}
			]
		}, {
			kind: enyo.Toolbar,
			className: "deep-green",
			components: [
				{
					kind: enyo.GrabButton
				}, {
					kind: enyo.ToolButtonGroup,
					style: "margin-left: 50px;",
					components: [
						{
							onclick: "sortButtonClicked",
							icon: "assets/menu_icons/sort.png",
							className: "enyo-grouped-toolbutton-dark"
						}, {
							onclick: "reloadSystem",
							icon: "assets/menu_icons/refresh.png",
							className: "enyo-grouped-toolbutton-dark"
						}
					]
				}, {
					kind: enyo.Spacer
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							name: "addIncomeButton",
							onclick: "addIncome",
							toggling: true,
							icon: "assets/menu_icons/income.png",
							className: "enyo-grouped-toolbutton-dark"
						}, {
							name: "addTransferButton",
							onclick: "addTransfer",
							toggling: true,
							icon: "assets/menu_icons/transfer.png",
							className: "enyo-grouped-toolbutton-dark"
						}, {
							name: "addExpenseButton",
							onclick: "addExpense",
							toggling: true,
							icon: "assets/menu_icons/expense.png",
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

							onclick: "functionButtonClicked",
							icon: "assets/menu_icons/config.png",
							className: "enyo-grouped-toolbutton-dark"
						}, {
							onclick: "searchButtonClicked",
							icon: "assets/menu_icons/search.png",
							className: "enyo-grouped-toolbutton-dark"
						}
					]
				}
			]
		},

		{
			name: "viewSingle",
			kind: "Checkbook.transactions.viewSingle",
			onClear: "vsCleared",
			onEdit: "vsEdit",
			onDelete: "transactionDeleted"
		},

		{
			name: "deleteTransactionConfirm",
			kind: "GTS.deleteConfirm",

			confirmTitle: "Delete Transaction",
			confirmMessage: "Are you sure you want to delete this transaction?",
			confirmButtonYes: "Delete",
			confirmButtonNo: "Cancel",

			onYes: "deleteTransactionConfirmHandler",
			onNo: "deleteTransactionConfirmClose"
		},

		//All menu item actions call 'menuItemClick'
		{
			name: "transactonMenu",
			kind: "GTS.menu",
			lazy: false,
			components: [
				{
					name: "tmClear",
					caption: "Clear Transaction",
					value: "clear",
					menuParent: "transactonMenu"
				}, {
					caption: "Edit Transaction",
					value: "edit",
					menuParent: "transactonMenu"
				}, {
					caption: "Duplicate Transaction",
					value: "duplicate",
					menuParent: "transactonMenu"
				}, {
					caption: "Delete Transaction",
					value: "delete",
					menuParent: "transactonMenu"
				}
			]
		}, {
			name: "balanceMenu",
			kind: "Checkbook.balanceMenu"
		}, {
			name: "sortMenu",
			kind: "Checkbook.selectedMenu"
		}, {
			name: "searchMenu",
			kind: "GTS.menu",
			components: [
				{
					showing: false,

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
		}, {
			name: "functionMenu",
			kind: "GTS.menu",
			components: [
				{
					caption: "Purge Transactions",
					menuParent: "functionMenu"
				}, {
					caption: "Combine Transactions",
					menuParent: "functionMenu"
				}, {
					caption: "Clear Multiple Transactions",
					menuParent: "functionMenu"
				}
			]
		}
	],

	create: function() {

		this.inherited( arguments );

		this.log();

		this.$.pageHeader.hide();
		this.$.toolbar.hide();
	},

	changeAccount: function( accountObj, force ) {

		force = typeof( force ) !== 'undefined' ? force : false;

		if( !accountObj ) {

			this.unloadSystem();
			return;
		}

		if( !this.account['acctId'] ) {

			this.$.pageHeader.show();
			this.$.toolbar.show();
		}

		if( force || !this.account['acctId'] || this.account['acctId'] !== accountObj['acctId'] ) {

			//Make a clone; else unable to modify account
			this.account = enyo.clone( accountObj );

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
			this.transactions = [];
			this.$['entries'].punt();
			this.initialScroll();

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
	},

	getAccountId: function() {

		return this.account['acctId'];
	},

	setAccountIndex: function( index ) {

		this.account['index'] = index;
	},

	unloadSystem: function() {

		this.account = {};
		this.transactions = [];
		this.$['entries'].punt();

		this.$.pageHeader.hide();
		this.$.toolbar.hide();
	},

	reloadSystem: function() {

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		this.transactions = [];
		this.$['entries'].punt();

		this.initialScroll();
		this.balanceChangedHandler();
	},

	initialScroll: function() {

		if( !( this.account['sort'] === 0 || this.account['sort'] === 1 || this.account['sort'] === 6 || this.account['sort'] === 7 ) ) {

			this.scrollTo( 0 );
			return;
		}

		var currDate = new Date();

		if( this.account['showTransTime'] !== 1 ) {

			currDate.setHours( 23, 59, 59, 999 );
		}
		currDate = Date.parse( currDate );

		var qryScrollCount = null;

		switch( this.account['sort'] ) {
			case 0://oldest >> newest, show newest
				qryScrollCount = new GTS.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND CAST( date AS INTEGER ) <= ? ORDER BY date ASC, itemId ASC;",
						'values': [ this.account['acctId'], currDate ]
					});
				break;
			case 1://newest >> oldest, show newest
				qryScrollCount = new GTS.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND CAST( date AS INTEGER ) <= ? ORDER BY date DESC, itemId DESC;",
						'values': [ this.account['acctId'], currDate ]
					});
				break;
			case 6://cleared first
				qryScrollCount = new GTS.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND cleared = 1;",
						'values': [ this.account['acctId'] ]
					});
				break;
			case 7://pending first
				qryScrollCount = new GTS.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND cleared = 0;",
						'values': [ this.account['acctId'] ]
					});
				break;
		}

		if( qryScrollCount ) {

			var options = {
					"onSuccess": enyo.bind( this, this.initialScrollHandler )
				};

			enyo.application.gts_db.query( qryScrollCount, options );
		}
	},

	initialScrollHandler: function( results ) {

		var scrollToIndex = 0;

		if( this.account['sort'] === 1 ) {

			scrollToIndex = this.account['itemCount'] - results[0]['itemIndex'] - 3;
		} else {

			scrollToIndex = results[0]['itemIndex'] - 3;
		}

		scrollToIndex = ( scrollToIndex >= 0 ? scrollToIndex : 0 );

		this.log( this.account['sort'], scrollToIndex, arguments );

		this.scrollTo( scrollToIndex );
	},

	menuItemClick: function() {
		//All menu items come here

		var inSender = arguments[arguments.length === 2 ? 0 : 1];

		if( inSender.menuParent.toLowerCase() === "balancemenu" ) {
			//Balance menu

			if( this.account['bal_view'] === inSender.value ) {
				//No change, abort
				return;
			}

			this.account['bal_view'] = inSender.value;

			enyo.application.accountManager.updateAccountBalView(
					this.account['acctId'],
					this.account['bal_view'],
					{
						"onSuccess": enyo.bind( this, this.renderBalanceButton )
					}
				);

			this.doBalanceViewChanged( this.account['index'], this.account['acctId'], this.account['bal_view'] );
		} else if( inSender.menuParent.toLowerCase() === "transactionsortoptions" ) {
			//Sort menu

			if( this.account['sort'] === inSender.value ) {
				//No change, abort
				return;
			}

			this.account['sort'] = inSender.value;
			this.account['sortQry'] = inSender.qry;

			enyo.application.accountManager.updateAccountSorting(
					this.account['acctId'],
					this.account['sort']
				);

			this.transactions = [];
			this.$['entries'].punt();
			this.initialScroll();
		} else if( inSender.menuParent.toLowerCase() === "functionmenu" ) {

			this.log( "functionMenu", arguments );
		} else if( inSender.menuParent.toLowerCase() === "searchmenu" ) {
			//Tool Menu

			if( inSender.value.toLowerCase() === "budget" ) {

				enyo.nextTick(
						this,
						this.doBudgetView,
						null,
						{
							accountObj: this.account
						}
					);
			} else if( inSender.value.toLowerCase() === "reports" ) {

				this.log( "Report system go" );
			} else if( inSender.value.toLowerCase() === "search" ) {

				enyo.nextTick(
						this,
						this.doSearchView,
						null,
						{
							acctId: this.account['acctId']
						}
					);
			}
		} else if( inSender.menuParent.toLowerCase() === "transactonmenu" ) {
			//Transction Menu

			var rowIndex = this.$['transactonMenu'].rowIndex;

			if( !Object.validNumber( rowIndex ) || rowIndex < 0 ) {

				return;
			}

			if( inSender.value === "clear" ) {

				this.vsCleared( null, rowIndex );
			} else if( inSender.value === "edit" ) {

				this.vsEdit( null, rowIndex );
			} else if( inSender.value === "duplicate" ) {

				this.duplicateTransaction( rowIndex );
			} else if( inSender.value === "delete" ) {

				this.$['deleteTransactionConfirm'].rowIndex = rowIndex;
				this.$['deleteTransactionConfirm'].openAtCenter();
			}
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

			enyo.application.accountManager.fetchAccountBalance( this.account['acctId'], { "onSuccess": enyo.bind( this, this.balanceChangedHandler, accounts ) } );
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

			accounts['accountBal'] = [
					this.account['balance0'],
					this.account['balance1'],
					this.account['balance2'],
					this.account['balance3']
				];
		} else {

			accounts['accountBal'] = [];
		}

		this.doChanged( accounts );

		this.loadingDisplay( false );
	},

	/* Header Control */
	renderBalanceButton: function() {

		var balance = this.account['balance' + this.account['bal_view']];

		var balanceColor = "neutralBalance";
		if( balance > 0 ) {

			balanceColor = "positiveBalance";
		} else if( balance < 0 ) {

			balanceColor = "negativeBalance";
		}

		this.$['balanceButton'].setCaption( formatAmount( balance ) );
		this.$['balanceButton'].setClassName( "enyo-button " + balanceColor );
	},

	balanceButtonClicked: function( inSender ) {

		this.$['balanceMenu'].setItems(
				[
					{
						caption: "Available:",
						balance: this.account['balance0'],
						menuParent: "balanceMenu",
						value: 0,
					}, {
						caption: "Cleared:",
						balance: this.account['balance1'],
						menuParent: "balanceMenu",
						value: 1
					}, {
						caption: "Pending:",
						balance: this.account['balance3'],
						menuParent: "balanceMenu",
						value: 3
					}, {
						caption: "Final:",
						balance: this.account['balance2'],
						menuParent: "balanceMenu",
						value: 2
					}
				],
				this.account['bal_view']
			);

		this.$['balanceMenu'].openAtControl( inSender );
	},

	/* Footer Control */
	renderSortButton: function() {

		if( transactionSortOptions.length <= 0 ) {

			enyo.application.transactionManager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	buildTransactionSorting: function() {

		this.$['sortMenu'].setItems( transactionSortOptions );
	},

	sortButtonClicked: function( inSender, inEvent ) {

		this.$['sortMenu'].openAtControl( inSender, this.account['sort'] );
	},

	searchButtonClicked: function( inSender, inEvent ) {

		this.$['searchMenu'].openAtControl( inSender );
	},

	functionButtonClicked: function( inSender, inEvent ) {

		this.$['functionMenu'].openAtControl( inSender );
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

	newTransaction: function( type ) {

		//Prevent user from launching multiple New Transaction windows
		if( this.$['add' + type + 'Button'].getDepressed() &&
			!( this.$['addIncomeButton'].getDisabled() || this.$['addTransferButton'].getDisabled() || this.$['addExpenseButton'].getDisabled() ) ) {

			this.toggleCreateButtons();

			enyo.nextTick(
					this,
					this.doModify,
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

	addTransactionComplete: function( inSender, action, accounts, actionStatus ) {

		this.toggleCreateButtons();

		if( action === 1 && actionStatus === true ) {

			this.balanceChangedHandler( accounts );

			//Reload full list
			this.account['itemCount']++;
			this.transactions = [];
			this.$['entries'].punt();
			this.initialScroll();
		}
	},

	toggleCreateButtons: function() {

		if( this.$['addIncomeButton'].getDisabled() ) {

			this.$['addIncomeButton'].setDepressed( false );
			this.$['addTransferButton'].setDepressed( false );
			this.$['addExpenseButton'].setDepressed( false );

			this.$['addIncomeButton'].setDisabled( false );
			this.$['addTransferButton'].setDisabled( false );
			this.$['addExpenseButton'].setDisabled( false );
		} else {

			this.$['addIncomeButton'].setDisabled( true );
			this.$['addTransferButton'].setDisabled( true );
			this.$['addExpenseButton'].setDisabled( true );
		}
	},

	/* List Control */
	scrollTo: function( topIndex ) {

		if( topIndex < 0 ) {

			topIndex = 0;
		}

		var pageSize = this.$['entries'].getPageSize();

		this.$['entries'].$.scroller.adjustTop( topIndex );
		this.$['entries'].$.scroller.adjustBottom( topIndex + pageSize );
		this.$['entries'].$.scroller.top = topIndex;
		this.$['entries'].$.scroller.bottom = topIndex + pageSize;
	},

	duplicateTransaction: function( rowIndex ) {

		this.toggleCreateButtons();

		var type, newTrsn = enyo.clone( this.transactions[rowIndex] );

		if( Object.validNumber( newTrsn['linkedRecord'] ) && newTrsn['linkedRecord'] >= 0 ) {

			type = "transfer";
		} else if( newTrsn['amount'] < 0 ) {

			type = "expense";
		} else {

			type = "income";
		}

		delete newTrsn['date'];
		delete newTrsn['itemId'];
		delete newTrsn['linkedRecord'];
		delete newTrsn['repeatId'];
		delete newTrsn['cleared'];

		enyo.nextTick(
				this,
				this.doModify,
				{
					name: "createTransaction",
					kind: "Checkbook.transactions.modify",
					accountObj: this.account,
					trsnObj: newTrsn,
					transactionType: type.toLowerCase(),
					onFinish: enyo.bind( this, this.addTransactionComplete )
				}
			);
	},

	transactionTapped: function( inSender, inEvent, rowIndex ) {

		this.log();

		if( enyo.application.checkbookPrefs['transPreview'] === 1 ) {
			//preview mode

			this.$['viewSingle'].setIndex( rowIndex );
			this.$['viewSingle'].setTransaction( this.transactions[rowIndex] );
			this.$['viewSingle'].setAccount( this.account );
			this.$['viewSingle'].openAtCenter();
		} else {

			this.vsEdit( null, rowIndex );
		}
	},

	vsEdit: function( inSender, rowIndex ) {

		if( this.account['frozen'] !== 1 ) {
			//account not frozen

			enyo.nextTick(
					this,
					this.doModify,
					{
						name: "editTransaction",
						kind: "Checkbook.transactions.modify",
						accountObj: this.account,
						trsnObj: enyo.clone( this.transactions[rowIndex] ),
						transactionType: "",
						onFinish: enyo.bind( this, this.modifyTransactionComplete, rowIndex )
					}
				);
		}
	},

	modifyTransactionComplete: function( rowIndex, inSender, action, accounts, actionStatus ) {

		if( action === 1 && actionStatus === true ) {
			//edited

			this.balanceChangedHandler( accounts );

			this.transactions = [];
			this.$['entries'].punt();

			enyo.nextTick(
					this,
					this.scrollTo,
					rowIndex
				);
		} else if( action === 2 ) {
			//deleted

			this.balanceChangedHandler( accounts );

			this.account['itemCount']--;

			this.transactions = [];
			this.$['entries'].punt();

			enyo.nextTick(
					this,
					this.scrollTo,
					( rowIndex - 1 )
				);
		}
	},

	transactionHeld: function( inSender, inEvent ) {

		this.log();

		//enyo-held class isn't being removed on mouse up either

		if( this.transactions[inEvent.rowIndex]['cleared'] === 1 ) {

			this.$['tmClear'].setCaption( "Unclear Transaction" );
		} else {

			this.$['tmClear'].setCaption( "Clear Transaction" );
		}

		this.$['transactonMenu'].rowIndex = inEvent.rowIndex;
		this.$['transactonMenu'].openAtEvent( inEvent );
	},

	transactionCleared: function( inSender, inEvent ) {

		this.vsCleared( null, inEvent.rowIndex );

		//Don't 'click' the row
		inEvent.stopPropagation();
	},

	vsCleared: function( inSender, rowIndex ) {

		if( this.account['frozen'] === 1 ) {

			this.$['entries'].refresh();
			return;
		}

		this.loadingDisplay( true );

		this.transactions[rowIndex]['cleared'] = this.transactions[rowIndex]['cleared'] === 1 ? 0 : 1;

		var cleared = ( this.transactions[rowIndex]['cleared'] === 1 );

		enyo.application.transactionManager.clearTransaction( this.transactions[rowIndex]['itemId'], cleared );

		this.$['entries'].refresh();

		this.balanceChangedHandler();

		return this.transactions[rowIndex]['cleared'];
	},

	deleteTransactionConfirmHandler: function() {

		this.transactionDeleted( null, this.$['deleteTransactionConfirm'].rowIndex );
		this.deleteTransactionConfirmClose();
	},

	deleteTransactionConfirmClose: function() {

		this.$['deleteTransactionConfirm'].close();
	},

	transactionDeleted: function( inSender, rowIndex ) {

		if( this.account['frozen'] === 1 ) {

			this.$['entries'].refresh();
			return;
		}

		this.loadingDisplay( true );

		var accounts = {
					"account": this.transactions[rowIndex]['account'],
					"linkedAccount": this.transactions[rowIndex]['linkedAccount']
				};

		//update database;
		enyo.application.transactionManager.deleteTransaction( this.transactions[rowIndex]['itemId'] );

		var balChanged = this.transactions[rowIndex]['amount'];
		this.transactions.splice( rowIndex, 1 );//Causing dynamic fetch to stop working...

		if( this.account['runningBalance'] === 1 &&
				(
					this.account['sort'] === 0 ||
					this.account['sort'] === 1 ||
					this.account['sort'] === 6 ||
					this.account['sort'] === 7 ||
					this.account['sort'] === 8
				) ) {

			if( rowIndex === 0 ) {

				this.transactions = [];
				this.$['entries'].punt();
				return;
			}

			//Update running balance in paging distance
				//Really should update entire transaction object...
			var start = ( rowIndex > this.$['entries'].getPageSize() ) ? ( rowIndex - this.$['entries'].getPageSize() ) : 0;
			var end = ( rowIndex + this.$['entries'].getPageSize() < this.transactions.length ) ? ( rowIndex + this.$['entries'].getPageSize() ) : this.transactions.length;

			var index = start;

			var currentBalance = this.transactions[index]['runningBalance'] - balChanged;

			while( index < end && this.transactions[index] ) {

				if( this.account['sort'] === 0 || this.account['sort'] === 6 || this.account['sort'] === 8 ) {

					currentBalance += this.transactions[index]['amount'];
				}

				this.transactions[index]['runningBalance'] = prepAmount( currentBalance );

				if( this.account['sort'] !== 0 && this.account['sort'] !== 6 && this.account['sort'] !== 8 ) {

					currentBalance -= this.transactions[index]['amount'];
				}

				index++;
			}
		}

		this.$['entries'].refresh();

		//Fetch row
		enyo.application.transactionManager.fetchTransactions(
				this.account,
				{
					"onSuccess": enyo.bind( this, this.transactionFetchGroupHandler )
				},
				1,//Limit
				this.transactions.length//Offset
			);

		this.balanceChangedHandler( accounts );
	},

	transactionBuildRow: function( inSender, inIndex ) {

		var row = this.transactions[inIndex];

		if( row ) {

			this.$.swipeableItem.addRemoveClass( "alt-row", ( inIndex % 2 === 0 ) );
			this.$.swipeableItem.addRemoveClass( "norm-row", ( inIndex % 2 !== 0 ) );

			//Description
			this.$['desc'].setContent( row['desc'] );

			//Date
			var dateObj = new Date( parseInt( row['date'] ) );
			this.$['time'].setContent( dateObj.format( { date: 'long', time: ( this.account['showTransTime'] === 1 ? 'short' : '' ) } ) );

			var today = new Date();
			if( this.account['showTransTime'] !== 1 ) {

				today.setHours( 23, 59, 59, 999 );
			}

			this.$.swipeableItem.addRemoveClass( "futureTransaction", ( row['date'] > Date.parse( today ) ) );

			//Balance Display
			this.$['amount'].setContent( formatAmount( row['amount'] ) );

			if( !row['dispRunningBalance'] ) {

				this.$['runningBal'].setContent( "" );

				this.$['amount'].addRemoveClass( "positiveFunds", ( row['amount'] > 0 ) );
				this.$['amount'].addRemoveClass( "negativeFunds", ( row['amount'] < 0 ) );
				this.$['amount'].addRemoveClass( "neutralFunds", ( row['amount'] == 0 ) );
			} else {

				this.$['runningBal'].setContent( formatAmount( row['runningBalance'] ) );

				this.$['runningBal'].addRemoveClass( "positiveFunds", ( row['runningBalance'] > 0 ) );
				this.$['runningBal'].addRemoveClass( "negativeFunds", ( row['runningBalance'] < 0 ) );
				this.$['runningBal'].addRemoveClass( "neutralFunds", ( row['runningBalance'] == 0 ) );
			}

			//Cleared
			this.$['cleared'].setChecked( row['cleared'] === 1 );

			//Categories
			//Handle split transactions
			if( this.account['enableCategories'] === 1 ) {

				this.$['category'].setShowing( true );
				this.$['category'].setContent( enyo.application.transactionManager.formatCategoryDisplay( row['category'], row['category2'], true, "small" ) );
			} else {

				this.$['category'].setShowing( false );
			}
			//Check Number
			this.$['checkNum'].setContent( ( this.account['checkField'] === 1 && row['checkNum'] && row['checkNum'] !== "" ) ? ( "Check #" + row['checkNum'] ) : "" );

			//Notes
			this.$['note'].setContent( ( this.account['hideNotes'] === 1 ? "" : row['note'] ) );

			//Row Icons
			var transferCheck = ( row['linkedRecord'] && !isNaN( row['linkedRecord'] ) && row['linkedRecord'] != "" );
			var repeatCheck = ( row['repeatId'] && !isNaN( row['repeatId'] ) && row['repeatId'] != "" );

			this.$['mainBody'].addRemoveClass( "repeatTransferIcon", ( transferCheck && repeatCheck ) );
			this.$['mainBody'].addRemoveClass( "transferIcon", ( transferCheck && !repeatCheck ) );
			this.$['mainBody'].addRemoveClass( "repeatIcon", ( !transferCheck && repeatCheck ) );

			return true;
		}
	},

	transactionFetchGroup: function( inSender, inPage ) {

		var index = inPage * inSender.getPageSize();

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		if( index < 0 ) {
			//No indexes below zero, don't bother calling

			return;
		}

		if( !this.transactions[index] ) {

			this.loadingDisplay( true );

			enyo.application.transactionManager.fetchTransactions(
					this.account,
					{
						"onSuccess": enyo.bind( this, this.transactionFetchGroupHandler )
					},
					inSender.getPageSize(),//Limit
					index//Offset
				);
		}
	},

	transactionFetchGroupHandler: function( offset, results, rbResults ) {
		//Parse page data

		var currentBalance = 0;

		if( rbResults.length > 0 ) {

			if( offset > 0 || ( this.account['sort'] !== "0" && this.account['sort'] !== "6" && this.account['sort'] !== "8" ) ) {

				currentBalance = rbResults[0]['balanceToDate'];
			}
		}

		var dispRunningBalance = (
				this.account['runningBalance'] === 1 &&
				(
					this.account['sort'] === 0 ||
					this.account['sort'] === 1 ||
					this.account['sort'] === 6 ||
					this.account['sort'] === 7 ||
					this.account['sort'] === 8
				)
			);

		for( var i = 0; i < results.length; i++ ) {
/*
results = {
	account
	amount
	category
	category2
	checkNum
	cleared
	date
	desc
	itemId
	linkedAccount
	linkedRecord
	note
	repeatId
}
*/
			if( this.account['sort'] === 0 || this.account['sort'] === 6 || this.account['sort'] === 8 ) {

				currentBalance += results[i]['amount'];
			}

			this.transactions[offset + i] = enyo.mixin(
					{
						"dispRunningBalance": dispRunningBalance,
						"runningBalance": prepAmount( currentBalance ),
						"amount": prepAmount( results[i]['amount'] )
					},
					results[i]//fetched properties
				);

			this.transactions[offset + i]['desc'] = this.transactions[offset + i]['desc'].dirtyString();
			this.transactions[offset + i]['category'] = this.transactions[offset + i]['category'].dirtyString();
			this.transactions[offset + i]['category2'] = this.transactions[offset + i]['category2'].dirtyString();
			this.transactions[offset + i]['note'] = this.transactions[offset + i]['note'].dirtyString();

			if( this.account['sort'] !== 0 && this.account['sort'] !== 6 && this.account['sort'] !== 8 ) {

				currentBalance -= this.transactions[offset + i]['amount'];
			}
		}

		this.$['entries'].refresh();

		this.loadingDisplay( false );
	},

	loadingDisplay: function( status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['acctTypeIcon'].setShowing( !status );
	}
});
