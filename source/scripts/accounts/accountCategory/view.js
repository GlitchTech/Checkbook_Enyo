/* Copyright � 2011-2012, GlitchTech Science */

/**
 * @name Checkbook.accounts.modify
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @class
 * @version 2.0 (2012/08/08)
 */

enyo.kind({
	name: "Checkbook.accountCategory.view",
	kind: "FittableRows",
	classes: "enyo-fit",

	style: "height: 100%;",

	categories: [],

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: "onyx.Toolbar",
			classes: "text-center text-middle",
			style: "position: relative;",
			components: [
				{
					components: [
						{
							content: "Account Categories",
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
			classes: "rich-brown-gradient",
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
									name: "icon",
									kind: "enyo.Image",
									className: "accountIcon"
								}, {
									name: "name",
									style: "display: inline-block",
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
			kind: "Checkbook.accountCategory.modify",

			onChangeComplete: "modificationComplete",
		},

		{
			name: "manager",
			kind: "Checkbook.accountCategory.manager"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.fetchCategories();
	},

	fetchCategories: function() {

		this.$['manager'].fetchCategories(
				{
					"onSuccess": enyo.bind( this, this.dataResponse )
				}
			);
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

			item.$['icon'].setSrc( "assets/" + row['icon'] );
			item.$['name'].setContent( row['name'] );

			for( var i = 0; i < appColors.length; i++ ) {

				item.$['item'].removeClass( appColors[i]['name'] );
			}

			item.$['item'].addClass( row['color'] );

			return true;
		}
	},

	/** Events **/

	createNew: function( inSender, inEvent ) {

		this.$['modifyCat'].show( -1 );
	},

	editItem: function( inSender, inEvent ) {

		var row = this.categories[inEvent.index];

		if( row ) {

			this.$['modifyCat'].show( row['rowid'], row['name'], row['icon'], row['color'] );
		}
	},

	deleteItem: function( inSender, inIndex ) {

		var row = this.categories[inIndex];

		if( row ) {

			this.$['manager'].deleteCategory( row['rowid'], row['name'], { "onSuccess": enyo.bind( this, this.modificationComplete, { action: "delete" } ) } );
		}
	},

	modificationComplete: function( inSender, inEvent ) {

		this.fetchCategories();

		if( inEvent['action'] != "reorder" ) {

			this.$['modifyCat'].hide();
		}
	},

	reorder: function( inSender, toIndex, fromIndex ) {
		//Row moved

		if( toIndex != fromIndex && toIndex > -1 && toIndex < this.categories.length ) {

			var temp = this.categories.splice( fromIndex, 1 );
			var bottom = this.categories.slice( toIndex );

			this.categories.length = toIndex;
			this.categories.push.apply( this.categories, temp );
			this.categories.push.apply( this.categories, bottom );

			this.$['manager'].reorderCategories( this.categories, { "onSuccess": enyo.bind( this, this.modificationComplete, { action: "reorder" } ) } );
		}
	}
});
