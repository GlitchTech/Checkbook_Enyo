/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.import",
	kind: "FittableRows",
	classes: "enyo-fit",

	style: "height: 100%;",

	allSheetsList: [],
	importItems: [],

	standardLimit: 100,

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: "onyx.Toolbar",
			classes: "text-center",
			style: "position: relative;",

			components: [
				{
					content: "Import System",
					classes: "bigger"
				}, {
					kind: "onyx.Button",
					ontap: "closeImport",

					content: "x",

					classes: "onyx-negative",
					style: "position: absolute; right: 15px;"
				}
			]
		},

		{
			kind: "enyo.Scroller",
			horizontal: "hidden",
			classes: "tardis-blue",
			fit: true,
			components: [
				{
					name: "instructions",
					classes: "light narrow-column padding-half-top",
					style: "height: 100%;",
					components: [
						{
							classes: "padding-std smaller",
							allowHtml: true,

							content: "<p>" +
									"To import your finances into this program you must have a Google Drive account. " + "<br />" +
									"<a href='http://drive.google.com/' target='_blank'>" + "Sign up here" + "</a>" +
								"</p><p>" +
									"Upload or create a spreadsheet with all the information to import. Once that is complete, tap 'Continue', select your spreadsheet, then the system will import your data. Existing data may be overwritten. <span style='color:#cc0000;'>The first row of the spreadsheet must have the following columns: account, accountCat, date, amount, description, cleared, note.</span>" +
								"</p>"
						}, {
							name: "saveCredentialsWrapper",
							layoutKind: "enyo.FittableColumnsLayout",
							noStretch: true,

							classes: "padding-std text-middle",

							components: [
								{
									name: "saveCredentials",
									kind: "onyx.Checkbox",
									value: true,

									classes: "margin-right"
								}, {
									content: "Save credentials",
									fit: true
								}
							]
						}
					]
				},

				{
					showing: false,

					name: "sheetList",
					kind: "Repeater",

					classes: "light narrow-column padding-half-top",

					onSetupItem: "setupRow",

					components: [
						{
							kind: "onyx.Item",

							tapHighlight: true,
							ontap: "sheetSelectedChanged",

							classes: "bordered",

							components: [
								{
									name: "sheetSelected",
									kind: "onyx.Checkbox",

									value: false,
									disabled: true,

									style: "margin-right: 10px;"
								}, {
									name: "sheetName",
									tag: "span"
								}, {
									name: "sheetUpdated",
									classes: "smaller"
								}
							]
						}
					]
				}
			]
		},

		{
			name: "instructionsBar",
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					name: "instructionsButton",
					kind: "onyx.Button",
					content: "Authenticate",

					ontap: "authenticateWithGoogle",

					classes: "onyx-affirmative",
					style: "min-width: 150px;"
				}
			]
		},

		{
			showing: false,

			name: "sheetListBar",
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					name: "sheetListButton",
					kind: "onyx.Button",
					content: "Import Accounts",

					ontap: "beginImportProcess",

					classes: "onyx-affirmative deep-green",
					style: "min-width: 150px;"
				}, {
					kind: "onyx.MenuDecorator",
					onSelect: "menuItemClick",
					components: [
						{
							kind: "onyx.Button",
							components: [
								{
									content: "Select..."
								}
							]
						}, {
							kind: "onyx.Menu",
							showOnTop: true,
							floating: true,
							components: [
								{
									content: "All",
									value: 1
								}, {
									content: "None",
									value: 2
								}, {
									content: "Invert",
									value: 3
								}
							]
						}
					]
				}
			]
		},

		{
			name: "progress",
			kind: "GTS.ProgressDialog",
			animateProgress: true,
			onCancel: "closeImport",
			cancelText: "Cancel"
		}, {
			name: "errorMessage",
			kind: "Checkbook.systemError",

			errTitle: "Import Error",
			mainMessage: "",
			secondaryMessage: "",

			onFinish: "closeErrorMessage"
		},

		{
			name: "gapi",
			kind: "GTS.Gapi",
			onReady: "gapiReady"
		},

		{
			name: "gapiAccess",
			kind: "private.gapi"
		},

		{
			name: "gssc",
			kind: "GTS.gdata",
			appName: "com.glitchtechscience.checkbook"
		},

		{
			name: "cryptoSystem",
			kind: "Checkbook.encryption"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.$['instructionsButton'].setDisabled( true );
		this.$['instructionsBar'].show();
		this.$['sheetListBar'].hide();

		this.$['instructions'].show();
		this.$['sheetList'].hide();

		//Show message of loading
		this.$['progress'].show( {
				"title": "Import Progress",
				"message": "Linking to Google...",
				"progress": 25
			});

		this.refreshLayout();
	},

	refreshLayout: function() {

		this.waterfall( "onresize", "onresize", this );
	},

	gapiReady: function() {

		this.$['progress'].setProgress( 60 );

		//check for pre-existing g-data log in
		Checkbook.globals.gts_db.query(
				"SELECT saveGSheetsData, gSheetPass FROM prefs LIMIT 1;",
				{
					"onSuccess": enyo.bind( this, this.decryptGapiData )
				}
			);
	},

	decryptGapiData: function( results ) {

		this.$['progress'].setProgress( 90 );

		if( results.length > 0 ) {

			this.$['saveCredentials'].setValue( results[0]['saveGSheetsData'] );

			//Decrypt if exists
			this.$['cryptoSystem'].decryptString(
					results[0]['gSheetPass'],
					enyo.bind(
							this,
							this.loadGapiData
						)
				);
		} else {

			this.loadGapiData( "" );
		}
	},

	loadGapiData: function( obj ) {

		this.$['gapi'].setApiKey( this.$['gapiAccess'].getApiKey() );
		this.$['gapi'].setClientId( this.$['gapiAccess'].getClientId() );
		this.$['gapi'].setClientSecret( this.$['gapiAccess'].getClientSecret() );

		this.$['saveCredentialsWrapper'].hide();
		this.$['gapi'].setAuthToken( enyo.json.parse( obj ) );

		this.$['instructionsButton'].setDisabled( false );

		//hide message of loading
		this.$['progress'].hide();
	},

	authenticateWithGoogle: function() {

		this.$["gapi"].setScope( [ "https://www.googleapis.com/auth/drive", "https://spreadsheets.google.com/feeds", "https://docs.google.com/feeds" ] );

		this.$['gapi'].auth( { "onSuccess": enyo.bind( this, this.userAuthenticated ), "onError": enyo.bind( this, this.userNotAuthenticated ) } );

		this.$['progress'].show( {
				"title": "Import Progress",
				"message": "Authenticating...",
				"progress": 5
			});
	},

	userNotAuthenticated: function() {

		this.closeImport();
	},

	userAuthenticated: function() {

		this.$['progress'].show( {
				"title": "Import Progress",
				"message": "Authenticated...",
				"progress": 15
			});

		//save credentials
		if( this.$['saveCredentials'].getValue() ) {

			this.$['cryptoSystem'].encryptString(
					enyo.json.stringify( this.$['gapi'].getAuthToken() ),
					enyo.bind(
							this,
							this.saveUserGData
						)
				);
		} else {

			this.saveUserGData( "" );
		}

		this.$['gapi'].loadModule( "drive", 2, { "onSuccess": enyo.bind( this, this.fetchsheetList ), "onError": enyo.bind( this, this.fatalError, "Checkbook importer has encountered a fatal error. Please try again later." ) } );
	},

	saveUserGData: function( token ) {

		var updateObj = {
					"saveGSheetsData": 0,
					"gSheetPass": ""
				};

		if( this.$['saveCredentials'].getValue() && token.length > 0 ) {

			updateObj = {
						"saveGSheetsData": this.$['saveCredentials'].getValue() ? 1 : 0,
						"gSheetPass": token
					};
		}

		Checkbook.globals.gts_db.query( Checkbook.globals.gts_db.getUpdate( "prefs", updateObj, {} ) );
	},

	fetchsheetList: function() {

		this.$['progress'].show( {
				"title": "Import Progress",
				"message": "Retrieving spreadsheets...",
				"progress": 25
			});

		var initialRequest = gapi.client.drive.files.list();
		this.retrievePageOfFiles( initialRequest, [] );
	},

	retrievePageOfFiles: function( request, result ) {

		var self = this;

		request.execute( function( resp ) {

				result = result.concat( resp.items );

				console.log( enyo.json.stringify( resp ) );
				console.log( enyo.json.stringify( result ) );

				var nextPageToken = resp.nextPageToken;

				if( nextPageToken ) {

					request = gapi.client.drive.files.list( {
							'pageToken': nextPageToken
						});

					this.retrievePageOfFiles( request, result );
				} else {

					self.rendersheetList( result );
				}
			});
	},

	rendersheetList: function( gapiSheetList ) {

		this.log( gapiSheetList.length, enyo.json.stringify( gapiSheetList ) );

		if( !gapiSheetList || typeof( gapiSheetList ) === "undefined" || gapiSheetList.length <= 0 ) {

			this.$['progress'].hide();

			this.showErrorMessage( enyo.bind( this, this.closeImport ), "No data available to be imported." );

			return;
		}

		this.$['progress'].setMessage( "Processing spreadsheets..." );
		this.$['progress'].setProgress( 75 );

		this.$['sheetListButton'].setDisabled( false );
		this.$['instructionsBar'].hide();
		this.$['sheetListBar'].show();

		this.$['instructions'].hide();
		this.$['sheetList'].show();

		this.allSheetsList = gapiSheetList;

		this.$['sheetList'].setCount( this.allSheetsList.length );

		this.refreshLayout();

		this.$['progress'].hide();
	},

	setupRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var item = inEvent.item;

		var row = this.allSheetsList[index];

		if( row ) {

			item.$['sheetName'].setContent( row['title'] );

			var dateObj = new Date( row['modifiedDate'] );
			item.$['sheetUpdated'].setContent( dateObj.format( { date: "longDate", time: "shortTime" } ) );

			item.$['sheetSelected'].setValue( row['selectStatus'] );

			return true;
		}
	},

	sheetSelectedChanged: function( inSender, inEvent ) {

		this.allSheetsList[inEvent.index]['selectStatus'] = !this.allSheetsList[inEvent.index]['selectStatus'];

		this.$['sheetList'].renderRow( inEvent.index );
	},

	menuItemClick: function( inSender, inEvent ) {

		if( inEvent.selected.value === 1 ) {
			//All

			for( var i = 0; i < this.allSheetsList.length; i++ ) {

				this.allSheetsList[i]['selectStatus'] = true;
			}
		} else if( inEvent.selected.value === 2 ) {
			//None

			for( var i = 0; i < this.allSheetsList.length; i++ ) {

				this.allSheetsList[i]['selectStatus'] = false;
			}
		} else if( inEvent.selected.value === 3 ) {
			//Invert

			for( var i = 0; i < this.allSheetsList.length; i++ ) {

				this.allSheetsList[i]['selectStatus'] = !this.allSheetsList[i]['selectStatus'];
			}
		}

		this.$['sheetList'].setCount( this.allSheetsList.length );
	},

	beginImportProcess: function() {

		this.$['sheetListButton'].setDisabled( true );

		this.importItems = [];

		for( var i = 0; i < this.allSheetsList.length; i++ ) {

			if( this.allSheetsList[i]['selectStatus'] ) {

				this.importItems.push( {
						"sheetIndex": i,
						"name": this.allSheetsList[i]['title'],
						"sheetId": this.allSheetsList[i]['id'],
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
			//Convert to Phonegap API

			enyo.windows.setWindowProperties( window, { blockScreenTimeout: true } );
			this.log( "Window: blockScreenTimeout: true" );
		} catch( err ) {

			this.log( "Window Error (Start)", err );
		}

		this.$['progress'].show( {
				"title": "Importing Data",
				"message": "Fetching document specifications...",
				"progress": 0
			});

		this.$['gssc'].setAuthKey( this.$['gapi'].getAuthToken().AccessToken );

		enyo.asyncMethod(
				this,
				this.fetchDocSummary
			);
	},

	fetchDocSummary: function() {

		this.$['progress'].setProgress( this.documentIndex / this.importItems.length * 100 );

		this.$['gssc'].getSheetSummary(
				this.importItems[this.documentIndex]['sheetId'],
				{
					"onSuccess": enyo.bind( this, this.parseDocSummary ),
					"onError": enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.fetchsheetList ) )
				}
			);
	},

	parseDocSummary: function( inSender, data ) {

		if( this.checkErrorCount() ) { return; }

		if( typeof( data.feed.entry ) === "undefined" ) {
			//Bad data returned

			this.error( "Bad data from Google." );
			this.$['progress'].setMessage( "Attempting to fix bad import data" );

			this.errorCount++;

			//Restart this again
			this.fetchDocSummary();

			return;
		}

		var data = data.feed.entry;

		if( !enyo.isArray( data ) ) {

			data = [ data ];
		}

		for( var i = 0; i < data.length; i++ ) {

			//Add page to array with all sheet Ids
			this.importItems[this.documentIndex]['pages'].push( {
					"pageKey": data[i]['id']['#text'].slice( data[i]['id']['#text'].lastIndexOf( "/" ) + 1 ),
					"title": data[i]['title']['#text'],
					"totalResults": 0
				});
		}

		this.documentIndex++;

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

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "accounts", [ "acctId", "acctCategory", "acctName" ] ),
				{
					"onSuccess": enyo.bind( this, this.processAccountData, callbackFn )
				}
			);
	},

	processAccountData: function( callbackFn, results ) {

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

		if( typeof( this.accountList[category] ) === "undefined" ) {

			this.accountList[category] = {};
		}

		this.accountList[category][name] = id;
	},

	startDataPull: function() {

		this.documentIndex = 0;
		this.pageIndex = 0;

		this.errorCount = 0;

		this.downloadDocData( 1, this.standardLimit );
	},

	downloadDocData: function( offset, limit ) {

		if( this.pageIndex >= this.importItems[this.documentIndex]['pages'].length ) {

			//invalid page index
			this.nextDocumentPage();

			return;
		}

		this.$['gssc'].getSheetData(
				this.importItems[this.documentIndex]['sheetId'],
				this.importItems[this.documentIndex]['pages'][this.pageIndex]['pageKey'],
				offset,
				limit,
				{
					"onSuccess": enyo.bind( this, this.processDocData ),
					'onError': enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.fetchsheetList ) )
				}
			);
	},

	processDocData: function( inSender, data ) {

		if( this.checkErrorCount( 5 ) ) { return; }

		if( typeof( data ) === "undefined" ||
			typeof( data.feed ) === "undefined" ) {
			//Bad data returned

			this.error( "Bad data from Google." );
			this.$['progress'].setMessage( "Attempting to fix bad import data" );

			this.errorCount++;

			//Restart this again
			this.importItems[this.documentIndex]['transactions'] = [];
			this.downloadDocData( 1, this.standardLimit );

			return;
		}

		this.importItems[this.documentIndex]['limit'] = parseInt( data.feed['openSearch:itemsPerPage']['#text'] );
		this.importItems[this.documentIndex]['offset'] = parseInt( data.feed['openSearch:startIndex']['#text'] );
		this.importItems[this.documentIndex]['totalResults'] = parseInt( data.feed['openSearch:totalResults']['#text'] );

		if( this.importItems[this.documentIndex]['totalResults'] <= 0 || typeof( data.feed.entry ) === "undefined" ) {

			this.nextDocumentPage();
			return;
		}

		var data = data.feed.entry;

		if( !enyo.isArray( data ) ) {

			data = [ data ];
		}

		if( this.importItems[this.documentIndex]['offset'] === 1 &&
			(
				typeof( data[0]['gsx:amount'] ) === "undefined" ||
				typeof( data[0]['gsx:amount']['#text'] ) === "undefined" ||
				typeof( data[0]['gsx:description'] ) === "undefined" ||
				typeof( data[0]['gsx:description']['#text'] ) === "undefined" ||
				typeof( data[0]['gsx:date'] ) === "undefined" ||
				typeof( data[0]['gsx:date']['#text'] ) === "undefined"
			) ) {

			this.createComponent( {
					name: "alertShow",
					kind: "gts.ConfirmDialog",

					title: "Warning! Missing Fields",
					message: "Current page is missing essential fields for importing the data. These fields can be blank, but doing so may result in an improper import. The first row should have the following items: account, accountCat, date, amount, description, cleared, note. (" + this.importItems[this.documentIndex]['name'] + " page " + ( this.pageIndex + 1 ) + ")",

					confirmText: "Skip Current Item",
					cancelText: "Ignore and Continue",

					onConfirm: "nextDocumentPage",
					onCancel: "processDocDataIgnoreContinue"
				});

			this.responseHolder = data;

			this.$['alertShow'].show();
		} else {

			this.processDocDataFollower( data );
		}
	},

	processDocDataIgnoreContinue: function() {

		this.$['alertShow'].hide();
		this.$['alertShow'].destroy();

		var data = this.responseHolder;
		this.responseHolder = null;

		this.processDocDataFollower( data );
	},

	processDocDataFollower: function( entry ) {

		var data = enyo.isArray( entry ) ? entry : [];
		var trsn;

		for( var i = 0; i < data.length; i++ ) {

			trsn = {};

			trsn['amount'] = deformatAmount( this.getNode( data[i], 'gsx:amount' ) );

			if( Object.validNumber( trsn['amount'] ) ) {
				//Only continue if amount field is not empty && is a number

				trsn['amount'] = parseFloat( trsn['amount'] );

				//Transaction Id
				trsn['itemId'] = parseInt( this.getNode( data[i], 'gsx:gtid' ) );

				if( !Object.validNumber( trsn['itemId'] ) ) {

					trsn['itemId'] = "";
				}

				//Account
				trsn['accountName'] = this.getNode( data[i], 'gsx:account' );
				trsn['accountCat'] = this.getNode( data[i], 'gsx:accountcat' );

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
				trsn['linkedAccountName'] = this.getNode( data[i], 'gsx:gtlinkedaccount' );//Line 776 of mojo for basic idea
				trsn['linkedAccountCat'] = this.getNode( data[i], 'gsx:gtlinkedaccountcat' );
				trsn['linkedRecord'] = parseInt( this.getNode( data[i], 'gsx:gtlinkid' ) );

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
				trsn['cleared'] = this.getNode( data[i], 'gsx:cleared' ).toLowerCase();

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
				trsn['date'] = Date.deformat( this.getNode( data[i], 'gsx:date' ) );

				if( !Object.validNumber( trsn['date'] ) ) {

					trsn['date'] = Date.parse( new Date() );
				}

				//Category
				trsn['category'] = this.getNode( data[i], 'gsx:gtcat' );

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
				trsn['desc'] = this.getNode( data[i], 'gsx:description' );
				trsn['desc'] = trsn['desc'].length > 0 ? trsn['desc'] : "Transaction Description";

				//Special checks not needed
				trsn['checkNum'] = this.getNode( data[i], 'gsx:checknum' );
				trsn['note'] = this.getNode( data[i], 'gsx:note' );

				this.importItems[this.documentIndex]['transactions'].push( trsn );
			}
		}

		this.updateDocDownloadProgress( data.length );

		if( ( this.importItems[this.documentIndex]['limit'] + this.importItems[this.documentIndex]['offset'] ) < this.importItems[this.documentIndex]['totalResults'] ) {

			//Still more rows; fetch next set;
			this.downloadDocData( ( this.importItems[this.documentIndex]['limit'] + this.importItems[this.documentIndex]['offset'] ), this.importItems[this.documentIndex]['limit'] );
		} else {

			//Page done; contine;
			this.nextDocumentPage();
		}
	},

	updateDocDownloadProgress: function( dataLength ) {

		var pageProgress = ( dataLength + this.importItems[this.documentIndex]['offset'] ) / this.importItems[this.documentIndex]['totalResults'];
		var docProgress = ( ( pageProgress > 1 ? 1 : pageProgress ) + this.pageIndex ) / this.importItems[this.documentIndex]['pages'].length;
		var totalProgress = ( ( ( docProgress / 2 ) + this.documentIndex ) / this.importItems.length ) * 100;

		this.$['progress'].setMessage( this.importItems[this.documentIndex]['name'] + "<br />Downloading: " + ( new Number( isNaN( docProgress ) ? 0 : docProgress ) ).toFixed( 1 ) + "%" );

		if( !isNaN( totalProgress ) ) {

			this.$['progress'].setProgress( totalProgress );
		}
	},

	getNode: function( container, id ) {

		if( typeof( container ) === "undefined" || typeof( container[id] ) === "undefined" || typeof( container[id]['#text'] ) === "undefined" ) {

			return "";
		} else {

			//Trim extra space from start and end of node content
			return container[id]['#text'].trim();
		}
	},

	nextDocumentPage: function() {

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

		Checkbook.globals.gts_db.insertData( data, options );
	},

	saveDocData: function( offset, limit ) {

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

				catQuery = Checkbook.globals.transactionManager.handleCategoryData( this.importItems[this.documentIndex]['transactions'][i] );
			} else {
				//Single Category

				this.importItems[this.documentIndex]['transactions'][i]['category'] = catObj[0]['category'];
				this.importItems[this.documentIndex]['transactions'][i]['category2'] = catObj[0]['category2'];
			}

			queries.push(
					Checkbook.globals.gts_db.getReplace(
							"transactions",
							this.importItems[this.documentIndex]['transactions'][i]
						)
				);

			queries = queries.concat( catQuery );
		}

		var options = {
				"onSuccess": enyo.bind( this, this.saveDocDataHandler, offset, limit ),
				"onError": enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.fetchsheetList ), "Error while saving data, please try again. Contact <a href='mailto:GlitchTechScience@gmail.com'>GlitchTechScience@gmail.com</a> if this continues to occur." )
			};

		//Insert
		Checkbook.globals.gts_db.queries( queries, options );
	},

	saveDocDataHandler: function( offset, limit ) {

		Checkbook.globals.accountManager.updateAccountModTime();

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

			this.$['sheetList'].render();

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

	checkErrorCount: function( testLimit ) {

		if( !testLimit ) { testLimit = 3; }

		if( this.errorCount >= 3 ) {
			//Too many errors

			this.error( "Multiple sets of bad data from Google." );

			this.errorCount = 0;

			this.showErrorMessage( enyo.bind( this, this.fetchsheetList ), "There has been an error: Multiple sets of bad data from Google. Please try again later." );

			return true;
		}

		return false;
	},

	fatalError: function( message ) {

		this.showErrorMessage( enyo.bind( this, this.closeImport, true ), message );
	},

	showErrorMessage: function( callbackFn, error ) {

		this.onErrorClose = callbackFn;

		this.$['progress'].hide();

		//set error message
		this.$['errorMessage'].show();
		this.$['errorMessage'].setMainMessage( error );
	},

	closeErrorMessage: function() {

		this.$['errorMessage'].hide();

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
		this.$['sheetList'].hide();

		//Hide all popups
		this.$['errorMessage'].hide();
		this.$['progress'].hide();

		//Close & continue
		this.doFinish( { "success": success } );
	}
});
