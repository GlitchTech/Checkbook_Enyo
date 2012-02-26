/* Copyright © 2011, GlitchTech Science */

enyo.kind({

	name: "Checkbook.budget.view",
	kind: enyo.VFlexBox,

	flex: 1,
	style: "height: 100%;",

	sort: 0,
	budgets: [],

	published: {
		accountObj: {}
	},

	events: {
		onFinish: "",
		onSearchView: ""
	},

	components: [
		{
			kind: enyo.PageHeader,
			components: [
				{//Swap between icon for account & spinner when loading data in the background.
					showing: true,

					name: "systemIcon",
					kind: enyo.Image,
					src: "source/images/icon_4.png",
					className: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					showing: false,

					name: "loadingSpinner",
					kind: "GTS.Spinner",
					className: "img-icon",
					style: "margin: 0px 15px 5px 0;"
				}, {
					content: $L( "Budget System" ),
					className: "bigger",
					style: "margin-top: -6px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "totalCurrent",
					style: "margin-top: -5px;"
				}, {
					name: "totalProgress",
					kind: enyo.ProgressBar,

					className: "big",
					style: "width: 200px; margin-left: 10px; margin-right: 10px;",

					minimum: 0,
					maximum: 100,
					position: 0
				}, {
					name: "totalMax",
					style: "margin-top: -5px;"
				}
			]
		},

		{
			name: "entries",
			kind: "ReorderableVirtualList",

			className: "light narrow-column",//Should this be narrow-column?
			style: "padding-left: 0px; padding-right: 0px;",
			flex: 1,

			reorderable: true,

			onReorder: "reorder",
			onSetupRow: "setupRow",
			onAcquirePage: "acquirePage",

			components: [
				{
					kind: enyo.SwipeableItem,

					style: "padding-right: 7px;",

					tapHighlight: true,
					onclick: "tapped",
					onConfirm: "deleted",

					components: [
						{
							layoutKind: enyo.HFlexLayout,
							align: "center",

							components: [
								{
									name: "category",

									flex: 1
								}, {
									name: "current"
								}, {
									content: $L( "of" ),
									style: "padding-left: 5px; padding-right: 5px;"
								}, {
									name: "total"
								}
							]
						}, {
							layoutKind: enyo.HFlexLayout,
							align: "center",

							components: [
								{
									name: "progress",
									kind: enyo.ProgressBar,

									flex: 1,
									className: "big",
									style: "margin-right: 10px;",

									minimum: 0,
									maximum: 100,
									position: 0
								}, {
									name: "config",
									kind: enyo.Image,
									src: "source/images/config.png"
								}, {
									name: "search",
									kind: enyo.Image,
									src: "source/images/search.png"
								}
							]
						}
					]
				}
			]
		},

		{
			kind: enyo.Toolbar,
			className: "tardis-blue",
			components: [
				{
					kind: enyo.ToolButtonGroup,
					components: [
						{
							caption: $L( "Back" ),
							className: "enyo-grouped-toolbutton-dark",
							onclick: "doFinish"
						}, {
							icon: "source/images/menu_icons/sort.png",
							className: "enyo-grouped-toolbutton-dark",
							onclick: "sortButtonClicked"
						}
					]
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							onclick: "dateBack",
							className: "enyo-grouped-toolbutton-dark",
							icon: "source/images/menu_icons/back.png"
						}
					]
				}, {
					name: "date",
					kind: enyo.DatePicker,

					className: "enyo-grouped-toolbutton-dark",

					label: "",
					hideDay: true,
					onChange: "dateChanged"
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							onclick: "dateForward",
							className: "enyo-grouped-toolbutton-dark",
							icon: "source/images/menu_icons/forward.png"
						}
					]
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							name: "editModeToggle",
							toggling: true,
							className: "enyo-grouped-toolbutton-dark",
							icon: "source/images/menu_icons/lock.png",
							onclick: "toggleEdit"
						}, {
							icon: "source/images/menu_icons/new.png",
							className: "enyo-grouped-toolbutton-dark",
							onclick: "addBudget"
						}
					]
				}
			]
		},

		{
			name: "sortMenu",
			kind: "Checkbook.selectedMenu",
			components: budgetSortOptions
		},

		{
			name: "manager",
			kind: "Checkbook.budget.manager"
		},

		{
			name: "modify",
			kind: "Checkbook.budget.modify",
			onFinish: "modifyComplete"
		}
	],

	/**
	 * @private
	 * @constructs
	 */
	constructor: function() {

		// Run our default construction
		this.inherited( arguments );

		// Setup listing of bound methods
		// Cuts down on memory usage spikes, since bind() creates a new method every call, but causes more initial memory to be allocated
		this.bound = {
			modifyComplete: enyo.bind( this, this.modifyComplete )
		};
	},

	rendered: function() {

		this.inherited( arguments );

		this.budgets = [];

		this.buildHeader();
	},

	colorize: function( inSender, progress ) {

		//blue from  0% to 24.99%
		inSender.addRemoveClass( "blue", ( progress < 25 ) );
		//green from 25% to 74.99%
		inSender.addRemoveClass( "green", ( progress >= 25 && progress < 75 ) );
		//yellow from 75% to 99.99%
		inSender.addRemoveClass( "yellow", ( progress >= 75 && progress <= 100 ) );
		//red over 100%
		inSender.addRemoveClass( "red", ( progress > 100 ) );
	},

	menuItemClick: function() {
		//All menu items come here

		var inSender = arguments[arguments.length === 2 ? 0 : 1];

		if( inSender.menuParent.toLowerCase() === "budgetsortoptions" ) {
			//Sort menu

			console.log( inSender );

			if( this.sort === inSender.value ) {
				//No change, abort
				return;
			}

			this.sort = inSender.value;

			this.budgets = [];
			this.$['entries'].punt();
		}
	},

	/** Header Controls **/

	buildHeader: function() {

		this.$['manager'].fetchOverallBudget( this.$['date'].getValue().setStartOfMonth(), this.$['date'].getValue().setEndOfMonth(), { "onSuccess": enyo.bind( this, this.buildHeaderHandler ) } );
	},

	buildHeaderHandler: function( result ) {

		//result['budgetCount']

		var progress = result['spent'] / result['spending_limit'] * 100;

		this.$['totalCurrent'].setContent( formatAmount( result['spent'] ) );
		this.$['totalMax'].setContent( formatAmount( result['spending_limit'] ) );

		this.$['totalProgress'].setPosition( progress );

		this.colorize( this.$['totalProgress'], progress );
		this.colorize( this.$['totalCurrent'], progress );
	},

	/** Footer Controls **/

	sortButtonClicked: function( inSender, inEvent ) {

		this.$['sortMenu'].openAtControl( inSender, this.sort );
	},

	dateBack: function() {

		var date = this.$['date'].getValue();

		date.setDate( 5 );
		date.setMonth( date.getMonth() - 1 );

		this.$['date'].setValue( date );

		this.dateChanged( null, date );
	},

	dateForward: function() {

		var date = this.$['date'].getValue();

		date.setDate( 5 );
		date.setMonth( date.getMonth() + 1 );

		this.$['date'].setValue( date );

		this.dateChanged( null, date );
	},

	dateChanged: function( inSender, date ) {

		this.budgets = [];
		this.$['entries'].punt();

		this.$['manager'].fetchOverallBudget( this.$['date'].getValue().setStartOfMonth(), this.$['date'].getValue().setEndOfMonth(), { "onSuccess": enyo.bind( this, this.buildHeader ) } );
	},

	toggleEdit: function() {

		if( this.$['editModeToggle'].getDepressed() ) {

			this.$['editModeToggle'].setIcon( "source/images/menu_icons/unlock.png" );
		} else {

			this.$['editModeToggle'].setIcon( "source/images/menu_icons/lock.png" );
		}

		this.$['entries'].refresh();
	},

	addBudget: function() {

		this.$['modify'].openAtCenter();
	},

	/** List Control **/

	reorder: function( inSender, toIndex, fromIndex ) {

		if( toIndex != fromIndex && toIndex > -1 && toIndex < this.budgets.length ) {

			var temp = this.budgets.splice( fromIndex, 1 );
			var bottom = this.budgets.slice( toIndex );

			this.budgets.length = toIndex;
			this.budgets.push.apply( this.budgets, temp );
			this.budgets.push.apply( this.budgets, bottom );

			var qryOrder = [];

			for( var i = 0; i < this.budgets.length; i++ ) {

				qryOrder.push(
						enyo.application.gts_db.getUpdate(
								"budgets",
								{ "budgetOrder": i },
								{ "budgetId": this.budgets[i]['budgetId'] }
							)
					);
			}

			enyo.application.gts_db.queries( qryOrder );

			this.sort = 0;

			this.$['entries'].refresh();
		}
	},

	tapped: function( inSender, inEvent, rowIndex ) {

		var row = this.budgets[rowIndex];

		if( row ) {

			if( this.$['editModeToggle'].getDepressed() ) {

				this.$['modify'].openAtCenter( row );
			} else {

				enyo.nextTick(
						this,
						this.doSearchView,
						null,
						{
							category: row['category'],
							category2: row['category2'],
							dateStart: this.$['date'].getValue().setStartOfMonth(),
							dateEnd: this.$['date'].getValue().setEndOfMonth(),
							onFinish: enyo.bind( this, this.dateChanged, null, this.$['date'].getValue() )
						}
					);
			}
		}
	},

	deleted: function( inSender, rowIndex ) {

		var row = this.budgets[rowIndex];

		if( row ) {

			this.$['manager'].deleteBudget( row['budgetId'], { "onSuccess": this.bound['modifyComplete'] } );
		}
	},

	modifyComplete: function() {

		this.budgets = [];
		this.$['entries'].punt();

		this.buildHeader();
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.budgets[inIndex];

		if( row ) {

			var progress = 100 * row['spent'] / row['spending_limit'];

			this.$['category'].setContent( row['category'] + ( row['category2'] !== "%" ? " >> " + row['category2'] : "" ) );

			this.$['current'].setContent( formatAmount( row['spent'] ) );
			this.$['total'].setContent( formatAmount( row['spending_limit'] ) );

			this.colorize( this.$['progress'], progress );
			this.colorize( this.$['current'], progress );

			this.$['progress'].setPosition( progress );

			this.$['search'].setShowing( !this.$['editModeToggle'].getDepressed() );
			this.$['config'].setShowing( this.$['editModeToggle'].getDepressed() );

			return true;
		}
	},

	acquirePage: function( inSender, inPage ) {

		var index = inPage * inSender.getPageSize();

		if( index < 0 ) {
			//No indexes below zero, don't bother calling

			return;
		}

		if( !this.budgets[index] ) {

			this.loadingDisplay( true );

			this.$['manager'].fetchBudgets(
					this.$['date'].getValue().setStartOfMonth(),
					this.$['date'].getValue().setEndOfMonth(),
					{
						"onSuccess": enyo.bind( this, this.buildPage, index )
					},
					this.sort,
					inSender.getPageSize(),//Limit
					index//Offset
				);
		}
	},

	buildPage: function( offset, results ) {
		//Parse page data

		for( var i = 0; i < results.length; i++ ) {
/*
results = {
	budgetId: 2
	budgetOrder: null
	category: "Auto & Transport"
	category2: "Gas & Fuel"
	rollOver: null
	span: null
	spending_limit: 30
	spent: 98.4
}
*/
			this.budgets[offset + i] =  results[i];

			this.budgets[offset + i]['category'] = this.budgets[offset + i]['category'].dirtyString();
			this.budgets[offset + i]['category2'] = this.budgets[offset + i]['category2'].dirtyString();
		}

		this.$['entries'].refresh();

		this.loadingDisplay( false );
	},

	loadingDisplay: function( status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['systemIcon'].setShowing( !status );
	}
});