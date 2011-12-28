/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

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
					src: enyo.fetchAppInfo()['icon'],
				}, {
					kind: enyo.HtmlContent,
					content: enyo.fetchAppInfo()['title'] + " v" + enyo.fetchAppInfo()['version'],
					style: "padding-left: 10px",
					flex: 1
				}, {
					kind: enyo.ToolButton,
					icon: "source/images/menu_icons/close.png",
					style: "top: -25px; right: -10px; position: relative;",
					onclick: "doClose"
				}
			]
		},

		{
			kind: enyo.HtmlContent,
			className: "small",
			style: "margin-bottom: 10px;",
			content: "<p>Thanks for using Checkbook on your webOS device.</p>"
		},

		{
			kind: enyo.HFlexBox,

			align: "center",
			pack: "left",
			className: "small",

			components: [
				{
					kind: enyo.Image,
					src: "source/images/application-web.png",
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
					src: "source/images/application-web.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='" + enyo.fetchAppInfo()['vendorurl'] + "'>" + enyo.fetchAppInfo()['vendor'] + " Website</a>",

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
					src: "source/images/twitter-icon.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='http://twitter.com/#!/glitchtech'>" + enyo.fetchAppInfo()['vendor'] + " Twitter</a>",

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
					src: "source/images/application-email.png",
				}, {
					kind: enyo.HtmlContent,
					onLinkClick: "linkClicked",

					content: "<a href='mailto:" + enyo.fetchAppInfo()['vendoremail'] + "?subject=" + enyo.fetchAppInfo()['title'] + " Support'>Send Email</a>",

					style: "padding-left: 10px",
					flex: 1
				}
			]
		},

		{
			content: enyo.fetchAppInfo()['copyright'],
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