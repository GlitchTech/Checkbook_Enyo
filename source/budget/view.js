/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.budget.view",
//	layoutKind: "FittableRowsLayout",
	classes: "enyo-fit budget-view v-box",//don't want to use this here, but FittableRowsLayout is causing trouble

	style: "height: 100%;",

	dispDate: "",
	sort: 0,
	budgets: [],
	budgetCount: 0,

	published: {
		accountObj: {}
	},

	events: {
		onFinish: ""
	},

	components: [
		{
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
					kind: "onyx.Button",
					classes: "padding-none transparent",
					ontap: "dateChanged",
					components: [
						{
							kind: "onyx.Icon",
							src: "assets/menu_icons/refresh.png"
						}
					]
				}
			]
		},

		{
			classes: "padding-half-bottom padding-half-left padding-half-right",
			style: "border-bottom: 2px solid #cccccc;",
			components: [
				{
					name: "progressHeader",
					layoutKind: "enyo.FittableColumnsLayout",
					classes: "padding-half-bottom",
					style: "margin-top: 0.1em;",
					components: [
						{
							name: "currentMonth",
							classes: "label bold",
							style: "font-size: 1.15rem;",
							fit: true
						}, {
							name: "totalRemaining",
							classes: "bold"
						}
					]
				}, {
					layoutKind: "enyo.FittableColumnsLayout",
					components: [
						{
							name: "totalProgress",
							kind: "onyx.ProgressButton",

							fit: true,

							animateStripes: false,
							showStripes: false,

							minimum: 0,
							maximum: 100,
							position: 0,

							classes: "margin-vert-none no-cancel bold",

							components: [
								{
									name: "totalCurrent"
								}, {
									content: "of",
									style: "padding-left: 5px; padding-right: 5px;"
								}, {
									name: "totalMax"
								}
							]
						}
					]
				}
			]
		},

		{
			name: "entries",
			kind: "gts.LazyList",

			classes: "box-flex-1",

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

					classes: "bordered padding-none",

					tapHighlight: true,//tap
					holdHighlight: false,//hold

					ontap: "tapped",
					//ondelete: "deleted",

					components: [
						{
							classes: "h-box box-align-center padding-std budget-category",

							components: [
								{
									name: "category",
									classes: "box-flex-1"
								}, {
									name: "remaining",
									classes: "padding-right bold"
								}
							]
						}, {
							classes: "h-box box-align-center padding-half-left padding-half-right",

							components: [
								{
									name: "progress",
									kind: "onyx.ProgressButton",

									classes: "box-flex-1 margin-right no-cancel bold",

									animateStripes: false,
									showStripes: false,

									minimum: 0,
									maximum: 100,
									position: 0,

									components: [
										{
											name: "current"
										}, {
											content: "of",
											style: "padding-left: 5px; padding-right: 5px;"
										}, {
											name: "total"
										}
									]
								}, {
									kind: "onyx.Button",
									ontap: "buttonTapped",
									classes: "padding-none margin-none",
									components: [
										{
											kind: "onyx.IconButton",
											src: "assets/menu_icons/settings.png"
										}
									]
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
							kind: "onyx.Button",
							ontap: "dateNow",
							content: "Today",
							classes: "margin-half-right margin-half-left"
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

		this.dispDate = new Date();
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

		this.$['currentMonth'].setContent( this.dispDate.format( { date: "MMMM yyyy", time: "" } ) );

		var progress = result['spent'] / result['spending_limit'] * 100;
		progress = progress || 0;

		var remaining = result['spending_limit'] - result['spent'];
		this.$['totalRemaining'].setContent( formatAmount( Math.abs( remaining ) ) + " " + ( remaining >= 0 ? "left" : "over" ) );
		this.colorText( this.$['totalRemaining'], progress );

		this.$['totalCurrent'].setContent( formatAmount( result['spent'] ) );
		this.$['totalMax'].setContent( formatAmount( result['spending_limit'] ) );

		this.$['totalProgress'].setProgress( progress );
		this.colorBar( this.$['totalProgress'], progress );

		this.$['progressHeader'].reflow();

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

		this.dispDate.setDate( 5 );
		this.dispDate.setMonth( this.dispDate.getMonth() - 1 );

		this.dateChanged();
	},

	dateNow: function() {

		this.dispDate = new Date();

		this.dateChanged();
	},

	dateForward: function() {

		this.dispDate.setDate( 5 );
		this.dispDate.setMonth( this.dispDate.getMonth() + 1 );

		this.dateChanged();
	},

	dateChanged: function() {

		this.loadingDisplay( true );

		enyo.asyncMethod( this, this._dateChanged );
	},

	_dateChanged: function() {

		Checkbook.budget.manager.fetchOverallBudget( this.dispDate.setStartOfMonth(), this.dispDate.setEndOfMonth(), { "onSuccess": enyo.bind( this, this.buildHeaderHandler ) } );
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
					spending_limit: 0,
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

	deleted: function( inSender, inEvent ) {

		this.warn( "NOT YET BUILT" );
		return;

		var row = this.budgets[rowIndex];

		if( row ) {

			Checkbook.budget.manager.deleteBudget( row['budgetId'], { "onSuccess": this.bound['modifyComplete'] } );
		}
	},

	tapped: function( inSender, inEvent ) {

		var row = this.budgets[inEvent.index];

		if( row ) {

			this.log( "NYI" );
			return true;

			enyo.Signals.send(
					"showSearch",
					{
						"category": row['category'],
						"category2": row['category2'],
						"dateStart": this.dispDate.setStartOfMonth(),
						"dateEnd": this.dispDate.setEndOfMonth(),
						"onFinish": enyo.bind( this, this.dateChanged, null, this.dispDate )
					}
				);
		}

		return true;
	},

	buttonTapped: function( inSender, inEvent ) {

		var row = this.budgets[inEvent.index];

		if( row ) {

			enyo.Signals.send(
					"showPanePopup",
					{
						name: "modifyBudgetItem",
						kind: "Checkbook.budget.modify",

						budgetId: row['budgetId'],
						budgetOrder: row['budgetOrder'],
						category: row['category'],
						category2: row['category2'],
						rollOver: row['rollOver'],
						span: row['span'],
						spending_limit: row['spending_limit'],

						onFinish: this.bound['modifyComplete']
					}
				);
		}

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
			progress = progress || 0;

			this.$['category'].setContent( row['category'] + ( row['category2'] !== "%" ? " >> " + row['category2'] : "" ) );

			var remaining = row['spending_limit'] - row['spent'];
			this.$['remaining'].setContent( formatAmount( Math.abs( remaining ) ) + " " + ( remaining >= 0 ? "left" : "over" ) );
			this.colorText( this.$['remaining'], progress );

			this.$['progress'].setProgress( progress );
			this.colorBar( this.$['progress'], progress );

			this.$['current'].setContent( formatAmount( row['spent'] ) );
			this.$['total'].setContent( formatAmount( row['spending_limit'] ) );

			return true;
		}
	},

	acquirePage: function( inSender, inEvent ) {

		var index = inEvent['page'] * inEvent['pageSize'];

		if( index >= 0 && this.budgets.length < this.budgetCount && !this.budgets[index] ) {

			this.loadingDisplay( true );

			Checkbook.budget.manager.fetchBudgets(
					this.dispDate.setStartOfMonth(),
					this.dispDate.setEndOfMonth(),
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
