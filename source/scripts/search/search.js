/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.search.pane",
	kind: enyo.VFlexBox,

	style: "height: 100%;",

	published: {
		acctId: null,
		category: null,
		category2: null,
		dateStart: null,
		dateEnd: null
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: enyo.PageHeader,
			pack: "start",
			components: [
				{
					showing: true,

					name: "systemIcon",
					kind: enyo.Image,
					src: "source/images/search.png",
					className: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					showing: false,

					name: "loadingSpinner",
					kind: enyo.Spinner,
					className: "img-icon",
					style: "margin: 0px 15px 5px 0;"
				}, {
					content: $L( "Search System" ),
					className: "bigger",
					style: "margin-top: -6px;"
				}
			]
		}, {
			kind: enyo.SlidingPane,
			flex: 1,
			components: [
				{
					name: "search",
					kind: "Checkbook.search.filter",
					flex: 1,

					onSearch: "searchTransactions",
					onFinish: "doFinish"
				}, {
					name: "results",
					kind: "Checkbook.search.results",
					flex: 3,

					onLoading: "loadingDisplay"
				}
			]
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.$['search'].load( this.acctId, this.category, this.category2, this.dateStart, this.dateEnd );
	},

	searchTransactions: function( inSender, qryStrs, qryArgs ) {

		this.$['results'].search( qryStrs, qryArgs );
	},

	loadingDisplay: function( inSender, status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['systemIcon'].setShowing( !status );
	}
});