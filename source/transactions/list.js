/* Copyright © 2013, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.list",

	transactions: [],
	account: {},

	initialScrollCompleted: false,
	savedScrollPosition: false,

	events: {
		onLoadingStart: "",
		onLoadingFinish: "",

		onScrimShow: "",
		onScrimHide: "",

		onCloneTransaction: ""
	},

	components: [
		{
			name: "list",
			kind: "gts.LazyList",

			classes: "checkbook-stamp enyo-fit",

			reorderable: false,
			enableSwipe: false,

			touchOverscroll: false,

			onSetupItem: "transactionBuildRow",
			onAcquirePage: "transactionFetchGroup",

			onReorder: "",
			onSetupReorderComponents: "",
			onSetupPinnedReorderComponents: "",
			onSetupSwipeItem: "",
			onSwipeComplete: "",


			aboveComponents: [ /* Content that displays above the list */ ],

			components: [
				{
					name: "transactionWrapper",
					kind: "gts.Item",

					tapHighlight: true,//tap
					holdHighlight: false,//hold

					ontap: "transactiontapped",
					onhold: "transactionHeld",

					classes: "bordered",

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
											classes: "description text-ellipsis bold",
											allowHtml: true
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
							name: "payee",
							classes: "smaller"
						}, {
							name: "note",
							classes: "smaller",
							allowHtml: true
						}
					]
				}
			],

			belowComponents: [
				/* Content that displays below the list (Incorrectly implemented) */
				{
					content: "&nbsp;",
					allowHtml: true
				}
			],

			reorderComponents: [],
			pinnedReorderComponents: [],
			swipeableComponents: []
		},

		{
			name: "transactonMenu",
			kind: "gts.EventMenu",

			showOnTop: true,
			floating: true,
			scrim: true,
			scrimclasses: "onyx-scrim-translucent",

			onSelect: "transactionHeldHandler",

			components: [
				{
					name: "tmClear",
					content: "Clear",
					value: "clear",
					classes: "bordered"
				}, {
					content: "Edit",
					value: "edit",
					classes: "bordered"
				}, {
					content: "Duplicate",
					value: "duplicate",
					classes: "bordered"
				}, {
					content: "Delete",
					value: "delete",
					classes: "bordered"
				}
			]
		},

		{
			name: "viewSingle",
			kind: "Checkbook.transactions.viewSingle",
			onClear: "vsCleared",
			onEdit: "vsEdit",
			onDelete: "transactionDeleted"
		}
	],

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		this.bound = {
			transactionFetchGroupHandler: enyo.bind( this, this.transactionFetchGroupHandler ),
			initialScroll: enyo.bind( this, this._initialScroll ),
			initialScrollHandler: enyo.bind( this, this.initialScrollHandler ),
			moveToSavedScrollPosition: enyo.bind( this, this.moveToSavedScrollPosition )
		};
	},

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
		this.$['list'].setCount( 0 );
		this.$['list'].reset();
	},

	reloadSystem: function() {

		this.log();

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		if( this.savedScrollPosition === false ) {

			this.initialScrollCompleted = false;
		}

		this.reloadTransactionList();
	},

	setItemCount: function( count ) {

		if( Number.isFinite( count ) ) {

			this.account['itemCount'] = count;
		}
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

		this.startJob( "initialScroll", this.bound.initialScroll, 100 );
	},

	_initialScroll: function() {

		if( this.$['list'].getCount() <= 0 ) {

			this.log( "empty list" );

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
				qryScrollCount = new gts.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND CAST( date AS INTEGER ) <= ? ORDER BY date ASC, itemId ASC;",
						'values': [ this.account['acctId'], currDate ]
					});
				break;
			case 1://newest >> oldest, show newest
				qryScrollCount = new gts.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND CAST( date AS INTEGER ) <= ? ORDER BY date DESC, itemId DESC;",
						'values': [ this.account['acctId'], currDate ]
					});
				break;
			case 6://cleared first
				qryScrollCount = new gts.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND cleared = 1;",
						'values': [ this.account['acctId'] ]
					});
				break;
			case 7://pending first
				qryScrollCount = new gts.databaseQuery( {
						'sql': "SELECT DISTINCT COUNT( itemId ) AS itemIndex FROM transactions main WHERE account = ? AND cleared = 0;",
						'values': [ this.account['acctId'] ]
					});
				break;
		}

		if( qryScrollCount ) {

			var options = {
					"onSuccess": this.bound.initialScrollHandler
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

	rememberScrollPosition: function() {

		this.savedScrollPosition = this.$['list'].getScrollPosition();
	},

	moveToSavedScrollPosition: function() {

		this.$['list'].setScrollPosition( this.savedScrollPosition );
		this.savedScrollPosition = false;
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

			this.$['time'].setContent( dateObj.format( { "date": ( enyo.Panels.isScreenNarrow() ? "short" : "long" ), "time": ( this.account['showTransTime'] === 1 ? 'short' : '' ) } ) );

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
			if( this.account['enableCategories'] === 1 ) {

				this.$['category'].show();
				this.$['category'].setContent( Checkbook.transactions.manager.formatCategoryDisplay( row['category'], row['category2'], true, "smaller" ) );
			} else {

				this.$['category'].hide();
			}

			//Check Number
			this.$['checkNum'].setContent( ( this.account['checkField'] === 1 && row['checkNum'] && row['checkNum'] !== "" ) ? ( "Check #" + row['checkNum'] ) : "" );

			//Payee
			this.$['payee'].setContent( ( this.account['payeeField'] === 1 && row['payee'] && row['payee'] !== "" ) ? ( "Payee: " + row['payee'] ) : "" );

			//Notes
			this.$['note'].setContent( ( this.account['hideNotes'] === 1 ? "" : row['note'] ).replace( /\n/g, "<br />" ) );

			//Row Icons
			var transferCheck = ( row['linkedRecord'] && !isNaN( row['linkedRecord'] ) && row['linkedRecord'] != "" );
			var repeatCheck = ( row['repeatId'] && !isNaN( row['repeatId'] ) && row['repeatId'] != "" && row['repeatId'] >= 0 );

			this.$['mainBody'].addRemoveClass( "repeatTransferIcon", ( transferCheck && repeatCheck ) );
			this.$['mainBody'].addRemoveClass( "transferIcon", ( transferCheck && !repeatCheck ) );
			this.$['mainBody'].addRemoveClass( "repeatIcon", ( !transferCheck && repeatCheck ) );

			return true;
		}
	},

	transactionFetchGroup: function( inSender, inEvent ) {

		var index = inEvent['page'] * inEvent['pageSize'];

		if( !this.account['acctId'] || this.account['acctId'] < 0 ) {

			this.log( "System not ready yet" );

			return false;
		}

		if( index >= 0 && this.account['itemCount'] >= this.$['list'].getCount() && !this.transactions[index] ) {

			this.doLoadingStart();

			enyo.asyncMethod( this, this._transactionFetchGroup, inEvent['pageSize'], index );

			return true;
		}

		return false;
	},

	_transactionFetchGroup: function( limit, offset ) {

			Checkbook.transactions.manager.fetchTransactions(
					this.account,
					{
						"onSuccess": this.bound.transactionFetchGroupHandler
					},
					limit,
					offset
				);
	},

	transactionFetchGroupHandler: function( offset, results, rbResults ) {
		//Parse page data

		this.log( rbResults.length, results.length );

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

			this.transactions[offset + i]['desc'] = gts.String.dirtyString( this.transactions[offset + i]['desc'] );
			this.transactions[offset + i]['category'] = gts.String.dirtyString( this.transactions[offset + i]['category'] );
			this.transactions[offset + i]['category2'] = gts.String.dirtyString( this.transactions[offset + i]['category2'] );
			this.transactions[offset + i]['note'] = gts.String.dirtyString( this.transactions[offset + i]['note'] );

			if( this.account['sort'] !== 0 && this.account['sort'] !== 6 && this.account['sort'] !== 8 ) {

				currentBalance -= this.transactions[offset + i]['amount'];
			}
		}

		this.$['list'].setCount( this.transactions.length );
		this.$['list'].refresh();

		if( !this.initialScrollCompleted ) {

			this.initialScrollCompleted = true;
			this.initialScroll();
		} else if( this.savedScrollPosition ) {

			this.startJob( "moveToSavedScrollPosition", this.bound.moveToSavedScrollPosition, 1000 );
		}

		enyo.asyncMethod( this, this.doLoadingFinish );
	},

	/** List Reaction Events **/

	duplicateTransaction: function( rowIndex ) {

		var newTrsn = enyo.clone( this.transactions[rowIndex] );

		var type = "income";

		if( gts.Object.validNumber( newTrsn['linkedRecord'] ) && newTrsn['linkedRecord'] >= 0 ) {

			type = "transfer";
		} else if( newTrsn['amount'] < 0 ) {

			type = "expense";
		}

		delete newTrsn['date'];
		delete newTrsn['itemId'];
		delete newTrsn['linkedRecord'];
		delete newTrsn['repeatId'];
		delete newTrsn['cleared'];

		this.doCloneTransaction( { "data": newTrsn, "type": type.toLowerCase() } );
	},

	transactiontapped: function( inSender, inEvent ) {

		if( Checkbook.globals.prefs['transPreview'] === 1 ) {
			//preview mode

			this.$['viewSingle'].setIndex( inEvent.rowIndex );
			this.$['viewSingle'].setTransaction( this.transactions[inEvent.rowIndex] );
			this.$['viewSingle'].setAccount( this.account );

			enyo.asyncMethod( this.$['viewSingle'], this.$['viewSingle'].show );
		} else {

			enyo.asyncMethod( this, this.vsEdit, null, inEvent );
		}

		return true;
	},

	vsEdit: function( inSender, inEvent ) {

		this.log();

		if( this.account['frozen'] !== 1 ) {
			//account not frozen

			this.doScrimShow();

			enyo.Signals.send(
					"showPanePopup",
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

		var action = accounts['modifyStatus'];
		delete accounts['modifyStatus'];

		if( action == 1 ) {
			//edited

			enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );

			this.reloadTransactionList();

			enyo.asyncMethod(
					this.$['list'],
					this.$['list'].scrollToRow,
					rowIndex
				);
		} else if( action == 2 ) {
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

		enyo.asyncMethod( this, this.doScrimHide );
	},

	transactionHeld: function( inSender, inEvent ) {

		if( this.account['frozen'] === 1 ) {

			return;
		}

		if( this.transactions[inEvent.index]['cleared'] === 1 ) {

			this.$['tmClear'].setContent( "Unclear" );
		} else {

			this.$['tmClear'].setContent( "Clear" );
		}

		this.$['transactonMenu'].rowIndex = inEvent.index;
		this.$['transactonMenu'].showAtEvent( inEvent );
	},

	transactionHeldHandler: function( inSender, inEvent ) {

		var rowIndex = this.$['transactonMenu'].rowIndex;

		if( !gts.Object.validNumber( rowIndex ) || rowIndex < 0 || !inEvent.selected ) {

			return;
		}

		if( inEvent.selected.value === "clear" ) {

			enyo.asyncMethod( this, this.vsCleared, null, { "rowIndex": rowIndex } );
		} else if( inEvent.selected.value === "edit" ) {

			enyo.asyncMethod( this, this.vsEdit, null, { "rowIndex": rowIndex } );
		} else if( inEvent.selected.value === "duplicate" ) {

			this.duplicateTransaction( rowIndex );
		} else if( inEvent.selected.value === "delete" ) {

			enyo.asyncMethod( this, this.confirmDeletion, rowIndex );
		}

		return true;
	},

	transactionCleared: function( inSender, inEvent ) {

		this.vsCleared( null, inEvent );

		//Don't 'click' the row
		inEvent.preventDefault();
		return true;
	},

	vsCleared: function( inSender, inEvent ) {

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

		//Update row UI
		this.$['list'].renderRow( index );

		enyo.asyncMethod( this, this.transactionClearedDatabaseUpdate, inEvent, index, cleared );

		return true;
	},

	transactionClearedDatabaseUpdate: function( inEvent, index, cleared ) {

		Checkbook.transactions.manager.clearTransaction( this.transactions[index]['itemId'], cleared );

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
	},

	confirmDeletion: function( index ) {

		if( this.transactions[index]['repeatId'] > 0 || this.transactions[index]['repeatId'] === 0 ) {

			this.createComponent( {
					name: "deleteTransactionConfirm",
					kind: "Checkbook.transactions.recurrence.delete",

					transactionId: this.transactions[index]['itemId'],
					recurrenceId: this.transactions[index]['repeatId'],

					rowIndex: index,

					onFinish: "deleteTransactionHandler",
					onCancel: "deleteTransactionConfirmClose"
				});
		} else {

			this.createComponent( {
					name: "deleteTransactionConfirm",
					kind: "gts.ConfirmDialog",

					title: "Delete Transaction",
					message: "Are you sure you want to delete this transaction?",

					confirmText: "Delete",
					confirmClass: "onyx-negative",

					cancelText: "Cancel",
					cancelClass: "",

					rowIndex: index,

					onConfirm: "deleteTransactionHandler",
					onCancel: "deleteTransactionConfirmClose"
				});
		}

		this.$['deleteTransactionConfirm'].show();
	},

	deleteTransactionConfirmClose: function() {

		this.$['deleteTransactionConfirm'].hide();
		this.$['deleteTransactionConfirm'].destroy();
	},

	deleteTransactionHandler: function() {

		this.transactionDeleted( null, { "rowIndex": this.$['deleteTransactionConfirm'].rowIndex } );
		enyo.asyncMethod( this, this.deleteTransactionConfirmClose );
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
		Checkbook.transactions.manager.deleteTransaction( this.transactions[rowIndex]['itemId'] );

		if( inEvent['recurrence'] ) {

			enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );

			this.reloadTransactionList();
			return;
		}

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

				enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );

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
		Checkbook.transactions.manager.fetchTransactions(
				this.account,
				{
					"onSuccess": this.bound.transactionFetchGroupHandler
				},
				1,//Limit
				this.transactions.length//Offset
			);

		enyo.Signals.send( "accountBalanceChanged", { "accounts": accounts } );
	}
});
