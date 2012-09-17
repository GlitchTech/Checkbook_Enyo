/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.accountCategory.view",
	kind: "onyx.Popup",
	//Should not be a popup. Maybe fullscreen or view to the side.

	classes: "small-popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	categories: [],

	events: {
		onClose: ""
	},

	components: [
		{
			kind: "onyx.Toolbar",
			classes: "text-center",
			style: "position: relative; background: none; border: 0;",

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
					ontap: "closeView",

					content: "x",

					classes: "onyx-negative",
					style: "position: absolute; right: 5px; padding: 3px 12px;"
				}
			]
		}, {

			name: "entries",
			//kind: "ReorderableVirtualList",

			style: "height: 325px;",
			reorderable: true,

			onReorder: "reorder",
			onSetupRow: "setupRow",
			onAcquirePage: "acquirePage",

			components: [
				{
					name: "item",

				//	kind: enyo.SwipeableItem,
				//	layoutKind: enyo.VFlexLayout,

					tapHighlight: true,
					ontap: "editItem",
					onConfirm: "deleteItem",

					components: [
						{
						//	kind: enyo.HFlexBox,
							className: "account",
							align: "center",
							components: [
								{
									name: "icon",
									//kind: enyo.Image,
									className: "accountIcon"
								}, {
									name: "name",
									className: "enyo-text-ellipsis",
									flex: 1
								}
							]
						}
					]
				}
			]
		}, {
			classes: "padding-std text-center",
			components:[
				{
					kind: "onyx.Button",
					content: "Create New",

					ontap: "createNew"
				}
			]
		},

		{
			name: "modifyCat",
			//kind: "Checkbook.accountCategory.modify",

			onChange: "modificationComplete",
		},

		{
			name: "manager",
			//kind: "Checkbook.accountCategory.manager"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.categories = [];
	},

	/** List Control **/

	setupRow: function( inSender, inIndex ) {

		var row = this.categories[inIndex];

		if( row ) {

			this.$['icon'].setSrc( "assets/" + row['icon'] );
			this.$['name'].setContent( row['name'] );

			this.$['item'].setClassName( "enyo-item enyo-swipeableitem custom-background legend " + row['color'] + " enyo-vflexbox" );

			return true;
		}
	},

	acquirePage: function( inSender, inPage ) {

		var index = inPage * inSender.pageSize;

		if( index < 0 ) {
			//No indexes below zero, don't bother calling

			return;
		}

		if( !this.categories[index] ) {

			this.$['manager'].fetchCategories(
					{
						"onSuccess": enyo.bind( this, this.dataResponse, index )
					},
					inSender.pageSize,//Limit
					index//Offset
				);
		}
	},

	dataResponse: function( offset, results ) {
		//Parse page data

		for( var i = 0; i < results.length; i++ ) {

			//Make a clone; else unable to modify account
			this.categories[offset + i] = enyo.clone( results[i] );
		}

		//Reload list
		this.$['entries'].refresh();
	},

	/** Events **/

	createNew: function( inSender, inEvent ) {

		this.$['modifyCat'].openAtCenter( -1 );
	},

	editItem: function( inSender, inEvent, inIndex ) {

		var row = this.categories[inIndex];

		if( row ) {

			this.$['modifyCat'].openAtCenter( row['rowid'], row['name'], row['icon'], row['color'] );
		}
	},

	deleteItem: function( inSender, inIndex ) {

		var row = this.categories[inIndex];

		if( row ) {

			this.$['manager'].deleteCategory( row['rowid'], row['name'], { "onSuccess": enyo.bind( this, this.modificationComplete, "delete" ) } );
		}
	},

	modificationComplete: function( inSender, inAction ) {

		if( enyo.isString( inSender ) ) {

			inAction = inSender;
		}

		if( enyo.isString( inAction ) ) {

			if( inAction === "reorder" ) {

				this.$['entries'].refresh();
			} else {

				this.$['modifyCat'].close();

				this.categories = [];
				this.$['entries'].punt();
			}
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

			this.$['manager'].reorderCategories( this.categories, { "onSuccess": enyo.bind( this, this.modificationComplete, "reorder" ) } );
		}
	}
});
