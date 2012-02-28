/* Copyright © 2011, GlitchTech Science */

enyo.kind({

	name: "Checkbook.app",
	kind: enyo.VFlexBox,

	components: [
		{
			name: "container",
			kind: enyo.Pane,
			transitionKind: "enyo.transitions.Fade",
			flex: 1,
			components: [
				{
					name: "mainPane",
					kind: enyo.SlidingPane,

					flex: 1,
					showing: false,

					components: [
						{
							name: "accounts",
							kind: "Checkbook.accounts.view",
							flex: 1,

							onModify: "showPanePopup",
							onChanged: "accoutChanged",
							onDelete: "accoutDeleted",

							onView: "updateTransactionsView"
						}, {
							name: "transactions",
							kind: "Checkbook.transactions.view",
							flex: 2,

							onModify: "showPanePopup",
							onChanged: "accountBalanceChanged",
							onBalanceViewChanged: "tranasactionBalanceViewChanged",

							onBudgetView: "openBudget",
							onSearchView: "openSearch"
						}
					]
				}
			]
		}, {
			name: "appMenu",
			kind: enyo.AppMenu,
			scrim: true,
			components: [
				{
					caption: $L( "Preferences & Data" ),
					components: [
						{
							name: "prefsMenuItem",
							caption: $L( "Preferences & Accounts" ),
							onclick: "openPreferences"
						}, {
							caption: $L( "Import Data" ),
							onclick: "openImport"
						}, {
							caption: $L( "Export Data" ),
							onclick: "openExport"
						}
					]
				}, {
					caption: $L( "Finance Information" ),
					components: [
						{
							caption: $L( "Search" ),
							onclick: "openSearch"
						}, {
							caption: $L( "Budget" ),
							onclick: "openBudget"
						}, {
							showing: false,
							caption: $L( "Reports" ),
							onclick: "openReports"
						}
					]
				}, {
					caption: $L( "Show Notices" ),
					onclick: "forceShowMetrix"
				}, {
					showing: false,
					caption: $L( "Report Bug" ),
					onclick: "errorReport"
				}, {
					caption: $L( "About" ),
					onclick: "showPopup",
					popup: "about"
				}
			]
		}, {
			name: "about",
			kind: "Checkbook.about",
			onClose: "closePopup"
		}, {
			name: "splash",
			kind: "Checkbook.splash",
			onFinish: "splashFinisher"
		},

		{
			name: "criticalError",
			kind: "GTS.system_error",

			errTitle: "~|p2t|~",
			errMessage: "",
			errMessage2: "~|mt|~" ,
			onFinish: "closePopup"
		},

		{
			name: "security",
			kind: "Checkbook.login"
		},

		{
			kind: enyo.ApplicationEvents,
			onBack: "goBack"
		}
	],

	paneStack: [],

	/** Application Events **/

	backHandler: function( inSender, inEvent ) {

		//this.$.slidingPane.back( inEvent );
		//
		inEvent.stopPropagation();
		return -1;
	},

	/** Splash Controls **/

	rendered: function() {

		this.inherited( arguments );

		this.log();

		//Load splash popup. Verifies database.
		this.$['splash'].openAtCenter();
		this.$['appMenu'].setAutomatic( false );
	},

	splashFinisher: function() {

		this.log();

		this.notificationType = !this.$['splash'].getFirstRun();

		//Close & remove splash system. Not used again
		this.$['splash'].close();
		this.$['splash'].destroy();

		enyo.application.security = this.$['security'];

		if( enyo.application.checkbookPrefs['useCode'] != 0 ) {
			//App Locked

			enyo.application.security.authUser(
					$L( "Main Program PIN Code" ),
					enyo.application.checkbookPrefs['code'],
					{
						"onSuccess": enyo.bind( this, this.loadCheckbook ),
						"onFailure": enyo.bind( this, this.appAuthFailure )
					}
				);
		} else {

			this.loadCheckbook();
		}
	},

	appAuthFailure: function() {

		this.log( "App Auth Failure" );

		//close app
		window.close();
	},

	/** Data Launch Controls **/

	loadCheckbook: function() {

		this.$['mainPane'].setShowing( true );
		this.$['appMenu'].setAutomatic( true );

		enyo.application.criticalError = this.$['criticalError'];
		enyo.application.accountManager = new Checkbook.accounts.manager();
		enyo.application.transactionManager = new Checkbook.transactions.manager();
		enyo.application.transactionCategoryManager = new Checkbook.transactionCategory.manager();

		//Metrix Work
		enyo.application.Metrix.postDeviceData();

		enyo.nextTick(
				this,
				this.loadCheckbookStage2
			);
	},

	loadCheckbookStage2: function() {

		enyo.application.accountManager.fetchDefaultAccount( { "onSuccess": enyo.bind( this, this.loadCheckbookStage3 ) } );
	},

	loadCheckbookStage3: function( result ) {

		if( result ) {

			if( result['acctLocked'] === 1 ) {
				//System security

				enyo.application.security.authUser(
						result['acctName'] + " " + $L( "PIN Code" ),
						result['lockedCode'],
						{
							"onSuccess": enyo.bind( this, this.updateTransactionsView, null, result )
						}
					);
			} else {

				this.updateTransactionsView( null, result );
			}
		}

		this.$['accounts'].renderAccountList();

		if( this.notificationType === true && enyo.application.checkbookPrefs['updateCheckNotification'] == 1 ) {

			enyo.application.Metrix.checkBulletinBoard( 1, false );//Min bulletin version (int), force review (boolean)
		} else if( this.notificationType === false ) {
			//First run notice

			enyo.application.criticalError.load(
					"Welcome to " + enyo.fetchAppInfo()['title'],
					"If you have any questions, visit <a href='" + enyo.fetchAppInfo()['vendorurl'] + "'>" + enyo.fetchAppInfo()['vendorurl'] + "</a> or email <a href='mailto:" + enyo.fetchAppInfo()['vendoremail'] + "?subject=" + enyo.fetchAppInfo()['title'] + " Support'>" + enyo.fetchAppInfo()['vendoremail'] + "</a>.",
					"",
					"source/images/icon_1_32x32.png"
				);

			enyo.asyncMethod(
					enyo.application.criticalError,
					enyo.application.criticalError.set,
					"~|p2t|~",
					"",
					"~|mt|~",
					"source/images/warning-icon.png"
				);
		}
	},

	/** PopUp Controls **/

	showPopup: function( inSender ) {

		this.log( inSender.popup );

		//LoD? Does Lazy cut it?

		var popup = this.$[inSender.popup];

		if( popup ) {

			this.$['appMenu'].setAutomatic( false );
			popup.openAtCenter();
		}
	},

	closePopup: function( inSender ) {

		this.$['appMenu'].setAutomatic( true );
		inSender.close();
	},

	forceShowMetrix: function() {

		enyo.application.Metrix.checkBulletinBoard( 1, true );
	},

	errorReport: function() {

		console.log( "ERROR REPORT SYSTEM GO" );
	},

	/** PopUp Pane Controls **/

	showPanePopup: function( inSender, inPaneArgs ) {

		var paneArgs = enyo.mixin(
				inPaneArgs,
				{
					name: ( enyo.isString( inPaneArgs['name'] ) ? inPaneArgs['name'] : "panePopup" ),
					flex: 1,
					onFinish: "hidePanePopup",
					onFinishFollower: ( enyo.isFunction( inPaneArgs['onFinish'] ) ? inPaneArgs['onFinish'] : null )
				}
			);

		this.createComponent( paneArgs );

		//Display new pane
		this.$['appMenu'].setAutomatic( false );
		this.$[paneArgs['name']].render();
		this.$['container'].selectView( this.$[paneArgs['name']] );

		//Add new pane to the display stack
		this.paneStack.push( paneArgs['name'] );
	},

	hidePanePopup: function( inSender ) {

		//If a prevous callback existed, call it with any arguments applied
		if( enyo.isFunction( inSender.onFinishFollower ) ) {

			inSender.onFinishFollower.apply( null, arguments );
		}

		//Remove pane from the display stack
		this.paneStack.splice( this.paneStack.indexOf( inSender['name'] ), 1 );

		//Destroy the pane
		inSender.destroy();

		//Determine proper view to show
		var len = this.paneStack.length;

		if( len > 0 ) {

			//show last item in stack
			this.$['container'].selectView( this.$[this.paneStack[len - 1]] );
		} else {

			//show base view
			this.$['appMenu'].setAutomatic( true );
			this.$['container'].selectView( this.$['mainPane'] );
		}
	},

	/** Checkbook.Import && Checkbook.Export **/

	openExport: function( inSender, inEvent ) {

		this.showPanePopup(
				null,
				{
					name: "export",
					kind: "Checkbook.export"
				}
			);
	},

	openImport: function( inSender, inEvent ) {

		this.showPanePopup(
				null,
				{
					name: "import",
					kind: "Checkbook.import",
					onFinish: "importComplete"
				}
			);
	},

	importComplete: function( inSender, importStatus ) {

		this.$['appMenu'].setAutomatic( true );

		if( importStatus === true ) {

			this.$['transactions'].reloadSystem();

			this.notificationType = null;

			enyo.nextTick(
					this,
					this.loadCheckbookStage2
				);
		}
	},

	/** Checkbook.budget.* **/

	openBudget: function( inSender, inEvent, args ) {

		var budgetArgs = enyo.mixin(
				{
					name: "budget",
					kind: "Checkbook.budget.view",
					onSearchView: "openSearch"
				},
				args
			);

		this.showPanePopup(
				null,
				budgetArgs
			);
	},

	/** Checkbook.search **/

	openSearch: function( inSender, inEvent, args ) {

		var searchArgs = enyo.mixin(
				args,
				{
					name: "search",
					kind: "Checkbook.search.pane",
					onModify: "showPanePopup",
					onFinish: enyo.bind(
							this,
							this.closeSearch
						),
					doNext: ( args && enyo.isFunction( args['onFinish'] ) ? args['onFinish'] : null )
				}
			);

		this.showPanePopup(
				null,
				searchArgs
			);
	},

	closeSearch: function( inSender, changesMade ) {

		if( changesMade === true ) {
			//Update account and transaction information

			enyo.application.accountManager.updateAccountModTime();
			this.$['accounts'].renderAccountList();
			this.$['transactions'].reloadSystem();
		}

		//If a prevous callback existed, call it with any arguments applied
		if( enyo.isFunction( inSender.doNext ) ) {

			inSender.doNext( changesMade );
		}
	},

	/** Checkbook.preferences && ( Checkbook.preferences --> Checkbook.accounts.view ) Communication Channels **/

	openPreferences: function() {

		this.showPanePopup(
				null,
				{
					name: "preferences",
					kind: "Checkbook.preferences",
					//onFinish: "closePopup",

					//Account Controls
					onModify: "showPanePopup",
					onChanged: "prefAccoutChanged",
					onDelete: "prefAccoutDeleted"
				}
			);
	},

	prefAccoutChanged: function() {

		this.$['accounts'].renderAccountList();

		if( arguments.length > 1 ) {
			//Needs to have more than inSender

			this.accoutChanged.apply( this, arguments );
		}
	},

	prefAccoutDeleted: function() {

		this.log( "Update account list", arguments );

		this.$['accounts'].renderAccountList();
		this.accoutDeleted.apply( this, arguments );
	},

	/** ( Checkbook.accounts.view --> Checkbook.transactions.view ) Communication Channels **/

	updateTransactionsView: function( inSender, account ) {

		this.$['transactions'].changeAccount( account );
	},

	accoutChanged: function( inSender, result ) {

		if( this.$['transactions'].getAccountId() === result['acctId'] ) {

			this.$['transactions'].changeAccount( result, true );
		}
	},

	accoutDeleted: function( inSender, accountId ) {

		if( this.$['transactions'].getAccountId() == accountId ) {

			this.$['transactions'].unloadSystem();
		} else {

			this.$['transactions'].reloadSystem();
		}
	},

	/** ( Checkbook.transactions.view --> Checkbook.accounts.view ) Communication Channels **/

	tranasactionBalanceViewChanged: function( inSender, index, id, mode ) {

		this.$['accounts'].accountBalanceViewChanged(
				index,
				id,
				mode,
				enyo.bind(
						this.$['transactions'],
						this.$['transactions'].setAccountIndex
					)
			);
	},

	accountBalanceChanged: function( inSender, accts, deltaBalanceArr ) {

		this.log( Object.toJSON( accts ) );

		var acctIndex = accts['account'] >= 0 ? enyo.application.accountManager.fetchAccountIndex( accts['account'] ) : - 1;

		if( acctIndex >= 0 ) {

			if( accts['accountBal'].length > 0 ) {

				this.$['accounts'].accountBalanceChanged(
						acctIndex,
						accts['accountBal']
					);
			} else {

				enyo.application.accountManager.fetchAccountBalance( accts['account'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['account'], acctIndex ) } );
			}
		}

		var linkedIndex = accts['linkedAccount'] >= 0 ? enyo.application.accountManager.fetchAccountIndex( accts['linkedAccount'] ) : - 1;

		if( linkedIndex >= 0 ) {

			enyo.application.accountManager.fetchAccountBalance( accts['linkedAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['linkedAccount'], linkedIndex ) } );
		}

		var atIndex = accts['atAccount'] >= 0 ? enyo.application.accountManager.fetchAccountIndex( accts['atAccount'] ) : - 1;

		if( atIndex >= 0 ) {

			enyo.application.accountManager.fetchAccountBalance( accts['atAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['atAccount'], atIndex ) } );
		}
	},

	accountBalanceChangedHandler: function( id, index, results ) {

		var newBal = [
				prepAmount( results['balance0'] ),
				prepAmount( results['balance1'] ),
				prepAmount( results['balance2'] ),
				prepAmount( results['balance3'] )
			];

		this.$['accounts'].accountBalanceChanged(
				index,
				newBal
			);
	}
});