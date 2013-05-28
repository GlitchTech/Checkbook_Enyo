/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({

	name: "Checkbook.search.results",
	kind: "FittableRows",

	where: {
		strings: "",
		arguments: []
	},

	resultCount: 0,
	transactions: [],
	sort: null,
	sortQry: null,

	published: {
		changesMade: false
	},

	events: {
		onResultsFound: "",//Update header with result count
		onLoading: ""//Loading icon
	},

	components: [
		{
			name: "entries",
			//kind: enyo.VirtualList,

			fit: true,
			classes: "checkbook-stamp",

			onSetupRow: "setupRow",
			onAcquirePage: "acquirePage",
			//pageSize: 15,

			components: [
				{
					//kind: enyo.SwipeableItem,

					tapHighlight: true,
					ontap: "transactiontapped",
					onConfirm: "transactionDeleted",

					style: "padding-right: 20px; padding-left: 30px;",

					//Vertical Layout
					components: [
						{
							name: "mainBody",
							//layoutKind: enyo.HFlexLayout,
							classes: "transactionItemTop",

							components: [
								{
									flex: 1,
									//Vertical Layout
									components: [
										{
											name: "desc",
											classes: "description enyo-text-ellipsis bold"
										}, {
											name: "time",
											classes: "date smaller"
										}, {
											//layoutKind: enyo.HFlexLayout,
											align: "center",
											pack: "start",
											components: [
												{
													name: "accountIcon",
													kind: "enyo.Image",
													src: "",
													style: "height: 16px; width: 16px; margin: 0 5px 0 0;"
												}, {
													name: "account",
													classes: "small",
													content: "Account Name"
												}
											]
										}
									]
								}, {
									name: "amount",
									style: "text-align: right;"
								}, {
									name: "cleared",
									//kind: enyo.CheckBox,
									ontap: "transactionCleared",

									style: "margin-left: 15px;"
								}
							]
						}, {
							name: "category",
							allowHtml: true
						}, {
							name: "checkNum",
							classes: "small"
						}, {
							name: "note",
							classes: "small",
							allowHtml: true
						}
					]
				}
			]
		}, {
			//kind: enyo.Toolbar,
			classes: "tardis-blue",
			pack: "start",
			components: [
				{
					//kind: enyo.GrabButton
				}, {
					//kind: enyo.ToolButtonGroup,
					style: "margin-left: 50px;",
					components: [
						{
							ontap: "sortClicked",
							icon: "assets/menu_icons/sort.png",
							classes: "enyo-grouped-toolbutton-dark"
						}
					]
				}
			]
		},

		{
			name: "sortMenu",
			//kind: "Checkbook.selectedMenu"
		},

		{
			name: "viewSingle",
			//kind: "Checkbook.transactions.viewSingle",
			onClear: "vsCleared",
			onEdit: "vsEdit",
			onDelete: "transactionDeleted"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		return;

		if( transactionSortOptions.length <= 0 ) {

			Checkbook.globals.transactionManager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	search: function( qryStrs, qryArgs ) {

		this.where = {
				strings: qryStrs,
				arguments: qryArgs
			};

		this.doLoading( true );

		if( this.where['strings'].length <= 0 ) {

			this.fetchSearchCountHandler();
		} else {

			Checkbook.globals.transactionManager.searchTransactionsCount(
					this.where['strings'],
					this.where['arguments'],
					this.sortQry,
					{
						"onSuccess": enyo.bind( this, this.fetchSearchCountHandler )
					}
				);
		}
	},

	fetchSearchCountHandler: function( result ) {

		this.resultCount = ( ( result && result['searchCount'] ) ? result['searchCount'] : 0 );

		this.doResultsFound( this.resultCount );

		this.transactions = [];
		this.$['entries'].punt();
	},

	/** Footer Control **/

	buildTransactionSorting: function() {

		this.sort = transactionSortOptions[0].value;
		this.sortQry = transactionSortOptions[0].qry;

		this.$['sortMenu'].setItems( transactionSortOptions );
	},

	sortClicked: function( inSender, inEvent ) {

		this.$['sortMenu'].openAtControl( inSender, this.sort );
	},

	menuItemClick: function() {
		//All menu items come here

		var inSender = arguments[arguments.length === 2 ? 0 : 1];

		if( inSender.menuParent.toLowerCase() === "transactionsortoptions" ) {
			//Sort menu

			if( this.sort === inSender.value ) {
				//No change, abort
				return;
			}

			this.sort = inSender.value;
			this.sortQry = inSender.qry;

			this.transactions = [];
			this.$['entries'].punt();
		}
	},

	/** List Item Control **/

	transactiontapped: function( inSender, inEvent, rowIndex ) {

		this.log();

		if( Checkbook.globals.prefs['transPreview'] === 1 ) {
			//preview mode

			this.$['viewSingle'].setIndex( rowIndex );
			this.$['viewSingle'].setTransaction( this.transactions[rowIndex] );
			this.$['viewSingle'].setAccount( { acctId: this.transactions[rowIndex]['account'] } );
			this.$['viewSingle'].openAtCenter();
		} else {

			this.vsEdit( null, rowIndex );
		}
	},

	transactionCleared: function( inSender, inEvent ) {

		this.vsCleared( null, inEvent.rowIndex );

		//Don't tap the row
		inEvent.stopPropagation();
	},

	vsCleared: function( inSender, rowIndex ) {

		if( this.transactions[rowIndex]['frozen'] === 1 ) {

			this.$['entries'].refresh();
			return;
		}

		this.changesMade = true;
		this.doLoading( true );

		this.transactions[rowIndex]['cleared'] = this.transactions[rowIndex]['cleared'] === 1 ? 0 : 1;

		Checkbook.globals.transactionManager.clearTransaction( this.transactions[rowIndex]['itemId'], ( this.transactions[rowIndex]['cleared'] === 1 ) );

		this.$['entries'].refresh();

		return this.transactions[rowIndex]['cleared'];
	},

	vsEdit: function( inSender, rowIndex ) {

		var row = this.transactions[rowIndex];

		if( row && row['frozen'] !== 1 ) {
			//account not frozen

			var acctObj = {
					acctId: row['account']
				};

			var trsnObj = {
					account: row['account'],
					amount: row['amount'],
					category: row['category'],
					category2: row['category2'],
					checkNum: row['checkNum'],
					cleared: row['cleared'],
					date: row['date'],
					desc: row['desc'],
					itemId: row['itemId'],
					linkedAccount: row['linkedAccount'],
					linkedRecord: row['linkedRecord'],
					note: row['note'],
					repeatId: row['repeatId']
				};

			//Change to signal
			enyo.asyncMethod(
					this,
					this.doModify,
					{
						name: "editTransaction",
						kind: "Checkbook.transactions.modify",
						accountObj: acctObj,
						trsnObj: trsnObj,
						transactionType: "",
						onFinish: enyo.bind( this, this.modifyTransactionComplete, rowIndex )
					}
				);
		}
	},

	modifyTransactionComplete: function( rowIndex, inSender, action, accounts, actionStatus ) {

		if( action === 1 && actionStatus === true ) {
			//edited

			this.changesMade = true;

			this.transactions = [];
			this.$['entries'].punt();
/*
			enyo.asyncMethod(
					this,
					this.scrollTo,
					rowIndex
				);*/
		} else if( action === 2 ) {
			//deleted

			this.changesMade = true;

			this.transactions = [];
			this.$['entries'].punt();

			this.resultCount--;
			this.doResultsFound( this.resultCount );
/*
			enyo.asyncMethod(
					this,
					this.scrollTo,
					( rowIndex - 1 )
				);*/
		}
	},

	transactionDeleted: function( inSender, rowIndex ) {

		if( this.transactions[rowIndex]['frozen'] === 1 ) {

			this.$['entries'].refresh();
			return;
		}

		this.changesMade = true;
		this.doLoading( true );

		//update database;
		Checkbook.globals.transactionManager.deleteTransaction( this.transactions[rowIndex]['itemId'] );

		//update list
		this.transactions.splice( rowIndex, 1 );//Causing dynamic fetch to stop working...
		this.$['entries'].refresh();

		this.resultCount--;
		this.doResultsFound( this.resultCount );

		//Fetch row to fix dynamic fetch
		Checkbook.globals.transactionManager.searchTransactions(
				this.where['strings'],
				this.where['arguments'],
				this.sortQry,
				{
					"onSuccess": enyo.bind( this, this.acquirePageHandler, this.transactions.length )
				},
				1,//Limit
				this.transactions.length//Offset
			);
	},

	/** List Control **/

	setupRow: function( inSender, inIndex ) {

		var row = this.transactions[inIndex];

		if( row ) {

			this.$.swipeableItem.addRemoveClass( "alt-row", ( inIndex % 2 === 0 ) );
			this.$.swipeableItem.addRemoveClass( "norm-row", ( inIndex % 2 !== 0 ) );

			//Description
			this.$['desc'].setContent( row['desc'] );

			//Date
			var dateObj = new Date( parseInt( row['date'] ) );
			this.$['time'].setContent( dateObj.format( { date: 'long', time: ( row['showTransTime'] === 1 ? 'short' : '' ) } ) );

			var today = new Date();
			if( row['showTransTime'] !== 1 ) {

				today.setHours( 23, 59, 59, 999 );
			}

			this.$.swipeableItem.addRemoveClass( "futureTransaction", ( row['date'] > Date.parse( today ) ) );

			//Balance Display
			this.$['amount'].setContent( formatAmount( row['amount'] ) );

			this.$['amount'].addRemoveClass( "positiveBalance", ( row['amount'] > 0 ) );
			this.$['amount'].addRemoveClass( "negativeBalance", ( row['amount'] < 0 ) );
			this.$['amount'].addRemoveClass( "neutralBalance", ( row['amount'] == 0 ) );

			//Cleared
			this.$['cleared'].setChecked( row['cleared'] === 1 );

			//Account
			this.$['accountIcon'].setSrc( "assets/" + row['acctCategoryIcon'] );
			this.$['account'].setContent( row['acctName'] );

			//Categories
			//Handle split transactions
			if( row['enableCategories'] === 1 ) {

				this.$['category'].show();
				this.$['category'].setContent( Checkbook.globals.transactionManager.formatCategoryDisplay( row['category'], row['category2'] ) );
			} else {

				this.$['category'].hide();
			}

			//Check Number
			this.$['checkNum'].setContent( ( row['checkField'] === 1 && row['checkNum'] && row['checkNum'] !== "" ) ? ( "Check #" + row['checkNum'] ) : "" );

			//Notes
			this.$['note'].setContent( ( row['hideNotes'] === 1 ? "" : row['note'] ) );

			//Row Icons
			var transferCheck = ( row['linkedRecord'] && !isNaN( row['linkedRecord'] ) && row['linkedRecord'] != "" );
			var repeatCheck = ( row['repeatId'] && !isNaN( row['repeatId'] ) && row['repeatId'] != "" );

			this.$['mainBody'].addRemoveClass( "repeatTransferIcon", ( transferCheck && repeatCheck ) );
			this.$['mainBody'].addRemoveClass( "transferIcon", ( transferCheck && !repeatCheck ) );
			this.$['mainBody'].addRemoveClass( "repeatIcon", ( !transferCheck && repeatCheck ) );

			return true;
		}
	},

	acquirePage: function( inSender, inPage ) {

		if( this.where['strings'].length <= 0 ) {

			this.transactions = [];
			this.doLoading( false );
			return;
		}

		var index = inPage * inSender.getPageSize();

		if( this.where['strings'] && this.where['arguments'] &&
			index >= 0 && !this.transactions[index] ) {

			this.doLoading( true );

			Checkbook.globals.transactionManager.searchTransactions(
					this.where['strings'],
					this.where['arguments'],
					this.sortQry,
					{
						"onSuccess": enyo.bind( this, this.acquirePageHandler, index )
					},
					inSender.getPageSize(),//Limit
					index//Offset
				);
		}
	},

	acquirePageHandler: function( offset, results ) {

		for( var i = 0; i < results.length; i++ ) {

			this.transactions[offset + i] = enyo.mixin(
					{
						"amount": prepAmount( results[i]['amount'] )
					},
					results[i]//fetched properties
				);

			this.transactions[offset + i]['desc'] = gts.String.dirtyString( this.transactions[offset + i]['desc'] );
			this.transactions[offset + i]['category'] = gts.String.dirtyString( this.transactions[offset + i]['category'] );
			this.transactions[offset + i]['category2'] = gts.String.dirtyString( this.transactions[offset + i]['category2'] );
			this.transactions[offset + i]['note'] = gts.String.dirtyString( this.transactions[offset + i]['note'] );
		}

		if( this.$['entries'] ) {

			this.$['entries'].refresh();
		}

		this.doLoading( false );
	},
});
