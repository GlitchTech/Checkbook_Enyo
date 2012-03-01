/* Copyright © 2011, GlitchTech Science */

enyo.kind({

	name: "Checkbook.search.filter",
	kind: enyo.SlidingView,
	layoutKind: enyo.VFlexLayout,

	flex: 1,

	acctList: {
			count: 0,
			items: []
		},

	events: {
		onSearch: "",
		onFinish: ""
	},

	components: [
		{
			kind: enyo.Scroller,
			flex: 1,
			components: [
				{
					kind: enyo.Item,
					tapHightlight: false,
					components: [
						{
							name: "searchString",
							kind: enyo.RichText,
							hint: $L( "Search" ),

							oninput: "searchChanged",
							autoKeyModifier: "shift-single",

							flex: 1
						}
					]
				}, {
					name: "accountDrawer",
					kind: enyo.DividerDrawer,
					caption: $L( "Accounts" ),
					components: [
						{
							name: "accounts",
							kind: enyo.VirtualRepeater,

							onSetupRow: "setupRow",

							components: [
								{
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,

									tapHighlight: true,
									onclick: "accountSelectedChanged",

									components: [
										{
											name: "icon",
											kind: enyo.Image,
											className: "accountIcon"
										}, {
											name: "iconLock",
											kind: enyo.Image,
											src: "source/images/padlock_1.png",
											className: "accountLockIcon unlocked"
										}, {
											flex: 1,
											components: [
												{
													name: "accountName"
												}, {
													name: "accountNote",
													className: "smaller"
												}
											]
										}, {
											name: "accountSelected",
											kind: enyo.CheckBox,

											style: "margin-right: 10px;"
										}
									]
								}
							]
						}
					]
				}, {
					name: "fromToggle",
					kind: "GTS.ToggleBar",
					mainText: "Limit Start Date",
					subText: "Limit the earliest date that can appear in search query.",
					onText: "Yes",
					offText: "No",
					onChange: "toggleToggles"
				}, {
					name: "fromDrawer",
					kind: enyo.BasicDrawer,
					style: "padding: 0px 25px 0px 5px;",
					components: [
						{
							name: "fromDate",
							kind: "GTS.DateTimePicker",
							//showTime: false
						}
					]
				}, {
					name: "toToggle",
					kind: "GTS.ToggleBar",
					mainText: "Limit End Date",
					subText: "Limit the latest date that can appear in search query.",
					onText: "Yes",
					offText: "No",
					onChange: "toggleToggles"
				}, {
					name: "toDrawer",
					kind: enyo.BasicDrawer,
					style: "padding: 0px 25px 0px 5px;",
					components: [
						{
							name: "toDate",
							kind: "GTS.DateTimePicker",
							//showTime: false
						}
					]
				}, {
					name: "cleared",
					kind: "GTS.ListSelectorBar",
					labelText: "Include Transaction Status",
					className: "force-left-padding",

					value: 2,
					choices: [
						{
							caption: "All",
							value: 2
						}, {
							caption: "Cleared Only",
							value: 1
						}, {
							caption: "Pending Only",
							value: 0
						}
					]
				}, {
					name: "includeNeg",
					kind: "GTS.ToggleBar",
					mainText: "Include Expenses",
					onText: "Yes",
					offText: "No",
					value: true
				}, {
					name: "includePos",
					kind: "GTS.ToggleBar",
					mainText: "Include Income",
					onText: "Yes",
					offText: "No",
					value: true
				}, {
					name: "includeTrans",
					kind: "GTS.ToggleBar",
					mainText: "Include Transfers",
					onText: "Yes",
					offText: "No",
					value: true
				}
			]
		}, {
			kind: enyo.Button,
			caption: $L( "Search" ),
			className: "enyo-button-dark",
			onclick: "search"
		}, {
			kind: enyo.Toolbar,
			className: "tardis-blue",
			pack: "start",
			components: [
				{
					content: "Back",
					onclick: "doFinish"
				}
			]
		}
	],

	load: function( acctId, category, category2, dateStart, dateEnd ) {

		this.$['accountDrawer'].close();
		enyo.application.accountManager.fetchAccounts( { "onSuccess": enyo.bind( this, this.renderAccountList, acctId, category, category2, dateStart, dateEnd ) } );
	},

	renderAccountList: function( acctId, category, category2, dateStart, dateEnd, results ) {

		//Account List
		this.acctList['items'] = [];
		this.acctList['count'] = 0;

		for( var i = 0; i < results.length; i++ ) {

			this.acctList['items'][i] = results[i];

			if( acctId ) {

				if( this.acctList['items'][i]['acctId'] === acctId ) {

					this.acctList['items'][i]['selectStatus'] = true;
					this.acctList['count']++;
				} else {

					this.acctList['items'][i]['selectStatus'] = false;
				}
			} else {

				this.acctList['items'][i]['selectStatus'] = true;
				this.acctList['count']++;
			}
		}

		this.renderDrawerCaption();
		this.$['accounts'].render();

		//Start Date
		if( dateStart ) {

			var startValue = new Date( dateStart );

			if( Date.validDate( startValue ) ) {

				startValue.setHours( 0, 0, 0, 0 );//Start of day
				this.$['fromDate'].setValue( startValue );
				this.$['fromToggle'].setValue( true );
			} else {

				this.$['fromToggle'].setValue( false );
			}
		}

		//End Date
		if( dateEnd ) {

			var endValue = new Date( dateEnd );

			if( Date.validDate( endValue ) ) {

				endValue.setHours( 23, 59, 59, 999 );//End of day
				this.$['toDate'].setValue( endValue );
				this.$['toToggle'].setValue( true );
			} else {

				this.$['toToggle'].setValue( false );
			}
		}

		this.toggleToggles();

		//Search Box
		var searchStr = "";

		if( category ) {

			searchStr += '"' + category + '"' + ( ( category2 && category2 !== "%" ) ? ' "' + category2 + '"' : "" );
		}

		this.$['searchString'].setValue( searchStr.trim() );

		if( this.$['searchString'].getValue().length > 0 ) {

			this.search();
		}
	},

	toggleToggles: function() {

		this.$['fromDrawer'].setOpen( this.$['fromToggle'].getValue() );
		this.$['toDrawer'].setOpen( this.$['toToggle'].getValue() );
	},

	/** Account List Control **/

	renderDrawerCaption: function() {

		this.$['accountDrawer'].setCaption( $L( "Accounts" ) + " (" + this.acctList['count'] + $L( " of " ) + this.acctList['items'].length + ")" );
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.acctList['items'][inIndex];

		if( row ) {

			this.$['accountName'].setContent( row['acctName'] );

			this.$['icon'].setSrc( "source/images/" + row['acctCategoryIcon'] );
			this.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 || row['bypass'] ) );

			this.$['accountSelected'].setChecked( row['selectStatus'] );

			return true;
		}
	},

	accountSelectedChanged: function( inSender, inEvent ) {

		var rowIndex = inEvent.rowIndex;

		if( this.acctList['items'][rowIndex]['acctLocked'] && !this.acctList['items'][rowIndex]['bypass'] ) {

				enyo.application.security.authUser(
						this.acctList['items'][rowIndex]['name'] + " " + $L( "PIN Code" ),
						this.acctList['items'][rowIndex]['lockedCode'],
						{
							"onSuccess": enyo.bind( this, this.authSuccessful, inEvent )
						}
					);
		} else {

			this.acctList['items'][rowIndex]['selectStatus'] = !this.acctList['items'][rowIndex]['selectStatus'];

			this.acctList['count'] = ( this.acctList['items'][rowIndex]['selectStatus'] ? this.acctList['count'] + 1 : this.acctList['count'] - 1 );
		}

		this.renderDrawerCaption();
		this.$['accounts'].renderRow( rowIndex );
	},

	authSuccessful: function( inEvent ) {

		this.acctList['items'][inEvent.rowIndex]['bypass'] = true;
		this.accountSelectedChanged( null, inEvent );
	},

	/** Search Controls **/

	search: function() {

		var whereStrs = "";
		var whereArgs = [];

		var searchStr = this.$['searchString'].getValue().dirtyString().trim();

		//Extract quote items
		var phrases = searchStr.match( /"([^"]*)"/gi );

		searchStr = searchStr.replace( /"[^"]*"/gi, "" ).trim();
		searchStr = searchStr.split( " " );

		if( phrases && phrases.length > 0 ) {

			for( var i = 0; i < phrases.length; i++ ) {

					phrases[i] = phrases[i].replace( /"/g, "" );
			}

			searchStr = searchStr.concat( phrases );
		}

		for( var i = 0; i < searchStr.length; i++ ) {

			if( searchStr[i][0] === "-" ) {

				searchStr[i] = "%" + searchStr[i].slice( 1 ) + "%";

				if( searchStr[i] !== "" ) {

					whereStrs += " AND desc NOT LIKE ?";
					whereArgs.push( searchStr[i] );

					whereStrs += " AND ( category NOT LIKE ? OR category2 NOT LIKE ? )";
					whereArgs.push( searchStr[i] );
					whereArgs.push( searchStr[i] );

					whereStrs += " AND itemId NOT IN ( SELECT ts.transId FROM transactionSplit ts WHERE ts.genCat LIKE ? OR ts.specCat LIKE ? )";
					whereArgs.push( searchStr[i] );
					whereArgs.push( searchStr[i] );

					whereStrs += " AND checkNum NOT LIKE ?";
					whereArgs.push( searchStr[i] );

					whereStrs += " AND note NOT LIKE ?";
					whereArgs.push( searchStr[i] );
				}
			} else if( searchStr[i].length > 0 ) {

				searchStr[i] = "%" + searchStr[i] + "%";

				whereStrs += " OR desc LIKE ?";
				whereArgs.push( searchStr[i] );

				whereStrs += " OR category LIKE ?";
				whereArgs.push( searchStr[i] );

				whereStrs += " OR category2 LIKE ?";
				whereArgs.push( searchStr[i] );

				whereStrs += " OR itemId IN ( SELECT ts.transId FROM transactionSplit ts WHERE ts.genCat LIKE ? OR ts.specCat LIKE ? )";
				whereArgs.push( searchStr[i] );
				whereArgs.push( searchStr[i] );

				whereStrs += " OR checkNum LIKE ?";
				whereArgs.push( searchStr[i] );

				whereStrs += " OR note LIKE ?";
				whereArgs.push( searchStr[i] );
			}
		}

		if( whereStrs.length > 0 ) {

			//remove first AND/OR
			whereStrs = whereStrs.replace( /^ (or|and) (.*)/i, "$2" );

			whereStrs = [ "( " + whereStrs + " )" ];
		}

		//Acount Filters
		var acctS = [];
		var acctA = [];

		for( var i = 0; i < this.acctList['items'].length; i++ ) {

			if( this.acctList['items'][i]['selectStatus'] ) {

				acctS.push( "account = ?" );
				acctA.push( this.acctList['items'][i]['acctId'] );
			}
		}

		if( acctS.length > 0 && acctA.length > 0 ) {

			whereStrs += " AND ( " + acctS.join( " OR " ) + " )";
			whereArgs = whereArgs.concat( acctA );
		}

		//Date Filters
		if( this.$['fromToggle'].getValue() ) {

			var from = this.$['fromDate'].getValue();

			whereStrs += " AND date >= ?";
			whereArgs.push( Date.parse( from ) );
		}

		if( this.$['toToggle'].getValue() ) {

			var to = this.$['toDate'].getValue();

			whereStrs += " AND date <= ?";
			whereArgs.push( Date.parse( to ) );
		}

		//Status Filters
		if( this.$['cleared'].getValue() !== 2 ) {

			whereStrs += " AND cleared = ?";
			whereArgs.push( this.$['cleared'].getValue() );
		}

		//Type Filters
		if( !this.$['includeTrans'].getValue() ) {
			//Don't include transfers

			whereStrs += " AND linkedAccount = '' AND linkedRecord = ''";

			if( !this.$['includeNeg'].getValue() ) {
				//Don't include negative

				whereStrs += " AND amount >= 0";
			}

			if( !this.$['includePos'].getValue() ) {
				//Don't include positive

				whereStrs += " AND amount < 0";
			}
		} else {
					//include transfers but check others

			if( !this.$['includeNeg'].getValue() ) {
				//Don't include negative but include transfers

				whereStrs += " AND ( amount >= 0 OR ( linkedAccount != '' AND linkedRecord != '' ) )";
			}

			if( !this.$['includePos'].getValue() ) {
				//Don't include positive but include transfers

				whereStrs += " AND ( amount < 0 OR ( linkedAccount != '' AND linkedRecord != '' ) )";
			}
		}

		//remove first AND/OR
		whereStrs = whereStrs.replace( /^ (or|and) (.*)/i, "$2" );

		this.doSearch( whereStrs, whereArgs );
	}
});