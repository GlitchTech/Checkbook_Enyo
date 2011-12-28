/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

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
					icon: "source/images/menu_icons/close.png",

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
							content: $L( "Group" ),
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
							content: $L( "Category" ),
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
					src: "source/images/warning-icon.png",
					style: "margin-right: 5px;"
				}, {
					name: "errorMessage",
					style: "color: #d70000;",
					content: $L( "Categories may not be blank." )
				}
			]
		}, {
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Button,

					flex: 2,
					className: "enyo-button-primary",

					caption: $L( "Cancel" ),
					onclick: "close"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.Button,

					flex: 2,
					className: "enyo-button-affirmative",

					caption: $L( "Save" ),
					onclick: "save"
				}
			]
		},

		{
			name: "autocomplete",
			kind: "Checkbook.transactionCategory.autocomplete",
			onSelect: "generalAutoSuggestComplete"
		},

		{
			name: "manager",
			kind: "Checkbook.transactionCategory.manager"
		}
	],

	openAtCenter: function( inId, inGeneral, inSpecific ) {

		this.inherited( arguments );

		this.$['general'].forceFocus();
		this.loadModifySystem( inId, inGeneral, inSpecific );
	},

	loadModifySystem: function( inId, inGeneral, inSpecific ) {

		if( inId < 0 && !enyo.isString( inGeneral ) ) {

			this.$['title'].setContent( $L( "Create a Category" ) );
			this.$['specific'].setShowing( true );
			this.mode = "new";
			this.id = -1;

			this.general = "";
			this.specific = "";
		} else if( inId < 0 && enyo.isString( inGeneral ) ) {

			this.$['title'].setContent( $L( "Edit Group Name" ) );
			this.$['specific'].setShowing( false );
			this.mode = "group";
			this.id = -1;

			this.general = inGeneral;
			this.specific = "";
		} else if( inId > 0 && enyo.isString( inGeneral ) && enyo.isString( inSpecific ) ) {

			this.$['title'].setContent( $L( "Edit Category" ) );
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

			this.$['errorMessage'].setContent( $L( "Category fields may not be blank." ) );
			this.$['errorMessageContainer'].setShowing( true );
			return;
		}

		this.$['errorMessageContainer'].setShowing( false );

		if( this.general === newGeneral && this.specific === newSpecific ) {
			//No change

			this.close();
		}

		if( this.mode === "new" ) {

			this.$['manager'].createCategory( newGeneral, newSpecific, { "onSuccess": enyo.bind( this, this.doChange, "new" ) } );
		} else if( this.mode === "category" ) {

			this.$['manager'].editCategory( this.id, newGeneral, newSpecific, this.general, this.specific, { "onSuccess": enyo.bind( this, this.doChange, "category" ) } );
		} else if( this.mode === "group" ) {

			this.$['manager'].editGroup( newGeneral, this.general, { "onSuccess": enyo.bind( this, this.doChange, "group" ) } );
		} else {

			this.close();
		}
	}
});