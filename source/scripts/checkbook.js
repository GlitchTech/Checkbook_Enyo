/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.app",
	kind: "enyo.Control",

	components: [
		{
			name: "container",
			layoutKind: "enyo.FittableRowsLayout",
			classes: "enyo-fit",
			showing: false,
			components: [
				{
					name: "menubar",
					kind: "onyx.Toolbar",
					classes: "padding-none",
					components: [
						{
							kind: "onyx.MenuDecorator",
							components: [
								{
									name: "appMenuButton",
									kind: "onyx.Button",
									components: [
										{
											kind: "enyo.Image",
											src: "assets/favicon.ico"
										}, {
											content: "Checkbook"
										}
									]
								}, {
									kind: "onyx.Menu",
									showOnTop: true,
									floating: true,
									components: [
										{
											content: "Preferences & Accounts",
											ontap: "openPreferences"
										}, {
											classes: "onyx-menu-divider"
										}, {
											content: "Import Data",
											ontap: "openImport"
										}, {
											content: "Export Data (NYI)",
											ontap: "openExport"
										}, {
											classes: "onyx-menu-divider"
										}, {
											content: "Search (NYI)",
											//ontap: "openSearch"
										}, {
											content: "Budget (NYI)",
											//ontap: "openBudget"
										}, {
											content: "Reports (NYI)",
											//ontap: "openReports"
										}, {
											classes: "onyx-menu-divider"
										}, {
											content: "Report Bug (NYI)",
											//ontap: "errorReport"
										}, {
											classes: "onyx-menu-divider"
										}, {
											content: "About",
											ontap: "showPopup",
											popup: "about"
										}
									]
								}
							]
						}
					]
				}, {
					kind: "Panels",

					fit: true,
					draggable: true,

					classes: "app-panels",
					arrangerKind: "CollapsingArranger",

					components: [
						{
							name: "accounts",
							kind: "Checkbook.accounts.view"
						}, {
							name: "transactions",
							kind: "Checkbook.transactions.view",

							onChanged: "accountBalanceChanged"
						}
					]
				}
			]
		},

		{
			name: "splash",
			kind: "Checkbook.splash",
			onFinish: "splashFinisher"
		}, {
			name: "about",
			kind: "Checkbook.about",
			onFinish: "closePopup"
		},

		{
			name: "criticalError",
			kind: "Checkbook.systemError",

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
			kind: "Signals",

			modifyAccount: "showPanePopup",
			modifyTransaction: "showPanePopup",
			showBudget: "openBudget",
			showSearch: "openSearch",

			onkeydown: "keyboardHandler"//for testing only
		}
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

			//Android bindings (phonegap)
			document.addEventListener( "backbutton", enyo.bind( this, this.backHandler ), false );
			document.addEventListener( "menubutton", enyo.bind( this, this.menuHandler ), false );
			document.addEventListener( "searchbutton", enyo.bind( this, this.searchHandler ), false);
		}
	},

	/**
	 * @protected
	 * Builds UI
	 */
	rendered: function() {

		this.inherited( arguments );

		this.$['splash'].show();

		if( enyo.platform.android ) {

			//Use Android bindings instead of UI buttons
			this.$['menubar'].hide();
		}
	},

	/** Application Events **/

	keyboardHandler: function( inSender, inEvent ) {

		if( inEvent.which === 18 ) {
			//alt key

			return this.menuHandler( inEvent );
		} else if( inEvent.which === 27 ) {
			//escape key

			return this.backHandler( inEvent );
		}
	},

	menuHandler: function( inEvent ) {

		if( this.paneStack.length <= 0 ) {
			//Menu is only available on Accounts or Transaction list screens.

			this.$['appMenuButton'].waterfall( "ontap", "ontap", this );
		}

		inEvent.stopPropagation();
		return true;
	},

	backHandler: function( inEvent ) {

		if( this.paneStack.length > 0 ) {

			//this.hidePanePopup(  );
			this.$[this.paneStack[this.paneStack.length - 1]].doFinish();
		//} else if( showing only transaction window ) {

			//reveal account window
		} else {

			this.createComponent( {
					name: "exitConfirmation",
					kind: "gts.ConfirmDialog",

					title: "Exit Checkbook",
					message: "Are you sure you want to close Checkbook?",

					confirmText: "Yes",
					cancelText: "No",

					onConfirm: "exitConfirmationHandler",
					onCancel: "exitConfirmationClose"
				});

			this.$['exitConfirmation'].show();
		}

		inEvent.stopPropagation();
		return true;
	},

	exitConfirmationClose: function() {

		this.$['exitConfirmation'].destroy();
	},

	exitConfirmationHandler: function() {

		this.exitConfirmationClose();

		this.log( "EXIT" );
	},

	searchHandler: function( inEvent ) {

		this.log( "NYI" );

		inEvent.stopPropagation();
		return true;
	},

	/** Splash Controls **/

	splashFinisher: function() {

		this.notificationType = !this.$['splash'].getFirstRun();

		//Close & remove splash system. Not used again
		this.$['splash'].hide();
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

		this.waterfall( "onresize", "onresize", this );

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
							"onSuccess": function() {

								enyo.Signals.send( "viewAccount", { account: result } );
							}
						}
					);
			} else {

				enyo.Signals.send( "viewAccount", { account: result } );
			}
		}

		enyo.Signals.send( "accountChanged" );

		if( this.notificationType === true && Checkbook.globals.prefs['updateCheckNotification'] == 1 ) {

			//Check for notifications
		} else if( this.notificationType === false ) {
			//First run notice

			Checkbook.globals.criticalError.load(
					//"Welcome to " + enyo.fetchAppInfo()['title'],
					//"If you have any questions, visit <a href='" + enyo.fetchAppInfo()['vendorurl'] + "' target='_blank'>" + enyo.fetchAppInfo()['vendorurl'] + "</a> or email <a href='mailto:" + enyo.fetchAppInfo()['vendoremail'] + "?subject=" + enyo.fetchAppInfo()['title'] + " Support'>" + enyo.fetchAppInfo()['vendoremail'] + "</a>.",
					"Welcome to Checkbook",
					"If you have any questions, visit <a href='http://glitchtechscience.com' target='_blank'>http://glitchtechscience.com</a> or email <a href='mailto:glitchtechscience@gmail.com?subject=Checkbook Support'>glitchtechscience@gmail.com</a>.",
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

		var popup = this.$[inSender.popup];

		if( popup ) {

			popup.show();
		}
	},

	closePopup: function( inSender ) {

		inSender.hide();
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

		if( importStatus['success'] === true ) {

			this.$['transactions'].reloadSystem();

			this.notificationType = null;

			enyo.asyncMethod(
					this,
					this.loadCheckbookStage2
				);
		}
	},

	/** Checkbook.budget.* **/

	openBudget: function( inSender, inEvent ) {

		this.log( arguments );
		return;

		this.showPanePopup(
				null,
				enyo.mixin(
						{
							name: "budget",
							kind: "Checkbook.budget.view"
						},
						inEvent
					)
			);
	},

	/** Checkbook.search **/

	openSearch: function( inSender, inEvent ) {

		this.showPanePopup(
				null,
				enyo.mixin(
						inEvent,
						{
							name: "search",
							kind: "Checkbook.search.pane",
							onModify: "showPanePopup",
							onFinish: enyo.bind(
									this,
									this.closeSearch
								),
							doNext: ( inEvent && enyo.isFunction( inEvent['onFinish'] ) ? inEvent['onFinish'] : null )
						}
					)
			);
	},

	closeSearch: function( inSender, changesMade ) {

		if( changesMade === true ) {
			//Update account and transaction information

			Checkbook.globals.accountManager.updateAccountModTime();

			enyo.Signals.send( "accountChanged" );
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

	prefAccoutChanged: function( inSender, inAccount ) {

		enyo.Signals.send( "accountChanged" );

		if( inAccount ) {
			//Needs to have more than inSender

			enyo.Signals.send( "viewAccount", { account: inAccount, force: true } )
		}
	},

	prefAccoutDeleted: function() {

		this.log( "Update account list", arguments );

		enyo.Signals.send( "accountChanged" );

		this.accoutDeleted.apply( this, arguments );
	},

	/** ( Checkbook.transactions.view --> Checkbook.accounts.view ) Communication Channels **/

	accountBalanceChanged: function( inSender, accts, deltaBalanceArr ) {

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
