/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.budget.view",
	layoutKind: "FittableRowsLayout",
	classes: "enyo-fit budget-view",

	style: "height: 100%;",

	sort: 0,
	budgets: [],
	budgetCount: 0,
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
			kind: "gts.LazyList",

			fit: true,
			reorderable: true,
			enableSwipe: false,
			touchOverscroll: false,

			onAcquirePage: "acquirePage",

			onSetupItem: "setupRow",
			onReorder: "reorder",
			onSetupReorderComponents: "setupReorderComponents",
			onSetupPinnedReorderComponents: "",
			onSetupSwipeItem: "",
			onSwipeComplete: "",

			components: [
				{
					kind: "gts.Item",

					classes: "bordered",

					tapHighlight: true,//tap
					holdHighlight: false,//hold

					ontap: "tapped",
					//ondelete: "deleted",

					components: [
						{
							classes: "h-box box-align-center",

							components: [
								{
									name: "category",
									classes: "box-flex-1"
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
							classes: "h-box box-align-center",

							components: [
								{
									name: "progress",
									kind: "onyx.ProgressBar",

									classes: "box-flex-1 big margin-right",

									animateStripes: false,
									showStripes: false,

									minimum: 0,
									maximum: 100,
									position: 0
								}, {
									name: "config",
									kind: "enyo.Image",
									src: "assets/config.png",
									classes: "img-icon"
								}, {
									name: "search",
									kind: "enyo.Image",
									src: "assets/search.png",
									classes: "img-icon"
								}
							]
						}
					]
				}
			],

			reorderComponents: [
				{
					name: "reorderContent",
					classes: "tardis-blue-trans padding-std",
					style: "max-width: 50%;",
					components: [
						{
							name: "reorderName",
							classes: "text-ellipsis accountName"
						}, {
							name: "reorderProgress",
							kind: "onyx.ProgressBar",

							animateStripes: false,
							showStripes: false,

							minimum: 0,
							maximum: 100,
							position: 0
						}
					]
				}
			]
		},

		{
			kind: "Checkbook.MoreToolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			classes: "tardis-blue",
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

					onSelect: "budgetSortingChanged",

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

		this.budgetCount = result['budgetCount'];

		var progress = result['spent'] / result['spending_limit'] * 100;
		progress = progress || 0;

		this.$['totalCurrent'].setContent( formatAmount( result['spent'] ) );
		this.$['totalMax'].setContent( formatAmount( result['spending_limit'] ) );

		this.$['totalProgress'].setProgress( progress );

		this.colorBar( this.$['totalProgress'], progress );
		this.colorText( this.$['totalCurrent'], progress );

		this.$['header'].reflow();

		this.resetList();
	},

	/** Footer Controls **/

	budgetSortingChanged: function( inSender, inEvent ) {

		if( !inEvent.selected || this.sort === inEvent.selected.value ) {
			//No change, abort

			return;
		}

		this.sort = inEvent.selected.value;

		this.resetList();
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

	resetList: function() {

		this.budgets = [];

		this.$['entries'].setCount( 0 );
		this.$['entries'].reset();

		this.$['entries'].lazyLoad();
	},

	reorder: function( inSender, inEvent ) {
		//Row moved

		if( inEvent.reorderTo != inEvent.reorderFrom && inEvent.reorderTo > -1 && inEvent.reorderTo < this.budgets.length ) {

			var movedItem = enyo.clone( this.budgets[inEvent.reorderFrom] );
			this.budgets.splice( inEvent.reorderFrom, 1 );
			this.budgets.splice( ( inEvent.reorderTo ), 0, movedItem );

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

	setupReorderComponents: function( inSender, inEvent ) {

		var row = this.budgets[inEvent.index];

		if( row ) {

			var progress = 100 * row['spent'] / row['spending_limit'];

			this.colorBar( this.$['reorderProgress'], progress );
			this.$['reorderProgress'].setProgress( progress );

			this.$['reorderName'].setContent( row['category'] + ( row['category2'] !== "%" ? " >> " + row['category2'] : "" ) );
		}
	},

	deleted: function( inSender, rowIndex ) {

		this.warn( "NOT YET BUILT" );
		return;

		var row = this.budgets[rowIndex];

		if( row ) {

			Checkbook.budget.manager.deleteBudget( row['budgetId'], { "onSuccess": this.bound['modifyComplete'] } );
		}
	},

	tapped: function( inSender, inEvent, rowIndex ) {

		this.warn( "NOT YET BUILT" );

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
		*/

		return true;
	},

	modifyComplete: function() {

		this.budgets = [];
		//this.$['entries'].punt();

		this.dateChanged();
	},

	setupRow: function( inSender, inEvent ) {

		var row = this.budgets[inEvent.index];

		if( row ) {

			var progress = 100 * row['spent'] / row['spending_limit'];

			this.$['category'].setContent( row['category'] + ( row['category2'] !== "%" ? " >> " + row['category2'] : "" ) );

			this.$['current'].setContent( formatAmount( row['spent'] ) );
			this.$['total'].setContent( formatAmount( row['spending_limit'] ) );

			this.colorBar( this.$['progress'], progress );
			this.colorText( this.$['current'], progress );

			this.$['progress'].setProgress( progress );

			this.$['search'].setShowing( !this.editMode );
			this.$['config'].setShowing( this.editMode );

			return true;
		}
	},

	acquirePage: function( inSender, inEvent ) {

		var index = inEvent['page'] * inEvent['pageSize'];

		if( index >= 0 && this.budgets.length < this.budgetCount && !this.budgets[index] ) {

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

			return true;
		}

		return false;
	},

	buildPage: function( offset, results ) {
		//Parse page data

		this.log( results );

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

		this.$['entries'].setCount( this.budgets.length );
		this.$['entries'].refresh();

		this.loadingDisplay( false );
	},

	loadingDisplay: function( status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['systemIcon'].setShowing( !status );
	}
});
