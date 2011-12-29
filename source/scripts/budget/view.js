/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.budget.view",
	kind: enyo.VFlexBox,

	flex: 1,
	style: "height: 100%;",

	published: {
		accountObj: {}
	},

	events: {
		onFinish: "",
		onModify: "",
		onChanged: "",
		onDelete: ""
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
					kind: enyo.Spinner,
					className: "img-icon",
					style: "margin: 0px 15px 5px 0;"
				}, {
					content: $L( "Budget System" ),
					className: "bigger",
					style: "margin-top: -6px;",
					flex: 1
				}
			]
		},

		{
			name: "entries",
			kind: "ReorderableVirtualList",

			className: "light narrow-column",
			style: "padding-left: 0px; padding-right: 0px;",
			flex: 1,

			onReorder: "reorder",
			onSetupRow: "setupRow",
			onAcquirePage: "acquirePage",

			components: [
				{
					kind: enyo.SwipeableItem,

					style: "padding-right: 7px;",

					tapHighlight: true,
					//onclick: "itemTapped",

					//Vertical Layout
					components: [
						{
							layoutKind: enyo.HFlexLayout,
							align: "center",

							components: [
								{
									name: "category",
								}, {
									name: "progress",
									kind: enyo.ProgressBar,
									flex: 1,

									minimum: 0,
									maximum: 100,
									position: 0
								}, {
									name: "total"
								}, {
									kind: enyo.Image,
									src: "source/images/search.png",
									className: "img-icon"
								}
							]
						}
					]
				}
			]
		},

		{
			kind: enyo.Toolbar,
			className: "enyo-toolbar-light",
			components: [
				{
					kind: enyo.Button,

					caption: $L( "Back" ),
					onclick: "doFinish"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.Button,

					className: "enyo-button-affirmative deep-green",

					caption: $L( "Add New" ),
					onclick: "addBudget"
				}
			]
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.log( "GO" );
	},

	addBudget: function() {

		this.log( "launch modify tool" );
	},

	/** List Control **/

	reorder: function() {
	},

	setupRow: function( inSender, inIndex ) {

		//var row = this.transactions[inIndex];

		if( inIndex < 100 && inIndex >= 0 ) {

			this.$['category'].setContent( inIndex );

			var progress = Math.random() * 100 + 10;

			this.$['progress'].addRemoveClass( "green", ( progress >= 25 && progress < 75 ) );
			this.$['progress'].addRemoveClass( "yellow", ( progress >= 75 && progress < 100 ) );
			this.$['progress'].addRemoveClass( "red", ( progress >= 100 ) );

			this.$['progress'].setPosition( progress );

			this.$['total'].setContent( "$" + inIndex * 100 );

			return true;
		}
	},

	acquirePage: function( inSender, inPage ) {

		var index = inPage * inSender.getPageSize();
			return;

		if( index < 0 ) {
			//No indexes below zero, don't bother calling

			return;
		}

		if( !this.transactions[index] ) {

			//this.loadingDisplay( true );

			//fetch
		}
	},

	loadingDisplay: function( status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['acctTypeIcon'].setShowing( !status );
	}
});