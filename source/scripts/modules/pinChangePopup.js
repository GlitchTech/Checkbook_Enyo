/* Copyright © 2011, GlitchTech Science */

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
	kind: enyo.ModalDialog,

	layoutKind: enyo.VFlexLayout,

	modal: true,
	scrim: true,

	dismissWithClick: false,
	dismissWithEscape: false,

	style: "width: 400px;",

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: enyo.Header,

			className: "enyo-header-dark popup-header",
			style: "border-radius: 10px; margin-bottom: 10px; padding: 0 10px;",

			components: [
				{
					name: "title",
					content: $L( "Change PIN Code" ),

					className: "bigger"
				}
			]
		}, {
			content: $L( "Your pin may only contain numeric characters. (0-9)" ),
			className: "smaller"
		}, {
			kind: enyo.RowGroup,
			components: [
				{
					name: "pin1",
					kind: enyo.PasswordInput,

					hint: $L( "10 characters max" ),

					autoKeyModifier: "num-lock",
					selectAllOnFocus: true,
					spellcheck: false,
					autocorrect: false,
					autoWordComplete: false,

					oninput: "checkPin",

					components: [
						{
							content: $L( "pin code" ),
							className: "small",
							style: "text-transform: uppercase; color: rgb( 32, 117, 191 );"
						}
					]
				}, {
					name: "pin2",
					kind: enyo.PasswordInput,

					autoKeyModifier: "num-lock",
					selectAllOnFocus: true,
					spellcheck: false,
					autocorrect: false,
					autoWordComplete: false,

					oninput: "checkPin",

					hint: $L( "10 characters max" ),
					components: [
						{
							content: $L( "confirm" ),
							className: "small",
							style: "text-transform: uppercase; color: rgb( 32, 117, 191 );"
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
					content: $L( "The code entered is invalid." )
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
					onclick: "doFinish"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.Button,

					flex: 2,
					className: "enyo-button-affirmative",

					caption: $L( "Change" ),
					onclick: "updatePin"
				}
			]
		}
	],

	show: function() {

		this.inherited( arguments );

		this.$['pin1'].forceFocus();
	},

	checkPin: function( inSender, kbEvent ) {

		inSender.setValue( inSender.getValue().replace( /[^0-9]/, "" ).substr( 0, 10 ) );
	},

	updatePin: function() {

		if( this.$['pin1'].getValue() === "" || this.$['pin2'].getValue() === "" ) {

			this.$['errorMessage'].setContent( $L( "The code entered is invalid." ) );
			this.$['errorMessageContainer'].show();

			return;
		}

		if( this.$['pin1'].getValue() !== this.$['pin2'].getValue() ) {

			this.$['errorMessage'].setContent( $L( "The codes entered do not match." ) );
			this.$['errorMessageContainer'].show();

			return;
		}

		this.$['errorMessageContainer'].hide();

		this.doFinish( this.$['pin1'].getValue() );
	}
});
