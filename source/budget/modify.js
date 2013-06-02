/* Copyright © 2013, GlitchTech Science */

enyo.kind({

	name: "Checkbook.budget.modify",
	kind: "FittableRows",
	classes: "enyo-fit budget-modify",

	style: "height: 100%;",

	acctList: [],

	published: {
		budgetId: null,
		category: "Uncategorized",
		category2: "%",
		spending_limit: "",
		span: 1,
		rollOver: 0
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					name: "title",
					content: "Modify Budget",
					classes: "bigger"
				}
			]
		}, {
			kind: "enyo.Scroller",
			horizontal: "hidden",
			classes: "rich-brown-gradient",
			fit: true,
			components: [
				{
					classes: "light narrow-column",
					style: "min-height: 100%;",
					components: [
						{
							kind: "onyx.Groupbox",
							classes: "padding-half-top padding-half-bottom",
							components: [
								{
									kind: "onyx.InputDecorator",
									layoutKind: "FittableColumnsLayout",
									noStretch: true,

									ontap: "categoryTapped",

									components: [
										{
											name: "category",
											fit: true
										}, {
											kind: "onyx.Button",
											classes: "label arrow",
											content: "Category"
										}
									]
								}, {
									kind: "onyx.InputDecorator",
									layoutKind: "FittableColumnsLayout",
									noStretch: true,
									components: [
										{
											name: "amount",
											kind: "gts.DecimalInput",

											fit: true,
											atm: false,
											selectOnFocus: true,

											placeholder: "0.00"
										}, {
											content: "Spending Limit",
											classes: "label"
										}
									]
								}
							]
						}, {
							name: "delete",
							kind: "onyx.Button",
							content: "Delete",

							ontap: "delete",

							classes: "onyx-negative"
						}

								, {
									showing: false,

									name: "span",
									//kind: "gts.ListSelectorBar",
									labelText: "Time Span",
									choices: [
											"1 month", "2 months", "3 months"
										],
									value: "1 month",

									style: "padding: 10px !important;"
								}, {
									showing: false,

									name: "rollover",
									//kind: "gts.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Rollover",
									subText: "",

									onText: "Yes",
									offText: "No",

									value: false,

									style: "padding: 10px !important;"
								}
					]
				}
			]
		}, {
			kind: "onyx.Toolbar",
			classes: "text-center two-button-toolbar",
			components: [
				{
					kind: "onyx.Button",
					content: "Cancel",

					ontap: "doFinish"
				}, {
					content: ""
				}, {
					kind: "onyx.Button",
					content: "Save",

					ontap: "save",

					classes: "onyx-affirmative"
				}
			]
		},

		{
			name: "progress",
		//	kind: "gts.progress",

			title: "",
			message: "",
			progress: ""
		}, {
			name: "errorMessage",
		//	kind: "gts.system_error",

			errTitle: "Budget Error",
			errMessage: "",
			errMessage2: "" ,
			onFinish: "closeErrorMessage"
		},

		{
			name: "categorySystem",
			kind: "Checkbook.transactionCategory.select",
			entireGeneral: true
		}
	],

	destroy: function() {

		this.$['categorySystem'].hide();

		this.inherited( arguments );
	},

	rendered: function() {

		this.inherited( arguments );

		this.$['categorySystem'].loadCategories( enyo.bind( this, this.completeLoad ) );
	},

	completeLoad: function() {

		this.$['delete'].setShowing( this.budgetId && this.budgetId >= 0 );

		this.renderCategory();
		this.renderAmount();
	},

	/** Category Control **/

	categoryTapped: function() {

		this.$['categorySystem'].getCategoryChoice( enyo.bind( this, this.categorySelected ), null );
	},

	categorySelected: function( obj ) {

		this.category = obj['category'];
		this.category2 = obj['category2'] != "<strong>All</strong>" ? obj['category2'] : "%";

		this.renderCategory();
	},

	renderCategory: function() {

		if( this.category2 === "%" ) {

			this.$['category'].setContent( this.category );
		} else {

			this.$['category'].setContent( this.category2 + " [" + this.category + "]" );
		}
	},

	/** Amount Control **/

	renderAmount: function() {

		this.$['amount'].setValue( this.spending_limit );
	},

	/** Save System **/

	save: function() {

		this.spending_limit = ( gts.Object.validNumber( this.$['amount'].getValue() ) ? 0 : Number( Number( this.$['amount'].getValue() ).toFixed( 2 ) ) );

		if( this.spending_limit === 0 ) {

			this.$['errorMessage'].load( null, "Spending limit must not be zero.", null, null );
			return;
		}

		var budgetObj = {
				budgetId: this.budgetId,
				category: this.category,
				category2: this.category2,
				spending_limit: this.spending_limit,
				span: this.span,
				rollOver: this.rollOver
			};

		if( this.budgetId && this.budgetId >= 0 ) {

			Checkbook.budget.manager.updateBudget( budgetObj, { "onSuccess": enyo.bind( this, this.saveComplete ) } );
		} else {

			delete this.budgetId;

			Checkbook.budget.manager.createBudget( budgetObj, { "onSuccess": enyo.bind( this, this.saveComplete ) } );
		}
	},

	delete: function() {

		if( this.budgetId && this.budgetId >= 0 ) {

			Checkbook.budget.manager.deleteBudget( this.budgetId, { "onSuccess": enyo.bind( this, this.saveComplete ) } );
		} else {

			enyo.bind( this, this.saveComplete )();
		}
	},

	saveComplete: function() {

		this.doFinish();
	},

	closeErrorMessage: function() {

		this.$['errorMessage'].close();
	}
});
