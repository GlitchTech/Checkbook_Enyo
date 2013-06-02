/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.budget.view",
	layoutKind: "FittableRowsLayout",
	classes: "enyo-fit budget-view",

	style: "height: 100%;",

	sort: 0,
	budgets: [],
	editMode: false,

	published: {
		accountObj: {}
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			name: "header",
			kind: "onyx.Toolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			noStretch: true,
			components: [
				{//Swap between icon for account & spinner when loading data in the background.
					name: "systemIcon",
					kind: "enyo.Image",
					src: "assets/icon_4.png",
					classes: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					name: "loadingSpinner",
					kind: "onyx.Spinner",
					showing: false,
					classes: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					content: "Budget System",
					classes: "enyo-text-ellipsis text-left",
					fit: true
				}, {
					name: "totalCurrent"
				}, {
					name: "totalProgress",
					kind: "onyx.ProgressBar",

					animateStripes: false,
					showStripes: false,

					minimum: 0,
					maximum: 100,
					position: 0,

					classes: "big margin-vert-none",
					style: "width: 200px; margin-left: 10px; margin-right: 10px;"
				}, {
					name: "totalMax"
				},

				{
					name: "editOverlay",
					content: "Edit Budgets",
					classes: "enyo-fit text-center header-overlay rounded",
					showing: false
				}
			]
		},

		{
			name: "entries",

			fit: true,

			content: "TEST"
			/*
			kind: "ReorderableVirtualList",

			classes: "light narrow-column",//Should this be narrow-column?
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
					ontap: "tapped",
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
									content: "of",
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
									kind: "onyx.ProgressBar",

									flex: 1,
									classes: "big",
									style: "margin-right: 10px;",

									minimum: 0,
									maximum: 100,
									position: 0
								}, {
									name: "config",
									kind: enyo.Image,
									src: "assets/config.png"
								}, {
									name: "search",
									kind: enyo.Image,
									src: "assets/search.png"
								}
							]
						}
					]
				}
			]
			*/
		},

		{
			kind: "Checkbook.MoreToolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			classes: "tardis-blue",
			noStretch: true,
			components: [
				{
					name: "backButton",
					kind: "onyx.Button",
					ontap: "doFinish",
					components: [
						{
							kind: "onyx.Icon",
							src: "assets/menu_icons/back.png"
						}
					]
				}, {
					kind: "onyx.MenuDecorator",
					classes: "padding-none margin-vert-none",
					components: [
						{
							kind: "onyx.Button",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/sort.png"
								}
							]
						}, {
							name: "sortMenu",
							kind: "gts.SelectedMenu",

							classes: "bordered-menu",
							floating: true,
							scrim: true,
							scrimclasses: "onyx-scrim-translucent",

							style: "min-width: 225px;",

							onChange: "budgetSortingChanged",

							components: budgetSortOptions,
							value: 0
						}
					]
				},

				{
					classes: "text-middle text-center padding-none margin-vert-none",
					fit: true,
					unmoveable: true,
					components: [
						{
							kind: "onyx.Button",
							ontap: "dateBack",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/back.png"
								}
							]
						}, {
							name: "date",
							kind: "onyx.DatePicker",

							classes: "padding-none date-picker",
							style: "display: inline-block;",

							onchange: "dateChanged",
							dayHidden: true
						}, {
							kind: "onyx.Button",
							ontap: "dateForward",
							components: [
								{
									kind: "onyx.Icon",
									src: "assets/menu_icons/forward.png"
								}
							]
						}
					]
				},

				{
					kind: "onyx.Button",

					ontap: "toggleEdit",

					components: [
						{
							name: "editModeButtonIcon",
							kind: "onyx.Icon",
							src: "assets/menu_icons/lock_closed.png",
							classes: "onyx-icon-button"
						}
					]
				}, {
					name: "addAccountButton",
					kind: "onyx.Button",

					ontap: "addBudget",

					components: [
						{
							kind: "onyx.Icon",
							src: "assets/menu_icons/new.png"
						}
					]
				}
			]
		}
	],

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		// Run our default construction
		this.inherited( arguments );

		// Setup listing of bound methods
		this.bound = {
			modifyComplete: enyo.bind( this, this.modifyComplete )
		};
	},

	rendered: function() {

		this.inherited( arguments );

		this.budgets = [];

		this.dateChanged();
	},

	colorText: function( inSender, progress ) {

		//blue from  0% to 24.99%
		inSender.addRemoveClass( "text-onyx-blue", ( progress < 25 ) );
		//green from 25% to 74.99%
		inSender.addRemoveClass( "text-onyx-green", ( progress >= 25 && progress < 75 ) );
		//yellow from 75% to 99.99%
		inSender.addRemoveClass( "text-onyx-yellow", ( progress >= 75 && progress <= 100 ) );
		//red over 100%
		inSender.addRemoveClass( "text-onyx-red", ( progress > 100 ) );
	},

	colorBar: function( inSender, progress ) {

		var barClass = "";

		if( progress < 25 ) {
			//blue from  0% to 24.99%

			barClass = "onyx-blue";
		} else if( progress >= 25 && progress < 75 ) {
			//green from 25% to 74.99%

			barClass = "onyx-green";
		} else if( progress >= 75 && progress <= 100 ) {
			//yellow from 75% to 99.99%

			barClass = "onyx-yellow";
		} else if( progress > 100 ) {
			//red over 100%

			barClass = "onyx-red";
		}

		inSender.setBarClasses( barClass );
	},

	/** Header Controls **/

	buildHeaderHandler: function( result ) {

		//result['budgetCount']

		var progress = result['spent'] / result['spending_limit'] * 100;
		progress = progress || 0;

		this.$['totalCurrent'].setContent( formatAmount( result['spent'] ) );
		this.$['totalMax'].setContent( formatAmount( result['spending_limit'] ) );

		this.$['totalProgress'].animateProgressTo( progress );

		this.colorBar( this.$['totalProgress'], progress );
		this.colorText( this.$['totalCurrent'], progress );

		this.$['header'].reflow();
	},

	/** Footer Controls **/

	budgetSortingChanged: function() {

		this.log( arguments );
		return;

		if( this.sort === inSender.value ) {
			//No change, abort
			return;
		}

		this.sort = inSender.value;

		this.budgets = [];
		//this.$['entries'].punt();
	},

	dateBack: function() {

		var date = this.$['date'].getValue();

		date.setDate( 5 );
		date.setMonth( date.getMonth() - 1 );

		this.$['date'].setValue( date );
		this.$['date'].valueChanged();

		this.dateChanged();
	},

	dateForward: function() {

		var date = this.$['date'].getValue();

		date.setDate( 5 );
		date.setMonth( date.getMonth() + 1 );

		this.$['date'].setValue( date );
		this.$['date'].valueChanged();

		this.dateChanged();
	},

	dateChanged: function() {

		this.budgets = [];
		//this.$['entries'].punt();

		Checkbook.budget.manager.fetchOverallBudget( this.$['date'].getValue().setStartOfMonth(), this.$['date'].getValue().setEndOfMonth(), { "onSuccess": enyo.bind( this, this.buildHeaderHandler ) } );
	},

	toggleEdit: function() {

		this.editMode = !this.editMode;

		this.$['editModeButtonIcon'].setSrc( this.editMode ? "assets/menu_icons/lock_open.png" : "assets/menu_icons/lock_closed.png" );
		this.$['editOverlay'].setShowing( this.editMode );
		this.$['header'].reflow();
	},

	addBudget: function() {

		enyo.Signals.send(
				"showPanePopup",
				{
					name: "modifyBudgetItem",
					kind: "Checkbook.budget.modify",

					budgetId: null,
					category: "Uncategorized",
					category2: "%",
					spending_limit: "",
					span: 1,
					rollOver: 0,

					onFinish: this.bound['modifyComplete']
				}
			);

		return true;
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
						Checkbook.globals.gts_db.getUpdate(
								"budgets",
								{ "budgetOrder": i },
								{ "budgetId": this.budgets[i]['budgetId'] }
							)
					);
			}

			Checkbook.globals.gts_db.queries( qryOrder );

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

				enyo.Signals.send(
						"showSearch",
						{
							"category": row['category'],
							"category2": row['category2'],
							"dateStart": this.$['date'].getValue().setStartOfMonth(),
							"dateEnd": this.$['date'].getValue().setEndOfMonth(),
							"onFinish": enyo.bind( this, this.dateChanged, null, this.$['date'].getValue() )
						}
					);
			}
		}
		/*
		var row = this.accounts[inEvent.index];

		if( row ) {

			var nextAction;
			var nextActionEvent = {};

			if( this.editMode ) {
				//Edit Account

				nextAction = "showPanePopup";
				nextActionEvent = {
						name: "editAccount",
						kind: "Checkbook.accounts.modify",
						acctId: this.accounts[inEvent.index]['acctId'],
						onFinish: enyo.bind( this, this.editAccountComplete, inEvent.index )
					};
			} else {
				//View Account

				nextAction = "showSearch";
				nextActionEvent = {
						account: row
					};
			}

			enyo.Signals.send(
					"showPanePopup",
					{
						name: "modifyBudgetItem",
						kind: "Checkbook.budget.modify",

						budgetId: null,
						category: "Uncategorized",
						category2: "%",
						spending_limit: "",
						span: 1,
						rollOver: 0,

						onFinish: this.bound['modifyComplete']
					}
				);
		}

		return true;
		*/
	},

	deleted: function( inSender, rowIndex ) {

		var row = this.budgets[rowIndex];

		if( row ) {

			Checkbook.budget.manager.deleteBudget( row['budgetId'], { "onSuccess": this.bound['modifyComplete'] } );
		}
	},

	modifyComplete: function() {

		this.budgets = [];
		//this.$['entries'].punt();

		this.dateChanged();
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.budgets[inIndex];

		if( row ) {

			var progress = 100 * row['spent'] / row['spending_limit'];

			this.$['category'].setContent( row['category'] + ( row['category2'] !== "%" ? " >> " + row['category2'] : "" ) );

			this.$['current'].setContent( formatAmount( row['spent'] ) );
			this.$['total'].setContent( formatAmount( row['spending_limit'] ) );

			this.colorBar( this.$['progress'], progress );
			this.colorText( this.$['current'], progress );

			this.$['progress'].animateProgressTo( progress );

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

			Checkbook.budget.manager.fetchBudgets(
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

			this.budgets[offset + i]['category'] = gts.String.dirtyString( this.budgets[offset + i]['category'] );
			this.budgets[offset + i]['category2'] = gts.String.dirtyString( this.budgets[offset + i]['category2'] );
		}

		this.$['entries'].refresh();

		this.loadingDisplay( false );
	},

	loadingDisplay: function( status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['systemIcon'].setShowing( !status );
	}
});
