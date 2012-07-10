/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.login",
	kind: enyo.Control,

	components: [
		{
			name: "loginPopup",
			kind: enyo.Popup,
			layoutKind: enyo.VFlexLayout,

			modal: true,
			scrim: true,

			dismissWithClick: false,
			dismissWithEscape: false,

			lazy: false,

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
							style: "text-align: center; padding: 0 10px;",
							flex: 1
						}, {
							kind: enyo.ToolButton,
							icon: "assets/menu_icons/close.png",

							className: "img-icon",
							style: "text-align: center;",

							onclick: "badPin"
						}
					]
				}, {
					kind: enyo.RowGroup,
					components: [
						{
							name: "pin",
							kind: enyo.PasswordInput,

							hint: "Enter PIN using key pad.",

							autoKeyModifier: "num-lock",
							spellcheck: false,
							autocorrect: false,
							autoWordComplete: false,

							disabled: true,

							components: [
								{
									content: "pin code",
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
							content: "",
							allowHtml: true
						}
					]
				}, {
					style: "margin-bottom: 10px;",
					components: [
						{
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									kind: onyx.Button,
									caption: "1",
									flex: 1,
									onclick: "padPressed"
								}, {
									kind: onyx.Button,
									caption: "2",
									flex: 1,
									onclick: "padPressed"
								}, {
									kind: onyx.Button,
									caption: "3",
									flex: 1,
									onclick: "padPressed"
								}
							]
						}, {
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									kind: onyx.Button,
									caption: "4",
									flex: 1,
									onclick: "padPressed"
								}, {
									kind: onyx.Button,
									caption: "5",
									flex: 1,
									onclick: "padPressed"
								}, {
									kind: onyx.Button,
									caption: "6",
									flex: 1,
									onclick: "padPressed"
								}
							]
						}, {
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									kind: onyx.Button,
									caption: "7",
									flex: 1,
									onclick: "padPressed"
								}, {
									kind: onyx.Button,
									caption: "8",
									flex: 1,
									onclick: "padPressed"
								}, {
									kind: onyx.Button,
									caption: "9",
									flex: 1,
									onclick: "padPressed"
								}
							]
						}, {
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									//Spacer; 2 to 1 ratio doesn't look right
									kind: onyx.Button,
									style: "visibility: hidden;",
									flex: 1
								}, {
									kind: onyx.Button,
									caption: "0",
									flex: 1,
									onclick: "padPressed"
								}, {
									name: "clear",
									kind: onyx.Button,
									caption: "Clear",
									flex: 1,
									onclick: "padPressed"
								}
							]
						}
					]
				}, {
					kind: enyo.Toolbar,
					components: [
						{
							kind: onyx.Button,

							flex: 2,
							className: "enyo-button-primary",

							caption: "Cancel",
							onclick: "badPin"
						}, {
							kind: enyo.Spacer,
							flex: 1
						}, {
							kind: onyx.Button,

							flex: 2,
							className: "enyo-button-affirmative",

							caption: "Confirm",
							onclick: "checkPin"
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

	pin: "",
	errorCount: 0,
	options: {},

	authUser: function( title, inPin, inOptions ) {

		this.$['loginPopup'].openAtCenter();
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

			this.$['pin'].setValue( curr + inSender.caption );
		}
	},

	checkPin: function() {

		this.$['encryption'].encryptString( this.$['pin'].getValue(), enyo.bind( this, this.checkPinHandler ) );
	},

	checkPinHandler: function( userEntry ) {

		this.log( this.pin, userEntry );

		if( userEntry != this.pin ) {

			this.errorCount++;

			this.$['errorMessageContainer'].setShowing( true );
			this.$['errorMessage'].setContent( "Invalid PIN." ) + "<br />" + this.errorCount + $L( " out of 5 attempts used." );
			this.$['pin'].setValue( "" )

			if( this.errorCount >= 5 ) {

				this.badPin();
			}
		} else {

			this.$['loginPopup'].close();

			if( enyo.isFunction( this.options.onSuccess ) ) {

				this.options.onSuccess();
			}
		}
	},

	badPin: function() {

		this.$['loginPopup'].close();

		if( enyo.isFunction( this.options.onFailure ) ) {

			this.options.onFailure();
		}
	}
});
