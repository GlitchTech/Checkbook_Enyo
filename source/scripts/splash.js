/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

enyo.kind({

	name: "Checkbook.splash",
	kind: enyo.ModalDialog,

	scrim: true,
	modal: true,
	dismissWithClick: false,

	published: {
		firstRun: false
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			layoutKind: enyo.VFlexLayout,
			pack: "center",
			components: [
				{
					layoutKind: enyo.HFlexLayout,
					pack: "start",
					components: [
						{
							kind: enyo.Spinner,
							style: "margin-right: 5px;",
							showing: true
						}, {
							name: "icon",
							kind: "Image",
							src: "source/images/warning-icon.png",
							style: "margin-right: 5px;",
							showing: false
						}, {
							name: "title",
							className: "bold"
						}
					]
				}, {
					name: "message",
					className: "smaller medium-margin-bottom",
					allowHtml: true
				}, {
					name: "splashProgress",
					kind: enyo.ProgressBar,
					minimum: 0,
					maximum: 100,
					position: 0
				}
			]
		}
	],

	create: function() {

		this.inherited( arguments );

		this.log();

		//Setup listing of bound methods
		this._binds = {
			splashCrash: enyo.bind( this, this.splashCrash ),
			checkDB: enyo.bind( this, this.checkDB )
		};
	},

	rendered: function() {

		this.inherited( arguments );

		this.log();

		this.$['title'].setContent( $L( "Loading Checkbook" ) );

		this.firstRun = false;

		this.checkSystem();
	},

	checkSystem: function() {

		this.log();

		this.$['message'].setContent( $L( "Preparing application." ) );
		this.$['splashProgress'].setPosition( 5 );

		if( !enyo.application.gts_db ) {

			this.log( "creating database object" );

			var db = new GTS.database( dbArgs );
		}

		if( !enyo.application.checkbookPrefs ) {

			this.log( "creating checkbookPrefs{}" );

			enyo.application.checkbookPrefs = {};
		}

		if( !enyo.application.Metrix ) {

			this.log( "setting up Metrix" );

			enyo.application.Metrix = new Metrix();
		}

		this.checkDB();
	},

	checkDB: function() {

		this.log();

		this.$['message'].setContent( $L( "Checking database version..." ) );
		this.$['splashProgress'].setPosition( 10 );

		enyo.application.gts_db.query(
				"SELECT * FROM prefs LIMIT 1;",
				{
					"onSuccess": enyo.bind( this, this.checkDBSuccess ),
					"onError": enyo.bind( this, this.buildInitialDB )
				}
			);
	},

	checkDBSuccess: function( results ) {

		//User data version
		var currVersion = -1;
		if( results.length > 0 && results[0]['dbVer'] && results[0]['dbVer'] !== "undefined" ) {

			currVersion = results[0]['dbVer'];
		}

		//DB Version
		this.versionCheck = 21;

		if( currVersion === this.versionCheck ) {

			this.$['splashProgress'].setPosition( 75 );

			this.log( "DB up to date, preparing to return" );

			//setup pref object
			enyo.application.checkbookPrefs['version'] = currVersion;//database version

			enyo.application.checkbookPrefs['useCode'] = results[0]['useCode'];
			enyo.application.checkbookPrefs['code'] = results[0]['code'];

			enyo.application.checkbookPrefs['transPreview'] = results[0]['previewTransaction'];
			enyo.application.checkbookPrefs['updateCheck'] = results[0]['updateCheck'];//App version
			enyo.application.checkbookPrefs['updateCheckNotification'] = results[0]['updateCheckNotification'];
			enyo.application.checkbookPrefs['errorReporting'] = results[0]['errorReporting'];

			enyo.application.checkbookPrefs['dispColor'] = results[0]['dispColor'];
			enyo.application.checkbookPrefs['bsSave'] = results[0]['bsSave'];

			enyo.application.checkbookPrefs['custom_sort'] = results[0]['custom_sort'];

			if( enyo.fetchDeviceInfo() && enyo.isString( enyo.fetchDeviceInfo().serialNumber ) ) {

				enyo.application.checkbookPrefs['nduid'] = enyo.fetchDeviceInfo().serialNumber;
			} else {

				enyo.application.checkbookPrefs['nduid'] = "xxxxxxxxxx";
			}

			//Check for recurring updates using the repeating system
			this.$['message'].setContent( $L( "Updating transaction data..." ) );
			this.$['splashProgress'].setPosition( 85 );
			//this.repeat_updateAll( enyo.bind( this, this.splashFinished ) );

			this.splashFinished();//Temp until repeat system is in place
		} else if( currVersion >= 1 ) {

			this.log( "DB out of date, preparing to update" );

			this.updateDBStructure( currVersion );
		} else {

			this.log( "DB does not exist, preparing to create" );

			this.buildInitialDB();
		}
	},

	splashFinished: function() {

		this.log();

		this.$['splashProgress'].setPosition( 100 );

		//Slight delay to allow for system lag
		enyo.asyncMethod( this, function() {

				this.doFinish();
			});
	},

	buildInitialDB: function() {

		this.log();

		this.firstRun = true;

		this.$['message'].setContent( $L( "Creating application database..." ) );
		this.$['splashProgress'].setPosition( 50 );

		var chars = ( "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz" + ( new Date() ).getTime() ).split( "" );

		var spike_length = Math.floor( Math.random() * chars.length ) + 5;//Min length of 5, max of 79

		var key_spike = "";
		for( var i = 0; i < spike_length; i++ ) {

			key_spike += chars[ Math.floor( Math.random() * chars.length ) ];
		}

		var initialStructure = [
					//Drop all potential conflict
					enyo.application.gts_db.getDropTable( "accounts" ),
					enyo.application.gts_db.getDropTable( "accountCategories" ),
					enyo.application.gts_db.getDropTable( "acctTrsnSortOptn" ),

					enyo.application.gts_db.getDropTable( "budgets" ),

					enyo.application.gts_db.getDropTable( "transactions" ),
					enyo.application.gts_db.getDropTable( "expenseCategories" ),
					enyo.application.gts_db.getDropTable( "transactionSplit" ),

					enyo.application.gts_db.getDropTable( "repeats" ),
					enyo.application.gts_db.getDropTable( "prefs" ),

					//Build new structure
					{
						"table": "accounts",
						"columns": [
							{
								"column": "acctId",
								"type": "INTEGER",
								"constraints": [
									"UNIQUE",
									"PRIMARY KEY ASC"
								]
							}, {
								"column": "acctName",
								"type": "TEXT"
							}, {
								"column": "acctNotes",
								"type": "TEXT"
							}, {
								"column": "acctCategory",
								"type": "TEXT"
							}, {
								"column": "sort",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "defaultAccount",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "frozen",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "hidden",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "acctLocked",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "lockedCode",
								"type": "TEXT"
							}, {
								"column": "transDescMultiLine",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "showTransTime",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "useAutoComplete",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "atmEntry",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "bal_view",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "runningBalance",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "checkField",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "hideNotes",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "enableCategories",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "sect_order",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "hide_cleared",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "last_sync",
								"type": "TEXT"
							}, {
								"column": "auto_savings",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "auto_savings_link",
								"type": "INTEGER NOT NULL DEFAULT -1"
							}
						],
						"data": []
					}, {
						"table": "accountCategories",
						"columns": [
							{
								"column": "name",
								"type": "TEXT"
							}, {
								"column": "catOrder",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "icon",
								"type": "TEXT"
							}, {
								"column": "color",
								"type": " NOT NULL DEFAULT \"green\""
							}, {
								"column": "view_status",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "last_sync",
								"type": "TEXT"
							}
						],
						"data": defaultAccountCategories
					}, {
						"table": "acctTrsnSortOptn",
						"columns": [
							{
								"column": "sortId",
								"type": "INTEGER",
								"constraints": [
									"UNIQUE",
									"PRIMARY KEY ASC"
								]
							}, {
								"column": "label",
								"type": "TEXT"
							}, {
								"column": "sortGroup",
								"type": "TEXT"
							}, {
								"column": "groupOrder",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "desc",
								"type": "TEXT"
							}, {
								"column": "qry",
								"type": "TEXT"
							}
						],
						"data": defaultAcctTrsnSortOptn
					}, {
						"table": "transactions",
						"columns": [
							{
								"column": "itemId",
								"type": "INTEGER",
								"constraints": [
									"UNIQUE",
									"PRIMARY KEY ASC"
								]
							}, {
								"column": "account",
								"type": "INTEGER",
								"constraints": [//FK to account table
									"REFERENCES accounts( acctId )",
									"ON UPDATE CASCADE",
									"ON DELETE CASCADE"
								]
							}, {
								"column": "linkedRecord",
								"type": "INTEGER"
							}, {
								"column": "linkedAccount",
								"type": "INTEGER",
								"constraints": [//FK to account table
									"REFERENCES accounts( acctId )",
									"ON UPDATE CASCADE",
									"ON DELETE SET NULL"
								]
							}, {
								"column": "desc",
								"type": "TEXT"
							}, {
								"column": "amount",
								"type": "NUMERIC"
							}, {
								"column": "note",
								"type": "TEXT"
							}, {
								"column": "date",
								"type": "TEXT"
							}, {
								"column": "category",
								"type": "TEXT"
							}, {
								"column": "category2",
								"type": "TEXT"
							}, {
								"column": "cleared",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "checkNum",
								"type": "TEXT"
							}, {
								"column": "atSource",
								"type": "INTEGER"
							}, {
								"column": "last_sync",
								"type": "TEXT"
							}, {
								"column": "repeatId",
								"type": "INTEGER",
								"constraints": [//FK to repeats table
									"REFERENCES repeats( repeatId )",
									"ON UPDATE CASCADE",
									"ON DELETE SET NULL",
									"DEFERRABLE INITIALLY DEFERRED"
								]
							}, {
								"column": "repeatUnlinked",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}
						],
						"data": []
					}, {
						"table": "transactionCategories",
						"columns": [
							{
								"column": "catId",
								"type": "INTEGER",
								"constraints": [
									"UNIQUE",
									"PRIMARY KEY ASC"
								]
							}, {
								"column": "genCat",
								"type": "TEXT"
							}, {
								"column": "specCat",
								"type": "TEXT"
							}, {
								"column": "last_sync",
								"type": "TEXT"
							}
						],
						"data": defaultExpenseCategories
					}, {
						"table": "transactionSplit",
						"columns": [
							{
								"column": "tsId",
								"type": "INTEGER",
								"constraints": [
									"UNIQUE",
									"PRIMARY KEY ASC"
								]
							}, {
								"column": "transId",
								"type": "INTEGER",
								"constraints": [//FK to transactions table
									"REFERENCES transactions( itemId )",
									"ON UPDATE CASCADE",
									"ON DELETE CASCADE",
									"DEFERRABLE INITIALLY DEFERRED"
								]
							}, {
								"column": "genCat",
								"type": "TEXT"
							}, {
								"column": "specCat",
								"type": "TEXT"
							}, {
								"column": "amount",
								"type": "NUMERIC"
							}, {
								"column": "last_sync",
								"type": "TEXT"
							}
						],
						"data": []
					}, {
						"table": "repeats",
						"columns": [
							{
								"column": "repeatId",
								"type": "INTEGER PRIMARY KEY ASC"
							}, {
								"column": "frequency",
								"type": "TEXT"
							}, {
								"column": "daysOfWeek",
								"type": "TEXT"
							}, {
								"column": "itemSpan",
								"type": "INTEGER"
							}, {
								"column": "endingCondition",
								"type": "TEXT"
							}, {
								"column": "endDate",
								"type": "TEXT"
							}, {
								"column": "endCount",
								"type": "INTEGER"
							}, {
								"column": "currCout",
								"type": "INTEGER"
							}, {
								"column": "origDate",
								"type": "TEXT"
							}, {
								"column": "lastOccurance",
								"type": "TEXT"
							}, {
								"column": "last_sync",
								"type": "TEXT"
							}, {
								"column": "desc",
								"type": "TEXT"
							}, {
								"column": "amount",
								"type": "NUMERIC"
							}, {
								"column": "note",
								"type": "TEXT"
							}, {
								"column": "category",
								"type": "TEXT"
							}, {
								"column": "acctId",
								"type": "INTEGER",
								"constraints": [//FK to account table
									"REFERENCES accounts( acctId )",
									"ON UPDATE CASCADE",
									"ON DELETE CASCADE"
								]
							}, {
								"column": "linkedAcctId",
								"type": "INTEGER",
								"constraints": [//FK to account table
									"REFERENCES accounts( acctId )",
									"ON UPDATE CASCADE",
									"ON DELETE SET NULL"
								]
							}, {
								"column": "autoTrsnLink",
								"type": "INTEGER"
							}
						],
						"data": []
					}, {
						"table": "budgets",
						"columns": [
							{
								"column": "budgetId",
								"type": "INTEGER",
								"constraints": [
									"UNIQUE",
									"PRIMARY KEY ASC"
								]
							}, {
								"column": "category",
								"type": "TEXT"
							}, {
								"column": "spending_limit",
								"type": "NUMERIC"
							}, {
								"column": "span",
								"type": "INTEGER"
							}, {
								"column": "rollOver",
								"type": "INTEGER"
							}, {
								"column": "budgetOrder",
								"type": "INTEGER"
							}
						],
						"data": []
					}, {
						"table": "prefs",
						"columns": [
							{
								"column": "dbVer",
								"type": "INTEGER"
							}, {
								"column": "useCode",
								"type": "INTEGER"
							}, {
								"column": "code",
								"type": "TEXT"
							}, {
								"column": "saveGSheetsData",
								"type": "INTEGER"
							}, {
								"column": "gSheetUser",
								"type": "TEXT"
							}, {
								"column": "gSheetPass",
								"type": "TEXT"
							}, {
								"column": "repeatUpdate",
								"type": "TEXT"
							}, {
								"column": "updateCheck",
								"type": "TEXT"
							}, {
								"column": "synergyAcctId",
								"type": "TEXT"
							}, {
								"column": "synergyCalId",
								"type": "TEXT"
							}, {
								"column": "updateCheckNotification",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "dispColor",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "bsSave",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}, {
								"column": "custom_sort",
								"type": "INTEGER NOT NULL DEFAULT 0"
							}, {
								"column": "gts_name",
								"type": "TEXT"
							}, {
								"column": "gts_pass",
								"type": "TEXT"
							}, {
								"column": "gts_last_connection",
								"type": "TEXT"
							}, {
								"column": "spike",
								"type": "TEXT"
							}, {
								"column": "errorReporting",
								"type": "INTEGER NOT NULL DEFAULT 1"
							}
						],
						"data": [
							{
								"dbVer": 19,
								"useCode": 0,
								"saveGSheetsData": 0,
								"spike": key_spike
							}
						]
					}
				];

		enyo.application.gts_db.setSchema(
				initialStructure,
				{
					"onSuccess": this._binds['checkDB'],
					"onError": this._binds['splashCrash']
				}
			);
	},

	updateDBStructure: function( currVersion ) {

		this.log();

		this.$['message'].setContent( $L( "Updating database..." ) );
		this.$['splashProgress'].setPosition( 50 );

		var querySet = [];
		var updateOptions = {
					"onSuccess": this._binds['checkDB'],
					"onError": this._binds['splashCrash']
				};

		//If system needs to run an external function, override updateOptions['onSuccess']
			//Optionally break early to force this.versionCheck to not be max version, will force another db update

		switch( currVersion ) {
			case 16:
				querySet.push( "ALTER TABLE expenses ADD COLUMN repeatUnlinked INTEGER NOT NULL DEFAULT 0;" );

				this.versionCheck = 17;
			case 17:
				querySet.push( "ALTER TABLE prefs ADD COLUMN errorReporting INTEGER NOT NULL DEFAULT 1;" );
				querySet.push( "ALTER TABLE expenses ADD COLUMN atSource INTEGER;" );
				querySet.push( "UPDATE accounts SET auto_savings_link = -1;" );

				this.versionCheck = 18;
			case 18:
				//Rename table
				querySet.push( "ALTER TABLE expenses RENAME TO transactions;" );
				querySet.push( "ALTER TABLE expenseCategories RENAME TO transactionCategories;" );

				//Split Transaction System
				querySet.push( "DROP TABLE IF EXISTS transactionSplit;" );
				querySet.push( "CREATE TABLE transactionSplit( transId INTEGER, genCat TEXT, specCat TEXT, amount REAL, last_sync TEXT );" );

				//Add secondary trans cat to system
				querySet.push( "ALTER TABLE transactions ADD COLUMN category2 TEXT;" );

				//Repeat System (ignore cleared, checknum)
				querySet.push( "DROP TABLE IF EXISTS repeats;" );
				querySet.push( "CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, frequency TEXT, daysOfWeek TEXT, itemSpan INTEGER, endingCondition TEXT, endDate TEXT, endCount INTEGER, currCout INTEGER, origDate TEXT, lastOccurance TEXT, last_sync TEXT, desc TEXT, amount REAL, note TEXT, category TEXT, acctId INTEGER, linkedAcctId INTEGER, autoTrsnLink INTEGER );" );

				this.versionCheck = 19;
			case 19:
				querySet.push( "ALTER TABLE prefs ADD COLUMN previewTransaction INTEGER NOT NULL DEFAULT 1;" );

				this.versionCheck = 20;
			case 20:
				querySet.push(
						enyo.application.gts_db.getUpdate(
								"acctTrsnSortOptn",
								{
									"qry": "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM transactions LIMIT 1 ) ) ASC, itemId ASC"
								},
								{
									"sortId": 9
								}
							)
					);

				//Add secondary trans cat to budget system
				querySet.push( "ALTER TABLE budgets ADD COLUMN category2 TEXT;" );

				this.versionCheck = 21;
			case 21:
				//GTS Sync System
				//querySet.push( "DROP TABLE IF EXISTS syncQueue;" );
				//querySet.push( "CREATE TABLE syncQueue( syncId INTEGER PRIMARY KEY ASC, action TEXT, table TEXT, data TEXT, where TEXT, ts INTEGER );" );

				//this.versionCheck = 22;
			case 22:
				//this.versionCheck = 23;
		}

		querySet.push(
				enyo.application.gts_db.getUpdate(
						"prefs",
						{
							"dbVer": this.versionCheck
						},
						{}
					)
			);

		enyo.application.gts_db.queries(
				querySet,
				updateOptions
			);
	},

	splashCrash: function( errorObj ) {

		this.error( arguments );

		this.$['splashProgress'].setShowing( false );
		this.$.spinner.setShowing( false );
		this.$['icon'].setShowing( true );

		this.$['title'].setContent( $L( "Checkbook Load Error" ) );
		this.$['message'].setContent(
				$L( "Checkbook has failed to load." ) + "<br />" +
				$L( "Please contact <a href='mailto:glitchtechscience@gmail.com'>GlitchTech Science</a> for assistant with the following error:" ) + "<br />" + "<br />" +
				"Code: " + errorObj['code'] + "<br />" +
				"Message: " + errorObj['message']
			);
	}
});