/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.transactionCategory.modify",
	kind: "onyx.Popup",

	classes: "login-system small-popup",

	centered: true,
	floating: true,
	modal: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	events: {
		onChangeComplete: ""
	},

	id: -1,
	general: "",
	specific: "",
	mode: "",

	components: [
		{
			kind: "enyo.FittableColumns",
			classes: "text-middle margin-bottom",
			noStretch: true,
			components: [
				{
					name: "title",
					content: "",

					classes: "bigger text-left margin-half-right",
					fit: true
				}, {
					kind: "onyx.Button",

					content: "X",
					ontap: "hide",

					classes: "onyx-blue small-padding"
				}
			]
		}, {
			kind: "onyx.Groupbox",
			classes: "light",
			components: [
				{
					name: "generalWrapper",
					kind: "GTS.AutoComplete",
					layoutKind: "FittableColumnsLayout",

					alwaysLooksFocused: true,

					onValueSelected: "generalAutoSuggestComplete",
					onDataRequested: "fetchData",

					zIndex: 200,

					components: [
						{
							name: "general",
							kind: "onyx.Input",

							placeholder: "group name",

							fit: true
						}, {
							content: "group",
							classes: "small label"
						}
					]
				}, {
					name: "specificWrapper",
					kind: "onyx.InputDecorator",
					layoutKind: "FittableColumnsLayout",

					classes: "onyx-focused",
					alwaysLooksFocused: true,

					components: [
						{
							name: "specific",
							kind: "onyx.Input",

							placeholder: "category name",

							fit: true,

							onkeypress: "keyPressed"
						}, {
							content: "category",
							classes: "small label"
						}
					]
				}
			]
		}, {
			name: "errorMessage",
			kind: "GTS.InlineNotification",
			type: "error",

			content: "",

			showing: false
		}, {
			//kind: "onyx.Toolbar",
			classes: "padding-std margin-half-top text-center h-box",
			components: [
				{
					kind: "onyx.Button",

					classes: "margin-right box-flex",

					content: "Cancel",
					ontap: "hide"
				}, {
					name: "deleteButton",
					kind: "onyx.Button",

					classes: "onyx-negative box-flex",

					content: "Delete",
					ontap: "deleteCategory"
				}, {
					kind: "onyx.Button",

					classes: "onyx-affirmative margin-left box-flex",

					content: "Save",
					ontap: "save"
				}
			]
		}
	],

	show: function( inId, inGeneral, inSpecific ) {

		this.inherited( arguments );

		if( inId < 0 ) {

			this.$['deleteButton'].hide();
		} else {

			this.$['deleteButton'].show();
		}

		if( inId < 0 && !enyo.isString( inGeneral ) ) {

			this.$['title'].setContent( "Create a Category" );
			this.$['specificWrapper'].show();
			this.mode = "new";
			this.id = -1;

			this.general = "";
			this.specific = "";
		} else if( inId < 0 && enyo.isString( inGeneral ) ) {

			this.$['title'].setContent( "Edit Group Name" );
			this.$['specificWrapper'].hide();
			this.mode = "group";
			this.id = -1;

			this.general = inGeneral;
			this.specific = "";
		} else if( inId > 0 && enyo.isString( inGeneral ) && enyo.isString( inSpecific ) ) {

			this.$['title'].setContent( "Edit Category" );
			this.$['specificWrapper'].show();
			this.mode = "category";
			this.id = inId;

			this.general = inGeneral;
			this.specific = inSpecific;
		} else {

			this.hide();
		}

		this.$['general'].setValue( this.general );
		this.$['specific'].setValue( this.specific );

		this.$['general'].focus();
	},

	keyPressed: function( inSender, inEvent ) {
		//Prevent ~ and |

		this.log( arguments );

		if( inEvent.keyCode === 124 || inEvent.keyCode === 126 ) {

			inEvent.preventDefault();
		}
	},

	fetchData: function( inSender, inEvent ) {

		if( inEvent.value.length <= 0 ) {

			inEvent.callback( [] );
			return;
		}

		Checkbook.globals.gts_db.query(
				new GTS.databaseQuery(
						{
							"sql": "SELECT DISTINCT genCat FROM transactionCategories WHERE genCat LIKE ? LIMIT ?;",
							"values": [ inEvent.value + "%", inSender.getLimit() ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.buildSuggestionList, inEvent.callback )
				}
			);
	},

	buildSuggestionList: function( callback, results ) {

		var data = [];

		for( var i = 0; i < results.length; i++ ) {

			data.push( results[i]['genCat'] );
		}

		callback( data );
	},

	generalAutoSuggestComplete: function( inSender, inEvent ) {

		this.$['general'].setValue( inEvent.value );
		return true;
	},

	deleteCategory: function() {

		this.log( arguments );

		if( this.acctId >= 0 ) {

			this.createComponent( {
					name: "deleteCategoryConfirm",
					kind: "gts.ConfirmDialog",

					title: "Delete Account",
					message: "Are you sure you want to delete this transaction category?",

					confirmText: "Delete",
					confirmClass: "onyx-negative",

					cancelText: "Cancel",
					cancelClass: "",

					onConfirm: "deleteCategoryHandler",
					onCancel: "deleteCategoryConfirmClose"
				});

			this.$['deleteCategoryConfirm'].show();
		}
	},

	deleteCategoryConfirmClose: function() {

		this.$['deleteCategoryConfirm'].destroy();
	},

	deleteCategoryHandler: function() {

		this.deleteCategoryConfirmClose();

		Checkbook.globals.transactionCategoryManager.deleteCategory( this.id, { "onSuccess": enyo.bind( this, this.doChangeComplete, { action: "delete" } ) } );
	},

	save: function() {

		var newGeneral = this.$['general'].getValue().replace(/(~|\|)/g, "");
		var newSpecific = this.$['specific'].getValue().replace(/(~|\|)/g, "");

		if( newGeneral.length <= 0 || ( this.mode !== "group" && newSpecific.length <= 0 ) ) {

			this.$['errorMessage'].setContent( "Category fields may not be blank." );
			this.$['errorMessage'].show();
			return;
		}

		if( newSpecific === "All Sub Categories" ) {

			this.$['errorMessage'].setContent( "Invalid category." );
			this.$['errorMessage'].show();
			return;
		}

		this.$['errorMessage'].hide();

		if( this.general === newGeneral && this.specific === newSpecific ) {
			//No change

			this.hide();
		}

		if( this.mode === "new" ) {

			Checkbook.globals.transactionCategoryManager.createCategory( newGeneral, newSpecific, { "onSuccess": enyo.bind( this, this.doChangeComplete, { action: "new" } ) } );
		} else if( this.mode === "category" ) {

			Checkbook.globals.transactionCategoryManager.editCategory( this.id, newGeneral, newSpecific, this.general, this.specific, { "onSuccess": enyo.bind( this, this.doChangeComplete, { action: "category" } ) } );
		} else if( this.mode === "group" ) {

			Checkbook.globals.transactionCategoryManager.editGroup( newGeneral, this.general, { "onSuccess": enyo.bind( this, this.doChangeComplete, { action: "group" } ) } );
		} else {

			this.hide();
		}
	}
});
