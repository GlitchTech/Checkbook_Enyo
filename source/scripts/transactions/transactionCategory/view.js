/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({

	name: "Checkbook.transactionCategory.view",
	kind: enyo.Popup,
	layoutKind: enyo.VFlexLayout,

	modal: true,
	scrim: true,

	style: "width: 400px;",

	categories: [],

	events: {
		onClose: ""
	},

	components: [//Need a restore orig button or something
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
							content: "Transaction Categories",
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
					onclick: "doClose"
				}
			]
		}, {
			name: "entries",
			kind: enyo.VirtualList,

			style: "height: 325px;",
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
							name: "general",
							kind: enyo.Divider,
							showing: false,
							onclick: "dividerTapped"
						}, {
							kind: enyo.HFlexBox,
							className: "account",
							align: "center",
							components: [
								{
									name: "specific",
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
			kind: "Checkbook.transactionCategory.modify",

			onChange: "modificationComplete",
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

			this.$['specific'].setContent( row['specCat'] );

			if( inIndex <= 0 || row['genCat'] !== this.categories[inIndex - 1]['genCat'] ) {

				this.$['general'].show();
				this.$['general'].setCaption( row['genCat'] );

				this.$['general'].parent.addClass( "categoryRow" );
			} else {

				this.$['general'].hide();

				this.$['general'].parent.removeClass( "categoryRow" );
			}

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

			Checkbook.globals.transactionCategoryManager.fetchCategories(
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

	dividerTapped: function( inSender, inEvent ) {
		//Not allowed, block action

		inEvent.stopPropagation();

		this.$['modifyCat'].openAtCenter( -1, inSender.caption, null );
	},

	editItem: function( inSender, inEvent, inIndex ) {

		var row = this.categories[inIndex];

		if( row ) {

			this.$['modifyCat'].openAtCenter( row['catId'], row['genCat'], row['specCat'] );
		}
	},

	deleteItem: function( inSender, inIndex ) {

		var row = this.categories[inIndex];

		if( row ) {

			Checkbook.globals.transactionCategoryManager.deleteCategory( row['catId'], { "onSuccess": enyo.bind( this, this.modificationComplete, "delete" ) } );
		}
	},

	modificationComplete: function( inSender, inAction ) {

		if( enyo.isString( inSender ) ) {

			inAction = inSender;
		}

		if( enyo.isString( inAction ) ) {

			this.$['modifyCat'].close();
			//inAction == new || category || group || delete

			//update list

			this.categories = [];
			this.$['entries'].punt();//heavy handed; should be cleaner; split into different groups? ( add-punt, edit(index change)-refresh, delete(index change)-refresh, group-punt(scroll))
		}
	}
});
