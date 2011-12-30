/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	//Use % as category2 for all category items, matches everything!
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
							json: "",

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
									content: $L( "Amount" ),
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
					name: "",
					kind: enyo.Button,
					caption: $L( "Cancel" ),

					flex: 3,
					onclick: "close"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "",
					kind: enyo.Button,
					caption: $L( "Save" ),

					flex: 3,
					onclick: "",

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

			errTitle: $L( "Export Error" ),
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

	rendered: function() {

		this.$['categorySystem'].loadCategories( enyo.bind( this, this.inherited, arguments ) );
	},

	openAtCenter: function() {

		this.inherited( arguments );

		this.log( arguments );
	},

	categoryTapped: function() {

		this.$['categorySystem'].getCategoryChoice( enyo.bind( this, this.categorySelected ), null );
	},

	categorySelected: function() {

		this.log( arguments );
	}
});