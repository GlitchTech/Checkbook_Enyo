/* Copyright © 2011-2012, GlitchTech Science */


/**
 * @protected
 * Dummy data since enyo.fetchAppInfo() doesn't exist in 2.0
 */
var appInfo = {
	"title": "Checkbook",
	"id": "com.glitchtechscience.enyo.checkbook",
	"version": "1.0.9",

	"vendor": "GlitchTech Science",
	"vendorurl": "http://www.glitchtechscience.com",
	"vendoremail": "GlitchTechScience@gmail.com",

	"copyright": "&copy; Copyright 2011 and forward GlitchTech Science. All rights reserved.",

	"keywords": [
		"Checkbook",
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
	kind: "onyx.Popup",

	classes: "small-popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: true,

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: "enyo.FittableColumns",
			noStretch: true,

			classes: "text-middle margin-half-bottom",

			components: [
				{
					kind: "enyo.Image",
					src: appInfo['icon']
				}, {
					content: appInfo['title'] + " v" + appInfo['version'],

					allowHtml: true,
					fit: true,

					classes: "padding-left biggest"
				}, {
					kind: "onyx.Button",

					content: "X",
					ontap: "doFinish",

					classes: "onyx-blue small-padding"
				}
			]
		},

		{
			kind: "enyo.FittableColumns",
			noStretch: true,

			classes: "text-middle margin-half-top margin-half-bottom",

			components: [
				{
					content: "Thank you for using " + appInfo['title'] + " powered by"
				}, {
					kind: "enyo.Image",
					src: "assets/enyo-logo.png"
				}
			]
		},

		{
			kind: "enyo.FittableColumns",
			noStretch: true,

			classes: "text-middle margin-half-top",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/application-web.png",
				}, {
					content: "<a href='http://forums.precentral.net/glitchtech-science/' target='_blank'>Discussion Forums</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		}, {
			kind: "enyo.FittableColumns",
			noStretch: true,

			classes: "text-middle margin-half-top",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/application-web.png",
				}, {
					content: "<a href='" + appInfo['vendorurl'] + "' target='_blank'>" + appInfo['vendor'] + " Website</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		}, {
			kind: "enyo.FittableColumns",
			noStretch: true,

			classes: "text-middle margin-half-top",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/twitter-icon.png",
				}, {
					content: "<a href='http://twitter.com/#!/glitchtech' target='_blank'>" + appInfo['vendor'] + " Twitter</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		}, {
			kind: "enyo.FittableColumns",
			noStretch: true,

			classes: "text-middle margin-half-top",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/application-email.png",
				}, {
					content: "<a href='mailto:" + appInfo['vendoremail'] + "?subject=" + appInfo['title'] + " Support' target='_blank'>Send Email</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		},

		{
			content: appInfo['copyright'],
			allowHtml: true,
			classes: "smaller margin-top"
		},

		{
			kind: "Signals",

			onbackbutton: "backPopupHandler"
		}
	],

	backPopupHandler: function( inEvent ) {

		this.doFinish();

		return true;
	}
});
