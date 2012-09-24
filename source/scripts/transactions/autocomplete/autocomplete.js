/* Copyright © 2011-2012, GlitchTech Science */

/**
 * Checkbook.transactions.autocomplete ( options )
 */
enyo.kind( {
	name: "Checkbook.transactions.autocomplete",
	kind: "onyx.InputDecorator",

	style: "position: relative;",

	handlers: {
		oninput: "input",
		onSelect: "itemSelected",
	},

	published: {
		enabled: true,
		limit: 50,

		values: "",
		delay: 200,
		//* private ... needed to support Menu ...
		active: false
	},

	events: {
		onInputChanged: "",
		onValueSelected: ""
	},

	components:[
		{
			name: "options",
			kind: "onyx.Menu",
			floating: true
		}, {
			name: "icon",
			kind: "enyo.Image",
			classes: "img-icon",
			style: "position: absolute; right: 5px;",
			src: "assets/search.png"
		},
	],

	rendered: function() {

		this.enabledChanged();
	},

	enabledChanged: function() {

		this.log();

		this.$['icon'].setShowing( this.enabled );
	},

	input: function( source, event ) {

		if( !this.enabled ) {

			return;
		}

		// cache input instance. means we only support a single input but that's probably okay.
		// works around a bug where originator is Menu rather than Input
		this.inputField = this.inputField || event.originator;

		enyo.job( null, enyo.bind( this, "fireInputChanged" ), this.delay );
	},

	fireInputChanged: function() {

		this.searchValue = this.inputField.getValue();

		if( this.searchValue.length <= 0 ) {

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

		this.doInputChanged( { value: this.inputField.getValue() } );
	},

	buildSuggestionList: function( oldSearchValue, results ) {

		if( this.searchValue !== oldSearchValue ) {
			//prevent old data queries

			return;
		}

		this.values = results;
		this.valuesChanged();
	},

	valuesChanged: function() {

		if( !this.values || this.values.length === 0 ) {

			this.waterfall( "onRequestHideMenu", { activator: this } );
			return;
		}

		this.$['options'].destroyClientControls();
		var c = [];

		for( var i = 0; i < this.values.length; i++ ) {

			c.push( {
					"content": this.values[i]['desc'],
					index: i,
					allowHtml: true
				});
		}

		this.$['options'].createComponents( c );
		this.$['options'].render();

		this.waterfall( "onRequestShowMenu", { activator: this } );
	},

	itemSelected: function( inSender, inEvent ) {

		if( inEvent.content && inEvent.content.length > 0 ) {

			inEvent.content = inEvent.content.dirtyString();

			this.inputField.setValue( inEvent.content );
		}

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
							"values": [ this.getOwner().$['account'].getValue(), this.values[inEvent.selected.index]['desc'] ]
						}
					),
				{
					"onSuccess": enyo.bind( this, this.dataHandler, inEvent.content )
				}
			);
	},

	dataHandler: function( desc, results ) {

		var data = { "data": false };

		if( results.length > 0 ) {

			var data = {
					"data": true,
					"desc": desc,
					"linkedAccount": results[0]['linkedAccount'],
					"category": Checkbook.globals.transactionManager.parseCategoryDB( results[0]['category'].dirtyString(), results[0]['category2'].dirtyString() )
				};
		}

		this.doValueSelected( data );

		this.searchValue = "";
	},

	updatePosition: function() {

		var descNode = this.getOwner().$['descWrapper'];

		if( descNode.getBounds() ) {

			var d = this.calcViewportSize();
			var b = descNode.getBounds();

			this.applyStyle( "left", b.left + "px" );
			this.applyStyle( "width", b.width + "px" );

			var t = 0;

			if( descNode.hasNode() ) {

				var obj = descNode.hasNode();

				do {

					t += obj.offsetTop;
				} while( obj = obj.offsetParent );
			} else {

				t = b.top;
			}

			this.applyStyle( "top", ( t + b.height ) + "px" );
		}
	}
});
