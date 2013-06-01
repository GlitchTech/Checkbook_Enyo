/* Copyright © 2013, GlitchTech Science */

enyo.kind({

	name: "Checkbook.budget.modify",
//	kind: enyo.ModalDialog,
//	layoutKind: enyo.VFlexLayout,

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
					content: "Modify Budget",
					className: "bigger",
					style: "text-align: center; margin-right: -32px;",
					flex: 1
				}, {
					kind: enyo.ToolButton,
					icon: "assets/menu_icons/close.png",
					className: "img-icon",
					style: "text-align: center;",
					ontap: "close"
				}
			]
		}, {
			kind: enyo.Group,
			components: [
				{
					kind: enyo.Item,
					layoutKind: enyo.HFlexLayout,

					className: "enyo-first",

					ontap: "categoryTapped",
					components: [
						{
							name: "category",

							className: "enyo-text-ellipsis",
							flex: 1
						}, {
							content: "Category",
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
									content: "Spending Limit",
									className: "enyo-label"
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
				}
			]
		}, {
			kind: enyo.HFlexBox,
			components: [
				{
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: "onyx.Button",
					caption: "Cancel",

					flex: 3,
					ontap: "close"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "delete",
					kind: "onyx.Button",
					caption: "Delete",

					flex: 3,
					ontap: "delete",

					className: "onyx-negative"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: "onyx.Button",
					caption: "Save",

					flex: 3,
					ontap: "save",

					className: "onyx-affirmative"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}
			]
		},

		{
			name: "progress",
			kind: "gts.progress",

			title: "",
			message: "",
			progress: ""
		}, {
			name: "errorMessage",
			kind: "gts.system_error",

			errTitle: "Budget Error",
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
					category: "Uncategorized",
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

		this.budgetObj['spending_limit'] = ( gts.Object.validNumber( this.$['amount'].getValue() ) ? 0 : Number( Number( this.$['amount'].getValue() ).toFixed( 2 ) ) );

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

			this.$['manager'].deleteBudget( this.budgetObj['budgetId'], { "onSuccess": this.saveComplete } );
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
