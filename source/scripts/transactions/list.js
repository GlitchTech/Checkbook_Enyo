/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.list",

	transactions: [],
	account: {},

	components: [
		{
			name: "list",
			kind: "GTS.LazyList",

			classes: "checkbook-stamp enyo-fit",

			onSetupItem: "transactionBuildRow",
			onAcquirePage: "transactionFetchGroup",
			components: [
				{
					name: "transactionWrapper",
					kind: "onyx.Item",//SwipeableItem
					tapHighlight: true,

					ontap: "transactiontapped",
					onhold: "transactionHeld",
					onDelete: "transactionDeleted",

					style: "padding-right: 20px; padding-left: 30px;",

					//Vertical Layout
					components: [
						{
							name: "mainBody",
							classes: "transaction-item-top h-box",

							components: [
								{
									classes: "box-flex-1",
									components: [
										{
											//long desc can push down amount & cleared fields
											name: "desc",
											classes: "description text-ellipsis bold"
										}, {
											name: "time",
											classes: "date smaller"
										}
									]
								}, {
									classes: "margin-left text-top",
									components: [
										{
											classes: "amount-block text-right",

											components: [
												{
													name: "amount"
												}, {
													name: "runningBal"
												}
											]
										}, {
											name: "cleared",
											ontap: "transactionCleared",
											classes: "onyx-checkbox checkbox-clone margin-left"
										}
									]
								}
							]
						}, {
							name: "category",
							allowHtml: true
						}, {
							name: "checkNum",
							classes: "smaller"
						}, {
							name: "note",
							classes: "smaller",
							allowHtml: true
						}
					]
				}
			]
		},

		{
			name: "transactonMenu",
			kind: "onyx.Menu",
			showOnTop: true,
			floating: true,
			components: [
				{
					name: "tmClear",
					content: "Clear Transaction",
					value: "clear"
				}, {
					content: "Edit Transaction",
					value: "edit"
				}, {
					content: "Duplicate Transaction",
					value: "duplicate"
				}, {
					content: "Delete Transaction",
					value: "delete"
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
			kind: "gts.ConfirmDialog",

			title: "Delete Transaction",
			message: "Are you sure you want to delete this transaction?",

			confirmText: "Delete",
			confirmClass: "onyx-negative",

			cancelText: "Cancel",
			cancelClass: "",

			onConfirm: "deleteTransactionConfirmHandler",
			onCancel: "deleteTransactionConfirmClose"
		}
	],

	/** External Controls **/

	accountChanged: function( inSender, inEvent ) {

		this.log();

		if( inEvent && inEvent.deleted && this.getAccountId() === inEvent.accountId ) {

			this.unloadSystem();
		} else {

			this.reloadSystem();
		}
	},

	unloadSystem: function() {

		this.log();

		this.account = {};
		this.$['list'].empty();
	},

	reloadSystem: function() {

		this.log();

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		this.initialScrollCompleted = false;
		this.reloadTransactionList();
	},

	reloadTransactionList: function() {

		this.log();

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			return false;
		}

		this.transactions = [];
		this.$['list'].setCount( 0 );
		this.$['list'].reset();
		this.$['list'].lazyLoad();
	},

	initialScroll: function() {

		enyo.job( "initialScroll", enyo.bind( this, "_initialScroll" ), 100 );
	},

	_initialScroll: function() {

		if( this.$['list'].getCount() <= 0 ) {

			return;
		}

		if( !( this.account['sort'] === 0 || this.account['sort'] === 1 || this.account['sort'] === 6 || this.account['sort'] === 7 ) ) {

			this.$['list'].scrollToRow( 0 );
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

		this.$['list'].scrollToRow( scrollToIndex );
	},

	/** List Display **/

	transactionBuildRow: function( inSender, inEvent ) {

		var inIndex = inEvent.index;

		var row = this.transactions[inIndex];

		if( row ) {

			this.$['transactionWrapper'].addRemoveClass( "alt-row", ( inIndex % 2 === 0 ) );
			this.$['transactionWrapper'].addRemoveClass( "norm-row", ( inIndex % 2 !== 0 ) );

			//Description
			this.$['desc'].setContent( row['desc'] );

			//Date
			var dateObj = new Date( parseInt( row['date'] ) );

			this.$['time'].setContent( dateObj.format( { "date": ( enyo.Panels.isScreenNarrow() ? "shortDate" : "longDate" ), "time": ( this.account['showTransTime'] === 1 ? 'shortTime' : '' ) } ) );

			var today = new Date();
			if( this.account['showTransTime'] !== 1 ) {

				today.setHours( 23, 59, 59, 999 );
			}

			this.$['transactionWrapper'].addRemoveClass( "futureTransaction", ( row['date'] > Date.parse( today ) ) );

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

				this.$['amount'].setClassAttribute( "" );
			}

			//Cleared
			this.$['cleared'].addRemoveClass( "checked", row['cleared'] === 1 );

			//Categories
			//Handle split transactions
			if( this.account['enableCategories'] === 1 ) {

				this.$['category'].show();
				this.$['category'].setContent( Checkbook.globals.transactionManager.formatCategoryDisplay( row['category'], row['category2'], true, "smaller" ) );
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

	transactionFetchGroup: function( inSender, inEvent ) {

		this.log();

		inEvent['pageSize'] = 50;//Event doesn't carry this detail by default. Change this.

		var index = inEvent['page'] * inEvent['pageSize'];

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		if( index < 0 ) {
			//No indexes below zero, don't bother calling

			return false;
		}

		if( this.account['itemCount'] > this.$['list'].getCount() && !this.transactions[index] ) {

			Checkbook.globals.transactionManager.fetchTransactions(
					this.account,
					{
						"onSuccess": enyo.bind( this, this.transactionFetchGroupHandler )
					},
					inEvent['pageSize'],//Limit
					index//Offset
				);

			return true;
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

			this.transactions[offset + i]['desc'] = GTS.String.dirtyString( this.transactions[offset + i]['desc'] );
			this.transactions[offset + i]['category'] = GTS.String.dirtyString( this.transactions[offset + i]['category'] );
			this.transactions[offset + i]['category2'] = GTS.String.dirtyString( this.transactions[offset + i]['category2'] );
			this.transactions[offset + i]['note'] = GTS.String.dirtyString( this.transactions[offset + i]['note'] );

			if( this.account['sort'] !== 0 && this.account['sort'] !== 6 && this.account['sort'] !== 8 ) {

				currentBalance -= this.transactions[offset + i]['amount'];
			}
		}

		this.$['list'].setCount( this.transactions.length );
		this.$['list'].refresh();

		if( !this.initialScrollCompleted ) {

			this.initialScrollCompleted = true;
			this.initialScroll();
		}
	},

	/** List Reaction Events **/

	duplicateTransaction: function( rowIndex ) {

		this.log();

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

		enyo.Signals.send(
				"modifyTransaction",
				{
					name: "createTransaction",
					kind: "Checkbook.transactions.modify",
					accountObj: this.account,
					trsnObj: newTrsn,
					transactionType: type.toLowerCase(),
					onFinish: enyo.bind( this, this.addTransactionComplete )//TODO
				}
			);
	},

	transactiontapped: function( inSender, inEvent ) {

		this.log();

		if( Checkbook.globals.prefs['transPreview'] === 1 ) {
			//preview mode

			this.$['viewSingle'].setIndex( inEvent.rowIndex );
			this.$['viewSingle'].setTransaction( this.transactions[inEvent.rowIndex] );
			this.$['viewSingle'].setAccount( this.account );
			this.$['viewSingle'].show();
		} else {

			this.vsEdit( null, inEvent );
		}

		return true;
	},

	vsEdit: function( inSender, inEvent ) {

		this.log();

		if( this.account['frozen'] !== 1 ) {
			//account not frozen

			enyo.Signals.send(
					"modifyTransaction",
					{
						name: "editTransaction",
						kind: "Checkbook.transactions.modify",
						accountObj: this.account,
						trsnObj: enyo.clone( this.transactions[inEvent.rowIndex] ),
						transactionType: "",
						onFinish: enyo.bind( this, this.modifyTransactionComplete, inEvent.rowIndex )
					}
				);
		}
	},

	modifyTransactionComplete: function( rowIndex, inSender, accounts ) {

		this.log();

		this.log( arguments );

		var action = accounts['modifyStatus'];
		delete accounts['modifyStatus'];

		if( action === 1 ) {
			//edited

			enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );

			this.reloadTransactionList();

			enyo.asyncMethod(
					this.$['list'],
					this.$['list'].scrollToRow,
					rowIndex
				);
		} else if( action === 2 ) {
			//deleted

			enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );

			this.account['itemCount']--;

			this.reloadTransactionList();

			enyo.asyncMethod(
					this.$['list'],
					this.$['list'].scrollToRow,
					( rowIndex - 1 )
				);
		}
	},

	transactionHeld: function( inSender, inEvent ) {

		this.log();

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

		this.log();

		this.log( "I DO NOT WORK YET", arguments );
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

		this.log();

		this.vsCleared( null, inEvent );

		//Don't 'click' the row
		inEvent.preventDefault();
		return true;
	},

	vsCleared: function( inSender, inEvent ) {

		this.log();

		var index = inEvent.rowIndex;

		if( !this.transactions[index] ) {

			return;
		} else if( this.account['frozen'] === 1 ) {

			this.$['list'].refresh();
			return;
		}

		//Update cleared value
		var cleared = this.transactions[index]['cleared'] !== 1;
		this.transactions[index]['cleared'] = cleared ? 1 : 0;
		Checkbook.globals.transactionManager.clearTransaction( this.transactions[index]['itemId'], cleared );

		//Update row UI
		this.$['list'].renderRow( index );


		enyo.Signals.send(
				"accountBalanceChanged",
				{
					"accounts": {
						"account": this.transactions[index]['account'],
						"linkedAccount": this.transactions[index]['linkedAccount']
					}
				}
			);

		if( enyo.isFunction( inEvent.callback ) ) {

			inEvent.callback( cleared );
		}

		return true;
	},

	deleteTransactionConfirmHandler: function() {

		this.log();

		this.transactionDeleted( null, this.$['deleteTransactionConfirm'].rowIndex );
		this.deleteTransactionConfirmClose();
	},

	deleteTransactionConfirmClose: function() {

		this.log();

		this.$['deleteTransactionConfirm'].close();
	},

	transactionDeleted: function( inSender, inEvent ) {

		this.log();

		var rowIndex = inEvent.rowIndex;

		if( this.account['frozen'] === 1 ) {

			this.$['list'].setCount( this.transactions.length );
			this.$['list'].refresh();
			return;
		}

		var accounts = {
					"account": this.transactions[rowIndex]['account'],
					"linkedAccount": this.transactions[rowIndex]['linkedAccount']
				};

		//update database;
		Checkbook.globals.transactionManager.deleteTransaction( this.transactions[rowIndex]['itemId'] );

		var balChanged = this.transactions[rowIndex]['amount'];
		this.transactions.splice( rowIndex, 1 );

		//TODO Get list dynamics running

		if( this.account['runningBalance'] === 1 &&
				(
					this.account['sort'] === 0 ||
					this.account['sort'] === 1 ||
					this.account['sort'] === 6 ||
					this.account['sort'] === 7 ||
					this.account['sort'] === 8
				) ) {

			if( rowIndex === 0 ) {

				this.reloadTransactionList();
				return;
			}

			//Update running balance in paging distance
				//Really should update entire transaction object...
			var start = ( rowIndex > this.$['list'].getPageSize() ) ? ( rowIndex - this.$['list'].getPageSize() ) : 0;
			var end = ( rowIndex + this.$['list'].getPageSize() < this.transactions.length ) ? ( rowIndex + this.$['list'].getPageSize() ) : this.transactions.length;

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

		this.$['list'].setCount( this.transactions.length );
		this.$['list'].refresh();

		//Fetch row
		Checkbook.globals.transactionManager.fetchTransactions(
				this.account,
				{
					"onSuccess": enyo.bind( this, this.transactionFetchGroupHandler )
				},
				1,//Limit
				this.transactions.length//Offset
			);

		enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );
	}
});
