/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.about",
	kind: "onyx.Popup",

	classes: "small-popup",

	modal: true,
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
			classes: "h-box box-align-center margin-half-bottom",

			components: [
				{
					kind: "enyo.Image",
					src: enyo.fetchAppInfo()['icon']
				}, {
					content: enyo.fetchAppInfo()['title'] + " v" + enyo.fetchAppInfo()['version'],

					allowHtml: true,

					classes: "box-flex-1 padding-left biggest"
				}, {
					kind: "onyx.Button",

					content: "X",
					ontap: "doFinish",

					classes: "onyx-blue"
				}
			]
		},

		{
			classes: "text-center margin-half-top margin-half-bottom",

			components: [
				{
					content: "Thank you for using " + enyo.fetchAppInfo()['title'] + " powered by"
				}, {
					kind: "enyo.Image",
					src: "assets/enyo-logo.png",
					style: "height: 32px; width: 87px;"
				}
			]
		},

		{
			showing: false,
			classes: "h-box box-align-center margin-half-top margin-half-bottom",

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
			showing: false,//Website offline
			classes: "h-box box-align-center margin-half-top margin-half-bottom",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/application-web.png",
				}, {
					content: enyo.fetchAppInfo()['vendorurl'],
					//content: "<a href='" + enyo.fetchAppInfo()['vendorurl'] + "' target='_blank'>" + enyo.fetchAppInfo()['vendor'] + " Website</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		}, {
			classes: "h-box box-align-center margin-half-top margin-half-bottom",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/twitter-icon.png",
				}, {
					content: "@GlitchTech",
					//content: "<a href='http://twitter.com/#!/glitchtech' target='_blank'>" + enyo.fetchAppInfo()['vendor'] + " Twitter</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		}, {
			classes: "h-box box-align-center margin-half-top margin-half-bottom",

			components: [
				{
					kind: "enyo.Image",
					src: "assets/application-email.png",
				}, {
					content: enyo.fetchAppInfo()['vendoremail'],
					//content: "<a href='mailto:" + enyo.fetchAppInfo()['vendoremail'] + "?subject=" + enyo.fetchAppInfo()['title'] + " Support' target='_blank'>Send Email</a>",
					classes: "padding-left dark-link",
					allowHtml: true
				}
			]
		},

		{
			content: enyo.fetchAppInfo()['copyright'],
			allowHtml: true,
			classes: "smaller margin-top"
		},

		{
			kind: "Signals",

			onbackbutton: "test",
			onmenubutton: "test",
			onsearchbutton: "test",
			onkeydown: "test"//for testing only
		}
	],

	test: function() {

		if( !this.showing ) {

			return;
		}

		this.log( arguments );
	}
});
