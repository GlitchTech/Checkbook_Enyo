/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.app",
	kind: "enyo.Control",
	fit: true,

	components: [
		{
			name: "container",
			kind: "Panels",

			fit: true,
			showing: false,
			draggable: false,

			classes: "app-panels enyo-fit",
			arrangerKind: "CollapsingArranger",

			components: [
				{
					name: "accounts",
					kind: "Checkbook.accounts.view",

					onModify: "showPanePopup",
					onChanged: "accoutChanged",
					onDelete: "accoutDeleted",

					onView: "updateTransactionsView"
				}, {
					name: "transactions",
					kind: "Checkbook.transactions.view",

					onModify: "showPanePopup",
					onChanged: "accountBalanceChanged",
					onBalanceViewChanged: "tranasactionBalanceViewChanged",

					onBudgetView: "openBudget",
					onSearchView: "openSearch"
				}
			]
		},

		{
			name: "splashScrim",
			kind: onyx.Scrim,
			classes: "onyx-scrim-translucent"
		}, {
			name: "splash",
			kind: "Checkbook.splash",
			onFinish: "splashFinisher"
		},

		{
			kind: "Signals",
			onBack: "goBack"
		}

		/*{
			name: "appMenu",
			kind: enyo.AppMenu,
			scrim: true,
			components: [
				{
					caption: "Preferences & Data",
					components: [
						{
							caption: "Preferences & Accounts",
							ontap: "openPreferences"
						}, {
							showing: false,
							caption: "Auto-Complete Preferences",
							ontap: "openACPrefs"
						}, {
							caption: "Import Data",
							ontap: "openImport"
						}, {
							caption: "Export Data",
							ontap: "openExport"
						}
					]
				}, {
					caption: "Finance Information",
					components: [
						{
							caption: "Search",
							ontap: "openSearch"
						}, {
							caption: "Budget",
							ontap: "openBudget"
						}, {
							showing: false,
							caption: "Reports",
							ontap: "openReports"
						}
					]
				}, {
					showing: false,
					caption: "Report Bug",
					ontap: "errorReport"
				}, {
					caption: "About",
					ontap: "showPopup",
					popup: "about"
				}
			]
		}, {
			name: "about",
			kind: "Checkbook.about",
			onClose: "closePopup"
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
		}*/
	],

	paneStack: [],

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		enyo.Scroller.touchScrolling = true;

		if( enyo.platform.android ) {

			touchEvent.preventDefault();
		}
	},

	/** Application Events **/

	backHandler: function( inSender, inEvent ) {

		//this.$.slidingPane.back( inEvent );

		inEvent.stopPropagation();
		return -1;
	},

	/** Splash Controls **/

	rendered: function() {

		this.inherited( arguments );

		this.$['splashScrim'].show();
		this.$['splash'].show();

		//Load splash popup. Verifies database.
		//this.$['appMenu'].setAutomatic( false );
	},

	splashFinisher: function() {

		this.notificationType = !this.$['splash'].getFirstRun();

		//Close & remove splash system. Not used again
		this.$['splashScrim'].hide();
		this.$['splash'].hide();

		this.$['splashScrim'].destroy();
		this.$['splash'].destroy();

		Checkbook.globals.security = this.$['security'];

		if( Checkbook.globals.prefs['useCode'] != 0 ) {
			//App Locked

			Checkbook.globals.security.authUser(
					"Main Program PIN Code",
					Checkbook.globals.prefs['code'],
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

		this.$['container'].show();
		this.$['container'].render();

		//this.$['appMenu'].setAutomatic( true );

		Checkbook.globals.criticalError = this.$['criticalError'];
		Checkbook.globals.accountManager = new Checkbook.accounts.manager();
		Checkbook.globals.transactionManager = new Checkbook.transactions.manager();
		Checkbook.globals.transactionCategoryManager = new Checkbook.transactionCategory.manager();

		enyo.asyncMethod(
				this,
				this.loadCheckbookStage2
			);
	},

	loadCheckbookStage2: function() {

		Checkbook.globals.accountManager.fetchDefaultAccount( { "onSuccess": enyo.bind( this, this.loadCheckbookStage3 ) } );
	},

	loadCheckbookStage3: function( result ) {

		if( result ) {

			if( result['acctLocked'] === 1 ) {
				//System security

				Checkbook.globals.security.authUser(
						result['acctName'] + " " + "PIN Code",
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

		if( this.notificationType === true && Checkbook.globals.prefs['updateCheckNotification'] == 1 ) {

			//Check for notifications
		} else if( this.notificationType === false ) {
			//First run notice

			Checkbook.globals.criticalError.load(
					//"Welcome to " + enyo.fetchAppInfo()['title'],
					//"If you have any questions, visit <a href='" + enyo.fetchAppInfo()['vendorurl'] + "'>" + enyo.fetchAppInfo()['vendorurl'] + "</a> or email <a href='mailto:" + enyo.fetchAppInfo()['vendoremail'] + "?subject=" + enyo.fetchAppInfo()['title'] + " Support'>" + enyo.fetchAppInfo()['vendoremail'] + "</a>.",
					"Welcome to Checkbook",
					"If you have any questions, visit <a href='http://glitchtechscience.com'>http://glitchtechscience.com</a> or email <a href='mailto:glitchtechscience@gmail.com?subject=Checkbook Support'>mailto:glitchtechscience@gmail.com</a>.",
					"",
					"assets/icon_1_32x32.png"
				);

			enyo.asyncMethod(
					Checkbook.globals.criticalError,
					Checkbook.globals.criticalError.set,
					"~|p2t|~",
					"",
					"~|mt|~",
					"assets/warning-icon.png"
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
		//this.$['appMenu'].setAutomatic( false );
		this.$[paneArgs['name']].render();
		this.$['container'].hide();
		this.$[paneArgs['name']].show();

		//Add new pane to the display stack
		this.paneStack.push( paneArgs['name'] );

		return true;
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
			this.$[this.paneStack[len - 1]].show();
		} else {

			//show base view
			//this.$['appMenu'].setAutomatic( true );
			this.$['container'].show();
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
					onFinish: enyo.bind( this, this.importComplete )
				}
			);
	},

	importComplete: function( inSender, importStatus ) {

		this.$['appMenu'].setAutomatic( true );

		if( importStatus === true ) {

			this.$['transactions'].reloadSystem();

			this.notificationType = null;

			enyo.asyncMethod(
					this,
					this.loadCheckbookStage2
				);
		}
	},

	/** Checkbook.autocompleteprefs.* **/

	openACPrefs: function( inSender, inEvent ) {

		this.showPanePopup(
				null,
				{
					name: "autocompleteprefs",
					kind: "Checkbook.autocompleteprefs.view"
				}
			);
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

			Checkbook.globals.accountManager.updateAccountModTime();
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

	accoutDeleted: function( inSender, inEvent ) {

		if( this.$['transactions'].getAccountId() == inEvent.accountId ) {

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

		var acctIndex = accts['account'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( accts['account'] ) : - 1;

		if( acctIndex >= 0 ) {

			if( accts['accountBal'].length > 0 ) {

				this.$['accounts'].accountBalanceChanged(
						acctIndex,
						accts['accountBal']
					);
			} else {

				Checkbook.globals.accountManager.fetchAccountBalance( accts['account'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['account'], acctIndex ) } );
			}
		}

		var linkedIndex = accts['linkedAccount'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( accts['linkedAccount'] ) : - 1;

		if( linkedIndex >= 0 ) {

			Checkbook.globals.accountManager.fetchAccountBalance( accts['linkedAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['linkedAccount'], linkedIndex ) } );
		}

		var atIndex = accts['atAccount'] >= 0 ? Checkbook.globals.accountManager.fetchAccountIndex( accts['atAccount'] ) : - 1;

		if( atIndex >= 0 ) {

			Checkbook.globals.accountManager.fetchAccountBalance( accts['atAccount'], { "onSuccess": enyo.bind( this, this.accountBalanceChangedHandler, accts['atAccount'], atIndex ) } );
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
