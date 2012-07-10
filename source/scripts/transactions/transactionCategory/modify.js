/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({

	name: "Checkbook.transactionCategory.modify",
	kind: enyo.Popup,
	layoutKind: enyo.VFlexLayout,

	modal: true,
	scrim: true,

	style: "width: 400px;",

	events: {
		onChange: ""
	},

	published: {
		id: -1,
		general: "",
		specific: "",
		mode: ""
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
					name: "title",
					content: "",

					className: "bigger",
					style: "text-align: center; margin-right: -32px;",
					flex: 1
				}, {
					kind: enyo.ToolButton,
					icon: "assets/menu_icons/close.png",

					className: "img-icon",
					style: "text-align: center;",

					onclick: "close"
				}
			]
		}, {
			kind: enyo.RowGroup,
			components: [
				{
					name: "general",
					kind: enyo.Input,
					autoKeyModifier: "shift-single",

					oninput: "generalContentChanged",
					onkeypress: "keyPressed",

					components: [
						{
							content: "Group",
							className: "enyo-label"
						}
					]
				}, {
					name: "specific",
					kind: enyo.Input,
					autoKeyModifier: "shift-single",

					onkeypress: "keyPressed",

					components: [
						{
							content: "Category",
							className: "enyo-label"
						}
					]
				}
			]
		}, {
			name: "errorMessageContainer",
			layoutKind: enyo.HFlexLayout,
			pack: "start",
			showing: false,
			components: [
				{
					kind: "Image",
					src: "assets/warning-icon.png",
					style: "margin-right: 5px;"
				}, {
					name: "errorMessage",
					style: "color: #d70000;",
					content: "Categories may not be blank."
				}
			]
		}, {
			kind: enyo.Toolbar,
			components: [
				{
					kind: "onyx.Button",

					flex: 2,
					className: "enyo-button-primary",

					caption: "Cancel",
					onclick: "close"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: "onyx.Button",

					flex: 2,
					className: "enyo-button-affirmative",

					caption: "Save",
					onclick: "save"
				}
			]
		},

		{
			name: "autocomplete",
			kind: "Checkbook.transactionCategory.autocomplete",
			onSelect: "generalAutoSuggestComplete"
		}
	],

	openAtCenter: function( inId, inGeneral, inSpecific ) {

		this.inherited( arguments );

		this.$['general'].forceFocus();
		this.loadModifySystem( inId, inGeneral, inSpecific );
	},

	loadModifySystem: function( inId, inGeneral, inSpecific ) {

		if( inId < 0 && !enyo.isString( inGeneral ) ) {

			this.$['title'].setContent( "Create a Category" );
			this.$['specific'].setShowing( true );
			this.mode = "new";
			this.id = -1;

			this.general = "";
			this.specific = "";
		} else if( inId < 0 && enyo.isString( inGeneral ) ) {

			this.$['title'].setContent( "Edit Group Name" );
			this.$['specific'].setShowing( false );
			this.mode = "group";
			this.id = -1;

			this.general = inGeneral;
			this.specific = "";
		} else if( inId > 0 && enyo.isString( inGeneral ) && enyo.isString( inSpecific ) ) {

			this.$['title'].setContent( "Edit Category" );
			this.$['specific'].setShowing( true );
			this.mode = "category";
			this.id = inId;

			this.general = inGeneral;
			this.specific = inSpecific;
		} else {

			this.close();
		}

		this.$['general'].setValue( this.general );
		this.$['specific'].setValue( this.specific );
	},

	generalContentChanged: function() {
		//Autocomplete

		this.$['autocomplete'].setSearchValue( this.$['general'].getValue() );
	},

	generalAutoSuggestComplete: function( inSender, suggestion ) {

		this.$['general'].setValue( suggestion );
	},

	keyPressed: function( inSender, inEvent ) {
		//Prevent ~ and |

		if( inEvent.keyCode === 124 || inEvent.keyCode === 126 ) {

			inEvent.preventDefault();
		}
	},

	save: function() {

		var newGeneral = this.$['general'].getValue().replace(/(~|\|)/g, "");
		var newSpecific = this.$['specific'].getValue().replace(/(~|\|)/g, "");

		if( newGeneral.length <= 0 || ( this.mode !== "group" && newSpecific.length <= 0 ) ) {

			this.$['errorMessage'].setContent( "Category fields may not be blank." );
			this.$['errorMessageContainer'].setShowing( true );
			return;
		}

		if( newSpecific === "All Sub Categories" ) {

			this.$['errorMessage'].setContent( "Invalid category." );
			this.$['errorMessageContainer'].setShowing( true );
			return;
		}

		this.$['errorMessageContainer'].setShowing( false );

		if( this.general === newGeneral && this.specific === newSpecific ) {
			//No change

			this.close();
		}

		if( this.mode === "new" ) {

			enyo.application.transactionCategoryManager.createCategory( newGeneral, newSpecific, { "onSuccess": enyo.bind( this, this.doChange, "new" ) } );
		} else if( this.mode === "category" ) {

			enyo.application.transactionCategoryManager.editCategory( this.id, newGeneral, newSpecific, this.general, this.specific, { "onSuccess": enyo.bind( this, this.doChange, "category" ) } );
		} else if( this.mode === "group" ) {

			enyo.application.transactionCategoryManager.editGroup( newGeneral, this.general, { "onSuccess": enyo.bind( this, this.doChange, "group" ) } );
		} else {

			this.close();
		}
	}
});
