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
							classes: "padding-half-top padding-half-bottom",
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
							classes: "custom-background bordered",

							label: "Account Category",
							onChange: "categoryChanged"
						}, {
							name: "defaultAccount",
							kind: "GTS.ToggleBar",
							classes: "bordered",

							label: "Default Account",
							sublabel: "This account is launched automatically on start.",
							onContent: "Yes",
							offText: "No"
						},

						{
							name: "securityOptionDrawer",
							kind: "GTS.DividerDrawer",
							caption: "Security Options",
							open: true,
							components: [
								{
									name: "freezeAccount",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Freeze Internal Transactions",
									sublabel: "Prevent any changes from being made only in this account.",
									onContent: "Yes",
									offText: "No"
								}, {
									name: "pinLock",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "PIN Lock",
									onContent: "Yes",
									offText: "No",
									onChange: "togglePINStatus"
								}, {
									name: "pinLockDrawer",
									kind: "onyx.Drawer",
									open: false,
									components: [
										{
											kind: "onyx.Groupbox",
											classes: "padding-half-top",
											ontap: "changePinCode",
											components: [
												{
													kind: "onyx.InputDecorator",
													layoutKind: "FittableColumnsLayout",
													components: [
														{
															name: "pinCode",
															kind: "onyx.Input",
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
						},

						{
							kind: "GTS.DividerDrawer",
							caption: "Display Options",
							open: true,
							components: [
								{
									name: "transactionSorting",
									kind: "GTS.SelectorBar",
									classes: "bordered",

									label: "Sorting",
									onChange: "transactionSortingUpdateLabel"
								}, {
									name: "accountDisplay",
									kind: "GTS.SelectorBar",
									classes: "bordered",

									label: "Display",
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
									classes: "bordered",

									label: "Balance",
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
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Show Transaction Time",
									sublabel: "Displays the transaction time in addition to the date.",
									onContent: "Yes",
									offText: "No",
									value: true
								}, {
									name: "showRunningBal",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Show Running Balance",
									sublabel: "Running balance will be shown beneath transaction amount. The transaction amount will be black and the current balance will be colored. Only available in certain sort modes.",
									onContent: "Yes",
									offText: "No"
								}, {
									name: "hideTransNotes",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Hide Transaction Notes",
									sublabel: "Transaction notes will be hidden.",
									onContent: "Yes",
									offText: "No"
								}
							]
						},

						{
							kind: "GTS.DividerDrawer",
							caption: "Transaction Options",
							open: true,
							components: [
								{
									name: "descriptionMultilineMode",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Description Multiline Mode",
									sublabel: "Allows the transaction description to take up multiple lines in the add/edit transaction screen.",
									onContent: "Yes",
									offText: "No"
								}, {
									name: "autoComplete",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Use Auto-Complete",
									sublabel: "Displays suggestions for transaction descriptions based on your history.",
									onContent: "Yes",
									offText: "No",
									value: true
								}, {
									name: "atmMode",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Use ATM Mode",
									sublabel: "Amount field will be automatically formatted as you type.",
									onContent: "Yes",
									offText: "No",
									value: true
								}, {
									name: "autoTransfer",
									kind: "GTS.SelectorBar",
									classes: "bordered",

									label: "Auto Transfer",
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
									kind: "onyx.Drawer",
									components: [
										{
											name: "autoTransferLink",
											kind: "GTS.SelectorBar",

											label: "Transfer to...",
											classes: "iconListSelector"
										}
									]
								}, {
									name: "checkNumber",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Add Check Number Field",
									sublabel: "Add a field to record the check number in the add/edit transaction screen.",
									onContent: "Yes",
									offText: "No"
								}, {
									name: "expenseCategories",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Add Expense Categories",
									sublabel: "Add a field to record the expense category in the add/edit transaction screen.",
									onContent: "Yes",
									offText: "No",
									value: true
								}, {
									showing: false,

									name: "hideCleared",
									kind: "GTS.ToggleBar",
									classes: "bordered",

									label: "Hide cleared transactions",
									sublabel: "",
									onContent: "Yes",
									offText: "No"
								}
							]
						},

						{
							kind: "onyx.Groupbox",
							classes: "padding-half-top",
							components: [
								{
									kind: "onyx.InputDecorator",
									layoutKind: "FittableColumnsLayout",
									components: [
										{
											name: "accountNotes",
											kind: "onyx.TextArea",
											placeholder: "Account specific notes",

											style: "min-height: 150px;",
											fit: true
										}, {
											content: "Notes",
											classes: "label",
											style: "vertical-align: top;"
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
			kind: "onyx.Scrim",
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

	/**
	 * TODO DEFINITION
	 */
	constructor: function() {

		this.inherited( arguments );

		this.log();

		//Setup listing of bound methods
		this._binds = {
		};
	},

	/**
	 * TODO DEFINITION
	 */
	rendered: function() {

		this.inherited( arguments );

		this.log();

		this.$['loadingScrim'].show();
		this.$['loadingSpinner'].show();

		//Account Category Options
		this.$['acctCategoryManager'].fetchCategories( { "onSuccess": enyo.bind( this, this.buildAccountCategories ) } );
	},

	/**
	 * TODO DEFINITION
	 */
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

	/**
	 * TODO DEFINITION
	 */
	buildTransactionSorting: function() {

		this.$['transactionSorting'].setChoices( transactionSortOptions );

		//Transaction Sort Options
		Checkbook.globals.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAutoTransferLink ) } );
	},

	/**
	 * TODO DEFINITION
	 */
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

	/**
	 * TODO DEFINITION
	 */
	transactionSortingUpdateLabel: function() {

		Checkbook.globals.gts_db.query(
				Checkbook.globals.gts_db.getSelect( "acctTrsnSortOptn", [ "desc" ], { "sortId": this.$['transactionSorting'].getValue() } ),
				{
					"onSuccess": enyo.bind( this, this.transactionSortingUpdateLabelHandler )
					//"onError": handled by database.js
				}
			);
	},

	/**
	 * TODO DEFINITION
	 */
	transactionSortingUpdateLabelHandler: function( results ) {

		if( results[0]['desc'] ) {

			this.$['transactionSorting'].setSublabel( results[0]['desc'] );
		} else {

			this.$['transactionSorting'].setSublabel( "" );
		}
	},

	/**
	 * TODO DEFINITION
	 */
	accountDisplayUpdateLabel: function() {

		var value = this.$['accountDisplay'].getValue();

		if( value === 0 ) {

			this.$['accountDisplay'].setSublabel( "Account is visible." );
		} else if( value === 1 ) {

			this.$['accountDisplay'].setSublabel( "Account is visible, but removed from total balance calculations." );
		} else if( value === 2 ) {

			this.$['accountDisplay'].setSublabel( "Account is hidden and removed from total balance calculations. Account can still be accessed via Preferences." );
		}
	},

	/**
	 * TODO DEFINITION
	 */
	balanceUpdateLabel: function() {

		var value = this.$['balance'].getValue();

		if( value === 0 ) {

			this.$['balance'].setSublabel( "Includes all transactions up to current date/time." );
		} else if( value === 1 ) {

			this.$['balance'].setSublabel( "Includes all cleared transactions up to current date/time." );
		} else if( value === 2 ) {

			this.$['balance'].setSublabel( "Includes all transactions." );
		} else if( value === 3 ) {

			this.$['balance'].setSublabel( "Includes all pending transactions." );
		}
	},

	/**
	 * TODO DEFINITION
	 */
	categoryChanged: function() {

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			for( var i = 0; i < appColors.length; i++ ) {

				this.$['accountCategory'].removeClass( appColors[i]['name'] );
			}

			var newCat = this.$['accountCategory'].getValue();

			if( this.categories['assoc'][newCat] ) {

				this.$['accountCategory'].addClass( this.categories['assoc'][newCat]['color'] );
			}
		}
	},

	/**
	 * TODO DEFINITION
	 */
	togglePINStatus: function() {

		this.$['pinLockDrawer'].setOpen( this.$['pinLock'].getValue() );
	},

	/**
	 * TODO DEFINITION
	 */
	changePinCode: function() {

		this.createComponent(
				{
					name: "pinPopup",
					kind: "Checkbook.pinChangePopup",

					onFinish: "changePinCodeHandler"
				}
			);

		this.$['pinPopup'].show();
	},

	/**
	 * TODO DEFINITION
	 */
	changePinCodeHandler: function( inSender, newPin ) {

		if( enyo.isString( newPin ) ) {

			this.$['pinCode'].setValue( newPin );
			this.pinChanged = true;
		}

		this.$['pinPopup'].hide();
		this.$['pinPopup'].destroy();
	},

	/**
	 * TODO DEFINITION
	 */
	toggleAutoTransferDrawer: function() {

		var value = this.$['autoTransfer'].getValue();

		if( value === 0 ) {

			this.$['autoTransfer'].setSublabel( "Do not transfer anything." );
		} else if( value === 1 ) {

			this.$['autoTransfer'].setSublabel( "Remainder of dollar amount will be transferred to selected account." );
		} else if( value === 2 ) {

			this.$['autoTransfer'].setSublabel( "Additional dollar will be transferred to selected account." );
		}

		this.$['autoTransferDrawer'].setOpen( this.$['autoTransfer'].getValue() > 0	 );
	},

	/**
	 * TODO DEFINITION
	 */
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

	/**
	 * TODO DEFINITION
	 */
	renderDisplayItems: function( results ) {

		if( !results || typeof( results ) === "undefined" ) {

			this.doFinish( 0 );
			return;
		}

		this.$['accountName'].setValue( results['acctName'] );
		this.$['accountCategory'].setValue( results['acctCategory'] );
		this.$['accountNotes'].setValue( results['acctNotes'] );

		this.$['freezeAccount'].setValue( results['frozen'] === 1 );
		this.$['pinLock'].setValue( results['acctLocked'] === 1 );
		this.$['pinCode'].setValue( results['lockedCode'] );

		this.$['transactionSorting'].setValue( results['sort'] );
		this.$['accountDisplay'].setValue( results['hidden'] );
		this.$['balance'].setValue( results['bal_view'] );
		this.$['defaultAccount'].setValue( results['defaultAccount'] === 1 );
		this.$['showTransTime'].setValue( results['showTransTime'] === 1 );
		this.$['showRunningBal'].setValue( results['runningBalance'] === 1 );
		this.$['hideTransNotes'].setValue( results['hideNotes'] === 1 );

		this.$['descriptionMultilineMode'].setValue( results['transDescMultiLine'] === 1 );
		this.$['autoComplete'].setValue( results['useAutoComplete'] === 1 );
		this.$['atmMode'].setValue( results['atmEntry'] === 1 );
		this.$['autoTransfer'].setValue( results['auto_savings'] );
		this.$['autoTransferLink'].setValue( results['auto_savings_link'] );
		this.$['checkNumber'].setValue( results['checkField'] === 1 );
		this.$['expenseCategories'].setValue( results['enableCategories'] === 1 );
		this.$['hideCleared'].setValue( results['hide_cleared'] === 1 );//DNE

		//Adjust Sublabel elements
		this.transactionSortingUpdateLabel();
		this.accountDisplayUpdateLabel();
		this.balanceUpdateLabel();

		//Adjust Drawer elements
		this.togglePINStatus();
		this.toggleAutoTransferDrawer();

		this.categoryChanged();

		if( this.acctId < 0 ) {
			//Can"t delete an account that doesn"t exist

			this.$['accountDeleteButton'].hide();
		}

		this.$['loadingScrim'].hide();
		this.$['loadingSpinner'].hide();

		this.$['accountName'].focus();
	},

	/**
	 * TODO DEFINITION
	 */
	saveAccount: function() {

		if( this.$['accountName'].getValue().length <= 0 ) {

			//Alert, you need an account name
			alert( "you need an account name (replace this)" );

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
				"onSuccess": enyo.bind( this, this.tryFinish )
			};

		if( this.acctId < 0 ) {

			Checkbook.globals.accountManager.createAccount( data, options );
		} else {

			Checkbook.globals.accountManager.updateAccount( data, this.acctId, this.pinChanged, options );
		}
	},

	tryFinish: function( status ) {

		this.doFinish( { "action": 1, "actionStatus": status } );
	},

	/**
	 * TODO DEFINITION
	 */
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
			this.$['deleteAccountConfirm'].show();
		}
	},

	/**
	 * TODO DEFINITION
	 */
	deleteAccountConfirmClose: function() {

		this.$['deleteAccountConfirm'].destroy();
	},

	/**
	 * TODO DEFINITION
	 */
	deleteAccountHandler: function() {

		Checkbook.globals.accountManager.deleteAccount(
				this.acctId,
				{
					"onSuccess": enyo.bind( this, this.doFinish, 2 )
				}
			);
	}
});
