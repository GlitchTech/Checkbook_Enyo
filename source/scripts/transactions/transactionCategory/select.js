/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.transactionCategory.select ( Popup )
 *
 * Popup for category control. Only handles selection of a single category.
 */
enyo.kind({
	name: "Checkbook.transactionCategory.select",
	kind: enyo.ModalDialog,

	lazy: false,

	scrim: false,
	dismissWithClick: true,

	style: "width: 400px;",

	categories: {},
	dispCategories: [],
	selected: {},

	doCategorySelect: null,//Callback function; not an event, extra data may be attached

	published: {
		entireGeneral: false
	},

	components: [
		{
			kind: enyo.Pane,
			className: "modal-pane-view",
			components: [
				{
					kind: enyo.VFlexBox,
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
											content: "Select a Category",
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
									ontap: "close"
								}
							]
						}, {
							kind: enyo.VFlexBox,
							className: "group",
							flex: 1,
							components: [
								{
									name: "categoryList",
									kind: enyo.VirtualList,

									onSetupRow: "setupRow",

									flex: 1,

									components: [
										{
											name: "item",
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,

											tapHighlight: true,
											ontap: "rowClicked",//Select item

											components: [
												{
													name: "sheetName",
													flex: 1
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

		this.openAtCenter();
		//Popup loaded, now can do UI changes

		this.$['categoryList'].punt();

		this.doCategorySelect = callbackFn;

		if( subheader ) {

			this.selected = subheader;

			this.$['subheader'].setContent( subheader['category'] + " >> " + subheader['category2'] );
		} else {

			this.selected = { category: '', category2: '' };

			this.$['subheader'].setContent( "" );
		}
	},

	returnedFromView: function() {

		this.$['transactionCategoryView'].close();
		this.$['transactionCategoryView'].destroy();

		this.$['categoryList'].punt();
	},

	rowClicked: function( inSender, inEvent, rowIndex ) {

		var row = this.dispCategories[rowIndex];

		if( row ) {

			if( row['parent'] === "|-add_edit-|" ) {
				//Add/Edit Transaction Category system

				this.createComponent( {
						name: "transactionCategoryView",
						kind: "Checkbook.transactionCategory.view",

						owner: this,

						onClose: enyo.bind( this, this.returnedFromView )
					});

				//DOM ERROR caused here.
				this.$['transactionCategoryView'].render();
				this.$['transactionCategoryView'].openAtCenter();
			} else if( row['parent'] === "|-go_back-|" ) {
				//Parent <- Child

				this.dispCategories = enyo.clone( Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'] );
				//this.dispCategories.push( { "content": "Add/Edit Categories", "parent": "|-add_edit-|" } );

				this.$['categoryList'].punt();
			} else if( row['parent'] !== "" ) {
				//Return selected category set

				if( enyo.isFunction( this.doCategorySelect ) ) {

					this.doCategorySelect( { "category": row['parent'], "category2": ( row['content'] === "All Sub Categories" ? "%" : row['content'] ) } );
				}

				this.close();
			} else {
				//Parent -> Child

				this.dispCategories = enyo.clone( Checkbook.globals.transactionCategoryManager.trsnCategories['subCats'][row['content']] );

				if( this.entireGeneral ) {

					this.dispCategories.unshift( { "content": "All Sub Categories", "parent": row['content'] } );
				}

				this.dispCategories.push( { "content": "Back", "parent": "|-go_back-|" } );

				this.$['categoryList'].punt();
			}
		}
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.dispCategories[inIndex];

		if( row ) {

			this.$['sheetName'].setContent( row['content'] );
			this.$['sheetName'].addRemoveClass( "positiveBalance", ( row['parent'] === "|-add_edit-|" ) );

			if( row['parent'] === "|-add_edit-|" ) {
				//Edit Categories (category view)

				this.$['arrows'].hide();
			} else if( row['parent'] === "|-go_back-|" ) {
				//Back Item (subcategory view)

				this.$['arrows'].setContent( "<<" );
				this.$['arrows'].show();
			} else if( row['parent'] !== "" ) {
				//Subcategory View

				var selected = ( this.selected['category2'] === row['content'] );

				this.$['item'].addRemoveClass( 'selected', selected );
				this.$['item'].addRemoveClass( 'normal', !selected );

				this.$['arrows'].hide();
			} else {
				//Category View

				var selected = ( this.selected['category'] === row['content'] );

				this.$['item'].addRemoveClass( 'selected', selected );
				this.$['item'].addRemoveClass( 'normal', !selected );

				this.$['arrows'].setContent( ">>" );
				this.$['arrows'].show();
			}

			return true;
		}
	}
});
