/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.search.pane",
	kind: "enyo.FittableRows",
	classes: "enyo-fit",

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
			name: "menubar",
			kind: "onyx.Toolbar",
			layoutKind: "enyo.FittableColumnsLayout",
			noStretch: true,
			components: [
				{//Swap between icon for account & spinner when loading data in the background.
					name: "systemIcon",
					kind: "enyo.Image",
					src: "assets/dollar_sign_1.png",
					classes: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					name: "loadingSpinner",
					kind: "onyx.Spinner",
					showing: false,
					classes: " img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					content: "Search System",
					classes: "enyo-text-ellipsis",
					fit: true
				}, {
					name: "resultCount",
					kind: "onyx.Button",
					className: "onyx-dark",
					showing: false,
					style: "padding: 0 8px; margin: 0;"
				}
			]
		}, {
			name: "mainViews",
			kind: "Panels",

			fit: true,
			animate: false,
			draggable: false,

			classes: "app-panels",
			arrangerKind: "CollapsingArranger",

			components: [
				{
					name: "filter",
					kind: "Checkbook.search.filter",

					onSearch: "searchTransactions",
					onFinish: "closeSearch"
				}, {
					name: "results",
					kind: "Checkbook.search.results",

					onResultsFound: "resultCount",
					onLoading: "loadingDisplay"
				}
			]
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.$['filter'].load( this.acctId, this.category, this.category2, this.dateStart, this.dateEnd );
	},

	searchTransactions: function( inSender, inEvent ) {

		this.$['results'].search( inEvent['strings'], inEvent['args'] );
	},

	resultCount: function( inSender, inEvent ) {

		this.$['resultCount'].show();
		this.$['resultCount'].setContent( inEvent['count'] + " transactions" );
	},

	loadingDisplay: function( inSender, inEvent ) {

		this.$['loadingSpinner'].setShowing( inEvent['status'] );
		this.$['systemIcon'].setShowing( !inEvent['status'] );
	},

	closeSearch: function() {

		this.doFinish( this.$['results'].getChangesMade() );
	}
});
