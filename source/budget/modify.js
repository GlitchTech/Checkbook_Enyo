/* Copyright © 2013, GlitchTech Science */

enyo.kind({

	name: "Checkbook.budget.modify",
	kind: "FittableRows",
	classes: "enyo-fit",

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
								/*{
									//////////////////////////////////
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,

									classes: "enyo-first",

									ontap: "categoryTapped",
									components: [
										{
											name: "category",

											classes: "enyo-text-ellipsis",
											flex: 1
										}, {
											content: "Category",
											classes: "enyo-listselector-label enyo-label"
										}, {
											classes: "enyo-listselector-arrow"
										}
									]
								}, {
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,
									tapHightlight: false,
									components: [
										{
											name: "amount",
											kind: enyo.Input,
											hint: "0.00",

											selectAllOnFocus: true,
											onkeypress: "amountKeyPress",//Key possibility filter

											flex: 1,
											components: [
												{
													content: "Spending Limit",
													classes: "enyo-label"
												}
											]
										}
									]
								}, {
									showing: false,

									name: "span",
									kind: "gts.ListSelectorBar",
									labelText: "Time Span",
									choices: [
											"1 month", "2 months", "3 months"
										],
									value: "1 month",

									style: "padding: 10px !important;"
								}, {
									showing: false,

									name: "rollover",
									kind: "gts.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Rollover",
									subText: "",

									onText: "Yes",
									offText: "No",

									value: false,

									style: "padding: 10px !important;"
								}, {
									name: "delete",
									kind: "onyx.Button",
									content: "Delete",

									ontap: "delete",

									classes: "onyx-negative"
								}*/
									//////////////////////////////////
							]
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

					ontap: "close"
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
			onHide: ""
		}
	],

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

		enyo.mixin( this.budgetObj, obj );
		this.renderCategory();
	},

	renderCategory: function() {

		if( this.budgetObj['category2'] === "%" ) {

			this.$['category'].setContent( this.category );
		} else {

			this.$['category'].setContent( this.budgetObj['category2'] );
		}
	},

	/** Amount Control **/

	amountKeyPress: function( inSender, inEvent ) {

		if( !( inEvent.keyCode >= 48 && inEvent.keyCode <= 57 ) && inEvent.keyCode !== 46 ) {

			inEvent.preventDefault();
		}
	},

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

		delete this.spent;

		if( this.budgetId && this.budgetId >= 0 ) {

			Checkbook.budget.manager.updateBudget( this.budgetObj, { "onSuccess": enyo.bind( this, this.saveComplete ) } );
		} else {

			delete this.budgetId;

			Checkbook.budget.manager.createBudget( this.budgetObj, { "onSuccess": enyo.bind( this, this.saveComplete ) } );
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

		this.close();
		this.doFinish();
	},

	closeErrorMessage: function() {

		this.$['errorMessage'].close();
	}
});
