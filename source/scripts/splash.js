/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.splash",
	kind: "onyx.Popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	published: {
		firstRun: false
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			name: "headerWrapper",
			kind: "onyx.Toolbar",
			noStretch: true,
			classes: "transparent"
		}, {
			classes: "padding-std light",
			components: [
				{
					name: "message",
					classes: "smaller margin-half-bottom margin-half-top",
					allowHtml: true
				}, {
					name: "splashProgress",
					kind: "onyx.ProgressBar",
					minimum: 0,
					maximum: 100,
					position: 0
				}
			]
		}
	],

	handlers: {
		onShow: "buildHeader"
	},

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		//Setup listing of bound methods
		this._binds = {
			splashCrash: enyo.bind( this, this.splashCrash ),
			checkDB: enyo.bind( this, this.checkDB )
		};

		this.firstRun = false;
		this.headerBuilt = false;
	},

	buildHeader: function() {

		if( !this.headerBuilt ) {

			this.$['headerWrapper'].createComponents(
					[
						{
							name: "spinner",
							kind: "onyx.Spinner",
							classes: "size-half",

							style: "margin: 0 5px 0 0;"
						}, {
							name: "icon",
							kind: "Image",
							src: "assets/status_icons/warning.png",
							style: "margin-right: 5px;",
							showing: false
						}, {
							name: "title",
							classes: "bold"
						}
					], {
						owner: this
					}
				);

			this.$['headerWrapper'].render();

			this.headerBuilt = true;
		}

		this.$['spinner'].show();

		this.checkSystem();

		this.reflow();
	},

	checkSystem: function() {

		this.$['title'].setContent( "Loading Checkbook" );
		this.$['message'].setContent( "Preparing application." );

		this.$['splashProgress'].animateProgressTo( 5 );

		if( !Checkbook.globals ) {

			Checkbook.globals = {};
		}

		if( !Checkbook.globals.gts_db ) {

			Checkbook.globals.gts_db = new GTS.database( getDBArgs() );

			this.log( "Checkbook.globals.gts_db v" + Checkbook.globals.gts_db.getVersion() + " created." );
		}

		if( !Checkbook.globals.prefs ) {

			Checkbook.globals.prefs = {};

			this.log( "creating prefs" );
		}

		this.checkDB();
	},

	checkDB: function() {

		this.log();

		this.$['message'].setContent( "Checking database version..." );
		this.$['splashProgress'].animateProgressTo( 10 );

		Checkbook.globals.gts_db.query(
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
		this.versionCheck = 29;

		if( currVersion == this.versionCheck ) {

			this.$['splashProgress'].animateProgressTo( 75 );

			this.log( "DB up to date, preparing to return" );

			//setup pref object
			Checkbook.globals.prefs['version'] = currVersion;//database version

			Checkbook.globals.prefs['useCode'] = results[0]['useCode'];
			Checkbook.globals.prefs['code'] = results[0]['code'];

			Checkbook.globals.prefs['transPreview'] = results[0]['previewTransaction'];
			Checkbook.globals.prefs['updateCheck'] = results[0]['updateCheck'];//App version
			Checkbook.globals.prefs['updateCheckNotification'] = results[0]['updateCheckNotification'];
			Checkbook.globals.prefs['errorReporting'] = results[0]['errorReporting'];

			Checkbook.globals.prefs['dispColor'] = results[0]['dispColor'];
			Checkbook.globals.prefs['bsSave'] = results[0]['bsSave'];

			Checkbook.globals.prefs['alwaysFullCalendar'] = results[0]['alwaysFullCalendar'];

			Checkbook.globals.prefs['custom_sort'] = results[0]['custom_sort'];

			//Check for recurring updates using the repeating system
			this.$['message'].setContent( "Updating transaction data..." );
			this.$['splashProgress'].animateProgressTo( 85 );
			//this.repeat_updateAll( enyo.bind( this, this.splashFinished ) );

			this.splashFinished();//Temp until repeat system is in place
		} else if( currVersion >= 1 ) {

			this.log( "DB out of date, preparing to update: " + currVersion + " to " + this.versionCheck );

			this.updateDBStructure( currVersion );
		} else {

			this.log( "DB does not exist, preparing to create" );

			this.buildInitialDB();
		}
	},

	splashFinished: function() {

		this.log();

		this.$['splashProgress'].animateProgressTo( 100 );

		//Slight delay to allow for system lag
		enyo.asyncMethod(
				this,
				this.doFinish
			);
	},

	buildInitialDB: function() {

		this.log();

		this.firstRun = true;

		this.$['message'].setContent( "Creating application database..." );
		this.$['splashProgress'].animateProgressTo( 50 );

		var chars = ( "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz" + ( new Date() ).getTime() ).split( "" );

		var spike_length = Math.floor( Math.random() * chars.length ) + 5;//Min length of 5, max of 79

		var key_spike = "";
		for( var i = 0; i < spike_length; i++ ) {

			key_spike += chars[ Math.floor( Math.random() * chars.length ) ];
		}

		var initialStructure = [
					//Drop all potential conflict
					Checkbook.globals.gts_db.getDropTable( "accounts" ),
					Checkbook.globals.gts_db.getDropTable( "accountCategories" ),
					Checkbook.globals.gts_db.getDropTable( "acctTrsnSortOptn" ),

					Checkbook.globals.gts_db.getDropTable( "budgets" ),

					Checkbook.globals.gts_db.getDropTable( "transactions" ),
					Checkbook.globals.gts_db.getDropTable( "expenseCategories" ),
					Checkbook.globals.gts_db.getDropTable( "transactionSplit" ),

					Checkbook.globals.gts_db.getDropTable( "repeats" ),
					Checkbook.globals.gts_db.getDropTable( "prefs" ),

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

		Checkbook.globals.gts_db.setSchema(
				initialStructure,
				{
					"onSuccess": this._binds['checkDB'],
					"onError": this._binds['splashCrash']
				}
			);
	},

	updateDBStructure: function( currVersion ) {

		this.log();

		this.$['message'].setContent( "Updating database..." );
		this.$['splashProgress'].animateProgressTo( 50 );

		var querySet = [];
		var updateOptions = {
					"onSuccess": this._binds['checkDB'],
					"onError": this._binds['splashCrash']
				};

		//If system needs to run an external function, override updateOptions['onSuccess']
			//Optionally break early to force this.versionCheck to not be max version, will force another db update

		switch( currVersion ) {
			case 15:
				// webOS updated acct cats
				querySet.push( "ALTER TABLE accounts ADD COLUMN auto_savings INTEGER NOT NULL DEFAULT 0;" );// OPTIONS: +1$, +remainder of dollar, none
				querySet.push( "ALTER TABLE accounts ADD COLUMN auto_savings_link INTEGER NOT NULL DEFAULT 0;" );// Linked account

				querySet.push( "DROP TABLE IF EXISTS repeats;" );
				querySet.push( "CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, frequency TEXT, daysOfWeek TEXT, itemSpan INTEGER, endingCondition TEXT, endDate TEXT, endCount INTEGER, currCout INTEGER, origDate TEXT, lastOccurance TEXT, desc TEXT, amount REAL, note TEXT, category TEXT, acctId INTEGER, linkedAcctId INTEGER );" );

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

				this.versionCheck = 19;
			case 19:
				querySet.push( "ALTER TABLE prefs ADD COLUMN previewTransaction INTEGER NOT NULL DEFAULT 1;" );

				this.versionCheck = 20;
			case 20:
				//Add secondary trans cat to budget system
				querySet.push( "ALTER TABLE budgets ADD COLUMN category2 TEXT;" );

				this.versionCheck = 21;
			case 21:
				querySet.push(
						Checkbook.globals.gts_db.getUpdate(
								"acctTrsnSortOptn",
								{
									"qry": "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM transactions LIMIT 1 ) ) ASC, itemId ASC"
								},
								{
									"sortId": 9
								}
							)
					);

				this.versionCheck = 22;
			case 22:
				//Repeat System (ignore cleared, checknum)
				querySet.push( "DROP TABLE IF EXISTS repeats;" );
				querySet.push( "CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, frequency TEXT, daysOfWeek TEXT, itemSpan INTEGER, endingCondition TEXT, endDate TEXT, endCount INTEGER, currCount INTEGER, origDate TEXT, lastOccurrence TEXT, rep_desc TEXT, rep_amount REAL, rep_note TEXT, rep_category TEXT, rep_acctId INTEGER, rep_linkedAcctId INTEGER, rep_autoTrsnLink INTEGER, lastUpdated TEXT, last_sync TEXT );" );

				this.versionCheck = 23;
			case 23:
				//Remove set passwords (encryption system changed)
				querySet.push(
						Checkbook.globals.gts_db.getUpdate(
								"accounts",
								{
									"acctLocked": 0,
									"lockedCode": ""
								},
								{}
							)
					);
				querySet.push(
						Checkbook.globals.gts_db.getUpdate(
								"prefs",
								{
									"useCode": 0,
									"code": "",
									"saveGSheetsData": 0,
									"gSheetUser": "depreciated",
									"gSheetPass": "",
								},
								{}
							)
					);

				this.versionCheck = 24;
			case 24:
				//Payee field option
				querySet.push( "ALTER TABLE accounts ADD COLUMN payeeField INTEGER NOT NULL DEFAULT 0;" );
				querySet.push( "ALTER TABLE transactions ADD COLUMN payee TEXT;" );

				this.versionCheck = 25;
			case 25:
				querySet.push( "ALTER TABLE transactions RENAME TO expenses;" );
				querySet.push( "ALTER TABLE transactionCategories RENAME TO expenseCategories;" );

				this.versionCheck = 26;
			case 26:
				querySet.push( "ALTER TABLE expenses RENAME TO transactions;" );
				querySet.push( "ALTER TABLE expenseCategories RENAME TO transactionCategories;" );

				this.versionCheck = 27;
			case 27:
				querySet.push( "ALTER TABLE prefs ADD COLUMN alwaysFullCalendar INTEGER NOT NULL DEFAULT 0;" );

				this.versionCheck = 28;
			case 28:
				querySet.push( "ALTER TABLE repeats ADD COLUMN terminated INTEGER NOT NULL DEFAULT 0;" );

				this.versionCheck = 29;
			case 28:
				//GTS Sync System
				//querySet.push( "DROP TABLE IF EXISTS syncQueue;" );
				//querySet.push( "CREATE TABLE syncQueue( syncId INTEGER PRIMARY KEY ASC, action TEXT, table TEXT, data TEXT, where TEXT, ts INTEGER, sourceTable TEXT, sourceId INTEGER );" );

				//this.versionCheck = ??;
		}

		querySet.push(
				Checkbook.globals.gts_db.getUpdate(
						"prefs",
						{
							"dbVer": this.versionCheck
						},
						{}
					)
			);

		Checkbook.globals.gts_db.queries(
				querySet,
				updateOptions
			);
	},

	splashCrash: function( errorObj ) {

		this.error( arguments );

		this.$['splashProgress'].hide();
		this.$['spinner'].hide();
		this.$['icon'].show();

		this.$['title'].setContent( "Checkbook Load Error" );
		this.$['message'].setContent(
				"Checkbook has failed to load." + "<br />" +
				"Please contact <a href='mailto:glitchtechscience@gmail.com'>GlitchTech Science</a> for assistant with the following error:" + "<br />" + "<br />" +
				"Code: " + errorObj['code'] + "<br />" +
				"Message: " + errorObj['message']
			);
	}
});
