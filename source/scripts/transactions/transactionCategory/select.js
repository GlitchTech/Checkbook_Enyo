/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.transactionCategory.select ( Popup )
 *
 * Popup for category control. Only handles selection of a single category.
 */
enyo.kind({
	name: "Checkbook.transactionCategory.select",
	kind: "onyx.Popup",

	classes: "small-popup",

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
			name: "scroller",
			kind: "enyo.Scroller",

			horizontal: "hidden",

			classes: "light popup-scroller",
			components: []
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
		this._generateTree();
		//Popup loaded, now can do UI changes

		this.doCategorySelect = callbackFn;

		if( subheader ) {

			this.selected = subheader;

			this.$['subheader'].setContent( subheader['category'] + " >> " + subheader['category2'] );
		} else {

			this.selected = { category: '', category2: '' };

			this.$['subheader'].setContent( "" );
		}

		this.reflow();
	},

	_generateTree: function() {

		this.$['scroller'].destroyClientControls();

		var tree = [];

		var parents = Checkbook.globals.transactionCategoryManager.trsnCategories['mainCats'];

		for( var i = 0; i < parents.length; i++ ) {

			var parentNode = {
					kind: "enyo.Node",
					expandable: true,
					expanded: false,

					icon: "assets/folder.png",

					content: parents[i]['content'],

					onExpand: "nodeExpand",
					onNodeTap: "nodeTap",

					components: []
				};

			var children = Checkbook.globals.transactionCategoryManager.trsnCategories['subCats'][parents[i]['content']];

			for( var j = 0; j < children.length; j++ ) {

				parentNode['components'].push(
						{
							classes: "padding-half-std margin-right bordered",

							icon: "assets/tag.png",

							content: children[j]['content'],
							parentNode: children[j]['parent']
						}
					);
			}

			tree.push( parentNode );
		}

		//tree.push( Edit button );?

		this.$['scroller'].createComponents( tree, { owner: this } );

		this.$['scroller'].render();
	},

	nodeExpand: function( inSender, inEvent ) {

		inSender.setIcon( "assets/" + ( inSender.expanded ? "folder-open.png" : "folder.png" ) );
	},

	nodeTap: function(inSender, inEvent) {

		if( inEvent.originator['parentNode'] ) {

			if( enyo.isFunction( this.doCategorySelect ) ) {

				this.doCategorySelect( { "category": inEvent.originator['parentNode'], "category2": ( inEvent.originator['content'] === "All Sub Categories" ? "%" : inEvent.originator['content'] ) } );
			}

			this.hide();
		}

		return true;
	},

	returnedFromView: function() {

		this.$['transactionCategoryView'].hide();
		this.$['transactionCategoryView'].destroy();

		this.datasetChanged();
	}
});
