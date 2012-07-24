/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.view",
	layoutKind: "FittableRowsLayout",

	transactions: [],
	account: {},

	events: {
		onModify: "",//Add/Edit Transaction
		onChanged: ""//Edit Made
	},

	components: [
		{
			name: "header",
			kind: "onyx.Toolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			components: [
				{//Swap between icon for account & spinner when loading data in the background.
					name: "acctTypeIcon",
					kind: enyo.Image,
					src: "assets/dollar_sign_1.png",
					classes: "img-icon",
					style: "margin: 0 15px 0 0; height: 32px;"
				}, {
					name: "loadingSpinner",
					kind: "jmtk.Spinner",

					color: "#284907",
					diameter: "32",
					shape: "spiral",

					style: "margin: 0 15px 0 0;"
				}, {
					name: "acctName",
					content: "Checkbook",
					classes: "enyo-text-ellipsis",
					style: "margin-top: -6px;",
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
			classes: "checkbook-stamp"
		}, {
			name: "footer",
			kind: "onyx.MoreToolbar",//Doesn't work with fittable.
			classes: "deep-green",
			components: [
				{
					//I do nothing right now
					showing: false,
					kind: "onyx.Grabber",
					classes: "margin-right"
				},{
					kind: "onyx.MenuDecorator",
					components: [
						{
							kind: "onyx.IconButton",
							src: "assets/menu_icons/sort.png"
						}, {
							name: "sortMenu",
							kind: "GTS.SelectedMenu",
							floating: true,

							onChange: "transactionSortingChanged",

							style: "min-width: 225px;"
						}
					]
				}, {
					components: [
						{
							name: "addIncomeButton",
							kind: "onyx.Checkbox",

							onchange: "addIncome",
							classes: "income"
						}, {
							name: "addTransferButton",
							kind: "onyx.Checkbox",

							onchange: "addTransfer",
							classes: "transfer"
						}, {
							name: "addExpenseButton",
							kind: "onyx.Checkbox",

							onchange: "addExpense",
							classes: "expense"
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
							onSelect: "searchSelected",
							components: [
								{
									content: "Reports"
								}, {
									content: "Budget"
								}, {
									content: "Search"
								}
							]
						}
					]
				}, {
					showing: false,
					kind: "onyx.MenuDecorator",
					components: [
						{
							kind: "onyx.IconButton",
							src: "assets/menu_icons/config.png"
						}, {
							kind: "onyx.Menu",
							floating: true,
							onSelect: "functionSelected",
							components: [
								{
									content: "Purge Transactions",
									value: "purge"
								}, {
									content: "Combine Transactions",
									value: "combine"
								}, {
									content: "Clear Multiple Transactions",
									value: "clear"
								}
							]
						}
					]
				}
			]
		},

		{
			kind: "Signals",

			viewAccount: "viewAccount",
			accountChanged: "accountChanged"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.$['header'].hide();
		this.$['footer'].hide();

		this.loadingDisplay( false );
	},

	accountChanged: function( inSender, inEvent ) {

		if( inEvent && inEvent.deleted && this.getAccountId() === inEvent.accountId ) {

			this.unloadSystem();
		} else {

			this.reloadSystem();
		}
	},

	viewAccount: function( inSender, inEvent ) {

		inEvent['force'] = typeof( inEvent['force'] ) !== 'undefined' ? inEvent['force'] : false;

		if( !inEvent['account'] || !inEvent['account']['acctId'] ) {

			this.unloadSystem();
			return;
		}

		if( !this.account['acctId'] ) {

			this.$['header'].show();
			this.$['footer'].show();
		}

		if( inEvent['force'] || !this.account['acctId'] || this.account['acctId'] !== inEvent['account']['acctId'] ) {

			//Make a clone; else unable to modify account
			this.account = enyo.clone( inEvent['account'] );

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
			this.reloadTransactionList();

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

		this.$['header'].reflow();
		this.$['footer'].reflow();
		this.reflow();
	},

	getAccountId: function() {

		return this.account['acctId'];
	},

	setAccountIndex: function( index ) {

		this.log( arguments );

		this.account['index'] = index;
	},

	unloadSystem: function() {

		this.account = {};

		this.reloadTransactionList();

		this.$['header'].hide();
		this.$['footer'].hide();
	},

	reloadSystem: function() {

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		this.reloadTransactionList();
		this.initialScroll();
		this.balanceChangedHandler();
	},

	reloadTransactionList: function() {

		this.transactions = [];
		this.$['entries'].setCount( this.transactions.length );
		this.$['entries'].reset();
	},

	initialScroll: function() {

		if( !( this.account['sort'] === 0 || this.account['sort'] === 1 || this.account['sort'] === 6 || this.account['sort'] === 7 ) ) {

			this.$['entries'].scrollToRow( 0 );
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

			Checkbook.globals.gts_db.query( qryScrollCount, options );
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

		this.$['entries'].scrollToRow( scrollToIndex );
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

		this.loadingDisplay( false );
		return true;
	},

	/* Footer Control */

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

		this.reloadTransactionList();
		this.initialScroll();

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

	searchSelected: function( inSender, inEvent ) {

		if( inEvent.content.toLowerCase() === "budget" ) {

			this.log( "Budget system go" );
			return true;

			enyo.Signals.send( "showBudget", { "account": this.account } );
		} else if( inEvent.content.toLowerCase() === "reports" ) {

			this.log( "Report system go" );
			return true;

			//enyo.Signals.send( "?????", { "account": this.account } );
		} else if( inEvent.content.toLowerCase() === "search" ) {

			this.log( "Search system go" );
			return true;

			enyo.Signals.send( "showSearch", { "acctId": this.account['acctId'] } );
		}
	},

	functionSelected: function( inSender, inEvent ) {

		this.log( inEvent.selected );
	},

	/* Transaction & List Control */

	newTransaction: function( type ) {

		//Prevent user from launching multiple New Transaction windows
		if( this.$['add' + type + 'Button'].getChecked() &&
			!( this.$['addIncomeButton'].getDisabled() || this.$['addTransferButton'].getDisabled() || this.$['addExpenseButton'].getDisabled() ) ) {

			this.toggleCreateButtons();

			enyo.asyncMethod(
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

	addTransactionComplete: function( inSender, accounts, actionStatus ) {

		this.toggleCreateButtons();

		var action = accounts['status'];
		delete accounts['status'];

		if( action === 1 && actionStatus === true ) {

			this.balanceChangedHandler( accounts );

			//Reload full list
			this.account['itemCount']++;
			this.transactions = [];

			this.$['entries'].setCount( this.transactions.length );
			this.$['entries'].reset();
			this.initialScroll();
		}
	},

	toggleCreateButtons: function() {

		if( this.$['addIncomeButton'].getDisabled() ) {

			this.$['addIncomeButton'].setChecked( false );
			this.$['addIncomeButton'].setDisabled( false );

			this.$['addTransferButton'].setChecked( false );
			this.$['addTransferButton'].setDisabled( false );

			this.$['addExpenseButton'].setChecked( false );
			this.$['addExpenseButton'].setDisabled( false );
		} else {

			this.$['addIncomeButton'].setChecked( true );
			this.$['addIncomeButton'].setDisabled( true );

			this.$['addTransferButton'].setChecked( true );
			this.$['addTransferButton'].setDisabled( true );

			this.$['addExpenseButton'].setChecked( true );
			this.$['addExpenseButton'].setDisabled( true );
		}
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

		enyo.asyncMethod(
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

	transactiontapped: function( inSender, inEvent, rowIndex ) {

		this.log();

		if( Checkbook.globals.prefs['transPreview'] === 1 ) {
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

			enyo.asyncMethod(
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

	modifyTransactionComplete: function( rowIndex, inSender, accounts, actionStatus ) {

		var action = accounts['status'];
		delete accounts['status'];

		if( action === 1 && actionStatus === true ) {
			//edited

			this.balanceChangedHandler( accounts );

			this.transactions = [];
			this.$['entries'].setCount( this.transactions.length );
			this.$['entries'].reset();

			enyo.asyncMethod(
					this.$['entries'],
					this.$['entries'].scrollToRow,
					rowIndex
				);
		} else if( action === 2 ) {
			//deleted

			this.balanceChangedHandler( accounts );

			this.account['itemCount']--;

			this.transactions = [];
			this.$['entries'].setCount( this.transactions.length );
			this.$['entries'].reset();

			enyo.asyncMethod(
					this.$['entries'],
					this.$['entries'].scrollToRow,
					( rowIndex - 1 )
				);
		}
	},

	transactionHeld: function( inSender, inEvent ) {

		this.log( "I DO NOT WORK YET", arguments );
		return;

		if( this.transactions[inEvent.index]['cleared'] === 1 ) {

			this.$['tmClear'].setContent( "Unclear Transaction" );
		} else {

			this.$['tmClear'].setContent( "Clear Transaction" );
		}

		this.$['transactonMenu'].rowIndex = inEvent.index;

		this.waterfallDown( "onRequestShowMenu", { activator: inEvent.originator } );
	},

	transactionHeldHandler: function( inSender, inEvent ) {

		this.log( arguments );
		return true;

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

		return true;
	},

	transactionCleared: function( inSender, inEvent ) {

		this.vsCleared( null, inEvent.rowIndex );

		//Don't 'click' the row
		inEvent.stopPropagation();
	},

	vsCleared: function( inSender, rowIndex ) {

		if( this.account['frozen'] === 1 ) {

			this.$['entries'].setCount( this.transactions.length );
			this.$['entries'].refresh();
			return;
		}

		this.loadingDisplay( true );

		this.transactions[rowIndex]['cleared'] = this.transactions[rowIndex]['cleared'] === 1 ? 0 : 1;

		var cleared = ( this.transactions[rowIndex]['cleared'] === 1 );

		Checkbook.globals.transactionManager.clearTransaction( this.transactions[rowIndex]['itemId'], cleared );

		this.$['entries'].setCount( this.transactions.length );
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

			this.$['entries'].setCount( this.transactions.length );
			this.$['entries'].refresh();
			return;
		}

		this.loadingDisplay( true );

		var accounts = {
					"account": this.transactions[rowIndex]['account'],
					"linkedAccount": this.transactions[rowIndex]['linkedAccount']
				};

		//update database;
		Checkbook.globals.transactionManager.deleteTransaction( this.transactions[rowIndex]['itemId'] );

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
				this.$['entries'].setCount( this.transactions.length );
				this.$['entries'].reset();
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

		this.$['entries'].setCount( this.transactions.length );
		this.$['entries'].refresh();

		//Fetch row
		Checkbook.globals.transactionManager.fetchTransactions(
				this.account,
				{
					"onSuccess": enyo.bind( this, this.transactionFetchGroupHandler )
				},
				1,//Limit
				this.transactions.length//Offset
			);

		this.balanceChangedHandler( accounts );
	},

	transactionBuildRow: function( inSender, inEvent ) {

		this.$['desc'].setContent( inEvent.index );
		return;

		var inIndex = inEvent.index;

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

				this.$['amount'].addRemoveClass( "positiveBalance", ( row['amount'] > 0 ) );
				this.$['amount'].addRemoveClass( "negativeBalance", ( row['amount'] < 0 ) );
				this.$['amount'].addRemoveClass( "neutralBalance", ( row['amount'] == 0 ) );
			} else {

				this.$['runningBal'].setContent( formatAmount( row['runningBalance'] ) );

				this.$['runningBal'].addRemoveClass( "positiveBalance", ( row['runningBalance'] > 0 ) );
				this.$['runningBal'].addRemoveClass( "negativeBalance", ( row['runningBalance'] < 0 ) );
				this.$['runningBal'].addRemoveClass( "neutralBalance", ( row['runningBalance'] == 0 ) );
			}

			//Cleared
			this.$['cleared'].setChecked( row['cleared'] === 1 );

			//Categories
			//Handle split transactions
			if( this.account['enableCategories'] === 1 ) {

				this.$['category'].show();
				this.$['category'].setContent( Checkbook.globals.transactionManager.formatCategoryDisplay( row['category'], row['category2'], true, "small" ) );
			} else {

				this.$['category'].hide();
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

		this.log( arguments );

		return;

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

			Checkbook.globals.transactionManager.fetchTransactions(
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

		this.$['entries'].setCount( this.transactions.length );
		this.$['entries'].refresh();

		this.loadingDisplay( false );
	},

	loadingDisplay: function( status ) {

		if( status ) {

			this.$['loadingSpinner'].show();
			this.$['acctTypeIcon'].hide();
		} else {

			this.$['loadingSpinner'].hide();
			this.$['acctTypeIcon'].show();
		}
	}
});
