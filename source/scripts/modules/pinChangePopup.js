/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.pinChangePopup ( Popup )
 *
 * Kind for PIN change popup. Requires new pin & pin confirmation.
 *
 * Parameters:
 * - onFinish ( function ): function to call when complete. Send new PIN back as argument
 *
 * USAGE:
 * components: [
 *	 {
 *		 name: "pinPopup",
 *		 kind: "Checkbook.pinChangePopup"
 *	 }
 * ]
 */
enyo.kind({
	name: "Checkbook.pinChangePopup",
	kind: "onyx.Popup",

	classes: "small-input-popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	events: {
		onFinish: ""
	},

	components: [
		{
			name: "title",
			content: "Change PIN Code",

			classes: "bigger"
		}, {
			classes: "padding-std light",
			components: [
				{
					content: "Your pin may only contain numeric characters. (0-9)",
					classes: "small bold padding-half-bottom"
				}, {
					kind: "onyx.Groupbox",
					components: [
						{
							kind: "onyx.InputDecorator",
							layoutKind: "FittableColumnsLayout",
							components: [
								{
									name: "pin1",
									kind: "onyx.Input",
									type: "password",

									placeholder: "10 characters max",

									fit: true,

									oninput: "checkPin",
								}, {
									content: "pin code",
									classes: "small label"
								}
							]
						}, {
							kind: "onyx.InputDecorator",
							layoutKind: "FittableColumnsLayout",
							components: [
								{
									name: "pin2",
									kind: "onyx.Input",
									type: "password",

									placeholder: "10 characters max",

									fit: true,

									oninput: "checkPin",
								}, {
									content: "confirm",
									classes: "small label"
								}
							]
						}
					]
				}, {
					name: "errorMessageContainer",
					layoutKind: "enyo.FittableColumnsLayout",
					noStretch: true,

					showing: false,
					classes: "padding-half-top text-middle",
					components: [
						{
							kind: "enyo.Image",
							src: "assets/warning-icon.png",
							style: "margin-right: 5px;"
						}, {
							name: "errorMessage",
							style: "color: #d70000;",
							content: "The code entered is invalid."
						}
					]
				}
			]
		}, {
			//kind: "onyx.Toolbar",
			classes: "padding-std margin-half-top text-center",
			components: [
				{
					kind: "onyx.Button",

					classes: "margin-half-right",

					content: "Cancel",
					ontap: "doFinish"
				}, {
					kind: "onyx.Button",

					classes: "onyx-affirmative margin-half-left",

					content: "Change",
					ontap: "updatePin"
				}
			]
		}
	],

	show: function() {

		this.inherited( arguments );

		this.$['pin1'].focus();
	},

	checkPin: function( inSender, kbEvent ) {

		inSender.setValue( inSender.getValue().replace( /[^0-9]/, "" ).substr( 0, 10 ) );
	},

	updatePin: function() {

		if( this.$['pin1'].getValue() === "" || this.$['pin2'].getValue() === "" ) {

			this.$['errorMessage'].setContent( "The code entered is invalid." );
			this.$['errorMessageContainer'].show();

			return;
		}

		if( this.$['pin1'].getValue() !== this.$['pin2'].getValue() ) {

			this.$['errorMessage'].setContent( "The codes entered do not match." );
			this.$['errorMessageContainer'].show();

			return;
		}

		this.$['errorMessageContainer'].hide();

		this.doFinish( { "value": this.$['pin1'].getValue() } );
	}
});
