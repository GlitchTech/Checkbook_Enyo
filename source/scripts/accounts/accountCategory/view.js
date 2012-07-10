/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({

	name: "Checkbook.accountCategory.view",
	kind: enyo.Popup,
	layoutKind: enyo.VFlexLayout,

	modal: true,
	scrim: true,

	style: "width: 400px;",

	categories: [],

	events: {
		onClose: ""
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
					style: "text-align: center; margin-right: -32px;",
					flex: 1,
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
					kind: enyo.ToolButton,
					icon: "assets/menu_icons/close.png",
					className: "img-icon",
					style: "text-align: center;",
					onclick: "close"
				}
			]
		}, {

			name: "entries",
			kind: "ReorderableVirtualList",

			style: "height: 325px;",
			reorderable: true,

			onReorder: "reorder",
			onSetupRow: "setupRow",
			onAcquirePage: "acquirePage",

			components: [
				{
					name: "item",

					kind: enyo.SwipeableItem,
					layoutKind: enyo.VFlexLayout,

					tapHighlight: true,
					onclick: "editItem",
					onConfirm: "deleteItem",

					components: [
						{
							kind: enyo.HFlexBox,
							className: "account",
							align: "center",
							components: [
								{
									name: "icon",
									kind: enyo.Image,
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
		},

		{
			kind: enyo.Toolbar,
			components: [
				{
					kind: "onyx.Button",

					flex: 2,
					className: "enyo-button-primary",

					caption: "Create New",
					onclick: "createNew"
				}
			]
		},

		{
			name: "modifyCat",
			kind: "Checkbook.accountCategory.modify",

			onChange: "modificationComplete",
		},

		{
			name: "manager",
			kind: "Checkbook.accountCategory.manager"
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
