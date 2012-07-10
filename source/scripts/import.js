/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.import",
	kind: enyo.VFlexBox,

	className: "light",
	style: "height: 100%;",

	allSheetsList: [],
	importItems: [],

	standardLimit: 100,

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: enyo.PageHeader,
			layoutKind: enyo.HFlexLayout,
			pack: "center",

			className: "enyo-header-dark",

			components: [
				{
					kind: enyo.Spacer,
					flex: 1
				}, {
					content: "Import System",
					className: "bigger",
					style: "margin-right: -32px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.ToolButton,

					icon: "assets/menu_icons/close.png",
					className: "img-icon",

					onclick: "closeImport"
				}
			]
		},

		{
			kind: enyo.Scroller,
			flex: 1,

			components: [
				{
					name: "instructions",
					className: "light narrow-column",
					flex: 1,
					components: [
						{
							kind: enyo.HtmlContent,
							className: "group smaller",
							style: "padding: 0 0.5em 0 0.5em;",
							content: "<p>" +
									"To import your finances into this program you must have a Google Documents account. " + "<br />" +
									"<a href='http://docs.google.com/'>" + "Sign up here" + "</a>" +
								"</p><p>" +
									"Upload or create a spreadsheet with all the information to import. Once that is complete, tap 'Continue', select your spreadsheet, then the system will import your data. Existing data may be overwritten. <span style='color:#cc0000;'>The first row of the spreadsheet must have the following columns: account, accountCat, date, amount, description, cleared, note.</span>" +
								"</p>"
						}
					]
				},

				{
					showing: false,

					name: "credentials",
					layoutKind: enyo.VFlexLayout,

					className: "light narrow-column",
					flex: 1,

					components: [
						{
							kind: enyo.RowGroup,
							caption: "Google Credentials",
							components: [
								{
									name: "gUser",
									kind: enyo.Input,
									hint: "Google Username",

									inputType: "email",

									components: [
										{
											content: "Username",
											className: "small",
											style: "color: rgb( 32, 117, 191 );"
										}
									]
								}, {
									name: "gPassWrapper",
									components: [
										{
											name: "gPass",
											kind: enyo.PasswordInput,
											hint: "Account Password",

											components: [
												{
													content: "Password",
													className: "small",
													style: "color: rgb( 32, 117, 191 );"
												}
											]
										}
									]
								}
							]
						}, {
							content: "Enter your Google Spreadsheets credentials to import your financial data from <a href='http://docs.google.com/'>Google Documents</a> to your device.",
							allowHtml: true,
							className: "smallest",
							style: "padding: 0.5em 0.5em 0 0.5em;"
						}, {
							layoutKind: enyo.HFlexLayout,

							align: "center",
							pack: "center",
							style: "padding: 0.5em 0.5em 0.5em 0.5em;",

							components: [
								{
									name: "saveCredentials",
									kind: enyo.CheckBox,
									checked: true,

									style: "margin-right: 10px;"
								}, {
									content: "Save credentials",
									flex: 1
								}, {
									name: "showPass",
									kind: enyo.ToggleButton,

									state: false,
									onLabel: "Show password",
									offLabel: "Mask password",

									onChange: 'togglePasswordVis',

									style: "margin-left: 10px;"
								}
							]
						}
					]
				},

				{
					showing: false,

					name: "sheetList",
					layoutKind: enyo.VFlexLayout,

					className: "light narrow-column",
					flex: 1,

					components: [
						{
							name: "spreadsheetList",
							kind: enyo.VirtualRepeater,

							flex: 1,
							onSetupRow: "setupRow",

							components: [
								{
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,

									tapHighlight: true,
									onclick: "sheetSelectedChanged",

									components: [
										{
											name: "sheetName",
											flex: 1
										}, {
											name: "sheetSelected",
											kind: enyo.CheckBox,

											style: "margin-right: 10px;"
										}
									]
								}
							]
						}
					]
				}
			]
		},

		{
			name: "instructionsBar",
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "instructionsButton",
					kind: enyo.Button,
					content: "Continue",

					onclick: "prepareCredentials",

					style: "min-width: 150px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}
			]
		},

		{
			showing: false,

			name: "credentialsBar",
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "credentialsButton",
					kind: enyo.Button,
					content: "Sign In",

					onclick: "authenticateWithGoogle",

					className: "enyo-button-affirmative deep-green",
					style: "min-width: 150px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}
			]
		},

		{
			showing: false,

			name: "sheetListBar",
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Spacer,
					flex: 8
				}, {
					name: "sheetListButton",
					kind: enyo.Button,
					content: "Import Accounts",

					onclick: "beginImportProcess",

					className: "enyo-button-affirmative deep-green",
					style: "min-width: 150px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "sheetListSelectButton",
					kind: enyo.Button,
					caption: "Select" + "...",

					onclick: "sheetListSelectOptions",

					flex: 1
				}, {
					kind: enyo.Spacer,
					flex: 8
				}
			]
		},

		{
			name: "selectMenu",
			kind: enyo.Menu,
			components: [
				{
					caption: "All",
					value: 1
				}, {
					caption: "None",
					value: 2
				}, {
					caption: "Invert",
					value: 3
				}
			]
		},

		{
			name: "progress",
			kind: "GTS.progress"
		}, {
			name: "errorMessage",
			kind: "GTS.system_error",

			errTitle: "Import Error",
			errMessage: "",
			errMessage2: "" ,
			onFinish: "closeErrorMessage"
		},

		{
			name: "gDataControls",
			kind: "GTS.gdata"
		}, {
			name: 'cryptoSystem',
			kind: 'Checkbook.encryption'
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.log();

		this.$['instructionsButton'].setDisabled( false );
		this.$['instructionsBar'].setShowing( true );
		this.$['credentialsBar'].setShowing( false );
		this.$['sheetListBar'].setShowing( false );

		this.$['instructions'].show();
		this.$['credentials'].hide();
		this.$['sheetList'].hide();

		this.resized();

		//check for pre-existing g-data log in
		enyo.application.gts_db.query(
				"SELECT saveGSheetsData, gSheetUser, gSheetPass FROM prefs LIMIT 1;",
				{
					"onSuccess": enyo.bind( this, this.fetchUserGData )
				}
			);
	},

	fetchUserGData: function( results ) {

		this.log();

		if( results.length > 0 ) {

			//Decrypt if exists
			this.$['cryptoSystem'].decryptString(
					results[0]['gSheetPass'],
					enyo.bind(
							this,
							this.setUserGData,
							results[0]['gSheetUser'],
							( results[0]['saveGSheetsData'] === 1 )
						)
				);
		}
	},

	setUserGData: function( user, save, pass ) {

		this.log();

		this.$['gUser'].setValue( user );
		this.$['gPass'].setValue( pass );
		this.$['saveCredentials'].setChecked( save );

		this.$['showPass'].setDisabled( save );//Disable show cred if loaded from DB
	},

	prepareCredentials: function() {

		this.log();

		this.$['instructionsButton'].setDisabled( true );
		this.$['credentialsButton'].setDisabled( false );
		this.$['instructionsBar'].setShowing( false );
		this.$['credentialsBar'].setShowing( true );
		this.$['sheetListBar'].setShowing( false );

		this.$['instructions'].hide();
		this.$['credentials'].show();
		this.$['sheetList'].hide();

		this.$['gUser'].forceFocus();

		this.resized();
	},

	togglePasswordVis: function( inSender, state ) {

		var pass = this.$['gPass'].getValue();

		this.$['gPass'].destroy();

		this.$['gPassWrapper'].createComponent(
				{
					name: "gPass",
					kind: ( state ? enyo.Input : enyo.PasswordInput ),
					hint: "Account Password",

					components: [
						{
							content: "Password",
							className: "small",
							style: "color: rgb( 32, 117, 191 );"
						}
					]
				}, {
					owner: this
				}
			);

		this.$['gPassWrapper'].render();

		this.$['gPass'].setValue( pass );
	},

	authenticateWithGoogle: function() {

		this.log();

		this.$['credentialsButton'].setDisabled( true );

		//Check username & password exist
		this.$['progress'].load( "Authenticating", "Trying to authenticate credentials", 25 );

		this.$['gDataControls'].gdata_authenticate(
				this.$['gUser'].getValue(),
				this.$['gPass'].getValue(),
				"wise",
				{
					'onSuccess': enyo.bind( this, this.fetchSpreadsheetList ),
					'onError': enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.prepareCredentials ) ),
					'timeout': 15
				}
			);
	},

	fetchSpreadsheetList: function() {

		this.log();

		this.$['progress'].setMessage( "Retrieving spreadsheets..." );
		this.$['progress'].setProgress( 50 );

		//save credentials
		if( this.$['saveCredentials'].getChecked() ) {

			this.$['cryptoSystem'].encryptString(
					this.$['gPass'].getValue(),
					enyo.bind(
							this,
							this.saveUserGData
						)
				);
		} else {

			this.saveUserGData( '' );
		}

		this.$['gDataControls'].gdata_fetch_spreadsheet_list(
				{
					'onSuccess': enyo.bind( this, this.renderSpreadsheetList ),
					'onError': enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.prepareCredentials ) ),
					'timeout': 30
				}
			);
	},

	saveUserGData: function( pass ) {

		this.log();

		var updateObj = null;

		if( !this.$['saveCredentials'].getChecked() || pass.length <= 0 ) {

			updateObj = {
						"saveGSheetsData": 0,
						"gSheetUser": "",
						"gSheetPass": ""
					};
		} else {

			updateObj = {
						"saveGSheetsData": this.$['saveCredentials'].getChecked() ? 1 : 0,
						"gSheetUser": this.$['gUser'].getValue(),
						"gSheetPass": pass
					};
		}

		enyo.application.gts_db.query(
				enyo.application.gts_db.getUpdate(
					"prefs",
					updateObj,
					{}
				)
			);
	},

	renderSpreadsheetList: function( sheetListObj ) {

		this.log();

		if( sheetListObj ) {

			this.allSheetsList = sheetListObj;
		}

		//Did the request get the right data
		if( this.allSheetsList.length <= 0 ) {

			this.$['progress'].close();

			this.showErrorMessage( enyo.bind( this, this.closeImport ), "No data available to be imported." );
		} else {

			this.$['progress'].setMessage( "Processing spreadsheets..." );
			this.$['progress'].setProgress( 75 );

			this.$['spreadsheetList'].render();

			this.$['sheetListButton'].setDisabled( false );
			this.$['instructionsBar'].setShowing( false );
			this.$['credentialsBar'].setShowing( false );
			this.$['sheetListBar'].setShowing( true );

			this.$['instructions'].hide();
			this.$['credentials'].hide();
			this.$['sheetList'].show();

			this.resized();

			this.$['progress'].close();
		}
	},

	setupRow: function( inSender, inIndex ) {
		//VirtualList render control

		var row = this.allSheetsList[inIndex];

		if( row ) {

			this.$['sheetName'].setContent( row['name'] );
			this.$['sheetSelected'].setChecked( row['selectStatus'] );

			return true;
		}
	},

	sheetSelectedChanged: function( inSender, inEvent ) {
		//VirtualList checkbox control, keep data synced

		this.allSheetsList[inEvent.rowIndex]['selectStatus'] = !this.allSheetsList[inEvent.rowIndex]['selectStatus'];

		this.$['spreadsheetList'].render();
	},

	sheetListSelectOptions: function( inSender ) {

		this.$['selectMenu'].openAtControl( inSender );
	},

	menuItemClick: function( inSender ) {

		if( inSender.value === 1 ) {
			//All

			for( var i = 0; i < this.allSheetsList.length; i++ ) {

				this.allSheetsList[i]['selectStatus'] = true;
			}
		} else if( inSender.value === 2 ) {
			//None

			for( var i = 0; i < this.allSheetsList.length; i++ ) {

				this.allSheetsList[i]['selectStatus'] = false;
			}
		} else if( inSender.value === 3 ) {
			//Invert

			for( var i = 0; i < this.allSheetsList.length; i++ ) {

				this.allSheetsList[i]['selectStatus'] = !this.allSheetsList[i]['selectStatus'];
			}
		}

		this.$['spreadsheetList'].render();
	},

	beginImportProcess: function() {

		this.log();

		this.$['sheetListButton'].setDisabled( true );

		this.importItems = [];

		for (var i = 0; i < this.allSheetsList.length; i++) {

			if( this.allSheetsList[i]['selectStatus'] ) {

				this.importItems.push( {
						"sheetIndex": i,
						"name": this.allSheetsList[i]['name'],
						"sheetKey": this.allSheetsList[i]['sheetKey'],
						"finished": false,

						"pages": [],
						"transactions": []
					});
			}
		}

		//No accounts selected; exit system
		if( this.importItems.length <= 0 ) {

			this.showErrorMessage( enyo.bind( this, this.closeImport ), "No accounts selected to import" );

			return;
		}

		/* Begin Google Data Import */
		this.documentIndex = 0;
		this.errorCount = 0;

		try {

			enyo.windows.setWindowProperties( window, { blockScreenTimeout: true } );
			this.log( "Window: blockScreenTimeout: true" );
		} catch( err ) {

			this.log( "Window Error (Start)", err );
		}

		this.$['progress'].load( "Importing Data", "Fetching document specifications", 0 );

		enyo.nextTick(
				this,
				this.fetchDocSummary
			);
	},

	fetchDocSummary: function() {

		this.log();

		this.$['gDataControls'].gdata_fetch_spreadsheet_summary(
				this.importItems[this.documentIndex]['sheetKey'],
				{
					'onSuccess': enyo.bind( this, this.parseDocSummary ),
					'onError': enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.renderSpreadsheetList ) ),
					'timeout': 20
				}
			);
	},

	parseDocSummary: function( response ) {

		this.log();

		if( this.errorCount >= 3 ) {
			//Too many errors

			this.error( "Multiple sets of bad data from Google." );

			this.errorCount = 0;

			this.showErrorMessage( enyo.bind( this, this.renderSpreadsheetList ), "There has been an error: Multiple sets of bad data from Google. Please try again later." );

			return;
		}

		if( typeof( response.responseJSON.feed.entry ) === "undefined" ) {
			//Bad data returned

			this.error( "Bad data from Google." );
			this.$['progress'].setMessage( "Attempting to fix bad import data" );

			this.errorCount++;

			//Restart this again
			this.fetchDocSummary();

			return;
		}

		this.$['progress'].setMessage( "Fetching document specifications" );

		var data = response.responseJSON.feed.entry;

		for( var i = 0; i < data.length; i++ ) {

			//Add page to array with all sheet Ids
			this.importItems[this.documentIndex]['pages'].push( {
					"pageKey": data[i]['id']['$t'].slice( data[i]['id']['$t'].lastIndexOf( "/" ) + 1 ),
					"title":data[i]['title']['$t']
				});
		}

		this.documentIndex++;

		this.$['progress'].setProgress( this.documentIndex / this.importItems.length * 100 );

		if( this.documentIndex < this.importItems.length ) {
			//Continue get sheet summary information

			this.fetchDocSummary();
		} else {
			//Get account list

			this.$['progress'].setMessage( "Retrieving document content" );
			this.$['progress'].setProgress( 0 );

			this.fetchAccountData( enyo.bind( this, this.startDataPull ) );
		}
	},

	fetchAccountData: function( callbackFn ) {

		this.log();

		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect( "accounts", [ "acctId", "acctCategory", "acctName" ] ),
				{
					"onSuccess": enyo.bind( this, this.processAccountData, callbackFn )
				}
			);
	},

	processAccountData: function( callbackFn, results ) {

		this.log();

		this.accountList = {};
		this.newAccounts = [];
		var row = null;

		for( var i = 0; i < results.length; i++ ) {

			row = results[i];

			this.addAccountListObject( row['acctId'], row['acctName'], row['acctCategory'] );
		}

		if( callbackFn ) {

			callbackFn();
		}
	},

	addAccountListObject: function( id, name, category ) {

		this.log( "( " + id + ", " + name + ", " + category + ")" );

		if( typeof( this.accountList[category] ) === "undefined" ) {

			this.accountList[category] = {};
		}

		this.accountList[category][name] = id;
	},

	startDataPull: function() {

		this.log();

		//Start pulling down full sheets
		this.$['progress'].setProgress( 5 );

		this.documentIndex = 0;
		this.pageIndex = 0;

		this.errorCount = 0;

		this.downloadDocData( 1, this.standardLimit );
	},

	downloadDocData: function( offset, limit ) {

		this.log( "( " + offset + ", " + limit + " )" );

		if( this.pageIndex >= this.importItems[this.documentIndex]['pages'].length ) {

			//invalid page index
			this.nextDocumentPage();

			return;
		}

		this.$['gDataControls'].gdata_fetch_spreadsheet_data(
				this.importItems[this.documentIndex]['sheetKey'],
				this.importItems[this.documentIndex]['pages'][this.pageIndex]['pageKey'],
				offset,
				limit,
				{
					"onSuccess": enyo.bind( this, this.processDocData ),
					'onError': enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.renderSpreadsheetList ) ),
					"timeout": 30
				}
			);
	},

	processDocData: function( response ) {

		this.log();

		if( this.errorCount >= 5 ) {
			//Too many errors

			this.error( "Multiple sets of bad data from Google." );

			this.errorCount = 0;

			this.showErrorMessage( enyo.bind( this, this.renderSpreadsheetList ), "There has been an error: Multiple sets of bad data from Google. Please try again later." );

			return;
		}

		if( typeof( response.responseJSON ) === "undefined" ||
			typeof( response.responseJSON.feed ) === "undefined" ||
			typeof( response.responseJSON.feed.entry ) === "undefined" ) {
			//Bad data returned

			this.error( "Bad data from Google." );
			this.$['progress'].setMessage( "Attempting to fix bad import data" );

			this.errorCount++;

			//Restart this again
			this.importItems[this.documentIndex]['transactions'] = [];
			this.downloadDocData( 1, this.standardLimit );

			return;
		}

		this.importItems[this.documentIndex]['limit'] = parseInt( response.responseJSON.feed['openSearch$itemsPerPage']['$t'] );
		this.importItems[this.documentIndex]['offset'] = parseInt( response.responseJSON.feed['openSearch$startIndex']['$t'] );
		this.importItems[this.documentIndex]['totalResults'] = parseInt( response.responseJSON.feed['openSearch$totalResults']['$t'] );

		if( this.importItems[this.documentIndex]['offset'] === 1 &&
			(
				typeof( response.responseJSON.feed.entry[0]['gsx$amount'] ) === "undefined" ||
				typeof( response.responseJSON.feed.entry[0]['gsx$amount']['$t'] ) === "undefined" ||
				typeof( response.responseJSON.feed.entry[0]['gsx$description'] ) === "undefined" ||
				typeof( response.responseJSON.feed.entry[0]['gsx$description']['$t'] ) === "undefined" ||
				typeof( response.responseJSON.feed.entry[0]['gsx$date'] ) === "undefined" ||
				typeof( response.responseJSON.feed.entry[0]['gsx$date']['$t'] ) === "undefined"
			) ) {

			this.createComponent( {
					name: "alertShow",
					kind: "GTS.confirm",

					confirmTitle: "Warning! Missing Fields",
					confirmMessage: "Current page is missing essential fields for importing the data. These fields can be blank, but doing so may result in an improper import. The first row should have the following items: account, accountCat, date, amount, description, cleared, note.",
					confirmMessage2: this.importItems[this.documentIndex]['name'] + " page " + ( this.pageIndex + 1 ),

					confirmButtonYes: "Skip Current Item",
					confirmButtonNo: "Ignore and Continue",

					onYes: "nextDocumentPage",
					onNo: "processDocDataIgnoreContinue"
				});

			this.responseHolder = response.responseJSON.feed.entry;

			this.$['alertShow'].openAtCenter();
		} else {

			this.processDocDataFollower( response.responseJSON.feed.entry );
		}
	},

	processDocDataIgnoreContinue: function() {

		this.$['alertShow'].destroy();

		var entry = this.responseHolder;
		this.responseHolder = null;

		this.processDocDataFollower( entry );
	},

	processDocDataFollower: function( entry ) {

		this.log();

		var data = enyo.isArray( entry ) ? entry : [];
		var trsn;

		for( var i = 0; i < data.length; i++ ) {

			trsn = {};

			trsn['amount'] = deformatAmount( this.getNode( data[i], 'gsx$amount' ) );

			if( Object.validNumber( trsn['amount'] ) ) {
				//Only continue if amount field is not empty && is a number

				trsn['amount'] = parseFloat( trsn['amount'] );

				//Transaction Id
				trsn['itemId'] = parseInt( this.getNode( data[i], 'gsx$gtid' ) );

				if( !Object.validNumber( trsn['itemId'] ) ) {

					trsn['itemId'] = "";
				}

				//Account
				trsn['accountName'] = this.getNode( data[i], 'gsx$account' );
				trsn['accountCat'] = this.getNode( data[i], 'gsx$accountcat' );

				if( trsn['accountName'] === "" ) {

					trsn['accountName'] = this.importItems[this.documentIndex]['name'];
				}

				if( trsn['accountCat'] === "" ) {

					trsn['accountCat'] = "Imported Account";
				}

				if( typeof( this.accountList[trsn['accountCat']] ) === "undefined" || typeof( this.accountList[trsn['accountCat']][trsn['accountName']] ) === "undefined" ) {

					this.newAccounts.push( {
							"acctName": trsn['accountName'],
							"acctCategory": trsn['accountCat'],
							"acctNotes": ""
						});

					this.addAccountListObject( -1, trsn['accountName'], trsn['accountCat'] );
				}

				//Linked Account & Record
				trsn['linkedAccountName'] = this.getNode( data[i], 'gsx$gtlinkedaccount' );//Line 776 of mojo for basic idea
				trsn['linkedAccountCat'] = this.getNode( data[i], 'gsx$gtlinkedaccountcat' );
				trsn['linkedRecord'] = parseInt( this.getNode( data[i], 'gsx$gtlinkid' ) );

				if( Object.validNumber( trsn['linkedRecord'] ) ) {

					if( trsn['linkedAccountName'] === "" ) {

						trsn['linkedAccountName'] = this.importItems[this.documentIndex]['name'];
					}

					if( trsn['linkedAccountCat'] === "" ) {

						trsn['linkedAccountCat'] = "Imported Account";
					}

					if( typeof( this.accountList[trsn['linkedAccountCat']] ) === "undefined" || typeof( this.accountList[trsn['linkedAccountCat']][trsn['linkedAccountName']] ) === "undefined" ) {

						this.newAccounts.push( {
								"acctName": trsn['linkedAccountName'],
								"acctCategory": trsn['linkedAccountCat'],
								"acctNotes": ""
							});

						this.addAccountListObject( -1, trsn['linkedAccountName'], trsn['linkedAccountCat'] );
					}
				} else {

					trsn['linkedAccountName'] = "";
					trsn['linkedAccountCat'] = "";
					trsn['linkedRecord'] = "";
				}

				//Cleared
				trsn['cleared'] = this.getNode( data[i], 'gsx$cleared' ).toLowerCase();

				if( trsn['cleared'] == 0 ||
							trsn['cleared'] == "no" ||
							trsn['cleared'] == "not" ||
							trsn['cleared'] == "false" ||
							trsn['cleared'] == "" ) {

					trsn['cleared'] = 0;
				} else {

					trsn['cleared'] = 1;
				}

				//Date
				trsn['date'] = Date.deformat( this.getNode( data[i], 'gsx$date' ) );

				if( !Object.validNumber( trsn['date'] ) ) {

					trsn['date'] = Date.parse( new Date() );
				}

				//Category
				trsn['category'] = this.getNode( data[i], 'gsx$gtcat' );

				if( trsn['category'] === "" || trsn['category'].toLowerCase() === "none" ) {
					//No or bad category data

					trsn['category'] = [
							{
								'category': '',
								'category2': '',
								'amount': ''
							}
						];
				} else {

					if( trsn['category'].isJSON() ) {
						//valid JSON (prototype.js function)

						trsn['category'] = enyo.json.parse( trsn['category'] );
					} else {
						//Assuming old style export

						trsn['category'] = [
								{
									'category': trsn['category'].split( "|", 2 )[0],
									'category2': trsn['category'].split( "|", 2 )[1],
									'amount': ''
								}
							];
					}
				}

				//Description
				trsn['desc'] = this.getNode( data[i], 'gsx$description' );
				trsn['desc'] = trsn['desc'].length > 0 ? trsn['desc'] : "Transaction Description";

				//Special checks not needed
				trsn['checkNum'] = this.getNode( data[i], 'gsx$checknum' );
				trsn['note'] = this.getNode( data[i], 'gsx$note' );

				this.importItems[this.documentIndex]['transactions'].push( trsn );
			}
		}

		var pageProgress = ( data.length + this.importItems[this.documentIndex]['offset'] ) / this.importItems[this.documentIndex]['totalResults'];
		var docProgress = ( ( pageProgress > 1 ? 1 : pageProgress ) + this.pageIndex ) / this.importItems[this.documentIndex]['pages'].length;
		var totalProgress = ( ( docProgress / 2 ) + this.documentIndex ) / this.importItems.length;

		this.$['progress'].setMessage( this.importItems[this.documentIndex]['name'] + "<br />Downloading: " + ( new Number( docProgress * 100 ) ).toFixed( 1 ) + "%" );
		this.$['progress'].setProgress( totalProgress * 100 );

		if( ( this.importItems[this.documentIndex]['limit'] + this.importItems[this.documentIndex]['offset'] ) < this.importItems[this.documentIndex]['totalResults'] ) {

			//Still more rows; fetch next set;
			this.downloadDocData( ( this.importItems[this.documentIndex]['limit'] + this.importItems[this.documentIndex]['offset'] ), this.importItems[this.documentIndex]['limit'] );
		} else {

			//Page done; contine;
			this.nextDocumentPage();
		}
	},

	getNode: function( container, id ) {

		if( typeof( container ) === "undefined" || typeof( container[id] ) === "undefined" || typeof( container[id]['$t'] ) === "undefined" ) {

			return "";
		} else {

			//Trim extra space from start and end of node content
			return container[id]['$t'].trim();
		}
	},

	nextDocumentPage: function() {

		this.log();

		this.pageIndex++;

		if( this.pageIndex < this.importItems[this.documentIndex]['pages'].length ) {

			//Still more pages; fetch next;
			this.downloadDocData( 1, this.standardLimit );
		} else {

			//document done; process;
			if( this.newAccounts.length > 0 ) {

				this.insertNewAccounts();
			} else {

				this.saveDocData( 0, ( this.standardLimit / 2 ) );
			}
		}
	},

	insertNewAccounts: function() {

		this.log();

		var data = {
				"table": "accounts",
				"data": this.newAccounts
			};

		var options = {
				"onSuccess": enyo.bind(
						this,
						this.fetchAccountData,
						enyo.bind(
								this,
								this.saveDocData,
								0,
								( this.standardLimit / 2 )
							)
					)
			};

		enyo.application.gts_db.insertData( data, options );
	},

	saveDocData: function( offset, limit ) {

		this.log( "( " + offset + ", " + limit + " )" );

		var queries = [];

		var finish = offset + limit;

		if( finish >= this.importItems[this.documentIndex]['transactions'].length ) {

			finish = this.importItems[this.documentIndex]['transactions'].length;
		}

		//Build query set
		for( var i = offset; i < finish; i++ ) {

			//Get account id
			this.importItems[this.documentIndex]['transactions'][i]['account'] = this.accountList[this.importItems[this.documentIndex]['transactions'][i]['accountCat']][this.importItems[this.documentIndex]['transactions'][i]['accountName']];

			//Get linked account id (if linked)
			if( this.importItems[this.documentIndex]['transactions'][i]['linkedRecord'] !== "" ) {

				this.importItems[this.documentIndex]['transactions'][i]['linkedAccount'] = this.accountList[this.importItems[this.documentIndex]['transactions'][i]['linkedAccountCat']][this.importItems[this.documentIndex]['transactions'][i]['linkedAccountName']];
			} else {

				delete this.importItems[this.documentIndex]['transactions'][i]['linkedRecord']
			}

			//Remove extra variables
			delete this.importItems[this.documentIndex]['transactions'][i]['accountName'];
			delete this.importItems[this.documentIndex]['transactions'][i]['accountCat'];
			delete this.importItems[this.documentIndex]['transactions'][i]['linkedAccountName'];
			delete this.importItems[this.documentIndex]['transactions'][i]['linkedAccountCat'];

			//Check for invalid itemId
			if( !Object.validNumber( this.importItems[this.documentIndex]['transactions'][i]['itemId'] ) ) {

				delete this.importItems[this.documentIndex]['transactions'][i]['itemId'];
			}

			/*
			//Restore category listing
			for( var j = 0; j < this.importItems[this.documentIndex]['transactions'][i]['category'][j]; j++ ) {

				queries.push(
						new GTS.databaseQuery(
							{
								"sql": "INSERT INTO transactionCategories( genCat, specCat ) SELECT ?, ? WHERE NOT EXISTS( SELECT 1 FROM transactionCategories WHERE genCat = ? AND specCat = ? );",
								"values": [
										this.importItems[this.documentIndex]['transactions'][i]['category'][j]['category'],
										this.importItems[this.documentIndex]['transactions'][i]['category'][j]['category2'],
										this.importItems[this.documentIndex]['transactions'][i]['category'][j]['category'],
										this.importItems[this.documentIndex]['transactions'][i]['category'][j]['category2']
									]
							}
						)
					);
			}
			*/

			var catObj = this.importItems[this.documentIndex]['transactions'][i]['category'];
			var catQuery = [];

			if( catObj.length > 1 && this.importItems[this.documentIndex]['transactions'][i]['itemId'] ) {
				//Split Category && item not new

				catQuery = enyo.application.transactionManager.handleCategoryData( this.importItems[this.documentIndex]['transactions'][i] );
			} else {
				//Single Category

				this.importItems[this.documentIndex]['transactions'][i]['category'] = catObj[0]['category'];
				this.importItems[this.documentIndex]['transactions'][i]['category2'] = catObj[0]['category2'];
			}

			queries.push(
					enyo.application.gts_db.getReplace(
							"transactions",
							this.importItems[this.documentIndex]['transactions'][i]
						)
				);

			queries = queries.concat( catQuery );
		}

		var options = {
				"onSuccess": enyo.bind( this, this.saveDocDataHandler, offset, limit ),
				"onError": enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.renderSpreadsheetList ), "Error while saving data, please try again. Contact <a href='mailto:GlitchTechScience@gmail.com'>GlitchTechScience@gmail.com</a> if this continues to occur." )
			};

		//Insert
		enyo.application.gts_db.queries( queries, options );
	},

	saveDocDataHandler: function( offset, limit ) {

		this.log( "( " + offset + ", " + limit + " )" );

		enyo.application.accountManager.updateAccountModTime();

		var trsnProgress = ( offset + limit ) / this.importItems[this.documentIndex]['transactions'].length;
		trsnProgress = ( trsnProgress > 1 ? 1 : trsnProgress );

		var totalProgress = ( ( trsnProgress / 2 ) + 0.5 + this.documentIndex ) / this.importItems.length;

		this.$['progress'].setMessage( this.importItems[this.documentIndex]['name'] + "<br />Saving: " + ( new Number( trsnProgress * 100 ) ).toFixed( 1 ) + "%" );
		this.$['progress'].setProgress( totalProgress * 100 );

		if( ( offset + limit ) < this.importItems[this.documentIndex]['transactions'].length ) {

			//Still more rows; fetch next set;
			this.saveDocData( ( offset + limit ), limit );
		} else {

			this.allSheetsList[this.importItems[this.documentIndex]['sheetIndex']]['selectStatus'] = false;

			this.$['spreadsheetList'].render();

			this.documentIndex++;
			this.pageIndex = 0;

			if( this.documentIndex < this.importItems.length ) {

				//document done; goto next;
				this.downloadDocData( 1, this.standardLimit );
			} else {

				//document done; no more exist;
				this.$['errorMessage'].setErrTitle( "Import Complete" );
				this.showErrorMessage( enyo.bind( this, this.closeImport, true ), "Imported " + this.importItems.length + " spreadsheets." );
			}
		}
	},

	showErrorMessage: function( callbackFn, error ) {

		this.onErrorClose = callbackFn;

		this.$['progress'].close();

		//set error message
		this.$['errorMessage'].setErrMessage( error );
		this.$['errorMessage'].openAtCenter();
	},

	closeErrorMessage: function() {

		this.$['errorMessage'].close();

		this.onErrorClose();
	},

	closeImport: function( success ) {

		try {

			enyo.windows.setWindowProperties( window, { blockScreenTimeout: false } );
			this.log( "Window: blockScreenTimeout: false" );
		} catch( err ) {

			this.log( "Window Error (End)", err );
		}

		//Reset system
		this.$['instructionsButton'].setDisabled( false );

		this.$['instructions'].show();
		this.$['credentials'].hide();
		this.$['sheetList'].hide();

		//Close & continue
		this.doFinish( success );
	}
});
