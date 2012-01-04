/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.transactions.search",
	kind: enyo.VFlexBox,

	style: "height: 100%;",

	acctList: {
			count: 0,
			items: []
		},

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
					kind: enyo.SlidingView,
					layoutKind: enyo.VFlexLayout,
					flex: 1,
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
											showTime: false
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
											showTime: false
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
											caption: "Pending and Cleared",
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
						}
					]
				}, {
					name: "results",
					kind: enyo.SlidingView,
					layoutKind: enyo.VFlexLayout,

					flex: 3,

					edgeDragging: true,
					dragAnywhere: false,

					components: [
						{
							style: "margin-left: 20px;",
							content: "DATA, drag bar on left edge as border"
						}
					]
				}
			]
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

	/** @private */
	constructor: function() {

		this.inherited( arguments );

		console.log( arguments, this );
	},

	rendered: function() {

		this.inherited( arguments );

		this.$['accountDrawer'].close();
		enyo.application.accountManager.fetchAccounts( { "onSuccess": enyo.bind( this, this.renderAccountList ) } );
	},

	renderAccountList: function( results ) {

		//Account List
		this.acctList['items'] = [];
		this.acctList['count'] = 0;

		for( var i = 0; i < results.length; i++ ) {

			this.acctList['items'][i] = results[i];

			if( this.acctId ) {

				if( this.acctList['items'][i]['acctId'] === this.acctId ) {

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
		if( this.dateStart ) {

			this.dateStart = new Date( this.dateStart );

			if( Date.validDate( this.dateStart ) ) {

				this.$['fromDate'].setValue( this.dateStart );
				this.$['fromToggle'].setValue( true );
			} else {

				this.$['fromToggle'].setValue( false );
				this.dateStart = null;
			}
		}

		//End Date
		if( this.dateEnd ) {

			this.dateEnd = new Date( this.dateEnd );

			if( Date.validDate( this.dateEnd ) ) {

				this.$['toDate'].setValue( this.dateEnd );
				this.$['toToggle'].setValue( true );
			} else {

				this.$['toToggle'].setValue( false );
				this.dateEnd = null;
			}
		}

		this.toggleToggles();

		//Search Box
		var searchStr = "";

		if( this.category ) {

			searchStr += " " + this.category;
		}

		if( this.category2 && this.category2 !== "%" ) {

			searchStr += " " + this.category2;
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

		var whereStrs = [];
		var whereArgs = [];
		var searchStr = this.$['searchString'].getValue().split( " " );

		//Do these need to be wrapped in %str%
		for( var i = 0; i < searchStr.length; i++ ) {

			if( searchStr[i][0] === "+" ) {

				if( searchStr[i].slice( 1 ) !== "" ) {

					whereStrs.push( "AND desc LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );

					whereStrs.push( "AND amount LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );

					whereStrs.push( "AND category LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );

					whereStrs.push( "AND category2 LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );

					whereStrs.push( "AND checkNum LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );

					whereStrs.push( "AND note LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );
				}
			} else if( searchStr[i][0] === "-" ) {

				if( searchStr[i].slice( 1 ) !== "" ) {

					whereStrs.push( "AND desc NOT LIKE ?" );
					whereArgs.push( searchStr[i].slice( 1 ) );
				}
			} else if( searchStr[i].lenght > 0 ) {

				whereStrs.push( "OR desc LIKE ?" );
				whereArgs.push( searchStr[i] );
			}
		}

		var accts = [];

		for( var i = 0; i < this.acctList['items'].length; i++ ) {

			if( this.acctList['items'][i]['selectStatus'] ) {

				accts.push( this.acctList['items'][i]['acctId'] );
			}
		}

		whereStrs.push( "AND account IN ( ? )" );
		whereArgs.push( accts.length > 0 ? accts.join( ", " ) : "-1" );

		if( this.$['fromToggle'].getValue() ) {

			var from = this.$['fromDate'].getValue();
			from.setHours( 0, 0, 0, 0 );//Start of day

			whereStrs.push( "AND date >= ?" );
			whereArgs.push( Date.parse( from ) );
		}

		if( this.$['toToggle'].getValue() ) {

			var to = this.$['toDate'].getValue();
			to.setHours( 23, 59, 59, 999 );//End of day

			whereStrs.push( "AND date <= ?" );
			whereArgs.push( Date.parse( to ) );
		}

		if( this.$['cleared'].getValue() !== 2 ) {

			whereStrs.push( "AND cleared = ?" );
			whereArgs.push( this.$['cleared'].getValue() );
		}

		if( !this.$['includeTrans'].getValue() ) {
			//Don't include transfers

			whereStrs.push( "AND linkedAccount = '' AND linkedRecord = ''" );

			if( !this.$['includeNeg'].getValue() ) {
				//Don't include negative

				whereStrs.push( "AND amount >= 0" );
			}

			if( !this.$['includePos'].getValue() ) {
				//Don't include positive

				whereStrs.push( "AND amount < 0" );
			}
		} else {
					//include transfers but check others

			if( !this.$['includeNeg'].getValue() ) {
				//Don't include negative but include transfers

				whereStrs.push( "AND ( amount >= 0 OR ( linkedAccount != '' AND linkedRecord != '' ) )" );
			}

			if( !this.$['includePos'].getValue() ) {
				//Don't include positive but include transfers

				whereStrs.push( "AND ( amount < 0 OR ( linkedAccount != '' AND linkedRecord != '' ) )" );
			}
		}

		console.log( "DO SEARCH", whereStrs.join( " " ), whereArgs );
	}
});