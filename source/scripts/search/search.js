/* Copyright © 2011-2012, GlitchTech Science */

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
		onModify: "",
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
					//kind: "Checkbook.search.results",

					onModify: "modifyTransaction",
					onResultsFound: "resultCount",
					onLoading: "loadingDisplay"
				}
			]
		}
	],

	rendered: function() {

		this.inherited( arguments );
return;
		this.$['filter'].load( this.acctId, this.category, this.category2, this.dateStart, this.dateEnd );
	},

	searchTransactions: function( inSender, qryStrs, qryArgs ) {

		this.$['results'].search( qryStrs, qryArgs );
	},

	resultCount: function( inSender, count ) {

		this.$['resultCount'].show();
		this.$['resultCount'].setContent( count + " transactions" );
	},

	loadingDisplay: function( inSender, status ) {

		this.$['loadingSpinner'].setShowing( status );
		this.$['systemIcon'].setShowing( !status );
	},

	modifyTransaction: function( inSender, args ) {

		this.doModify( args );
	},

	closeSearch: function() {

		this.doFinish( this.$['results'].getChangesMade() );
	}
});
