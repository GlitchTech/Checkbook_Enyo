/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.budget.modify",
	kind: enyo.ModalDialog,

	layoutKind: enyo.VFlexLayout,

	modal: true,
	scrim: true,

	dismissWithClick: true,
	dismissWithEscape: true,

	style: "width: 400px;",

	acctList: [],

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: enyo.Header,
			layoutKind: enyo.HFlexLayout,
			align: "center",

			className: "enyo-header-dark popup-header",
			style: "border-radius: 10px; margin-bottom: 10px;",

			components: [
				{
					name: "title",
					content: $L( "Modify Budget" ),
					className: "bigger",
					style: "text-align: center; margin-right: -32px;",
					flex: 1
				}, {
					kind: enyo.ToolButton,
					icon: "source/images/menu_icons/close.png",
					className: "img-icon",
					style: "text-align: center;",
					onclick: "close"
				}
			]
		}, {
			kind: enyo.Group,
			components: [
				{
					kind: enyo.Item,
					layoutKind: enyo.HFlexLayout,

					className: "enyo-first",

					onclick: "categoryTapped",
					components: [
						{
							name: "category",

							className: "enyo-text-ellipsis",
							flex: 1
						}, {
							content: $L( "Category" ),
							className: "enyo-listselector-label enyo-label"
						}, {
							className: "enyo-listselector-arrow"
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
									content: $L( "Spending Limit" ),
									className: "enyo-label"
								}
							]
						}
					]
				}, {
					showing: false,

					name: "span",
					kind: "GTS.ListSelectorBar",
					labelText: "Time Span",
					choices: [
							"1 month", "2 months", "3 months"
						],
					value: "1 month",

					style: "padding: 10px !important;"
				}, {
					showing: false,

					name: "rollover",
					kind: "GTS.ToggleBar",
					mainText: "Rollover",
					subText: "",

					onText: "Yes",
					offText: "No",

					value: false,

					style: "padding: 10px !important;"
				}
			]
		}, {
			kind: enyo.HFlexBox,
			components: [
				{
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.Button,
					caption: $L( "Cancel" ),

					flex: 3,
					onclick: "close"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "delete",
					kind: enyo.Button,
					caption: $L( "Delete" ),

					flex: 3,
					onclick: "delete",

					className: "enyo-button-negative"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.Button,
					caption: $L( "Save" ),

					flex: 3,
					onclick: "save",

					className: "enyo-button-affirmative"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}
			]
		},

		{
			name: "progress",
			kind: "GTS.progress",

			title: "",
			message: "",
			progress: ""
		}, {
			name: "errorMessage",
			kind: "GTS.system_error",

			errTitle: $L( "Budget Error" ),
			errMessage: "",
			errMessage2: "" ,
			onFinish: "closeErrorMessage"
		},

		{
			name: "categorySystem",
			kind: "Checkbook.transactionCategory.select",
			entireGeneral: true
		},

		{
			name: "manager",
			kind: "Checkbook.budget.manager"
		}
	],

	rendered: function() {

		this.$['categorySystem'].loadCategories( enyo.bind( this, this.inherited, arguments ) );

		this.saveComplete = enyo.bind( this, this.saveComplete );
	},

	openAtCenter: function( inBudget ) {

		this.inherited( arguments );

		this.budgetObj = enyo.mixin(
				{
					budgetId: null,
					category: $L( "Uncategorized" ),
					category2: "%",
					spending_limit: "",
					span: 1,
					rollOver: 0
				},
				inBudget
			);

		this.$['delete'].setShowing( this.budgetObj['budgetId'] && this.budgetObj['budgetId'] >= 0 );

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

			this.$['category'].setContent( this.budgetObj['category'] );
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

		this.$['amount'].setValue( this.budgetObj['spending_limit'] );
	},

	/** Save System **/

	save: function() {

		this.budgetObj['spending_limit'] = ( Object.validNumber( this.$['amount'].getValue() ) ? 0 : Number( Number( this.$['amount'].getValue() ).toFixed( 2 ) ) );

		if( this.budgetObj['spending_limit'] === 0 ) {

			this.$['errorMessage'].load( null, "Spending limit must not be zero.", null, null );
			return;
		}

		delete this.budgetObj['spent'];

		if( this.budgetObj['budgetId'] && this.budgetObj['budgetId'] >= 0 ) {

			this.$['manager'].updateBudget( this.budgetObj, { "onSuccess": this.saveComplete } );
		} else {

			delete this.budgetObj['budgetId'];

			this.$['manager'].createBudget( this.budgetObj, { "onSuccess": this.saveComplete } );
		}
	},

	delete: function() {

		if( this.budgetObj['budgetId'] && this.budgetObj['budgetId'] >= 0 ) {

			this.$['manager'].deleteTransaction( this.budgetObj['budgetId'], { "onSuccess": this.saveComplete } );
		} else {

			this.saveComplete();
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