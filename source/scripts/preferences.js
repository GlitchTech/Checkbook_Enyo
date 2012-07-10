/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind({
	name: "Checkbook.preferences",
	kind: enyo.VFlexBox,

	style: "height: 100%;",
	flex: 1,

	events: {
		onFinish: "",
		onModify: "",
		onChanged: "",
		onDelete: ""
	},

	components: [
		{
			kind: enyo.PageHeader,
			components: [
				{
					kind: enyo.Spacer
				}, {
					kind: enyo.Image,
					src: "assets/dollar_sign_1.png",
					className: "img-icon",
					style: "margin-right: 0.25em;"
				}, {
					content: "Preferences & Accounts",
					className: "bigger",
					style: "margin-top: -6px;"
				}, {
					kind: enyo.Spacer
				}
			]
		},

		{
			kind: enyo.Scroller,

			autoHorizontal: false,
			horizontal: false,

			flex: 1,

			components: [
				{
					layoutKind: enyo.VFlexLayout,
					className: "light narrow-column",
					flex: 1,

					components: [
						{
							kind: enyo.Group,
							caption: "Program Security",
							components: [
								{
									name: "pinLock",
									kind: "GTS.ToggleBar",

									mainText: "PIN Lock",

									onText: "Yes",
									offText: "No",

									onChange: "togglePINStatus"
								}, {
									name: "pinLockDrawer",
									kind: enyo.BasicDrawer,
									open: false,

									components: [
										{
											kind: enyo.Item,
											layoutKind: enyo.HFlexLayout,

											align: "center",
											tapHightlight: true,
											components: [
												{
													name: "pinCode",
													kind: enyo.PasswordInput,

													flex: 1,

													hint: "Tap to set...",

													onmousedown: "changeAppPin",
													onmouseup: "changeAppPin",

													components: [
														{
															content: "Code",
															className: "enyo-label"
														}
													]
												}
											]
										}
									]
								}
							]
						}, {
							kind: enyo.RowGroup,
							caption: "General Options",
							components: [
								{
									name: "transPreview",
									kind: "GTS.ToggleBar",

									mainText: "Transaction Preview",
									subText: "Show preview of a tapped transaction.",

									onText: "Yes",
									offText: "No",

									onChange: "updateTransPreview"
								}, {
									name: "updateNotice",
									kind: "GTS.ToggleBar",

									mainText: "System Notifications",
									subText: "Recieve in-app notices of updates and other important news.",

									onText: "Yes",
									offText: "No",

									onChange: "updateUpdateNotice"
								}, {
									name: "errorReporting",
									kind: "GTS.ToggleBar",

									mainText: "Error Reporting",
									subText: "Report errors to GlitchTech Science",

									onText: "Yes",
									offText: "No",

									onChange: "updateErrorReporting"
								}, {
									name: "dispColor",
									kind: "GTS.ToggleBar",

									mainText: "Account Colors",
									subText: "Add color in some areas based on account categories.",

									onText: "Yes",
									offText: "No",

									onChange: "updateDispColor"
								}, {
									showing: false,
									content: "backswipe save (function cannot not used on touchpad)"
								}
							]
						}, {
							kind: enyo.RowGroup,
							caption: "Accounts",
							components: [
								{
									name: "entries",
									kind: "Checkbook.accounts.list",

									style: "height: 300px;",
									className: "checkbook-stamp",

									balanceView: 4,

									editMode: true,

									onSetupRow: "setupRow",

									onModify: "doModify",
									onChanged: "doChanged",
									onDelete: "doDelete"
								}, {
									name: "defaultAccount",
									kind: "GTS.ListSelectorBar",
									className: "force-left-padding",

									disabled: true,

									labelText: "Default Account",
									onChange: "updateDefaultAccount",

									value: 0,
									choices: []
								}, {
									name: "addAccountButton",
									kind: enyo.Button,
									toggling: true,

									content: "Add Account",
									onclick: "addAccount"
								}
							]
						}, {
							kind: enyo.RowGroup,
							caption: "Add/Edit Categories",
							components: [
								{
									name: "editAccountCategories",
									kind: enyo.Button,
									toggling: true,

									content: "Edit Account Categories",
									onclick: "modifyAccountCategories"
								}, {
									name: "editTransactionCategories",
									kind: enyo.Button,
									toggling: true,

									content: "Edit Transaction Categories",
									onclick: "modifyTransactionCategories"
								}
							]
						}, {
							kind: enyo.Button,
							content: "Full Wipe",
							className: "enyo-button-negative",
							style: "margin-top: 1.5em;",
							onclick: "fullwipe"
						}
					]
				}
			]
		},

		{
			kind: enyo.Toolbar,
			className: "enyo-toolbar-light",
			components: [
				{
					kind: enyo.Spacer,
					flex: 4
				}, {
					kind: enyo.Button,

					flex: 2,
					className: "enyo-button-affirmative deep-green",

					caption: "Done",
					onclick: "doFinish"
				}, {
					kind: enyo.Spacer,
					flex: 4
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

		this.$['pinLock'].setValue( enyo.application.checkbookPrefs['useCode'] === 1 );
		this.$['pinCode'].setValue( enyo.application.checkbookPrefs['code'] );

		this.$['transPreview'].setValue( enyo.application.checkbookPrefs['transPreview'] === 1 );
		this.$['updateNotice'].setValue( enyo.application.checkbookPrefs['updateCheckNotification'] === 1 );
		this.$['errorReporting'].setValue( enyo.application.checkbookPrefs['errorReporting'] === 1 );
		this.$['dispColor'].setValue( enyo.application.checkbookPrefs['dispColor'] === 1 );

		enyo.application.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildDefaultAccountList ) } );

		this.$['entries'].renderAccountList();
	},

	/** PIN Controls **/

	togglePINStatus: function() {

		enyo.application.checkbookPrefs['useCode'] = ( this.$['pinLock'].getValue() ? 1 : 0 );
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

		this.$['pinPopup'].openAtCenter();
	},

	changeAppPinHandler: function( inSender, newPin ) {

		this.$['cryptoSystem'].encryptString(
				newPin,
				enyo.bind( this, this.cryptoPinHandler )
			);

		this.$['pinPopup'].close();
		this.$['pinPopup'].destroy();
	},

	cryptoPinHandler: function( cryptPin ) {

		if( cryptPin.length > 0 ) {

			enyo.application.checkbookPrefs['useCode'] = 1;
			enyo.application.checkbookPrefs['code'] = cryptPin;
		}

		this.saveAppPin();
	},

	saveAppPin: function() {

		if( enyo.application.checkbookPrefs['useCode'] === 0 || !enyo.isString( enyo.application.checkbookPrefs['code'] ) || enyo.application.checkbookPrefs['code'].length <= 0 ) {
			//if invalid or set to off;

			enyo.application.checkbookPrefs['useCode'] = 0;
			enyo.application.checkbookPrefs['code'] = "";
		}

		this.$['pinCode'].setValue( enyo.application.checkbookPrefs['code'] );

		enyo.application.gts_db.query( enyo.application.gts_db.getUpdate( "prefs", { "useCode": enyo.application.checkbookPrefs['useCode'], "code": enyo.application.checkbookPrefs['code'] }, {} ) );
	},

	/** General Controls **/

	updateTransPreview: function( inSender, inValue ) {

		enyo.application.checkbookPrefs['transPreview'] = ( inValue ? 1 : 0 );
		enyo.application.gts_db.query( enyo.application.gts_db.getUpdate( "prefs", { "previewTransaction": enyo.application.checkbookPrefs['transPreview'] }, {} ) );
	},

	updateUpdateNotice: function( inSender, inValue ) {

		enyo.application.checkbookPrefs['updateCheckNotification'] = ( inValue ? 1 : 0 );
		enyo.application.gts_db.query( enyo.application.gts_db.getUpdate( "prefs", { "updateCheckNotification": enyo.application.checkbookPrefs['updateCheckNotification'] }, {} ) );
	},

	updateErrorReporting: function( inSender, inValue ) {

		enyo.application.checkbookPrefs['errorReporting'] = ( inValue ? 1 : 0 );
		enyo.application.gts_db.query( enyo.application.gts_db.getUpdate( "prefs", { "errorReporting": enyo.application.checkbookPrefs['errorReporting'] }, {} ) );
	},

	updateDispColor: function( inSender, inValue ) {

		enyo.application.checkbookPrefs['dispColor'] = ( inValue ? 1 : 0 );
		enyo.application.gts_db.query( enyo.application.gts_db.getUpdate( "prefs", { "dispColor": enyo.application.checkbookPrefs['dispColor'] }, {} ) );
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
				caption: "No Default Account",
				color: null,
				icon: null,
				value: -1
			});

		this.$['defaultAccount'].setChoices( accounts );

		this.$['defaultAccount'].setDisabled( false );
		this.$['defaultAccount'].$['listName'].setDisabled( false );

		this.$['defaultAccount'].render();

		enyo.application.accountManager.fetchDefaultAccount( { "onSuccess": enyo.bind( this, this.setDefaultAccount ) } );
	},

	setDefaultAccount: function( result ) {

		if( result ) {

			this.$['defaultAccount'].setValue( result['acctId'] );
		} else {

			this.$['defaultAccount'].setValue( -1 );
		}
	},

	updateDefaultAccount: function( inSender, newVal, oldVal ) {

		enyo.application.accountManager.updateDefaultAccount( newVal );
	},

	addAccount: function() {

		//Prevent user from launching multiple New Account windows
		if( this.$['addAccountButton'].getDepressed() && !this.$['addAccountButton'].getDisabled() ) {

			this.$['addAccountButton'].setDisabled( true );

			enyo.nextTick(
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

		enyo.application.gts_db.queries(
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
