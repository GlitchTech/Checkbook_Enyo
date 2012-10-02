/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.accountCategory.modify",
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

	published: {
		id: -1,
		general: "",
		specific: "",
		mode: ""
	},

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
					kind: "onyx.InputDecorator",
					layoutKind: "FittableColumnsLayout",
					classes: "onyx-focused",
					alwaysLooksFocused: true,
					components: [
						{
							name: "name",
							kind: "onyx.Input",

							placeholder: "category name",

							fit: true
						}, {
							content: "name",
							classes: "small label"
						}
					]
				}, {
					//icon picker
					name: "icon",
					kind: "GTS.SelectorBar",

					label: "Icon",
					maxHeight: 300,

					choices: appIcons
				}, {
					//picker with background colors
					name: "color",
					kind: "GTS.SelectorBar",

					label: "Color",

					classes: "custom-background legend",
					choices: appColors,

					onChange: "colorChanged"
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
		},

		{
			name: "manager",
			kind: "Checkbook.accountCategory.manager"
		}
	],

	show: function( inRowid, inName, inIcon, inColor ) {

		this.inherited( arguments );

		if( inRowid < 0 ) {

			this.$['deleteButton'].hide();
		} else {

			this.$['deleteButton'].show();
		}

		this.$['name'].focus();
		this.loadModifySystem( inRowid, inName, inIcon, inColor );
	},

	loadModifySystem: function( inRowid, inName, inIcon, inColor ) {

		if( inRowid < 0 ) {

			this.$['title'].setContent( "Create a Category" );

			this.rowid = -1;
			this.name = "";
			this.icon = "";
			this.color = "";
		} else if( inRowid > 0 ) {

			this.$['title'].setContent( "Edit Category" );

			this.rowid = inRowid;
			this.name = inName;
			this.icon = inIcon;
			this.color = inColor;
		} else {

			this.hide();
		}

		this.$['name'].setValue( this.name );
		this.$['icon'].setValue( this.icon );
		this.$['color'].setValue( this.color.ucfirst() );

		for( var i = 0; i < appColors.length; i++ ) {

			this.$['color'].removeClass( appColors[i]['name'] );
		}

		this.$['color'].addClass( this.color );

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			this.$['color'].show();
		} else {

			this.$['color'].hide();
		}
	},

	colorChanged: function( inSender, inEvent ) {


		this.$['color'].removeClass( this.color );

		this.color = inEvent.selected.name;

		this.$['color'].addClass( this.color );

		return true;
	},

	deleteCategory: function() {

		if( this.acctId < 0 ) {

			this.doFinish( 0 );
		} else {

			this.createComponent( {
					name: "deleteCategoryConfirm",
					kind: "gts.ConfirmDialog",

					title: "Delete Account",
					message: "Are you sure you want to delete this account category?",

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

		this.$['manager'].deleteCategory( this.rowid, this.name, { "onSuccess": enyo.bind( this, this.doChangeComplete, { "action": "delete" } ) } );
	},

	save: function() {

		var newName = this.$['name'].getValue();
		this.icon = this.$['icon'].getValue();

		if( newName.length <= 0 ) {

			this.$['errorMessage'].setContent( "Category name may not be blank." );
			this.$['errorMessage'].show();
			return;
		}

		this.$['manager'].fetchMatchingCount( newName, this.rowid, { "onSuccess": enyo.bind( this, this.saveFinisher, newName ) } );
	},

	saveFinisher: function( newName, count ) {

		if( count > 0 ) {

			this.$['errorMessage'].setContent( "Category names must be unique." );
			this.$['errorMessage'].show();
			return;
		}

		this.$['errorMessage'].hide();

		if( this.rowid < 0 ) {

			this.$['manager'].createCategory( { "name": newName, "icon": this.icon, "color": this.color }, { "onSuccess": enyo.bind( this, this.doChangeComplete, { "action": "new" } ) } );
		} else {

			this.$['manager'].editCategory( this.rowid, newName, this.icon, this.color, this.name, { "onSuccess": enyo.bind( this, this.doChangeComplete, { "action": "edit" } ) } );
		}
	}
});
