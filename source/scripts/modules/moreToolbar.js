/* Copyright © 2011-2012, GlitchTech Science */

/*
Extension of onyx.MoreToolbar to change the styling of overflow button.
*/

enyo.kind({
	name: "Checkbook.MoreToolbar",
	kind: "onyx.MoreToolbar",
	tools: [
		{
			name: "client",
			noStretch:true,
			fit: true,
			classes: "onyx-toolbar-inline"
		}, {
			name: "nard",
			kind: "onyx.MenuDecorator",
			showing: false,
			onActivate: "activated",
			components: [
				{
					kind: "onyx.Button",
					classes: "padding-none margin-none transparent",
					style: "vertical-align: middle; margin: 4px 6px 5px; box-sizing: border-box;",
					components: [
						{
							kind: "onyx.Icon",
							classes: "onyx-more-button"
						}
					]
				}, {
					name: "menu",
					kind: "onyx.Menu",
					scrolling: false,
					classes: "onyx-more-menu"
				}
			]
		}
	]
});
