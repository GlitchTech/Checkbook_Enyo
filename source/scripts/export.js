/* Copyright © 2011, GlitchTech Science */

enyo.kind({
	name: "Checkbook.export",
	kind: enyo.VFlexBox,

	className: "light",
	style: "height: 100%;",

	acctList: [],

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
					content: $L( "Export System" ),
					className: "bigger",
					style: "margin-right: -32px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.ToolButton,

					icon: "source/images/menu_icons/close.png",
					className: "img-icon",

					onclick: "closeExport"
				}
			]
		},

		{
			kind: enyo.Scroller,
			flex: 1,

			components: [
				{
					name: "credentials",
					layoutKind: enyo.VFlexLayout,

					className: "light narrow-column",
					flex: 1,

					components: [
						{
							kind: enyo.RowGroup,
							caption: $L( "Google Credentials" ),
							components: [
								{
									name: "gUser",
									kind: enyo.Input,
									hint: $L( "Google Username" ),

									inputType: "email",

									components: [
										{
											content: $L( "Username" ),
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
											hint: $L( "Account Password" ),

											components: [
												{
													content: $L( "Password" ),
													className: "small",
													style: "color: rgb( 32, 117, 191 );"
												}
											]
										}
									]
								}
							]
						}, {
							content: "Enter your Google Spreadsheets credentials to export your financial data to <a href='http://docs.google.com/'>Google Documents</a> from your device.",
							allowHtml: true,
							className: "smallest",
							style: "padding: 0.5em 0.5em 0 0.5em;"
						}, {
							layoutKind: enyo.HFlexLayout,
							style: "padding: 0.5em 0.5em 0.5em 0.5em;",

							components: [
								{
									name: "saveCredentials",
									kind: enyo.CheckBox,
									checked: true,

									style: "margin-right: 10px;"
								}, {
									content: $L( "Save credentials" ),
									flex: 1
								}, {
									name: "showPass",
									kind: enyo.ToggleButton,

									state: false,
									onLabel: $L( "Show password" ),
									offLabel: $L( "Mask password" ),

									onChange: 'togglePasswordVis',

									style: "margin-left: 10px;"
								}
							]
						}
					]
				},

				{
					showing: false,

					name: "accountList",
					layoutKind: enyo.VFlexLayout,

					className: "light narrow-column",
					flex: 1,

					components: [
						{
							name: "accounts",
							kind: enyo.VirtualRepeater,

							flex: 1,
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
				}
			]
		},

		{
			name: "credentialsBar",
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "credentialsButton",
					kind: enyo.Button,
					content: $L( "Sign In" ),

					onclick: "authenticateWithGoogle",

					className: "enyo-button-affirmative deep-green",
					style: "min-width: 150px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}
			]
		}, {
			name: "accountListBar",
			showing: false,
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Spacer,
					flex: 8
				}, {
					name: "accountListButton",
					kind: enyo.Button,
					caption: $L( "Export Accounts" ),

					onclick: "beginExportProcess",

					className: "enyo-button-affirmative deep-green",
					style: "min-width: 150px;"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					name: "accountListSelectButton",
					kind: enyo.Button,
					caption: $L( "Select" ) + "...",

					onclick: "accountListSelectOptions"
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
					caption: $L( "All" ),
					value: 1
				}, {
					caption: $L( "None" ),
					value: 2
				}, {
					caption: $L( "Invert" ),
					value: 3
				}
			]
		},

		{
			name: "progress",
			kind: "GTS.progress",

			title: "",
			message: "",
			progress: ""
		}, {
			name: "errorMessage",
			kind: "GTS.system_error",

			errTitle: $L( "Export Error" ),
			errMessage: "",
			errMessage2: "" ,
			onFinish: "closeErrorMessage"
		},

		{
			name: "gDataControls",
			kind: "GTS.gdata"
		}, {
			name: "cryptoSystem",
			kind: "Checkbook.encryption"
		}
	],

	/** Initialization **/
	rendered: function() {

		this.inherited( arguments );

		this.log();

		this.prepareCredentials();

		//check for pre-existing g-data log in
		enyo.application.gts_db.query(
				"SELECT saveGSheetsData, gSheetUser, gSheetPass FROM prefs LIMIT 1;",
				{
					"onSuccess": enyo.bind( this, this.fetchUserGData )
				}
			);
	},

	prepareCredentials: function() {

		this.log();

		this.$['credentialsButton'].setDisabled( false );
		this.$['credentialsBar'].setShowing( true );
		this.$['accountListBar'].setShowing( false );

		this.$['credentials'].show();
		this.$['accountList'].hide();

		this.resized();
	},

	fetchUserGData: function( results ) {

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

		this.$['gUser'].setValue( user );
		this.$['gPass'].setValue( pass );
		this.$['saveCredentials'].setChecked( save );

		this.$['showPass'].setDisabled( save );//Disable show cred if loaded from DB

		this.$['gUser'].forceFocus();
	},

	togglePasswordVis: function( inSender, state ) {

		var pass = this.$['gPass'].getValue();

		this.$['gPass'].destroy();

		this.$['gPassWrapper'].createComponent(
				{
					name: "gPass",
					kind: ( state ? enyo.Input : enyo.PasswordInput ),
					hint: $L( "Account Password" ),

					components: [
						{
							content: $L( "Password" ),
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

	/** Authenticate **/
	authenticateWithGoogle: function() {

		this.log();

		this.$['credentialsButton'].setDisabled( true );

		//Check username & password exist
		this.$['progress'].load( "Authenticating", "Trying to authenticate credentials", 25 );

		this.$['gDataControls'].gdata_authenticate(
				this.$['gUser'].getValue(),
				this.$['gPass'].getValue(),
				"writely",
				{
					"onSuccess": enyo.bind( this, this.authenticationSuccessful ),
					"onError": enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.prepareCredentials ) ),
					"timeout": 15
				}
			);
	},

	authenticationSuccessful: function() {

		this.$['progress'].setProgress( 35 );

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

			this.saveUserGData( "" );
		}
	},

	saveUserGData: function( pass ) {

		this.$['progress'].setProgress( 40 );

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

		this.fetchAccounts();
	},

	/** Render/Display Accounts **/
	fetchAccounts: function() {

		this.$['progress'].setMessage( "Retrieving accounts..." );
		this.$['progress'].setProgress( 50 );

		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect(
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

			this.$['progress'].close();

			this.showErrorMessage( enyo.bind( this, this.closeExport ), "No data available to be exported." );
		} else {

			this.showAccountList();
		}
	},

	showAccountList: function() {

		this.$['progress'].setMessage( "Processing accounts..." );
		this.$['progress'].setProgress( 75 );

		this.$['accounts'].render();

		this.$['accountListButton'].setDisabled( false );
		this.$['credentialsBar'].setShowing( false );
		this.$['accountListBar'].setShowing( true );

		this.$['credentials'].hide();
		this.$['accountList'].show();

		this.resized();

		this.$['progress'].close();
	},

	setupRow: function( inSender, inIndex ) {
		//VirtualList render control

		var row = this.acctList[inIndex];

		if( row ) {

			this.$['accountName'].setContent( row['name'] );
			this.$['accountNote'].setContent( row['itemCount'] + " " + $L( "Transaction" + ( row['itemCount'] > 1 ? "s" : "" ) ) );

			this.$['icon'].setSrc( "source/images/" + row['icon'] );
			this.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 || row['bypass'] ) );

			this.$['accountSelected'].setChecked( row['selectStatus'] );

			return true;
		}
	},

	accountSelectedChanged: function( inSender, inEvent ) {
		//VirtualList checkbox control, keep data synced

		if( this.acctList[inEvent.rowIndex]['acctLocked'] && !this.acctList[inEvent.rowIndex]['bypass'] ) {

				enyo.application.security.authUser(
						this.acctList[inEvent.rowIndex]['name'] + " " + $L( "PIN Code" ),
						this.acctList[inEvent.rowIndex]['lockedCode'],
						{
							"onSuccess": enyo.bind( this, this.authSuccessful, inEvent.rowIndex )
						}
					);
		} else {

			this.acctList[inEvent.rowIndex]['selectStatus'] = !this.acctList[inEvent.rowIndex]['selectStatus'];
		}

		this.$['accounts'].render();
	},

	authSuccessful: function( index ) {

		this.acctList[index]['bypass'] = true;
		this.acctList[index]['selectStatus'] = true;

		this.$['accounts'].render();
	},

	accountListSelectOptions: function( inSender ) {

		this.$['selectMenu'].openAtControl( inSender );
	},

	menuItemClick: function( inSender ) {

		if( inSender.value === 1 ) {
			//All

			for( var i = 0; i < this.acctList.length; i++ ) {

				this.acctList[i]['selectStatus'] = true;
			}
		} else if( inSender.value === 2 ) {
			//None

			for( var i = 0; i < this.acctList.length; i++ ) {

				this.acctList[i]['selectStatus'] = false;
			}
		} else if( inSender.value === 3 ) {
			//Invert

			for( var i = 0; i < this.acctList.length; i++ ) {

				this.acctList[i]['selectStatus'] = !this.acctList[i]['selectStatus'];
			}
		}

		this.$['accounts'].render();
	},

	/** Run export process **/
	beginExportProcess: function() {

		this.$['progress'].load( "Exporting", "Preparing data", 0 );

		this.$['accountListButton'].setDisabled( true );

		try {

			enyo.windows.setWindowProperties( window, { blockScreenTimeout: true } );
		} catch( err ) {

			this.log( "Window Error (Start)", err );
		}

		var accountsToExport = [];

		//find out which are checked, combine into list (comma seps)
		for( var i = 0; i < this.acctList.length; i++ ) {

			if( this.acctList[i]['selectStatus'] === true ) {

				accountsToExport.push( enyo.mixin( { index: i }, this.acctList[i] ) );
			}
		}

		if( accountsToExport.length <= 0 ) {

			this.$['progress'].close();

			this.$['errorMessage'].setErrTitle( "Export Complete" );
			this.showErrorMessage( enyo.bind( this, this.closeExport ), "Nothing to export." );
		} else {

			this.startNewSheet( accountsToExport, 0 );
		}
	},

	startNewSheet: function( accountsToExport, index ) {

		this.$['progress'].setTitle( $L( "Exporting" ) + " " + accountsToExport[index]['name'] );
		this.$['progress'].setMessage( ( index + 1 ) + " of " + accountsToExport.length + "<br />" + $L( "Retrieving transactions" ) );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * 1 / 4 ) / accountsToExport.length ) * 100 );

		//fetch account finance data, use SQL to make each line a CSV
		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect(
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

		this.$['progress'].setMessage( ( index + 1 ) + " of " + accountsToExport.length + "<br />" + $L( "Processing account" ) );
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
										'"' + enyo.json.stringify( enyo.application.transactionManager.parseCategoryDB( row['category'], row['category2'] ) ).replace( /"/g, '""' ) + '",' +
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

		this.$['progress'].setMessage( ( index + 1 ) + " of " + accountsToExport.length + "<br />" + $L( "Uploading data" ) );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * 3 / 4 ) / accountsToExport.length ) * 100 );

		var docTitle = "[" + $L( "Checkbook HD" ) + "] " + uploadData['accountName'] + " [" + uploadData['accountCategory'] + "] [" + Date.format( { date: "short", time: "" } ) + "]";

		this.$['gDataControls'].gdata_upload_file(
				docTitle,
				uploadData['csv'],
				{
					"onSuccess": enyo.bind( this, this.sheetComplete, accountsToExport, index ),
					"onError": enyo.bind( this, this.showErrorMessage, enyo.bind( this, this.showAccountList ) ),
					"timeout": 60
				}
			);
	},

	sheetComplete: function( accountsToExport, index ) {

		this.$['progress'].setMessage( "Account uploaded" );
		this.$['progress'].setProgress( ( ( ( index + 1 ) * 4 / 4 ) / accountsToExport.length ) * 100 );
		//Uncheck item in list

		index++;

		if( index < accountsToExport.length ) {

			this.startNewSheet( accountsToExport, index );
		} else {

			this.$['progress'].close();

			this.$['errorMessage'].setErrTitle( "Export Complete" );
			this.showErrorMessage( enyo.bind( this, this.closeExport ), accountsToExport.length + $L( " account"  + ( accountsToExport.length > 1 ? "s" : "" ) + " exported." ) );
		}
	},

	/** Finisher **/
	closeExport: function() {

		//Reset system
		this.$['credentialsButton'].setDisabled( false );

		this.$['credentials'].show();
		this.$['accountList'].hide();

		try {

			enyo.windows.setWindowProperties( window, { blockScreenTimeout: false } );
		} catch( err ) {

			this.log( "Window Error (End)", err );
		}

		//Close & continue
		this.doFinish();
	},

	/** Error System **/
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
	}
});