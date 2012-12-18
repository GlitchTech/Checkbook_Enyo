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
							name: "appMenu",
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

									//modal: false,//allows event though

									components: [
										{
											content: "Preferences",
											ontap: "openPreferences"
										}, {
											classes: "onyx-menu-divider"
										}, {
											content: "Import Data",
											ontap: "openImport"
										}, {
											content: "Export Data",
											ontap: "openExport"
										}, {
											showing: false,
											classes: "onyx-menu-divider"
										}, {
											showing: false,
											content: "Search (NYI)",
											ontap: "openSearch"
										}, {
											showing: false,
											content: "Budget (NYI)",
											ontap: "openBudget"
										}, {
											showing: false,
											content: "Reports (NYI)",
											ontap: "openReports"
										}, {
											showing: false,
											classes: "onyx-menu-divider"
										}, {
											showing: false,
											content: "Report Bug (NYI)",
											ontap: "errorReport"
										}, {
											showing: false,
											classes: "onyx-menu-divider"
										}, {
											//hidden until handling in about for links in child view
											showing: false,
											content: "About",
											ontap: "showAbout"
										}
									]
								}
							]
						}
					]
				}, {
					name: "mainViews",
					kind: "Panels",

					fit: true,
					animate: false,
					draggable: false,

					classes: "app-panels",
					arrangerKind: "CollapsingArranger",

					components: [ { name: "destroyChild", content: "I am a dummy component so the panel structure doesn't crash on load." } ]
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

			viewAccount: "viewAccount",
			modifyAccount: "showPanePopup",
			modifyTransaction: "showPanePopup",
			showBudget: "openBudget",
			showSearch: "openSearch",

			showPanePopup: "showPanePopup",

			onbackbutton: "backHandler",
			onmenubutton: "menuHandler",
			onsearchbutton: "searchHandler",
			onkeydown: "keyboardHandler"//for testing only
		}
	],

	appReady: false,
	paneStack: [],

	/**
	 * @protected
	 * Builds UI
	 */
	rendered: function() {

		this.inherited( arguments );

		//Force touch scrolling
		enyo.Scroller.touchScrolling = true;

		//Bind phonegap events (should auto-bind)
		enyo.dispatcher.listen( document, "backbutton" );
		enyo.dispatcher.listen( document, "menubutton" );
		enyo.dispatcher.listen( document, "searchbutton" );

		//Start app
		this.$['splash'].show();

		if( enyo.platform.android || enyo.platform.androidChrome ) {

			//Use Android bindings instead of UI buttons
			this.$['menubar'].hide();
		}
	},

	/** Application Events **/

	keyboardHandler: function( inSender, inEvent ) {

		if( !this.appReady ) { return; }

		if( inEvent.which === 18 ) {
			//alt key

			enyo.Signals.send( "onmenubutton" );
			return true;
		} else if( inEvent.which === 27 ) {
			//escape key

			enyo.Signals.send( "onbackbutton" );
			return true;
		}
	},

	menuHandler: function() {

		if( !this.appReady ) { return; }

		if( this.paneStack.length <= 0 ) {
			//Menu is only available on Accounts or Transaction list screens.

			if( this.$['appMenuButton'].getActive() === true ) {

				this.$['appMenuButton'].setActive( false );
				this.$['appMenu'].requestHideMenu();
			} else {

				this.$['appMenuButton'].waterfall( "ontap", "ontap", this );
			}
		}

		return true;
	},

	backHandler: function() {

		if( !this.appReady ) { return; }

		if( this.$['appMenu'].menuActive === true ) {
			//Hide app menu

			this.$['appMenu'].requestHideMenu();
		} else if( this.paneStack.length > 0 ) {
			//Exit top most layer

			this.$[this.paneStack[this.paneStack.length - 1]].doFinish();
		} else if( this.$['mainViews'].getIndex() > 0 ) {
			//Slide back towards home (account list)

			this.$['mainViews'].previous();
		} else if( enyo.platform.android || enyo.platform.androidChrome ) {
			//Confirm exit (android only)

			if( this.$['exitConfirmation'] ) {

				this.exitConfirmationHandler();
			} else {

				this.createComponent( {
						name: "exitConfirmation",
						kind: "gts.ConfirmDialog",

						title: "Exit Checkbook",
						message: "Are you sure you want to close Checkbook?",

						confirmText: "Yes",
						cancelText: "No",

						modal: false,

						onConfirm: "exitConfirmationHandler",
						onCancel: "exitConfirmationClose",
					});

				this.$['exitConfirmation'].show();
			}
		} else {

			this.log( "backHandler: no action possible" );
		}

		return true;
	},

	exitConfirmationClose: function() {

		this.$['exitConfirmation'].hide();
		this.$['exitConfirmation'].destroy();
	},

	exitConfirmationHandler: function() {

		this.exitConfirmationClose();

		navigator.app.exitApp();
	},

	searchHandler: function( inEvent ) {

		if( !this.appReady ) { return; }

		this.log( "NYI" );

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

		this.$['destroyChild'].destroy();
		this.$['mainViews'].createComponents(
				[
					{
						name: "accounts",
						kind: "Checkbook.accounts.view"
					}, {
						name: "transactions",
						kind: "Checkbook.transactions.view"
					}
				], {
					owner: this
				}
			);

		this.$['mainViews'].render();
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

			var info = enyo.fetchAppInfo();

			Checkbook.globals.criticalError.load(
					"Welcome to " + info['title'],
					"If you have any questions, visit <a href='" + info['vendorurl'] + "' target='_blank'>" + info['vendorurl'] + "</a> or email <a href='mailto:" + info['vendoremail'] + "?subject=" + info['title'] + " Support'>" + info['vendoremail'] + "</a>.",
					"",
					"assets/icon_1_32x32.png"
				);

			enyo.asyncMethod(
					Checkbook.globals.criticalError,
					Checkbook.globals.criticalError.set,
					"~|p2t|~",
					"",
					"~|mt|~",
					"assets/status_icons/warning.png"
				);
		}

		this.appReady = true;
	},

	/** PopUp Controls **/

	showAbout: function() {

		this.showPopup( { "popup": "about" } );
	},

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
		this.$[paneArgs['name']].render();

		//Hide other panes
		this.$['container'].hide();
		for( var i = 0; i < this.paneStack.length; i++ ) {

			this.$[this.paneStack[i]].hide();
		}

		//Display new pane
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

		this.waterfall( "onresize", "onresize", this );
	},

	/** Checkbook.accounts.* **/

	viewAccount: function() {

		if( enyo.Panels.isScreenNarrow() ) {

			this.$['mainViews'].setIndex( 1 );
		}
	},

	/** Checkbook.preferences **/

	openPreferences: function() {

		this.showPanePopup(
				null,
				{
					name: "preferences",
					kind: "Checkbook.preferences"
				}
			);
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
	}
});
