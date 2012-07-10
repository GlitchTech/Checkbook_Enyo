/* Copyright � 2011-2012, GlitchTech Science */


/**
 * @private
 * Dummy data since enyo.fetchAppInfo() doesn't exist in 2.0
 */
var appInfo = {
	"title": "Checkbook HD Beta",
	"id": "com.glitchtechscience.enyo.checkbookbeta",
	"version": "1.1.0",

	"vendor": "GlitchTech Science",
	"vendorurl": "http://www.glitchtechscience.com",
	"vendoremail": "GlitchTechScience@gmail.com",

	"copyright": "&copy; Copyright 2011 and forward GlitchTech Science. All rights reserved.",

	"keywords": [
		"Checkbook",
		"Checkbook HD",
		"finance",
		"budget",
		"money",
		"cash"
	],

	"icon": "assets/icon_1.png",
	"miniicon": "assets/icon_1_32x32.png"
};

enyo.kind({

	name: "Checkbook.about",
	kind: enyo.Popup,

	layoutKind: enyo.VFlexLayout,

	modal: true,
	scrim: true,

	events: {
		onClose: ""
	},

	components: [
		{
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			className: "big",

			components: [
				{
					kind: enyo.Image,
					src: appInfo['icon']
				}, {
					kind: enyo.HtmlContent,
					content: appInfo['title'] + " v" + appInfo['version'],
					style: "padding-left: 10px",
					flex: 1
				}, {
					kind: enyo.ToolButton,
					icon: "assets/menu_icons/close.png",
					style: "top: -25px; right: -10px; position: relative;",
					onclick: "doClose"
				}
			]
		},

		{
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			style: "margin-bottom: 10px;",

			components: [
				{
					className: "small",
					content: "Thank you for using " + appInfo['title'] + " powered by"
				}, {
					kind: enyo.Image,
					src: "assets/enyo-logo.png",
					style: "background-color: black; border-radius: 5px; margin: 5px 0px 0px 5px; padding: 1px;"
				}
			]
		},

		{
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			className: "small",

			components: [
				{
					kind: enyo.Image,
					src: "assets/application-web.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='http://forums.precentral.net/glitchtech-science/'>Discussion Forums</a>",

					style: "padding-left: 10px",
					flex: 1
				}
			]
		}, {
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			className: "small",

			components: [
				{
					kind: enyo.Image,
					src: "assets/application-web.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='" + appInfo['vendorurl'] + "'>" + appInfo['vendor'] + " Website</a>",

					style: "padding-left: 10px",
					flex: 1
				}
			]
		}, {
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			className: "small",

			components: [
				{
					kind: enyo.Image,
					src: "assets/twitter-icon.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='http://twitter.com/#!/glitchtech'>" + appInfo['vendor'] + " Twitter</a>",

					style: "padding-left: 10px",
					flex: 1
				}
			]
		}, {
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			className: "small",

			components: [
				{
					kind: enyo.Image,
					src: "assets/application-email.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='mailto:" + appInfo['vendoremail'] + "?subject=" + appInfo['title'] + " Support'>Send Email</a>",

					style: "padding-left: 10px",
					flex: 1
				}
			]
		},

		{
			content: appInfo['copyright'],
			className: "smaller",
			style: "margin-top: 10px;"
		},

		{
			name: "linkService",
			kind: "PalmService",
			service: "palm://com.palm.applicationManager/",
			method: "open"
		}
	],

	linkClicked: function( inSender, inUrl, inEvent ) {

		this.$['linkService'].call( { target: inUrl } );
	}
});
