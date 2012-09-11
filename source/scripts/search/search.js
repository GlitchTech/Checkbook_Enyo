/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({

	name: "Checkbook.search.pane",
//	kind: enyo.VFlexBox,

	style: "height: 100%;",

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
			kind: enyo.PageHeader,
			pack: "start",
			components: [
				{
					showing: true,

					name: "systemIcon",
					kind: enyo.Image,
					src: "assets/search.png",
					className: "img-icon",
					style: "margin: 0 15px 0 0;"
				}, {
					showing: false,

					name: "loadingSpinner",
					kind: "GTS.Spinner",
					className: "img-icon",
					style: "margin: 0px 15px 5px 0;"
				}, {
					content: "Search System",
					className: "bigger",
					flex: 1,
					style: "margin-top: -6px;"
				}, {
					name: "resultCount",
					className: "enyo-button enyo-button-dark",
					showing: false
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
					onFinish: "closeSearch"
				}, {
					name: "results",
					kind: "Checkbook.search.results",
					flex: 2,

					onModify: "modifyTransaction",
					onResultsFound: "resultCount",
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
