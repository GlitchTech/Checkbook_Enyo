/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.app",
	kind: "enyo.Control",

	appReady: false,
	paneStack: [],

	components: [
		{
			name: "mainViews",
			kind: "Panels",

			classes: "enyo-fit app-panels",
			showing: false,

			fit: true,
			animate: false,
			draggable: false,

			arrangerKind: "CollapsingArranger",

			components: [ { name: "destroyChild", content: "I am a dummy component so the panel structure doesn't crash on load." } ]
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
			name: "appMenu",
			kind: "Checkbook.appmenu"
		},

		{
			kind: "Signals",

			//App startup handlers
			ondeviceready: "deviceReady",
			webworksready: "deviceReady",

			//Application control handles
			onbackbutton: "backHandler",
			onmenubutton: "menuHandler",
			onsearchbutton: "searchHandler",
			onkeydown: "keyboardHandler",

			//Internal Signals
			viewAccount: "viewAccount",

			resetSystem: "resetSystem",

			showBudget: "openBudget",
			showSearch: "openSearch",
			showReport: "openReport",

			showPanePopup: "showPanePopup",
			showPopup: "showPopup"
		}
	],

	/** Start Up Event **/

	deviceReady: function() {

		if( this.$['splash'] ) {

			this.$['splash'].show();
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

	menuHandler: function( inSender, inEvent ) {

		if( !this.appReady ) { return; }

		inEvent = enyo.mixin( { "pageX": 10, "pageY": 10 }, inEvent );

		if( this.paneStack.length <= 0 ) {
			//Menu is only available on Accounts or Transaction list screens.

			if( this.$['appMenu'].getShowing() ) {

				this.hideAppMenu();
			} else {

				this.showAppMenu( inSender, inEvent );
			}
		}

		return true;
	},

	showAppMenu: function( inSender, inEvent ) {

		this.$['appMenu'].showAtEvent( inEvent );
	},

	hideAppMenu: function() {

		this.$['appMenu'].hide();
	},

	backHandler: function() {

		if( !this.appReady ) { return; }

		if( this.$['appMenu'].getShowing() ) {
			//Hide app menu

			this.hideAppMenu();
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

		this.$['mainViews'].show();
		this.$['mainViews'].render();

		Checkbook.globals.criticalError = this.$['criticalError'];

		Checkbook.transactions.recurrence.manager.updateSeriesTransactions( -1, { "onSuccess": enyo.bind( this, this.loadCheckbookStage2 ) } );
	},

	loadCheckbookStage2: function() {

		if( this.$['splash'] ) {

			this.$['splash'].$['message'].setContent( "Loading account information..." );
		}

		Checkbook.accounts.manager.fetchDefaultAccount( { "onSuccess": enyo.bind( this, this.loadCheckbookStage3 ) } );
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

								enyo.Signals.send( "viewAccount", { "account": result } );
							}
						}
					);
			} else {

				enyo.Signals.send( "viewAccount", { "account": result } );
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
					//"If you have any questions, visit <a href='" + info['vendorurl'] + "' target='_blank'>" + info['vendorurl'] + "</a> or email <a href='mailto:" + info['vendoremail'] + "?subject=" + info['title'] + " Support'>" + info['vendoremail'] + "</a>.",
					"If you have any questions, email <a href='mailto:" + info['vendoremail'] + "?subject=" + info['title'] + " Support'>" + info['vendoremail'] + "</a>.",
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

		if( this.$['splash'] ) {

			//Close & remove splash system. Not used again
			this.$['splash'].hide();
			this.$['splash'].destroy();
		}

		this.openBudget();
	},

	resetSystem: function( inSender, inEvent ) {

		this.$['transactions'].unloadSystem();

		Checkbook.accounts.manager.updateAccountModTime();
		this.notificationType = null;

		enyo.asyncMethod(
				this,
				this.loadCheckbookStage2
			);
	},

	/** PopUp Controls **/

	showPopup: function( inSender, inEvent ) {

		if( this.$[inSender.popup] ) {

			this.$[inSender.popup].show();
		} else if( this.$[inEvent.popup] ) {

			this.$[inEvent.popup].show();
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
		this.$['mainViews'].hide();

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
			this.$['mainViews'].show();
		}

		this.resized();
	},

	/** Checkbook.accounts.* **/

	viewAccount: function() {

		if( enyo.Panels.isScreenNarrow() ) {

			this.$['mainViews'].setIndex( 1 );
		}
	},

	/** Checkbook.search.* **/

	openSearch: function( inSender, inEvent ) {

		this.showPanePopup(
				null,
				enyo.mixin(
						inEvent,
						{
							name: "search",
							kind: "Checkbook.search.pane",
							onFinish: enyo.bind( this, this.closeSearch )
						}
					)
			);
	},

	closeSearch: function( inSender, inEvent ) {

		if( inEvent['changes'] ) {

			this.resetSystem();
		}
	},

	/** Checkbook.budget.* **/

	openBudget: function( inSender, inEvent ) {

		enyo.asyncMethod(
				this,
				this.showPanePopup,
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

	/** Checkbook.reports.* **/

	openReport: function( inSender, inEvent ) {

		this.log( "Report", arguments );
		return;

		enyo.asyncMethod(
				this,
				this.showPanePopup,
				null,
				enyo.mixin(
						{
							name: "report",
							kind: "Checkbook.report.view"
						},
						inEvent
					)
			);
	}
});
