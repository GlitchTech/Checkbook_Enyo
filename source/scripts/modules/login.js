/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.login",
	kind: "onyx.Popup",

	classes: "login-system small-popup",

	centered: true,
	floating: true,
	modal: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	pin: "",
	errorCount: 0,
	options: {},

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
					ontap: "badPin",

					classes: "onyx-blue small-padding"
				}
			]
		}, {
			kind: "onyx.Groupbox",
			components: [
				{
					kind: "onyx.InputDecorator",
					layoutKind: "FittableColumnsLayout",
					classes: "onyx-focused margin-bottom",
					alwaysLooksFocused: true,
					components: [
						{
							name: "pin",
							kind: "onyx.Input",
							type: "password",

							placeholder: "Enter PIN using key pad.",

							fit: true,

							disabled: true
						}, {
							content: "pin code",
							classes: "small label"
						}
					]
				}
			]
		}, {
			name: "errorMessage",
			kind: "gts.InlineNotification",
			type: "error",

			content: "",

			showing: false
		}, {
			classes: "margin-bottom pin-pad",
			components: [
				{
					classes: "margin-half-bottom",
					components: [
						{
							kind: "onyx.Button",
							content: "1",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							kind: "onyx.Button",
							content: "2",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							kind: "onyx.Button",
							content: "3",

							classes: "margin-half-right",
							ontap: "padPressed"
						}
					]
				}, {
					classes: "margin-half-bottom",
					components: [
						{
							kind: "onyx.Button",
							content: "4",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							kind: "onyx.Button",
							content: "5",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							kind: "onyx.Button",
							content: "6",

							classes: "margin-half-right",
							ontap: "padPressed"
						}
					]
				}, {
					classes: "margin-half-bottom",
					components: [
						{
							kind: "onyx.Button",
							content: "7",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							kind: "onyx.Button",
							content: "8",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							kind: "onyx.Button",
							content: "9",

							classes: "margin-half-right",
							ontap: "padPressed"
						}
					]
				}, {
					classes: "margin-bottom",
					components: [
						{
							content: " ",

							classes: "dummy-button margin-half-right"
						}, {
							kind: "onyx.Button",
							content: "0",

							classes: "margin-half-right",
							ontap: "padPressed"
						}, {
							name: "clear",
							kind: "onyx.Button",
							content: "Clear",
							ontap: "padPressed"
						}
					]
				}, {
					classes: "text-center",
					components: [
						{
							kind: "onyx.Button",

							classes: "margin-right",

							content: "Cancel",
							ontap: "badPin"
						}, {
							kind: "onyx.Button",

							classes: "onyx-affirmative",

							content: "Confirm",
							ontap: "checkPin"
						}
					]
				}
			]
		},

		{
			name: "encryption",
			kind: "Checkbook.encryption"
		}
	],

	authUser: function( title, inPin, inOptions ) {

		this.show();
		this.$['title'].setContent( title );
		this.$['pin'].setValue( "" );

		this.pin = inPin;
		this.options = inOptions;

		this.errorCount = 0;
	},

	padPressed: function( inSender, inEvent ) {

		var curr = this.$['pin'].getValue();

		if( inSender.name && inSender.name === 'clear' ) {

			this.$['pin'].setValue( "" );
		} else if( curr.length < 10 ) {

			this.$['pin'].setValue( curr + inSender.content );
		}
	},

	checkPin: function() {

		this.$['encryption'].decryptString( this.pin, enyo.bind( this, this.checkPinHandler ) );
	},

	checkPinHandler: function( userPin ) {

		if( userPin != this.$['pin'].getValue() ) {

			this.errorCount++;

			this.$['errorMessage'].show();
			this.$['errorMessage'].setContent( "Invalid PIN." ) + "<br />" + this.errorCount + " out of 5 attempts used.";
			this.$['pin'].setValue( "" )

			if( this.errorCount >= 5 ) {

				this.badPin();
			}
		} else {

			this.hide();
			this.$['errorMessage'].hide();

			if( enyo.isFunction( this.options.onSuccess ) ) {

				this.options.onSuccess();
			}
		}
	},

	badPin: function() {

		this.hide();

		if( enyo.isFunction( this.options.onFailure ) ) {

			this.options.onFailure();
		}
	}
});
