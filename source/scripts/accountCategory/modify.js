/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.accountCategory.modify",
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
					name: "name",
					kind: enyo.Input,
					autoKeyModifier: "shift-single",

					components: [
						{
							content: $L( "name" ),
							className: "enyo-label"
						}
					]
				}, {
					name: "icon",
					kind: "GTS.ListSelectorBar",
					labelText: "Category Icon",
					className: "iconListSelector",
					choices: appIcons
				}, {
					name: "colorHolder",
					kind: enyo.Item,
					layoutKind: enyo.HFlexLayout,

					onclick: "showColorPicker",
					tapHightlight: true,
					className: "custom-background legend",

					components: [
						{
							name: "color",
							className: "enyo-text-ellipsis",
							flex: 1
						}, {
							content: $L( "Color" ),
							className: "enyo-listselector-label enyo-label"
						}, {
							className: "enyo-listselector-arrow"
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
					content: ""
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
			name: "colorPicker",
			kind: "Menu",
			allowHtml: true,
			components: appColors
		},

		{
			name: "manager",
			kind: "Checkbook.accountCategory.manager"
		}
	],

	openAtCenter: function( inRowid, inName, inIcon, inColor ) {

		this.inherited( arguments );

		this.$['name'].forceFocus();
		this.loadModifySystem( inRowid, inName, inIcon, inColor );
	},

	loadModifySystem: function( inRowid, inName, inIcon, inColor ) {

		if( inRowid < 0 ) {

			this.$['title'].setContent( $L( "Create a Category" ) );

			this.rowid = -1;
			this.name = "";
			this.icon = "";
			this.color = "";
		} else if( inRowid > 0 ) {

			this.$['title'].setContent( $L( "Edit Category" ) );

			this.rowid = inRowid;
			this.name = inName;
			this.icon = inIcon;
			this.color = inColor;
		} else {

			this.close();
		}

		this.$['name'].setValue( this.name );
		this.$['icon'].setValue( this.icon );
		this.$['color'].setContent( this.color.ucfirst() );

		for( var i = 0; i < appColors.length; i++ ) {

			this.$['colorHolder'].removeClass( appColors[i]['name'] );
		}

		this.$['colorHolder'].addClass( this.color );

		if( enyo.application.checkbookPrefs['dispColor'] === 1 ) {

			this.$['colorHolder'].setShowing( true );
		} else {

			this.$['colorHolder'].setShowing( false );
		}
	},

	showColorPicker: function( inSender ) {

		this.$['colorPicker'].openAtControl( inSender );
	},

	menuItemClick: function( inSender, inEvent ) {

		this.$['colorHolder'].removeClass( this.color );

		this.color = inSender.name;

		this.$['colorHolder'].addClass( this.color );
		this.$['color'].setContent( this.color.ucfirst() );
	},

	save: function() {

		var newName = this.$['name'].getValue();
		this.icon = this.$['icon'].getValue();

		if( newName.length <= 0 ) {

			this.$['errorMessage'].setContent( $L( "Category name may not be blank." ) );
			this.$['errorMessageContainer'].setShowing( true );
			return;
		}

		this.$['manager'].fetchMatchingCount( newName, this.rowid, { "onSuccess": enyo.bind( this, this.saveFinisher, newName ) } );
	},

	saveFinisher: function( newName, count ) {

		if( count > 0 ) {

			this.$['errorMessage'].setContent( $L( "Category names must be unique." ) );
			this.$['errorMessageContainer'].setShowing( true );
			return;
		}

		this.$['errorMessageContainer'].setShowing( false );

		if( this.rowid < 0 ) {

			this.$['manager'].createCategory( { "name": newName, "icon": this.icon, "color": this.color }, { "onSuccess": enyo.bind( this, this.doChange, "new" ) } );
		} else {

			this.$['manager'].editCategory( this.rowid, newName, this.icon, this.color, this.name, { "onSuccess": enyo.bind( this, this.doChange, "edit" ) } );
		}
	}
});