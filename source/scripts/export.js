/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.export",
	kind: "FittableRows",
	classes: "enyo-fit",

	style: "height: 100%;",

	acctList: [],

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
					content: "Export System",
					classes: "bigger"
				}, {
					kind: "onyx.Button",
					ontap: "closeExport",

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
									"To export your finances from this program you must have a Google Drive account. " + "<br />" +
									"Visit drive.google.com to sign up." +
								"</p><p>" +
									"<strong>Warning:</strong> Larger spreadsheets will take much longer to upload." +
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

					name: "accountList",
					kind: "Repeater",

					classes: "light narrow-column padding-half-top",

					onSetupItem: "setupRow",

					components: [
						{
							kind: "onyx.Item",

							tapHighlight: true,
							ontap: "accountSelectedChanged",

							classes: "bordered text-middle",

							components: [
								{
									name: "accountSelected",
									kind: "onyx.Checkbox",

									value: false,
									disabled: true,

									classes: "margin-half-right"
								}, {
									classes: "inline",
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
										}
									]
								}, {
									classes: "margin-half-left inline",
									components: [
										{
											name: "accountName"
										}, {
											name: "accountNote",
											classes: "smaller"
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
		}, {
			showing: false,

			name: "accountListBar",
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					name: "accountListButton",
					kind: "onyx.Button",
					content: "Export Accounts",

					ontap: "beginExportProcess",

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
			onCancel: "closeExport",
			cancelText: "Cancel"
		}, {
			name: "errorMessage",
			kind: "Checkbook.systemError",

			errTitle: "Export Error",
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
			name: "cryptoSystem",
			kind: "Checkbook.encryption"
		}
	],

	/** Initialization **/
	rendered: function() {

		this.inherited( arguments );

		this.$['instructions'].show();
		this.$['instructionsBar'].show();
		this.$['instructionsButton'].setDisabled( true );

		this.$['accountList'].hide();
		this.$['accountListBar'].hide();

		//Show message of loading
		this.$['progress'].show( {
				"title": "Export Progress",
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

	/** Authenticate **/
	authenticateWithGoogle: function() {

		this.$['gapi'].setScope( [ "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://spreadsheets.google.com/feeds", "https://docs.google.com/feeds" ] );

		this.$['gapi'].auth( { "onSuccess": enyo.bind( this, this.userAuthenticated ), "onError": enyo.bind( this, this.userNotAuthenticated ) } );

		this.$['progress'].show( {
				"title": "Export Progress",
				"message": "Authenticating...",
				"progress": 5
			});
	},

	userNotAuthenticated: function() {

		this.closeExport();
	},

	userAuthenticated: function() {

		this.$['progress'].show( {
				"title": "Export Progress",
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

		this.fetchAccounts();
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

	/** Render/Display Accounts **/
	fetchAccounts: function() {

		this.$['progress'].show( {
				"title": "Export Progress",
				"message": "Retrieving accounts...",
				"progress": 50
			});

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect(
						"accounts",
						[
							"acctId",
							"acctName",
							"acctCategory",
							"acctLocked",
							"lockedCode",
							"IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = acctCategory ), 'icon_2.png' ) AS acctCategoryIcon",
							"( SELECT accountCategories.catOrder FROM accountCategories WHERE accountCategories.name = acctCategory ) AS acctCatOrder",
							"IFNULL( ( SELECT COUNT( transactions.amount ) FROM transactions WHERE transactions.account = acctId ), 0 ) AS itemCount"
						],
						null,
						[
							"acctCatOrder",
							"acctName"
						]
					),
				{
					"onSuccess": enyo.bind( this, this.renderAccountList )
				}
			);
	},

	renderAccountList: function( results ) {

		this.acctList = [];

		for( var i = 0; i < results.length; i++ ) {

			var row = results[i];

			this.acctList.push(
							{
								acctId: row['acctId'],
								name: row['acctName'],
								cat: row['acctCategory'],
								icon: row['acctCategoryIcon'],
								itemCount: row['itemCount'],
								acctLocked: row['acctLocked'],
								lockedCode: row['lockedCode'],
								bypass: false,
								selectStatus: ( row['acctLocked'] != 1 )
							}
						);
		}

		if( this.acctList.length <= 0 ) {

			this.$['progress'].hide();

			this.showErrorMessage( enyo.bind( this, this.closeExport ), "No data available to be exported." );
		} else {

			this.showAccountList();
		}
	},

	showAccountList: function() {

		this.$['progress'].setMessage( "Processing accounts..." );
		this.$['progress'].setProgress( 75 );

		this.$['instructionsBar'].hide();
		this.$['instructions'].hide();

		this.$['accountListButton'].setDisabled( false );
		this.$['accountListBar'].show();
		this.$['accountList'].show();

		this.$['accountList'].setCount( this.acctList.length );

		this.refreshLayout();

		this.$['progress'].hide();
	},

	setupRow: function( inSender, inEvent ) {

		var index = inEvent.index;
		var item = inEvent.item;

		var row = this.acctList[index];

		if( row ) {

			item.$['accountName'].setContent( row['name'] );
			item.$['accountNote'].setContent( row['itemCount'] + " " + "Transaction" + ( row['itemCount'] > 1 ? "s" : "" ) );

			item.$['icon'].setSrc( "assets/" + row['icon'] );
			item.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 || row['bypass'] ) );

			item.$['accountSelected'].setChecked( row['selectStatus'] );

			return true;
		}
	},

	accountSelectedChanged: function( inSender, inEvent ) {

		if( this.acctList[inEvent.index]['acctLocked'] && !this.acctList[inEvent.index]['bypass'] ) {

				Checkbook.globals.security.authUser(
						this.acctList[inEvent.index]['name'] + " " + "PIN Code",
						this.acctList[inEvent.index]['lockedCode'],
						{
							"onSuccess": enyo.bind( this, this.authSuccessful, inEvent.index )
						}
					);
		} else {

			this.acctList[inEvent.index]['selectStatus'] = !this.acctList[inEvent.index]['selectStatus'];
		}

		this.$['accountList'].renderRow( inEvent.index );
	},

	authSuccessful: function( index ) {

		this.acctList[index]['bypass'] = true;
		this.acctList[index]['selectStatus'] = true;

		this.$['accountList'].renderRow( index );
	},

	menuItemClick: function( inSender, inEvent ) {

		if( inEvent.selected.value === 1 ) {
			//All

			for( var i = 0; i < this.acctList.length; i++ ) {

				if( !this.acctList[i]['acctLocked'] || this.acctList[i]['bypass'] ) {

					this.acctList[i]['selectStatus'] = true;
				}
			}
		} else if( inEvent.selected.value === 2 ) {
			//None

			for( var i = 0; i < this.acctList.length; i++ ) {

				this.acctList[i]['selectStatus'] = false;
			}
		} else if( inEvent.selected.value === 3 ) {
			//Invert

			for( var i = 0; i < this.acctList.length; i++ ) {

				if( !this.acctList[i]['acctLocked'] || this.acctList[i]['bypass'] ) {

					this.acctList[i]['selectStatus'] = !this.acctList[i]['selectStatus'];
				}
			}
		}

		this.$['accountList'].setCount( this.acctList.length );
	},

	/** Run export process **/
	beginExportProcess: function() {

		this.$['progress'].show( {
				"title": "Exporting",
				"message": "Preparing data...",
				"progress": 0
			});

		this.$['accountListButton'].setDisabled( true );

		var accountsToExport = [];

		//find out which are checked, combine into list (comma seps)
		for( var i = 0; i < this.acctList.length; i++ ) {

			if( this.acctList[i]['selectStatus'] === true ) {

				accountsToExport.push( enyo.mixin( { index: i }, this.acctList[i] ) );
			}
		}

		//No accounts selected; exit system
		if( accountsToExport.length <= 0 ) {

			this.showErrorMessage( enyo.bind( this, this.closeExport ), "Export complete." );
			return;
		}

		try {

			enyo.windows.blockScreenTimeout( true );
			this.log( "Window: blockScreenTimeout: true" );
		} catch( err ) {

			this.log( "Window Error (Start)", err );
		}

		this.startNewSheet( accountsToExport, 0 );
	},

	startNewSheet: function( accountsToExport, index ) {

		this.$['progress'].setTitle( "Exporting" + " " + accountsToExport[index]['name'] );
		this.$['progress'].setMessage( ( index + 1 ) + " of " + accountsToExport.length + "<br />" + "Retrieving transactions" );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * 1 / 4 ) / accountsToExport.length ) * 100 );

		//fetch account finance data, use SQL to make each line a CSV
		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect(
						"transactions",
						[
							"itemId",
							"linkedRecord",

							"amount",
							"checkNum",
							"cleared",
							"date",
							"desc",
							"note",

							" ( CASE WHEN category = '||~SPLIT~||' THEN" +
									" ( '[' || IFNULL( ( SELECT GROUP_CONCAT( json ) FROM ( SELECT ( '{ \"category\": \"' || ts.genCat || '\", \"category2\" : \"' || ts.specCat || '\", \"amount\": \"' || ts.amount || '\" }' ) AS json FROM transactionSplit ts WHERE ts.transId = itemId ORDER BY ts.amount DESC ) ), '{ \"category\": \"?\", \"category2\" : \"?\", \"amount\": \"0\" }' ) || ']' )" +
								" ELSE category END ) AS category",
							" ( CASE WHEN category = '||~SPLIT~||' THEN" +
									" 'PARSE_CATEGORY'" +
								" ELSE category2 END ) AS category2",

							"IFNULL( ( SELECT accounts.acctName FROM accounts WHERE accounts.acctId = transactions.account ), '' ) AS accountName",
							"IFNULL( ( SELECT accounts.acctCategory FROM accounts WHERE accounts.acctId = transactions.account ), '' ) AS accountCat",
							"IFNULL( ( SELECT accounts.acctName FROM accounts WHERE accounts.acctId = transactions.linkedAccount ), '' ) AS linkedAccountName",
							"IFNULL( ( SELECT accounts.acctCategory FROM accounts WHERE accounts.acctId = transactions.linkedAccount ), '' ) AS linkedAccountCat"
						],
						{
							"account": accountsToExport[index]['acctId']
						},
						[
							"date"
						]
					),
				{
					"onSuccess": enyo.bind(
							this,
							this.buildSheetContent,
							accountsToExport,
							index,
							0,
							100,
							{
								"accountId": accountsToExport[index]['acctId'],
								"accountName": accountsToExport[index]['name'],
								"accountCategory": accountsToExport[index]['cat'],
								"csv": "account,accountCat,date,amount,description,cleared,checkNum,note,gtId,gtCat,gtLinkId,gtLinkedAccount,gtLinkedAccountCat\n"
							}
						)
				}
			);
	},

	buildSheetContent: function( accountsToExport, index, offset, limit, uploadData, results ) {

		if( results.length <= 0 ) {

			this.sheetComplete( accountsToExport, index );
			return;
		}

		var endIndex = 0;

		if( ( offset + limit ) < results.length ) {

			endIndex = offset + limit;
		} else {

			endIndex = results.length;
		}

		this.$['progress'].setMessage( ( index + 1 ) + " of " + accountsToExport.length + "<br />" + "Processing account" );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * ( 2 + endIndex / results.length ) / 4 ) / accountsToExport.length ) * 100 );

		for( var i = offset; i < endIndex; i++ ) {

			var row = results[i];

			uploadData['csv'] += '"' + row['accountName'].cleanString() + '",' +
										'"' + row['accountCat'].cleanString() + '",' +
										'"\'' + ( new Date( parseInt( row['date'] ) ) ).format( "special" ) + '",' +// The \' at the start forces GDocs to treat as a string and not reformat the date
										'"' + formatAmount( row['amount'] ) + '",' +
										'"' + row['desc'].cleanString() + '",' +
										'"' + ( row['cleared'] == 1 ? "Yes" : "No" ) + '",' +
										'"' + row['checkNum'].cleanString() + '",' +
										'"' + row['note'].cleanString() + '",' +
										'"' + row['itemId'] + '",' +
										'"' + enyo.json.stringify( Checkbook.globals.transactionManager.parseCategoryDB( row['category'], row['category2'] ) ).replace( /"/g, '""' ) + '",' +
										'"' + row['linkedRecord'] + '",' +
										'"' + row['linkedAccountName'].cleanString() + '",' +
										'"' + row['linkedAccountCat'].cleanString() + '"\n';
		}

		if( endIndex < results.length ) {
			//slightly delay loading so UI doesn"t crash

			enyo.asyncMethod( this, this.buildSheetContent, accountsToExport, index, endIndex, limit, uploadData, results );
		} else {

			this.uploadSheet( accountsToExport, index, uploadData );
		}
	},

	uploadSheet: function( accountsToExport, index, uploadData ) {

		this.$['progress'].setMessage( ( index + 1 ) + " of " + accountsToExport.length + "<br />" + "Uploading data" );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * 3 / 4 ) / accountsToExport.length ) * 100 );

		const boundary = "----END_OF_PART----";
		const delimiter = "\r\n--" + boundary + "\r\n";
		const close_delim = "\r\n--" + boundary + "--";
		const contentType = "text/csv";

		var dateObj = new Date();
		var docTitle = "[" + "Checkbook GUTOC" + "] " + uploadData['accountName'] + " [" + uploadData['accountCategory'] + "] [" + dateObj.format( { date: "longDate", time: "shortTime" } ) + "]";

		var metadata = {
				"title": docTitle.cleanString(),
				"mimeType": contentType
			};

		var multipartRequestBody =
			delimiter +
			"Content-Type: application/json\r\n\r\n" +
			JSON.stringify( metadata ) +
			delimiter +
			"Content-Type: " + contentType + "\r\n" +
			"\r\n" +
			uploadData['csv'] +
			close_delim;

		var request = gapi.client.request( {
				"path": "/upload/drive/v2/files?convert=true",
				"method": "POST",
				"params": { "uploadType": "multipart" },
				"headers": {
					"Content-Type": 'multipart/mixed; boundary="' + boundary + '"'
				},
				"body": multipartRequestBody
			});

		request.execute( enyo.bind( this, this.requestComplete, accountsToExport, index ) );
	},

	requestComplete: function( accountsToExport, index, resp ) {

		if( !resp.error ) {

			this.sheetComplete( accountsToExport, index );
		} else {

			var error = "Code: " + resp.error.code + "<br />" + "Message" + resp.error.message;
			// More error information can be retrieved with resp.error.errors.

			this.showErrorMessage( this.showAccountList, error );
		}
	},

	sheetComplete: function( accountsToExport, index ) {

		this.$['progress'].setMessage( "Account uploaded" );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * 4 / 4 ) / accountsToExport.length ) * 100 );
		//Uncheck item in list

		index++;

		if( index < accountsToExport.length ) {

			this.startNewSheet( accountsToExport, index );
		} else {

			this.$['progress'].hide();

			this.$['errorMessage'].setErrTitle( "Export Complete" );
			this.showErrorMessage( enyo.bind( this, this.closeExport ), accountsToExport.length + " account"  + ( accountsToExport.length > 1 ? "s" : "" ) + " exported." );
		}
	},

	/** Finisher **/
	closeExport: function() {

		try {

			enyo.windows.blockScreenTimeout( false );
			this.log( "Window: blockScreenTimeout: false" );
		} catch( err ) {

			this.log( "Window Error (End)", err );
		}

		//Reset system
		this.$['instructions'].show();
		this.$['instructionsBar'].show();
		this.$['instructionsButton'].setDisabled( false );

		this.$['accountList'].hide();
		this.$['accountListBar'].hide();

		//Hide all popups
		this.$['errorMessage'].hide();
		this.$['progress'].hide();

		//Close & continue
		this.doFinish();
	},

	/** Error System **/
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
	}
});
