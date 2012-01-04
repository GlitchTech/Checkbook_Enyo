/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.search.results",
	kind: enyo.SlidingView,
	layoutKind: enyo.VFlexLayout,

	flex: 1,

	where: {
		strings: null,
		arguments: null
	},

	transactions: [],
	sort: null,
	sortQry: null,

	events: {
		onLoading: ""
	},

	components: [
		{
			name: "entries",
			kind: enyo.VirtualList,

			flex: 1,
			className: "checkbook-stamp",

			onSetupRow: "setupRow",
			onAcquirePage: "acquirePage",
			//pageSize: 15,

			components: [
				{
					kind: enyo.SwipeableItem,

					tapHighlight: true,
					onclick: "",
					onmousehold: "",
					onConfirm: "",

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
									name: "amount",
									style: "text-align: right;"
								}, {
									name: "cleared",
									onclick: "transactionCleared",
									kind: enyo.CheckBox,

									style: "margin-left: 15px;"
								}
							]
						}, {
							name: "category",
							className: "small"
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
			className: "tardis-blue",
			pack: "start",
			components: [
				{
					kind: enyo.GrabButton
				}, {
					kind: enyo.ToolButtonGroup,
					style: "margin-left: 50px;",
					components: [
						{
							onclick: "sortClicked",
							icon: "source/images/menu_icons/sort.png",
							className: "enyo-grouped-toolbutton-dark"
						}
					]
				}
			]
		},

		{
			name: "sortMenu",
			kind: "Checkbook.selectedMenu"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		if( transactionSortOptions.length <= 0 ) {

			enyo.application.transactionManager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	search: function( qryStrs, qryArgs ) {

		this.where = {
				strings: qryStrs,
				arguments: qryArgs
			};

		this.transactions = [];
		this.$['entries'].punt();

		this.doLoading( true );
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
			this.$['time'].setContent( dateObj.format( { date: 'long', time: 'short' } ) );

			this.$.swipeableItem.addRemoveClass( "futureTransaction", ( row['date'] > Date.parse( new Date() ) ) );

			//Balance Display
			this.$['amount'].setContent( formatAmount( row['amount'] ) );

			this.$['amount'].addRemoveClass( "positiveFunds", ( row['amount'] > 0 ) );
			this.$['amount'].addRemoveClass( "negativeFunds", ( row['amount'] < 0 ) );
			this.$['amount'].addRemoveClass( "neutralFunds", ( row['amount'] == 0 ) );

			//Cleared
			this.$['cleared'].setChecked( row['cleared'] === 1 );

			//Categories
			//Handle split transactions
			this.$['category'].setContent( enyo.application.transactionManager.formatCategoryDisplay( row['category'], row['category2'] ) );

			//Check Number
			this.$['checkNum'].setContent( ( row['checkNum'] && row['checkNum'] !== "" ) ? ( "Check #" + row['checkNum'] ) : "" );

			//Notes
			this.$['note'].setContent( row['note'] );

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

		var index = inPage * inSender.getPageSize();

		if( this.where['strings'] && this.where['arguments'] &&
			index >= 0 && !this.transactions[index] ) {

			this.doLoading( true );

			enyo.application.transactionManager.searchTransactions(
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
/*
results = {
	account: 8
	amount: -6.38
	category: ""
	category2: ""
	checkNum: ""
	cleared: 1
	date: "1229314560000.0"
	desc: "Gas"
	itemId: 2552
	linkedAccount: null
	linkedRecord: null
	note: ""
	repeatId: null
}
*/

			this.transactions[offset + i] = enyo.mixin(
					{
						"amount": prepAmount( results[i]['amount'] )
					},
					results[i]//fetched properties
				);

			this.transactions[offset + i]['desc'] = this.transactions[offset + i]['desc'].dirtyString();
			this.transactions[offset + i]['category'] = this.transactions[offset + i]['category'].dirtyString();
			this.transactions[offset + i]['category2'] = this.transactions[offset + i]['category2'].dirtyString();
			this.transactions[offset + i]['note'] = this.transactions[offset + i]['note'].dirtyString();
		}

		this.$['entries'].refresh();

		this.doLoading( false );
	},
});