/* Copyright © 2011-2012, GlitchTech Science */

/**
 * @name Checkbook.pinChangePopup
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * For changing the PIN. Requires initial entry and confirmation.
 *
 * @class
 * @version 2.0 (2012/07/13)
 * @requires onyx 2.0-beta5
 * @see http://enyojs.com
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

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends Checkbook.pinChangePopup# */

		/**
		 * PIN change completed. Pin is sent in inEvent.value.
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onFinish: ""
	},

	/**
	 * @private
	 * @type Array
	 * Components of the control
	 */
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

	/**
	 * @protected
	 * @function
	 * @name Checkbook.pinChangePopup#show
	 *
	 * Shows UI.
	 */
	show: function() {

		this.inherited( arguments );

		this.$['pin1'].focus();
	},

	/**
	 * @protected
	 * @function
	 * @name Checkbook.pinChangePopup#checkPin
	 *
	 * Called by input items. Prevents non-numerical characters.
	 *
	 * @param {Object} inSender	Event's sender
	 * @param {Object} inEvent	Event parameters
	 */
	checkPin: function( inSender, inEvent ) {

		inSender.setValue( inSender.getValue().replace( /[^0-9]/, "" ).substr( 0, 10 ) );
	},

	/**
	 * @protected
	 * @function
	 * @name Checkbook.pinChangePopup#updatePin
	 *
	 * Checks pin validity. Sends pin to controller.
	 */
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
