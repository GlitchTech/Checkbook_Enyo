/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.transactionCategory.select ( Popup )
 *
 * Popup for category control. Only handles selection of a single category.
 */
enyo.kind({
	name: "Checkbook.transactionCategory.select",
	kind: "onyx.Popup",

	classes: "small-input-popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	style: "max-height: 95%;",

	categories: {},
	dispCategories: [],
	selected: {},

	doCategorySelect: null,//Callback function; not an event, extra data may be attached

	published: {
		entireGeneral: false
	},

	components: [
		{
			kind: "enyo.FittableColumns",
			classes: "text-middle margin-bottom",
			noStretch: true,
			components: [
				{
					classes: "bigger text-left ",
					fit: true,
					components: [
						{
							content: "Select a Category",
							classes: "bigger"
						}, {
							name: "subheader",
							classes: "smaller"
						}
					]
				}, {
					kind: "onyx.Button",

					content: "X",
					ontap: "hide",

					classes: "onyx-blue small-padding"
				}
			]
		}, {
			kind: "enyo.Scroller",

			horizontal: "hidden",

			classes: "light popup-scroller",
			components: [
				{
					name: "categoryList",
					kind: "enyo.Repeater",

					onSetupItem: "setupRow",

					components: [
						{
							name: "item",
							kind: "enyo.FittableColumns",
							classes: "onyx-item text-middle bordered",

							tapHighlight: true,
							ontap: "rowClicked",//Select item

							components: [
								{
									name: "sheetName",
									fit: true
								}, {
									name: "arrows",
									content: ""
								}
							]
						}
					]
				}
			]
		}
	],

	//Go directly to the source for general & specific categories to avoid callbacks

	loadCategories: function( callbackFn ) {

		if( Checkbook.globals.transactionCategoryManager.trsnCategories ) {

			this.log( "transaction categories already built" );

			callbackFn();
		} else {

			Checkbook.globals.transactionCategoryManager.load( null, { "onSuccess": callbackFn }, null, null );
		}
	},

	getCategoryChoice: function( callbackFn, subheader ) {

		this.dispCategories = enyo.clone( Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'] );
		//this.dispCategories.push( { "content": "Add/Edit Categories", "parent": "|-add_edit-|" } );

		this.show();
		//Popup loaded, now can do UI changes

		this.datasetChanged();

		this.doCategorySelect = callbackFn;

		if( subheader ) {

			this.selected = subheader;

			this.$['subheader'].setContent( subheader['category'] + " >> " + subheader['category2'] );
		} else {

			this.selected = { category: '', category2: '' };

			this.$['subheader'].setContent( "" );
		}
	},

	rowClicked: function( inSender, inEvent ) {

		var row = this.dispCategories[inEvent.index];

		if( row ) {

			if( row['parent'] === "|-add_edit-|" ) {
				//Add/Edit Transaction Category system

				//NON FUNCTIONAL
				/*
				this.createComponent( {
						name: "transactionCategoryView",
						kind: "Checkbook.transactionCategory.view",

						owner: this,

						onClose: enyo.bind( this, this.returnedFromView )
					});

				//DOM ERROR caused here.
				this.$['transactionCategoryView'].render();
				this.$['transactionCategoryView'].openAtCenter();
				*/
			} else if( row['parent'] === "|-go_back-|" ) {
				//Parent <- Child

				this.dispCategories = enyo.clone( Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'] );
				//this.dispCategories.push( { "content": "Add/Edit Categories", "parent": "|-add_edit-|" } );

				this.datasetChanged();
			} else if( row['parent'] !== "" ) {
				//Return selected category set

				if( enyo.isFunction( this.doCategorySelect ) ) {

					this.doCategorySelect( { "category": row['parent'], "category2": ( row['content'] === "All Sub Categories" ? "%" : row['content'] ) } );
				}

				this.hide();
			} else {
				//Parent -> Child

				this.dispCategories = enyo.clone( Checkbook.globals.transactionCategoryManager.trsnCategories['subCats'][row['content']] );

				if( this.entireGeneral ) {

					this.dispCategories.unshift( { "content": "All Sub Categories", "parent": row['content'] } );
				}

				this.dispCategories.push( { "content": "Back", "parent": "|-go_back-|" } );

				this.datasetChanged();
			}
		}
	},

	datasetChanged: function() {

		this.$['categoryList'].setCount( this.dispCategories.length );

		this.reflow();
	},

	returnedFromView: function() {

		this.$['transactionCategoryView'].hide();
		this.$['transactionCategoryView'].destroy();

		this.datasetChanged();
	},

	setupRow: function( inSender, inEvent ) {

		var row = this.dispCategories[inEvent.index];
		var item = inEvent.item;

		if( row && item ) {

			item.$['sheetName'].setContent( row['content'] );
			item.$['sheetName'].addRemoveClass( "positiveBalance", ( row['parent'] === "|-add_edit-|" ) );

			if( row['parent'] === "|-add_edit-|" ) {
				//Edit Categories (category view)

				item.$['arrows'].hide();
			} else if( row['parent'] === "|-go_back-|" ) {
				//Back Item (subcategory view)

				item.$['arrows'].setContent( "<<" );
				item.$['arrows'].show();
			} else if( row['parent'] !== "" ) {
				//Subcategory View

				var selected = ( this.selected['category2'] === row['content'] );

				item.$['item'].addRemoveClass( 'selected', selected );
				item.$['item'].addRemoveClass( 'normal', !selected );

				item.$['arrows'].hide();
			} else {
				//Category View

				var selected = ( this.selected['category'] === row['content'] );

				item.$['item'].addRemoveClass( 'selected', selected );
				item.$['item'].addRemoveClass( 'normal', !selected );

				item.$['arrows'].setContent( ">>" );
				item.$['arrows'].show();
			}

			return true;
		}
	}
});
