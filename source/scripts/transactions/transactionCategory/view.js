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
					name: "mainCategories",
					kind: "enyo.Repeater",

					classes: "enyo-fit light narrow-column padding-half-top padding-half-bottom",
					style: "min-height: 100%; position: relative;",

					onSetupItem: "setupMainRow",

					components: [
						{
							name: "item",
							kind: "onyx.Item",
							tapHighlight: true,

							classes: "bordered text-middle",

							ontap: "editMainCategory",

							components: [
								{
									name: "content",
									classes: "bold"
								}, {
									name: "subCats",
									kind: "enyo.Repeater",

									count: 0,
									parentContent: "",

									onSetupItem: "setupSubRow",

									components: [
										{
											name: "item",
											kind: "onyx.Item",//SwipeableItem
											tapHighlight: true,

											ontap: "editChildCategory",
											onDelete: "deleteItem",

											components: [
												{
													name: "parent",
													showing: false
												}, {
													name: "subContent"
												}
											]
										}
									]
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

		if( Checkbook.globals.transactionCategoryManager.trsnCategories ) {

			this.dataResponse();
		} else {

			Checkbook.globals.transactionCategoryManager.load( null, { "onSuccess": enyo.bind( this, this.dataResponse ) }, null, null );
		}
	},

	dataResponse: function() {

		this.$['mainCategories'].setCount( Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'].length );
	},

	/** List Control **/

	setupMainRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var item = inEvent.item;
		var row = Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'][index];

		if( row && item && item.$['content'] && index >= 0 ) {

			item.$['content'].setContent( row['content'] );

			item.$['subCats'].parentContent = row['content'];
			item.$['subCats'].setCount( Checkbook.globals.transactionCategoryManager.trsnCategories['subCats'][row['content']].length );

			return true;
		}
	},

	setupSubRow: function( inSender, inEvent ) {

		var item = inEvent.item;

		if( !( item && item.$['subContent'] ) ) {

			return;
		}

		var index = item.index;
		var row = Checkbook.globals.transactionCategoryManager.trsnCategories['subCats'][inSender.parentContent][index];

		if( row && index >= 0 ) {

			item.$['subContent'].setContent( row['content'] );
			item.$['parent'].setContent( row['parent'] );

			return true;
		}
	},

	/** Events **/

	createNew: function( inSender, inEvent ) {

		this.log( arguments );
		return true;

		this.$['modifyCat'].show( -1 );
		return true;
	},

	editMainCategory: function( inSender, inEvent ) {

		var row = Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'][inEvent.index];

		if( row ) {

			this.$['modifyCat'].show( -1, row['content'], null );
		}

		return true;
	},

	editChildCategory: function( inSender, inEvent ) {

		this.log( arguments );
		return true;

		var row = Checkbook.globals.transactionCategoryManager.trsnCategories['subCats'][inSender.parentContent];

		if( row && row[inEvent.index] ) {

			row = row[inEvent.index];

			this.$['modifyCat'].show( row['catId'], row['genCat'], row['specCat'] );
			return true;
		}
	},

	deleteItem: function( inSender, inIndex ) {

		this.log( arguments );
		return true;

		var row = Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'][inIndex];

		if( row ) {

			Checkbook.globals.transactionCategoryManager.deleteCategory( row['catId'], { "onSuccess": enyo.bind( this, this.modificationComplete, { action: "delete" } ) } );
			return true;
		}
	},

	modificationComplete: function( inSender, inEvent ) {

		this.fetchCategories();

		if( inEvent['action'] != "reorder" ) {

			this.$['modifyCat'].hide();
		}
	}
});
