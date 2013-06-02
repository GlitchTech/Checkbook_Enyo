/* Copyright © 2013, GlitchTech Science */

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
			name: "header",
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

							classes: "text-middle",
							style: "padding-top: 0; padding-bottom: 0;",

							components: [
								{
									name: "content",
									classes: "bold bordered padding-std",

									ontap: "editMainCategory"
								}, {
									name: "subCats",
									kind: "enyo.Repeater",

									classes: "margin-double-left margin-right",

									count: 0,
									parentContent: "",

									onSetupItem: "setupSubRow",

									components: [
										{
											name: "item",
											kind: "onyx.Item",//SwipeableItem
											tapHighlight: true,

											classes: "bordered text-middle",

											ontap: "editChildCategory",
											onDelete: "deleteItem",

											components: [
												{
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

		this.$['header'].addRemoveClass( "text-left", enyo.Panels.isScreenNarrow() );
		this.$['header'].addRemoveClass( "text-center", !enyo.Panels.isScreenNarrow() );

		this.fetchCategories();
	},

	fetchCategories: function() {

		if( Checkbook.transactionCategory.manager.trsnCategories ) {

			this.dataResponse();
		} else {

			Checkbook.transactionCategory.manager.load( null, { "onSuccess": enyo.bind( this, this.dataResponse ) }, null, null );
		}
	},

	dataResponse: function() {

		this.$['mainCategories'].setCount( Checkbook.transactionCategory.manager.trsnCategories['mainCats'].length );
	},

	/** List Control **/

	setupMainRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var item = inEvent.item;
		var row = Checkbook.transactionCategory.manager.trsnCategories['mainCats'][index];

		if( row && item && item.$['content'] && index >= 0 ) {

			item.$['content'].setContent( row['content'] );

			item.$['subCats'].parentContent = row['content'];
			item.$['subCats'].setCount( Checkbook.transactionCategory.manager.trsnCategories['subCats'][row['content']].length );

			return true;
		}
	},

	setupSubRow: function( inSender, inEvent ) {

		var item = inEvent.item;

		if( !( item && item.$['subContent'] ) ) {

			return;
		}

		var index = item.index;
		var row = Checkbook.transactionCategory.manager.trsnCategories['subCats'][inEvent.originator.parentContent][index];

		if( row && index >= 0 ) {

			item.$['subContent'].setContent( row['content'] );
			item.$['subContent'].parentContent = row['parent'];

			return true;
		}
	},

	/** Events **/

	createNew: function( inSender, inEvent ) {

		this.$['modifyCat'].show( -1 );
		return true;
	},

	editMainCategory: function( inSender, inEvent ) {

		var row = Checkbook.transactionCategory.manager.trsnCategories['mainCats'][inEvent.index];

		if( row ) {

			this.$['modifyCat'].show( -1, row['content'], null );

			return true;
		}
	},

	editChildCategory: function( inSender, inEvent ) {

		var parent = Checkbook.transactionCategory.manager.trsnCategories['subCats'][inEvent.originator.parentContent];

		if( !parent ) {

			return;
		}

		var row = parent[inEvent.index];

		if( row ) {

			this.$['modifyCat'].show( row['id'], row['parent'], row['content'] );

			return true;
		}
	},

	deleteItem: function( inSender, inIndex ) {

		this.log( arguments );
		return true;

		var row = Checkbook.transactionCategory.manager.trsnCategories['mainCats'][inIndex];

		if( row ) {

			Checkbook.transactionCategory.manager.deleteCategory( row['id'], { "onSuccess": enyo.bind( this, this.modificationComplete, { action: "delete" } ) } );
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
