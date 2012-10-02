/* Copyright © 2011-2012, GlitchTech Science */

/**
 * @name Checkbook.accounts.modify
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @class
 * @version 2.0 (2012/08/08)
 */

enyo.kind({
	name: "Checkbook.transactionCategory.view",
	kind: "FittableRows",
	classes: "enyo-fit",

	style: "height: 100%;",

	categories: [],

	events: {
		onFinish: ""
	},

	components: [//Need a restore orig button or something
		{
			kind: "onyx.Toolbar",
			classes: "text-center text-middle",
			style: "position: relative;",
			components: [
				{
					components: [
						{
							content: "Transaction Categories",
							className: "bigger"
						}, {
							name: "subheader",
							className: "smaller"
						}
					]
				}, {
					kind: "onyx.Button",
					ontap: "doFinish",

					content: "x",

					classes: "onyx-negative",
					style: "position: absolute; right: 15px;"
				}
			]
		},

		{
			kind: "enyo.Scroller",
			horizontal: "hidden",
			classes: "deep-green-gradient",
			fit: true,
			components: [
				{
					name: "entries",
					kind: "enyo.Repeater",

					classes: "enyo-fit light narrow-column padding-half-top padding-half-bottom",
					style: "min-height: 100%; position: relative;",

					//onReorder: "reorder",
					onSetupItem: "setupRow",

					components: [
						{
							name: "item",
							kind: "onyx.Item",//SwipeableItem
							tapHighlight: true,

							classes: "bordered text-middle custom-background legend",

							ontap: "editItem",
							onDelete: "deleteItem",

							components: [
								{
									name: "general",
									style: "display: inline-block;"
								}, {
									content: "&gt;&gt;",
									style: "display: inline-block;",
									classes: "margin-left bold",
									allowHtml: true
								}, {
									name: "specific",
									style: "display: inline-block;",
									classes: "margin-left"
								}
							]
						}
					]
				}
			]
		},

		{
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					kind: "onyx.Button",

					content: "Create New",
					ontap: "createNew"
				}
			]
		},

		{
			name: "modifyCat",
			kind: "Checkbook.transactionCategory.modify",

			onChangeComplete: "modificationComplete",
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.fetchCategories();
	},

	fetchCategories: function() {

		Checkbook.globals.transactionCategoryManager.fetchCategories( { "onSuccess": enyo.bind( this, this.dataResponse ) } );
	},

	dataResponse: function( results ) {

		this.categories = results;
		this.$['entries'].setCount( this.categories.length );
	},

	/** List Control **/

	setupRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var item = inEvent.item;
		var row = this.categories[index];

		if( row ) {

			item.$['general'].setContent( row['genCat'] );
			item.$['specific'].setContent( row['specCat'] );
/*
			if( index <= 0 || row['genCat'] !== this.categories[index - 1]['genCat'] ) {

				item.$['general'].show();
				item.$['general'].setCaption( row['genCat'] );

				item.$['general'].parent.addClass( "categoryRow" );
			} else {

				item.$['general'].hide();

				item.$['general'].parent.removeClass( "categoryRow" );
			}
*/
			return true;
		}
	},

	/** Events **/

	createNew: function( inSender, inEvent ) {

		this.$['modifyCat'].show( -1 );
	},

	dividerTapped: function( inSender, inEvent ) {
		//Not allowed, block action

		inEvent.stopPropagation();

		this.$['modifyCat'].show( -1, inSender.caption, null );
	},

	editItem: function( inSender, inEvent ) {

		var row = this.categories[inEvent.index];

		if( row ) {

			this.$['modifyCat'].show( row['catId'], row['genCat'], row['specCat'] );
		}
	},

	deleteItem: function( inSender, inIndex ) {

		this.log( "NOT UPDATED" );

		var row = this.categories[inIndex];

		if( row ) {

			Checkbook.globals.transactionCategoryManager.deleteCategory( row['catId'], { "onSuccess": enyo.bind( this, this.modificationComplete, { action: "delete" } ) } );
		}
	},

	modificationComplete: function( inSender, inEvent ) {

		this.fetchCategories();

		if( inEvent['action'] != "reorder" ) {

			this.$['modifyCat'].hide();
		}
	}
});
