/* Copyright © 2013, GlitchTech Science */

/**
 * Checkbook.transactions.autocomplete ( options )
 */
enyo.kind( {
	name: "Checkbook.transactions.autocomplete",

	events: {
		onValueChanged: ""
	},

	published: {
		enabled: true
	},

	components:[
		{
			name: "ac",
			kind: "gts.AutoComplete",

			onValueSelected: "handleSuggestion",
			onDataRequested: "fetchData",

			components: [
				{
					tag: "",
					name: "client"
				}
			]
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.enabledChanged();
	},

	enabledChanged: function() {

		this.$['ac'].setEnabled( this.enabled );
	},

	fetchData: function( inSender, inEvent ) {

		if( inEvent.value.length <= 0 ) {

			inEvent.callback( [] );
			return;
		}

		Checkbook.globals.gts_db.query(
				new gts.databaseQuery(
						{
							"sql": "SELECT " +
										"DISTINCT desc " +
									"FROM transactions " +
									"WHERE " +
										"desc LIKE ? " +
										//AND desc NOT IN ( SELECT desc FROM suggestions WHERE ban = 1 )//Needs union or something with suggetions table
									"ORDER BY desc ASC " +
									"LIMIT ?;",
							"values": [ inEvent.value + "%", inSender.getLimit() ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.buildSuggestionList )
				}
			);
	},

	buildSuggestionList: function( results ) {

		var data = [];

		for( var i = 0; i < results.length; i++ ) {

			data.push( results[i]['desc'] );
		}

		this.$['ac'].setValues( data );
	},

	handleSuggestion: function( inSender, inEvent ) {

		Checkbook.globals.gts_db.query(
				new gts.databaseQuery(
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
							"values": [ this.getOwner().$['account'].getValue(), inEvent.value ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.dataHandler, inEvent.value )
				}
			);

		return true;
	},

	dataHandler: function( desc, results ) {

		var data = { "data": false };

		if( results.length > 0 ) {

			var data = {
					"data": true,
					"desc": desc,
					"linkedAccount": results[0]['linkedAccount'],
					"category": Checkbook.transactions.manager.parseCategoryDB( gts.String.dirtyString( results[0]['category'] ), gts.String.dirtyString( results[0]['category2'] ) )
				};
		}

		this.doValueChanged( data );
	}
});
