/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.search.filter",
	kind: "FittableRows",

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
			kind: "enyo.Scroller",
			fit: true,
			components: [
				{
					kind: "onyx.InputDecorator",
					layoutKind: "FittableColumnsLayout",
					noStretch: true,
					style: "width: 95%",
					components: [
						{
							name: "searchString",
							kind: "onyx.Input",

							fit: true,

							placeholder: "Search phrase",
							onchange:"searchChanged"
						}, {
							kind: "Image",
							src: "assets/search.png",
							classes: "img-icon"
						}
					]
				}, {
					name: "accountDrawer",
					kind: "gts.DividerDrawer",
					caption: "Accounts",

					open: false,

					components: [
						{
							name: "accounts",
							kind: "enyo.Repeater",

							onSetupRow: "setupRow",

							components: [
								{
									//kind: enyo.Item,
									//layoutKind: enyo.HFlexLayout,

									tapHighlight: true,
									ontap: "accountSelectedChanged",

									components: [
										{
											name: "icon",
											kind: "enyo.Image",
											classes: "accountIcon"
										}, {
											name: "iconLock",
											kind: "enyo.Image",
											src: "assets/padlock_1.png",
											classes: "accountLockIcon unlocked"
										}, {
											flex: 1,
											components: [
												{
													name: "accountName"
												}, {
													name: "accountNote",
													classes: "smaller"
												}
											]
										}, {
											name: "accountSelected",
											//kind: enyo.CheckBox,

											style: "margin-right: 10px;"
										}
									]
								}
							]
						}
					]
				}, {
					name: "fromToggle",
					kind: "gts.ToggleBar",
					classes: "bordered",

					label: "Limit Start Date",
					sublabel: "Limit the earliest date that can appear in search query.",
					onContent: "Yes",
					offContent: "No",

					value: false,

					onChange: "toggleToggles"
				}, {
					name: "startDateDrawer",
					kind: "onyx.Drawer",
					open: false,
					components: [
						{
							classes: "onyx-toolbar-inline",
							components: [
								{
									classes: "label",
									content: "Date"
								}, {
									name: "fromDate",
									kind: "onyx.DatePicker",
									onSelect: "dateChanged"
								}
							]
						}, {
							name: "fromTime",
							kind: "gts.TimePicker",

							label: "Time",

							minuteInterval: 5,
							is24HrMode: false,

							onSelect: "dateChanged"
						}
					]
				}, {
					name: "toToggle",
					kind: "gts.ToggleBar",
					classes: "bordered",

					label: "Limit End Date",
					sublabel: "Limit the latest date that can appear in search query.",
					onContent: "Yes",
					offContent: "No",

					value: false,

					onChange: "toggleToggles"
				}, {
					name: "endDateDrawer",
					kind: "onyx.Drawer",
					open: false,
					components: [
						{
							classes: "onyx-toolbar-inline",
							components: [
								{
									classes: "label",
									content: "Date"
								}, {
									name: "toDate",
									kind: "onyx.DatePicker",
									onSelect: "dateChanged"
								}
							]
						}, {
							name: "toTime",
							kind: "gts.TimePicker",

							label: "Time",

							minuteInterval: 5,
							is24HrMode: false,

							onSelect: "dateChanged"
						}
					]
				}, {
					name: "cleared",
					kind: "gts.SelectorBar",
					label: "Include Transaction Status",
					classes: "bordered",

					value: 2,
					choices: [
						{
							content: "All",
							value: 2
						}, {
							content: "Cleared Only",
							value: 1
						}, {
							content: "Pending Only",
							value: 0
						}
					]
				}, {
					name: "includeNeg",
					kind: "gts.ToggleBar",

					classes: "bordered",

					label: "Include Expenses",
					onText: "Yes",
					offText: "No",
					value: true
				}, {
					name: "includePos",
					kind: "gts.ToggleBar",

					classes: "bordered",

					label: "Include Income",
					onText: "Yes",
					offText: "No",
					value: true
				}, {
					name: "includeTrans",
					kind: "gts.ToggleBar",

					classes: "bordered",

					label: "Include Transfers",
					onText: "Yes",
					offText: "No",
					value: true
				}
			]
		}, {
			kind: "onyx.Toolbar",
			classes: "tardis-blue text-center",
			components: [
				{
					kind: "onyx.Button",
					content: "Back",
					ontap: "doFinish"
				}, {
					kind: "onyx.Button",
					content: "Search",
					ontap: "search"
				}
			]
		}
	],

	create: function() {

		this.inherited( arguments );

		if( !enyo.Panels.isScreenNarrow() || Checkbook.globals.prefs['alwaysFullCalendar'] ) {
			//Big Screen

			this.$['startDateDrawer'].destroyClientControls();
			this.$['startDateDrawer'].createComponent(
					{
						name: "fromDate",
						kind: "gts.DatePicker",
						onSelect: "",

						components: [
							{
								name: "fromTime",
								kind: "gts.TimePicker",

								label: "Time",

								minuteInterval: 5,
								is24HrMode: false,

								onSelect: ""
							}
						]
					}, {
						owner: this
					}
				);

			this.$['endDateDrawer'].destroyClientControls();
			this.$['endDateDrawer'].createComponent(
					{
						name: "toDate",
						kind: "gts.DatePicker",
						onSelect: "",

						components: [
							{
								name: "toTime",
								kind: "gts.TimePicker",

								label: "Time",

								minuteInterval: 5,
								is24HrMode: false,

								onSelect: ""
							}
						]
					}, {
						owner: this
					}
				);
		}
	},

	load: function( acctId, category, category2, dateStart, dateEnd ) {

		Checkbook.accounts.manager.fetchAccounts( { "onSuccess": enyo.bind( this, this.renderAccountList, acctId, category, category2, dateStart, dateEnd ) } );
	},

	renderAccountList: function( acctId, category, category2, dateStart, dateEnd, results ) {

		this.log( arguments );
		return;

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

		this.$['searchString'].setValue( gts.String.trim( searchStr ) );

		if( this.$['searchString'].getValue().length > 0 ) {

			this.search();
		}
	},

	toggleToggles: function() {

		this.$['startDateDrawer'].setOpen( this.$['fromToggle'].getValue() );
		this.$['startDateDrawer'].render();

		this.$['endDateDrawer'].setOpen( this.$['toToggle'].getValue() );
		this.$['endDateDrawer'].render();
	},

	/** Account List Control **/

	renderDrawerCaption: function() {

		this.$['accountDrawer'].setCaption( "Accounts" ) + " (" + this.acctList['count'] + $L( " of " ) + this.acctList['items'].length + ")";
	},

	setupRow: function( inSender, inIndex ) {

		var row = this.acctList['items'][inIndex];

		if( row ) {

			this.$['accountName'].setContent( row['acctName'] );

			this.$['icon'].setSrc( "assets/" + row['acctCategoryIcon'] );
			this.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 || row['bypass'] ) );

			this.$['accountSelected'].setChecked( row['selectStatus'] );

			return true;
		}
	},

	accountSelectedChanged: function( inSender, inEvent ) {

		var rowIndex = inEvent.rowIndex;

		if( this.acctList['items'][rowIndex]['acctLocked'] && !this.acctList['items'][rowIndex]['bypass'] ) {

				Checkbook.globals.security.authUser(
						this.acctList['items'][rowIndex]['name'] + " " + "PIN Code",
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

		this.log();
		return;

		var whereStrs = "";
		var whereArgs = [];

		var searchStr = gts.String.trim( gts.String.dirtyString( this.$['searchString'].getValue() ) );

		//Extract quote items
		var phrases = searchStr.match( /"([^"]*)"/gi );

		searchStr = gts.String.trim( searchStr.replace( /"[^"]*"/gi, "" ) );
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

		this.doSearch( { "strings": whereStrs, "args": whereArgs } );
	}
});
