/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.preferences",
	kind: "FittableRows",
	classes: "enyo-fit",

	style: "height: 100%;",

	events: {
		onFinish: "",
		onModify: "",
		onChanged: "",
		onDelete: ""
	},

	components: [
		{
			kind: "onyx.Toolbar",
			classes: "text-center text-middle",
			components: [
				{
					kind: "enyo.Image",
					src: "assets/dollar_sign_1.png",
					classes: "img-icon margin-half-right"
				}, {
					content: "Preferences & Accounts",
					classes: "bigger"
				}
			]
		},

		{
			kind: "enyo.Scroller",
			horizontal: "hidden",
			//classes: "tardis-blue-gradient",
			fit: true,
			components: [
				{
					classes: "light narrow-column",
					style: "min-height: 100%;",
					components: [
						{
							kind: "onyx.Groupbox",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "Program Security"
								}, {
									name: "pinLock",
									kind: "GTS.ToggleBar",

									label: "PIN Lock",

									onContent: "Yes",
									offContent: "No",

									onChange: "togglePINStatus"
								}, {
									name: "pinLockDrawer",
									kind: "onyx.Drawer",
									open: false,
									components: [
										{
											kind: "onyx.Groupbox",
											classes: "padding-half-top",
											ontap: "changeAppPin",
											components: [
												{
													kind: "onyx.InputDecorator",
													layoutKind: "FittableColumnsLayout",
													components: [
														{
															name: "pinCode",
															kind: "onyx.Input",
															type: "password",

															placeholder: "Tap to set...",

															disabled: true,
															fit: true
														}, {
															content: "Code",
															classes: "label"
														}
													]
												}
											]
										}
									]
								}
							]
						}, {
							kind: "onyx.Groupbox",
							classes: "margin-top",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "General Options"
								}, {
									name: "transPreview",
									kind: "GTS.ToggleBar",

									label: "Transaction Preview",
									sublabel: "Show preview of a tapped transaction.",

									onContent: "Yes",
									offContent: "No",

									onChange: "updateTransPreview"
								}, {
									name: "updateNotice",
									kind: "GTS.ToggleBar",

									label: "System Notifications",
									sublabel: "Recieve in-app notices of updates and other important news.",

									onContent: "Yes",
									offContent: "No",

									onChange: "updateUpdateNotice"
								}, {
									name: "errorReporting",
									kind: "GTS.ToggleBar",

									label: "Error Reporting",
									sublabel: "Report errors to GlitchTech Science",

									onContent: "Yes",
									offContent: "No",

									onChange: "updateErrorReporting"
								}, {
									name: "dispColor",
									kind: "GTS.ToggleBar",

									label: "Account Colors",
									sublabel: "Add color in some areas based on account categories.",

									onContent: "Yes",
									offContent: "No",

									onChange: "updateDispColor"
								}, {
									showing: false,
									content: "backswipe save (function cannot not used on touchpad)"
								}
							]
						}, {
							kind: "onyx.Groupbox",
							classes: "margin-top",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "Accounts"
								}, {
									kind: "onyx.Item",
									classes: "padding-none",
									components: [
										{
											name: "entries",
											kind: "Checkbook.accounts.list",
											fit: true,

											balanceView: 4,

											editMode: true,

											style: "height: 300px;",
											classes: "checkbook-stamp",
											onSetupRow: "setupRow",

											onModify: "doModify",
											onChanged: "doChanged",
											onDelete: "doDelete"
										}
									]
								}, {
									kind: "onyx.Item",
									components: [
										{
											name: "defaultAccount",
											kind: "GTS.SelectorBar",

											disabled: true,

											label: "Default Account",
											onChange: "updateDefaultAccount",

											value: 0,
											choices: []
										}
									]
								}, {
									kind: "onyx.Item",
									components: [
										{
											name: "addAccountButton",
											kind: "onyx.Button",
											toggling: true,

											content: "Add Account",
											classes: "full-width",

											ontap: "addAccount"
										}
									]
								}
							]
						}, {
							kind: "onyx.Groupbox",
							classes: "margin-top",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "Categories & Suggestions"
								}, {
									kind: "onyx.Item",
									components: [
										{
											name: "editAccountCategories",
											kind: "onyx.Button",
											toggling: true,

											content: "Edit Account Categories",
											classes: "full-width",

											ontap: "modifyAccountCategories"
										}
									]
								}, {
									kind: "onyx.Item",
									components: [
										{
											name: "editTransactionCategories",
											kind: "onyx.Button",
											toggling: true,

											content: "Edit Transaction Categories",
											classes: "full-width",

											ontap: "modifyTransactionCategories"
										}
									]
								}, {
									kind: "onyx.Item",
									components: [
										{
											name: "",
											kind: "onyx.Button",
											toggling: true,

											content: "Auto-Complete Settings",
											classes: "full-width",

											ontap: ""
										}
									]
								}
							]
						}, {
							kind: "onyx.Button",
							content: "Full Wipe",
							classes: "onyx-negative margin-top full-width",
							ontap: "fullwipe"
						}
					]
				}
			]
		},


		{
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					kind: "onyx.Button",

					classes: "onyx-affirmative deep-green",

					content: "Done",
					ontap: "doFinish"
				}
			]
		},

		{
			name: "cryptoSystem",
			kind: "Checkbook.encryption"
		}
	],

	rendered: function() {

		this.inherited( arguments );

		this.$['pinLock'].setValue( Checkbook.globals.prefs['useCode'] === 1 );
		this.$['pinCode'].setValue( Checkbook.globals.prefs['code'] );
		this.$['pinLockDrawer'].setOpen( this.$['pinLock'].getValue() );

		this.$['transPreview'].setValue( Checkbook.globals.prefs['transPreview'] === 1 );
		this.$['updateNotice'].setValue( Checkbook.globals.prefs['updateCheckNotification'] === 1 );
		this.$['errorReporting'].setValue( Checkbook.globals.prefs['errorReporting'] === 1 );
		this.$['dispColor'].setValue( Checkbook.globals.prefs['dispColor'] === 1 );

		Checkbook.globals.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildDefaultAccountList ) } );

		this.$['entries'].renderAccountList();
	},

	/** PIN Controls **/

	togglePINStatus: function() {

		Checkbook.globals.prefs['useCode'] = ( this.$['pinLock'].getValue() ? 1 : 0 );
		this.$['pinLockDrawer'].setOpen( this.$['pinLock'].getValue() );

		this.saveAppPin();
	},

	changeAppPin: function() {

		this.createComponent(
				{
					name: "pinPopup",
					kind: "Checkbook.pinChangePopup",

					onFinish: "changeAppPinHandler"
				}
			);

		this.$['pinPopup'].show();
	},

	changeAppPinHandler: function( inSender, inEvent ) {

		this.$['cryptoSystem'].encryptString(
				inEvent.value,
				enyo.bind( this, this.cryptoPinHandler )
			);

		this.$['pinPopup'].hide();
		this.$['pinPopup'].destroy();
	},

	cryptoPinHandler: function( cryptPin ) {

		if( cryptPin.length > 0 ) {

			Checkbook.globals.prefs['useCode'] = 1;
			Checkbook.globals.prefs['code'] = cryptPin;
		}

		this.saveAppPin();
	},

	saveAppPin: function() {

		if( Checkbook.globals.prefs['useCode'] === 0 || !enyo.isString( Checkbook.globals.prefs['code'] ) || Checkbook.globals.prefs['code'].length <= 0 ) {
			//if invalid or set to off;

			Checkbook.globals.prefs['useCode'] = 0;
			Checkbook.globals.prefs['code'] = "";
		}

		this.$['pinCode'].setValue( Checkbook.globals.prefs['code'] );

		Checkbook.globals.gts_db.query( Checkbook.globals.gts_db.getUpdate( "prefs", { "useCode": Checkbook.globals.prefs['useCode'], "code": Checkbook.globals.prefs['code'] }, {} ) );
	},

	/** General Controls **/

	updateTransPreview: function( inSender, inEvent ) {

		Checkbook.globals.prefs['transPreview'] = ( inEvent.value ? 1 : 0 );
		Checkbook.globals.gts_db.query( Checkbook.globals.gts_db.getUpdate( "prefs", { "previewTransaction": Checkbook.globals.prefs['transPreview'] }, {} ) );
	},

	updateUpdateNotice: function( inSender, inEvent ) {

		Checkbook.globals.prefs['updateCheckNotification'] = ( inEvent.value ? 1 : 0 );
		Checkbook.globals.gts_db.query( Checkbook.globals.gts_db.getUpdate( "prefs", { "updateCheckNotification": Checkbook.globals.prefs['updateCheckNotification'] }, {} ) );
	},

	updateErrorReporting: function( inSender, inEvent ) {

		Checkbook.globals.prefs['errorReporting'] = ( inEvent.value ? 1 : 0 );
		Checkbook.globals.gts_db.query( Checkbook.globals.gts_db.getUpdate( "prefs", { "errorReporting": Checkbook.globals.prefs['errorReporting'] }, {} ) );
	},

	updateDispColor: function( inSender, inEvent ) {

		Checkbook.globals.prefs['dispColor'] = ( inEvent.value ? 1 : 0 );
		Checkbook.globals.gts_db.query( Checkbook.globals.gts_db.getUpdate( "prefs", { "dispColor": Checkbook.globals.prefs['dispColor'] }, {} ) );
	},

	/** Account Controls **/

	setupRow: function( inControl, inSender, inIndex ) {

		var row = inControl.accounts[inIndex];

		if( row ) {

			inControl.$['accountItem'].addRemoveClass( "maskedAccount", ( row['hidden'] === 1 ) );

			if( row['hidden'] === 2 ) {

				inControl.$['icon'].setSrc( imgToGrey( "assets/" + row['acctCategoryIcon'] ) );
			} else {

				inControl.$['icon'].setSrc( "assets/" + row['acctCategoryIcon'] );
			}

			inControl.$['iconLock'].addRemoveClass( "unlocked", ( row['acctLocked'] !== 1 ) );

			inControl.$['name'].setContent( row['acctName'] );

			return true;
		}
	},

	buildDefaultAccountList: function( accounts ) {

		accounts.unshift( {
				content: "No Default Account",
				color: null,
				icon: null,
				value: -1
			});

		this.$['defaultAccount'].setChoices( accounts );
		this.$['defaultAccount'].setDisabled( false );
		this.$['defaultAccount'].render();

		Checkbook.globals.accountManager.fetchDefaultAccount( { "onSuccess": enyo.bind( this, this.setDefaultAccount ) } );
	},

	setDefaultAccount: function( result ) {

		if( result ) {

			this.$['defaultAccount'].setValue( result['acctId'] );
		} else {

			this.$['defaultAccount'].setValue( -1 );
		}
	},

	updateDefaultAccount: function( inSender, inEvent ) {

		Checkbook.globals.accountManager.updateDefaultAccount( this.$['defaultAccount'].getValue() );
	},

	addAccount: function() {

		//Prevent user from launching multiple New Account windows
		if( this.$['addAccountButton'].getDepressed() && !this.$['addAccountButton'].getDisabled() ) {

			this.$['addAccountButton'].setDisabled( true );

			enyo.asyncMethod(
					this,
					this.doModify,
					{
						name: "addAccount",
						kind: "Checkbook.accounts.modify",
						acctId: -1,
						onFinish: enyo.bind( this, this.addAccountComplete )
					}
				);
		}
	},

	addAccountComplete: function( inSender, action, actionStatus ) {

		this.$['addAccountButton'].setDepressed( false );
		this.$['addAccountButton'].setDisabled( false );

		if( action === 1 && actionStatus === true ) {

			this.log( "New account created" );

			this.$['entries'].renderAccountList();
			this.doChanged();
		}
	},

	/** Category Controls **/
	modifyAccountCategories: function() {

		if( this.$['editAccountCategories'].getDepressed() && !this.$['editAccountCategories'].getDisabled() ) {

			this.$['editAccountCategories'].setDisabled( true );

			this.createComponent( {
					name: "accountCategoryView",
					kind: "Checkbook.accountCategory.view",

					onClose: "modifyAccountCategoriesComplete",

					owner: this
				});

			this.$['accountCategoryView'].render();
			this.$['accountCategoryView'].openAtCenter();
		}
	},

	modifyAccountCategoriesComplete: function() {

		this.$['entries'].renderAccountList();
		this.doChanged();

		this.$['accountCategoryView'].destroy();

		this.$['editAccountCategories'].setDepressed( false );
		this.$['editAccountCategories'].setDisabled( false );
	},

	modifyTransactionCategories: function() {

		if( this.$['editTransactionCategories'].getDepressed() && !this.$['editTransactionCategories'].getDisabled() ) {

			this.$['editTransactionCategories'].setDisabled( true );

			this.createComponent( {
					name: "transactionCategoryView",
					kind: "Checkbook.transactionCategory.view",

					onClose: "modifyTransactionCategoriesComplete",

					owner: this
				});

			this.$['transactionCategoryView'].render();
			this.$['transactionCategoryView'].openAtCenter();
		}
	},

	modifyTransactionCategoriesComplete: function() {

		this.$['transactionCategoryView'].destroy();

		this.$['editTransactionCategories'].setDepressed( false );
		this.$['editTransactionCategories'].setDisabled( false );
	},

	/** Full Wipe Control **/
	fullwipe: function() {

		this.createComponent( {
				name: "fullwipeConfirm",
				kind: "GTS.deleteConfirm",

				owner: this,

				confirmTitle: "Purge All Data",
				confirmMessage: "Are you sure? Remember this cannot be undone. This app will exit when process is complete.",
				confirmButtonYes: "Delete Everything",
				confirmButtonNo: "Cancel",

				onYes: "fullwipeRun",
				onNo: "fullwipeConfirmClose"
			});

		this.$['fullwipeConfirm'].render();
		this.$['fullwipeConfirm'].openAtCenter();
	},

	fullwipeConfirmClose: function() {

		this.$['fullwipeConfirm'].destroy();
	},

	fullwipeRun: function() {

		this.$['fullwipeConfirm'].destroy();

		this.createComponent( {
				name: "wipeProgress",
				kind: "GTS.progress"
			});

		this.$['wipeProgress'].render();
		this.$['wipeProgress'].load( "Purging All Data", "Please wait...", 50 );

		Checkbook.globals.gts_db.queries(
				[
					"DROP TABLE IF EXISTS budget;",
					"DROP TABLE IF EXISTS rules;",

					"DROP TABLE IF EXISTS accounts;",
					"DROP TABLE IF EXISTS accountCategories;",

					"DROP TABLE IF EXISTS transactions;",
					"DROP TABLE IF EXISTS transactionCategories;",
					"DROP TABLE IF EXISTS transactionSplit;",

					"DROP TABLE IF EXISTS repeats;",

					"DROP TABLE IF EXISTS prefs;"
				],
				{
					"onSuccess": enyo.bind( this, this.deleteEverythingDone )
				}
			);
	},

	deleteEverythingDone: function() {

		window.close();
		/*
		//Multi-window version?
		for( var win in enyo.windows.getWindows() ) {

			win.close();
		}
		*/
	}
});
