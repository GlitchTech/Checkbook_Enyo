/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.accounts.modify",
	kind: "FittableRows",
	classes: "enyo-fit",

	published: {
		acctId: -1
	},

	events: {
		onFinish: ""
	},

	categories: [],
	sorting: [],
	pinChanged: false,

	components: [
		{
			kind: "enyo.Scroller",
			horizontal: "hidden",
			classes: "rich-brown-gradient",
			fit: true,
			components: [
				{
					classes: "light narrow-column",
					style: "min-height: 100%;",
					components: [
						{
							kind: "onyx.Groupbox",
							classes: "padding-half-top",
							components: [
								{
									kind: "onyx.InputDecorator",
									layoutKind: "FittableColumnsLayout",
									components: [
										{
											name: "accountName",
											kind: "onyx.Input",
											placeholder: "Enter Account Name...",
											fit: true
										}, {
											content: "Account Name",
											classes: "label"
										}
									]
								}
							]
						}, {
							name: "accountCategory",
							kind: "GTS.SelectorBar",
							labelText: "Account Category",
							subLabelText: "Random other stuff goes here",
							onChange: "categoryChanged"
						}, {
							name: "defaultAccount",
							kind: GTS.ToggleBar,
							style: "padding-left: 0;",
							mainText: "Default Account",
							subText: "This account is launched automatically on start.",
							onText: "Yes",
							offText: "No"
						},

						{
							kind: enyo.DividerDrawer,
							caption: "Security Options",
							open: true,
							components: [
								{
									name: "freezeAccount",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Freeze Internal Transactions",
									subText: "Prevent any changes from being made only in this account.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "pinLock",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "PIN Lock",
									onText: "Yes",
									offText: "No",
									onChange: "togglePINStatus"
								}, {
									name: "pinLockDrawer",
									kind: enyo.BasicDrawer,
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

													onmousedown: "changePinCode",
													onmouseup: "changePinCode",

													hint: "Tap to set...",
													components: [
														{
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
						},

						{
							kind: enyo.DividerDrawer,
							caption: "Display Options",
							open: true,
							components: [
								{
									name: "transactionSorting",
									kind: "GTS.SelectorBar",
									labelText: "Sorting",
									onChange: "transactionSortingUpdateLabel"
								}, {
									name: "accountDisplay",
									kind: "GTS.SelectorBar",
									localizeOptions: false,
									labelText: "Display",
									onChange: "accountDisplayUpdateLabel",
									value: 0,
									choices: [
										{
											content: "Show Account",
											value: 0
										}, {
											content: "Mask Account",
											value: 1
										}, {
											content: "Hide Account",
											value: 2
										}
									]
								}, {
									name: "balance",
									kind: "GTS.SelectorBar",
									labelText: "Balance",
									onChange: "balanceUpdateLabel",
									value: 0,
									choices: [
										{
											content: "Available",
											value: 0
										}, {
											content: "Cleared",
											value: 1
										}, {
											content: "Pending",
											value: 3
										}, {
											content: "Final",
											value: 2
										}
									]
								}, {
									name: "showTransTime",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Show Transaction Time",
									subText: "Displays the transaction time in addition to the date.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									name: "showRunningBal",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Show Running Balance",
									subText: "Running balance will be shown beneath transaction amount. The transaction amount will be black and the current balance will be colored. Only available in certain sort modes.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "hideTransNotes",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Hide Transaction Notes",
									subText: "Transaction notes will be hidden.",
									onText: "Yes",
									offText: "No"
								}
							]
						},

						{
							kind: enyo.DividerDrawer,
							caption: "Transaction Options",
							open: true,
							components: [
								{
									name: "descriptionMultilineMode",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Description Multiline Mode",
									subText: "Allows the transaction description to take up multiple lines in the add/edit transaction screen.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "autoComplete",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Use Auto-Complete",
									subText: "Displays suggestions for transaction descriptions based on your history.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									name: "atmMode",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Use ATM Mode",
									subText: "Amount field will be automatically formatted as you type.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									name: "autoTransfer",
									kind: "GTS.SelectorBar",
									labelText: "Auto Transfer",
									onChange: "toggleAutoTransferDrawer",
									value: 0,
									choices: [
										{
											content: "Do not transfer",
											value: 0
										}, {
											content: "Transfer remainder",
											value: 1
										}, {
											content: "Transfer additional dollar",
											value: 2
										}
									]
								}, {
									name: "autoTransferDrawer",
									kind: enyo.BasicDrawer,
									components: [
										{
											name: "autoTransferLink",
											kind: "GTS.SelectorBar",
											labelText: "Transfer to...",
											classes: "iconListSelector"
										}
									]
								}, {
									name: "checkNumber",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Add Check Number Field",
									subText: "Add a field to record the check number in the add/edit transaction screen.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "expenseCategories",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Add Expense Categories",
									subText: "Add a field to record the expense category in the add/edit transaction screen.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									showing: false,

									name: "hideCleared",
									kind: GTS.ToggleBar,
									style: "padding-left: 0;",
									mainText: "Hide cleared transactions",
									subText: "",
									onText: "Yes",
									offText: "No"
								}
							]
						},

						{
							kind: enyo.Group,
							align: "center",
							tapHightlight: false,
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									name: "accountNotes",
									kind: enyo.RichText,
									hint: "Account specific notes",
									style: "min-height: 150px;",
									flex: 1,
									components: [
										{
											content: "Notes",
											classes: "label"
										}
									]
								}
							]
						},

						{
							name: "accountDeleteButton",
							kind: "onyx.Button",

							ontap: "deleteAccount",

							content: "Delete Account",

							classes: "onyx-negative",
							style: "margin-top: 1.5em; width: 100%;"
						}, {
							style: "height: 1.5em;"
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
					content: "Cancel",
					style: "width: 150px",
					ontap: "doFinish"
				}, {
					style: "width: 50px;"
				}, {
					kind: "onyx.Button",
					content: "Save",
					classes: "onyx-affirmative",
					style: "width: 150px;",
					ontap: "saveAccount"
				}
			]
		},

		{
			name: "loadingScrim",
			kind: onyx.Scrim,
			classes: "onyx-scrim-translucent"
		}, {
			name: "loadingSpinner",
			kind: "jmtk.Spinner",
			color: "#284907",
			diameter: "90",
			shape: "spiral",

			style: "z-index: 2; position: absolute; width: 90px; height: 90px; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
		},

		{
			name: "appMenu",
			kind: enyo.AppMenu,
			scrim: true,
			components: [
				{
					//kind: "EditMenu"
				}
			]
		},

		{
			name: "acctCategoryManager",
			kind: "Checkbook.accountCategory.manager"
		}
	],

	constructor: function() {

		this.inherited( arguments );

		this.log();

		//Setup listing of bound methods
		this._binds = {
		};
	},

	rendered: function() {

		this.inherited( arguments );

		this.log();

		this.$['loadingScrim'].show();
		this.$['loadingSpinner'].show();

		//Account Category Options
		this.$['acctCategoryManager'].fetchCategories( { "onSuccess": enyo.bind( this, this.buildAccountCategories ) } );
	},

	buildAccountCategories: function( results ) {

		var row = null;
		this.categories = {
				assoc: {},
				choices: []
			};

		for( var i = 0; i < results.length; i++ ) {

			row = results[i];

			if( row ) {

				this.categories['assoc'][row['name']] = {
							icon: "assets/" + row['icon'],
							color: row['color']
						};

				this.categories['choices'].push(
						{
							content: row['name'],
							icon: "assets/" + row['icon'],
							color: row['color'],
							value: row['name']
						}
					);
			}
		}

		this.$['accountCategory'].setChoices( this.categories['choices'] );

		//Transaction Sort Options
		if( transactionSortOptions.length <= 0 ) {

			Checkbook.globals.transactionManager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	buildTransactionSorting: function() {

		this.$['transactionSorting'].setChoices( transactionSortOptions );

		//Transaction Sort Options
		Checkbook.globals.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAutoTransferLink ) } );
	},

	buildAutoTransferLink: function( accounts ) {

		if( accounts.length > 0) {

			this.$['autoTransferLink'].setChoices( accounts );

			this.$['autoTransferLink'].setDisabled( false );
			//this.$['autoTransferLink'].$['listName'].setDisabled( false );

			this.$['autoTransferLink'].render();

		} else {

			this.$['autoTransferLink'].setDisabled( true );
			//this.$['autoTransferLink'].$['listName'].setDisabled( true );
		}

		enyo.asyncMethod(
				this,
				this.setAccountValues
			);
	},

	transactionSortingUpdateLabel: function() {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "acctTrsnSortOptn", [ "desc" ], { "sortId": this.$['transactionSorting'].getValue() } ),
				{
					"onSuccess": enyo.bind( this, this.transactionSortingUpdateLabelHandler )
					//"onError": handled by database.js
				}
			);
	},

	transactionSortingUpdateLabelHandler: function( results ) {

		if( results[0]['desc'] ) {

			this.$['transactionSorting'].setSubLabelText( results[0]['desc'] );
		} else {

			this.$['transactionSorting'].setSubLabelText( "" );
		}
	},

	accountDisplayUpdateLabel: function() {

		var value = this.$['accountDisplay'].getValue();

		if( value === 0 ) {

			this.$['accountDisplay'].setSubLabelText( "Account is visible." );
		} else if( value === 1 ) {

			this.$['accountDisplay'].setSubLabelText( "Account is visible, but removed from total balance calculations." );
		} else if( value === 2 ) {

			this.$['accountDisplay'].setSubLabelText( "Account is hidden and removed from total balance calculations. Account can still be accessed via Preferences." );
		}
	},

	balanceUpdateLabel: function() {

		var value = this.$['balance'].getValue();

		if( value === 0 ) {

			this.$['balance'].setSubLabelText( "Includes all transactions up to current date/time." );
		} else if( value === 1 ) {

			this.$['balance'].setSubLabelText( "Includes all cleared transactions up to current date/time." );
		} else if( value === 2 ) {

			this.$['balance'].setSubLabelText( "Includes all transactions." );
		} else if( value === 3 ) {

			this.$['balance'].setSubLabelText( "Includes all pending transactions." );
		}
	},

	categoryChanged: function( inSender, newVal, oldVal ) {

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			if( this.categories['assoc'][oldVal] ) {

				this.$['accountCategory'].removeClass( this.categories['assoc'][oldVal]['color'] );
			}

			if( this.categories['assoc'][newVal] ) {

				this.$['accountCategory'].addClass( this.categories['assoc'][newVal]['color'] );
			}
		}
	},

	togglePINStatus: function() {

		this.$['pinLockDrawer'].setOpen( this.$['pinLock'].getValue() );
	},

	changePinCode: function() {

		this.createComponent(
				{
					name: "pinPopup",
					kind: "Checkbook.pinChangePopup",

					onFinish: "changePinCodeHandler"
				}
			);

		this.$['pinPopup'].openAtCenter();
	},

	changePinCodeHandler: function( inSender, newPin ) {

		if( enyo.isString( newPin ) ) {

			this.$['pinCode'].setValue( newPin );
			this.pinChanged = true;
		}

		this.$['pinPopup'].close();
		this.$['pinPopup'].destroy();
	},

	toggleAutoTransferDrawer: function() {

		var value = this.$['autoTransfer'].getValue();

		if( value === 0 ) {

			this.$['autoTransfer'].setSubLabelText( "Do not transfer anything." );
		} else if( value === 1 ) {

			this.$['autoTransfer'].setSubLabelText( "Remainder of dollar amount will be transferred to selected account." );
		} else if( value === 2 ) {

			this.$['autoTransfer'].setSubLabelText( "Additional dollar will be transferred to selected account." );
		}

		this.$['autoTransferDrawer'].setOpen( this.$['autoTransfer'].getValue() > 0	 );
	},

	//Set up UI & Data
	setAccountValues: function() {

		this.log();

		if( this.acctId >= 0 ) {

			Checkbook.globals.accountManager.fetchAccount(
					this.acctId,
					{
						"onSuccess": enyo.bind( this, this.renderDisplayItems ),
						"onError": null
					}
				);
		} else {

			this.renderDisplayItems(
						{
							"acctId": -1,
							"acctName": "",
							"acctNotes": "",
							"acctCategory": this.categories['choices'][0]['value'],
							"sort": transactionSortOptions[0]['value'],
							"defaultAccount": 0,
							"frozen": 0,
							"hidden": 0,
							"acctLocked": 0,
							"lockedCode": "",
							"transDescMultiLine": 0,
							"showTransTime": 1,
							"useAutoComplete": 1,
							"atmEntry": 1,
							"bal_view": 0,
							"runningBalance": 1,
							"checkField": 0,
							"hideNotes": 0,
							"enableCategories": 1,
							"hide_cleared": 0,
							"last_sync": "",
							"auto_savings": 0,
							"auto_savings_link": -1
						}
				);
		}
	},

	renderDisplayItems: function( results ) {

		if( !results || typeof( results ) === "undefined" ) {

			this.doFinish( 0 );
			return;
		}

		this.$['accountName'].setValue( results['acctName'] );
		this.$['accountCategory'].setValue( results['acctCategory'] );
		this.$['accountNotes'].setValue( results['acctNotes'] );

		//this.$['freezeAccount'].setValue( results['frozen'] === 1 );
		//this.$['pinLock'].setValue( results['acctLocked'] === 1 );
		//this.$['pinCode'].setValue( results['lockedCode'] );

		this.$['transactionSorting'].setValue( results['sort'] );
		this.$['accountDisplay'].setValue( results['hidden'] );
		this.$['balance'].setValue( results['bal_view'] );
		//this.$['defaultAccount'].setValue( results['defaultAccount'] === 1 );
		//this.$['showTransTime'].setValue( results['showTransTime'] === 1 );
		//this.$['showRunningBal'].setValue( results['runningBalance'] === 1 );
		//this.$['hideTransNotes'].setValue( results['hideNotes'] === 1 );

		//this.$['descriptionMultilineMode'].setValue( results['transDescMultiLine'] === 1 );
		//this.$['autoComplete'].setValue( results['useAutoComplete'] === 1 );
		//this.$['atmMode'].setValue( results['atmEntry'] === 1 );
		this.$['autoTransfer'].setValue( results['auto_savings'] );
		this.$['autoTransferLink'].setValue( results['auto_savings_link'] );
		//this.$['checkNumber'].setValue( results['checkField'] === 1 );
		//this.$['expenseCategories'].setValue( results['enableCategories'] === 1 );
		//this.$['hideCleared'].setValue( results['hide_cleared'] === 1 );//DNE

		//Adjust Sublabel elements
		this.transactionSortingUpdateLabel();
		this.accountDisplayUpdateLabel();
		this.balanceUpdateLabel();

		//Adjust Drawer elements
		//this.togglePINStatus();
		//this.toggleAutoTransferDrawer();

		this.categoryChanged( null, this.$['accountCategory'].getValue(), null );

		if( this.acctId < 0 ) {
			//Can"t delete an account that doesn"t exist

			this.$['accountDeleteButton'].hide();
		}

		this.$['loadingScrim'].hide();
		this.$['loadingSpinner'].hide();

		//this.$['accountName'].forceFocusEnableKeyboard();
	},

	saveAccount: function() {

		this.log();

		if( this.$['accountName'].getValue().length <= 0 ) {

			//Alert, you need an account name

			return;
		}

		var data = {
				"acctName": this.$['accountName'].getValue(),
				"acctNotes": this.$['accountNotes'].getValue(),
				"acctCategory": this.$['accountCategory'].getValue(),
				"sort": this.$['transactionSorting'].getValue(),
				"defaultAccount": this.$['defaultAccount'].getValue(),
				"frozen": this.$['freezeAccount'].getValue(),
				"hidden": this.$['accountDisplay'].getValue(),
				"acctLocked": this.$['pinLock'].getValue(),
				"lockedCode": this.$['pinCode'].getValue(),
				"transDescMultiLine": this.$['descriptionMultilineMode'].getValue(),
				"showTransTime": this.$['showTransTime'].getValue(),
				"useAutoComplete": this.$['autoComplete'].getValue(),
				"atmEntry": this.$['atmMode'].getValue(),
				"auto_savings": this.$['autoTransfer'].getValue(),
				"auto_savings_link": this.$['autoTransferLink'].getValue(),
				"bal_view": this.$['balance'].getValue(),
				"runningBalance": this.$['showRunningBal'].getValue(),
				"checkField": this.$['checkNumber'].getValue(),
				"hideNotes": this.$['hideTransNotes'].getValue(),
				"enableCategories": this.$['expenseCategories'].getValue(),
				"hide_cleared": false
			};

		var options = {
				"onSuccess": enyo.bind( this, this.doFinish, 1 )
			};

		if( this.acctId < 0 ) {

			Checkbook.globals.accountManager.createAccount( data, options );
		} else {

			Checkbook.globals.accountManager.updateAccount( data, this.acctId, this.pinChanged, options );
		}
	},

	deleteAccount: function() {

		if( this.acctId < 0 ) {

			this.doFinish( 0 );
		} else {

			this.createComponent( {
					name: "deleteAccountConfirm",
					kind: "GTS.deleteConfirm",

					owner: this,

					confirmTitle: "Delete Account",
					confirmMessage: "Are you sure you want to delete this account?",
					confirmButtonYes: "Delete",
					confirmButtonNo: "Cancel",

					onYes: "deleteAccountHandler",
					onNo: "deleteAccountConfirmClose"
				});

			this.$['deleteAccountConfirm'].render();
			this.$['deleteAccountConfirm'].openAtCenter();
		}
	},

	deleteAccountConfirmClose: function() {

		this.$['deleteAccountConfirm'].destroy();
	},

	deleteAccountHandler: function() {

		Checkbook.globals.accountManager.deleteAccount(
				this.acctId,
				{
					"onSuccess": enyo.bind( this, this.doFinish, 2 )
				}
			);
	}
});
