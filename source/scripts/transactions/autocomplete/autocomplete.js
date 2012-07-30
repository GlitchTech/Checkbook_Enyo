/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.transactions.autocomplete ( Popup )
 */
enyo.kind( {
	name: "Checkbook.transactions.autocomplete",
	kind: "onyx.Popup",

	published: {
		searchValue: "",
		limit: 50
	},

	events: {
		onSelect: ""
	},

	suggestResults: [],

	components: [
		{//repeater
			name: "suggestionList",
			kind: "enyo.Repeater",

			onSetupRow: "setupRow",

			components: [
				{
					kind: enyo.Item,
					layoutKind: enyo.HFlexLayout,

					tapHighlight: true,
					ontap: "rowClicked",

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

			this.hide();
			return;
		}

		Checkbook.globals.gts_db.query(
				new GTS.databaseQuery(
						{
							"sql": "SELECT " +
										"DISTINCT desc " +
									"FROM transactions " +
									"WHERE " +
										"desc LIKE ? " +
										//AND desc NOT IN ( SELECT desc FROM suggestions )//Needs union or something with suggetions table
									"ORDER BY desc ASC " +
									"LIMIT ?;",
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

			this.hide();
			return;
		}

		if( this.getOwner().$['desc'] ) {

			this.suggestResults = results;
			this.$['suggestionList'].setCount( this.suggestResults.length );

			this.show();
			this.updatePosition();
		}
	},

	updatePosition: function() {

		//Set to below defined component
		var d = this.calcViewportSize();
		var b = this.getBounds();

		this.addStyles( "top: " + Math.max( ( ( d.height - b.height ) / 2 ), 0 ) + "px; left: " + Math.max( ( ( d.width - b.width ) / 2 ), 0 ) + "px;" );

		var descNode = this.getOwner().$['desc'];
		//, { "top": ( this.getOwner().$['desc'].getBounds().height ), "left": 25 }
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.suggestResults[inIndex];

		if( row ) {

			this.$['desc'].setContent( row['desc'] );

			return true;
		}
	},

	rowClicked: function( inSender, inEvent, rowIndex ) {

		Checkbook.globals.gts_db.query(
				new GTS.databaseQuery(
						{
							"sql": "SELECT " +
									"( SELECT linkedAccount FROM( SELECT b.linkedAccount, COUNT( b.desc ) AS countB FROM transactions b WHERE b.desc = a.desc AND b.linkedAccount != '' AND b.account = ? GROUP BY b.linkedAccount ORDER BY countB DESC LIMIT 1 ) ) AS linkedAcct, " +
									" ( CASE WHEN a.category = '||~SPLIT~||' THEN" +
										" ( '[' || ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ) AS json FROM transactionSplit ts WHERE ts.transId = a.itemId ORDER BY ts.amount DESC ) ) || ']' )" +
									" ELSE a.category END ) AS category," +
									" ( CASE WHEN a.category = '||~SPLIT~||' THEN" +
										" 'PARSE_CATEGORY'" +
									" ELSE a.category2 END ) AS category2, " +
									"COUNT( desc ) AS count " +
								"FROM transactions a " +
								"WHERE desc = ? " +
									"AND category != '' " +
									"GROUP BY category " +
								"ORDER BY count DESC " +
								"LIMIT 1;",
							"values": [ this.getOwner().$['account'].getValue(), this.suggestResults[rowIndex]['desc'] ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.dataHandler, this.suggestResults[rowIndex]['desc'] )
				}
			);
	},

	dataHandler: function( desc, results ) {

		var data = {
				"desc": desc,
				"linkedAccount": results[0]['linkedAccount'],
				"category": Checkbook.globals.transactionManager.parseCategoryDB( results[0]['category'].dirtyString(), results[0]['category2'].dirtyString() )
			};

		this.doSelect( data );

		this.searchValue = "";
		this.hide();
	}
});
