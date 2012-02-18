/* Copyright © 2011, GlitchTech Science */

/**
 * Checkbook.transactions.autocomplete ( Popup )
 */
enyo.kind( {

	name: "Checkbook.transactions.autocomplete",
	kind: enyo.Popup,
	layoutKind: enyo.VFlexLayout,

	lazy: false,

	style: "width: 450px; height: 350px; border-width: 8px;",

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
									name: "desc",
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
							"sql": "SELECT DISTINCT desc FROM transactions WHERE desc LIKE ? ORDER BY desc ASC LIMIT ?;",
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

		if( this.getOwner().$['desc'] ) {

			this.suggestResults = results;
			this.$['suggestionList'].punt();

			this.openAtControl( this.getOwner().$['desc'], { "top": ( this.getOwner().$['desc'].getBounds().height ), "left": 25 } );
		}
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.suggestResults[inIndex];

		if( row ) {

			this.$['desc'].setContent( row['desc'] );

			return true;
		}
	},

	rowClicked: function( inSender, inEvent, rowIndex ) {

		//UPDATE FOR SPLIT TRANSACTIONS

		enyo.application.gts_db.query(
				new GTS.databaseQuery(
						{
							"sql": "SELECT ( SELECT linkedAccount FROM( SELECT b.linkedAccount, COUNT( b.desc ) AS countB FROM transactions b WHERE b.desc = a.desc AND b.linkedAccount != '' AND b.account = ? GROUP BY b.linkedAccount ORDER BY countB DESC LIMIT 1 ) ) AS linkedAcct, category, category2, COUNT( desc ) AS count FROM transactions a WHERE desc = ? AND category != '' GROUP BY category ORDER BY count DESC LIMIT 1;",
							"values": [ this.getOwner().$['account'].getValue(), this.suggestResults[rowIndex]['desc'] ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.dataHandler, this.suggestResults[rowIndex]['desc'] )
				}
			);
	},

	dataHandler: function( desc, result ) {

		this.doSelect( { "desc": desc, "linkedAccount": result[0]['linkedAccount'], "category": [ { "category": result[0]['category'].dirtyString(), "category2": result[0]['category2'].dirtyString(), "amount": "" } ] } );
		this.searchValue = "";
		this.close();
	}
} );