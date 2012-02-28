/* Copyright © 2011, GlitchTech Science */

/**
 * Checkbook.transactionCategory.autocomplete ( Popup )
 */
enyo.kind( {
	name: "Checkbook.transactionCategory.autocomplete",
	kind: enyo.Popup,
	layoutKind: enyo.VFlexLayout,

	lazy: false,

	style: "width: 350px; height: 350px; border-width: 8px;",//Want this to be dynamic height!

	published: {
		searchValue: "",
		limit: 50
	},

	events: {
		onSelect: ""
	},

	suggestResults: [],

	components: [
		{
					name: "suggestionList",
					kind: enyo.VirtualList,
					flex: 1,

					onSetupRow: "setupRow",

					components: [
						{
							kind: enyo.Item,
							layoutKind: enyo.HFlexLayout,

							tapHighlight: true,
							onclick: "rowClicked",

							components: [
								{
									name: "general",
									allowHtml: true,
									flex: 1
								}
							]
						}
					]
				}
	],

	searchValueChanged: function() {

		this.searchValue = this.searchValue.trim();

		if( this.searchValue.length <= 0 ) {

			this.close();
			return;
		}

		enyo.application.gts_db.query(
				new GTS.databaseQuery(
						{
							"sql": "SELECT DISTINCT genCat FROM transactionCategories WHERE genCat LIKE ? LIMIT ?;",
							"values": [ this.searchValue + "%", this.limit ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.buildSuggestionList, this.searchValue )
				}
			);
	},

	buildSuggestionList: function( qrySearch, results ) {

		if( this.searchValue !== qrySearch ) {

			return;
		}

		if( results.length <= 0 ) {

			this.close();
			return;
		}

		if( this.getOwner().$['general'] ) {

			this.suggestResults = results;
			this.$['suggestionList'].punt();

			this.openAtControl( this.getOwner().$['general'], { "top": ( this.getOwner().$['general'].getBounds().height ), "left": 25 } );
		}
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.suggestResults[inIndex];

		if( row ) {

			this.$['general'].setContent( row['genCat'] );

			return true;
		}
	},

	rowClicked: function( inSender, inEvent, rowIndex ) {

		this.doSelect( this.suggestResults[rowIndex]['genCat'] );
		this.searchValue = "";
		this.close();
	}
});