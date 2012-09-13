/**
 * GTS.system_error ( ModalDialog )
 *
 * Standardized alert kind. Will display title, content, icon, and OK button. On OK press, calls onFinish.
 * @requires appinfo.js to contain vendoremail and title for certain error modes. See conditional statement starting 177 for more information.
 *
 * @param {string}	[title]	title of aleart
 * @param {string}	[content]	text content to display
 * @param {string}	[icon]	path to icon
 * @param {boolean}	[localize]	If set to true (default), will wrap content items in $L()
 *
 * @param {function}	[onFinish]	what to call when OK button is pressed
 */
enyo.kind({
	name: "Checkbook.systemError",
	kind: "onyx.Popup",

	classes: "small-input-popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	published: {
		errTitle: "System Error",
		mainMessage: "Something happend that should not have. Sorry about that.",
		secondaryMessage: "",
		errorIcon: "assets/status_icons/warning.png"
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: "enyo.FittableColumns",
			classes: "text-middle margin-half-bottom",
			noStretch: true,
			components: [
				{
					name: "icon",
					kind: "enyo.Image",
					classes: "img-icon margin-half-right"
				}, {
					name: "title",
					fit: true,
					classes: "bold"
				}, {
					kind: "onyx.Button",

					content: "X",
					ontap: "closeMe",

					classes: "onyx-blue small-padding"
				}
			]
		}, {
			classes: "light padding-std",
			components: [
				{
					name: "primaryMessage",
					classes: "margin-half-bottom",

					allowHtml: true
				}, {
					name: "secondaryMessage",
					classes: "smaller margin-half-bottom",

					allowHtml: true
				}
			]
		}, {
			classes: "text-right margin-half-top",
			components: [
				{
					kind: "onyx.Button",
					content: "Okay",
					ontap: "closeMe"
				}
			]
		}
	],

	set: function( inTitle, inMessage, inMessage2, inIcon ) {

		if( enyo.isString( inTitle ) ) {

			this.errTitle = inTitle;
		}

		if( enyo.isString( inMessage ) ) {

			this.mainMessage = inMessage;
		}

		if( enyo.isString( inMessage2 ) ) {

			this.secondaryMessage = inMessage2;
		}

		if( enyo.isString( inIcon ) ) {

			this.errorIcon = inIcon;
		}
	},

	load: function( inTitle, inMessage, inMessage2, inIcon ) {

		this.set( inTitle, inMessage, inMessage2, inIcon );

		this.show();
	},

	show: function() {

		this.inherited( arguments );
		this.setUpDisplay();
	},

	setUpDisplay: function() {

		this.titleChanged();
		this.mainMessageChanged();
		this.secondaryMessageChanged();
		this.errorIconChanged();

		this.reflow();
	},

	titleChanged: function() {

		if( this.errTitle === "~|p2t|~" ) {
			//Silly randomizer

			var tempTitle = "Critical error";

			switch( Math.floor( Math.random() * 50 ) ) {//0-49
				case 0:
					//2% chance
					tempTitle = "I don't hate you";
					break;
				case 1:
					//2% chance
					tempTitle = "Hey, hey, hey";
					break;
				case 2:case 3:case 4:case 5:case 6:
				case 7:case 8:case 9:case 10:case 11:
				case 12:case 13:case 14:
					//26% chance
					tempTitle = "Malfunctioning";
					break;
				default:
					//70% chance
					//do nothing
			}

			this.$["title"].setContent( tempTitle );
		} else {

			this.$["title"].setContent( this.errTitle );
		}
	},

	mainMessageChanged: function() {

		this.$["primaryMessage"].setContent( this.mainMessage );
	},

	secondaryMessageChanged: function() {

		if( this.secondaryMessage === "~|mt|~" ) {

			this.$["secondaryMessage"].setContent(
					"Checkbook will attempt to resume normal functions. If it does not, please restart the app." +
					"<br />" +
					"If this error occurs again, please <a href='mailto:glitchtechscience@gmail.com?" +
						"subject=Error: Checkbook&" +
						"body=%0A%0AError Message: " + this.mainMessage +
					"'>contact us</a>."
				);
		} else {

			this.$["secondaryMessage"].setContent( this.secondaryMessage );
		}
	},

	errorIconChanged: function() {

		this.$['icon'].setSrc( this.errorIcon );
	},

	closeMe: function() {

		this.doFinish();
	}
});
