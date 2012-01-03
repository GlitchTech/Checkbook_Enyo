/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.search.view",
	kind: enyo.VFlexBox,

	style: "height: 100%;",

	published: {
		acctId: null,
		category: null,
		category2: null,
		dateStart: null,
		dateEnd: null
	},

	components: [
		{
			kind: enyo.PageHeader,
			components: [
				{
					content: "Header"
				}
			]
		}, {
			content: "mixin parameters with default / one main parameter search object / no parameters (besides acctId) => fixed search mode? / Search bar at the top / advanced options/search bar on left",
			flex: 1
		}, {
			kind: enyo.Toolbar,
			className: "tardis-blue",
			components: [
				{
					content: "Footer"
				}
			]
		}
	],

	/** @private */
	constructor: function() {

		this.inherited( arguments );

		console.log( arguments, this );
	},
});