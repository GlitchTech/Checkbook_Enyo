/* Copyright ? 2013, GlitchTech Science */

/**
 * @name Checkbook.accounts.modify
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @class
 * @version 2.0 (2012/08/08)
 */
enyo.kind( {
	name: "Checkbook.accounts.modify",
	kind: "FittableRows",
	classes: "enyo-fit",

	published: {
		/** @lends Checkbook.accounts.modify# */

		/**
		 * account id; -1 to create new
		 * @type integer
		 * @default -1
		 */
		acctId: -1
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends Checkbook.accounts.modify# */

		/**
		 * Modification complete
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onFinish: ""
	},

	categories: [],
	sorting: [],
	pinChanged: false,

	/**
	 * @protected
	 * @type Array
	 * Components of the control
	 */
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
							kind: "gts.SelectorBar",
							classes: "custom-background bordered",

							label: "Account Category",

							onChange: "categoryChanged"
						}, {
							name: "defaultAccount",
							kind: "gts.ToggleBar",
							classes: "bordered",

							label: "Default Account",
							sublabel: "This account is launched automatically on start.",
							onContent: "Yes",
							offContent: "No"
						},

						{
							name: "securityOptionDrawer",
							kind: "gts.DividerDrawer",
							caption: "Security Options",
							open: true,
							components: [
								{
									name: "freezeAccount",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Freeze Internal Transactions",
									sublabel: "Prevent any changes from being made only in this account.",
									onContent: "Yes",
									offContent: "No"
								}, {
									name: "pinLock",
									kind: "gts.ToggleBar",
									classes: "bordered",

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
											ontap: "changePinCode",
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
						},

						{
							kind: "gts.DividerDrawer",
							caption: "Display Options",
							open: true,
							components: [
								{
									name: "transactionSorting",
									kind: "gts.SelectorBar",
									classes: "bordered",

									label: "Sorting",
									maxHeight: 350,
									labelWidth: "150px",

									onChange: "transactionSortingUpdateLabel"
								}, {
									name: "accountDisplay",
									kind: "gts.SelectorBar",
									classes: "bordered",

									label: "Display",
									maxHeight: 350,
									labelWidth: "150px",

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
									kind: "gts.SelectorBar",
									classes: "bordered",

									label: "Balance",
									maxHeight: 350,
									labelWidth: "150px",

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
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Show Transaction Time",
									sublabel: "Displays the transaction time in addition to the date.",
									onContent: "Yes",
									offContent: "No",
									value: true
								}, {
									name: "showRunningBal",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Show Running Balance",
									sublabel: "Running balance will be shown beneath transaction amount. The transaction amount will be black and the current balance will be colored. Only available in certain sort modes.",
									onContent: "Yes",
									offContent: "No"
								}, {
									name: "hideTransNotes",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Hide Transaction Notes",
									sublabel: "Transaction notes will be hidden.",
									onContent: "Yes",
									offContent: "No"
								}
							]
						},

						{
							kind: "gts.DividerDrawer",
							caption: "Transaction Options",
							open: true,
							components: [
								{
									name: "descriptionMultilineMode",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Description Multiline Mode",
									sublabel: "Allows the transaction description to take up multiple lines in the add/edit transaction screen.",
									onContent: "Yes",
									offContent: "No"
								}, {
									name: "autoComplete",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Use Auto-Complete",
									sublabel: "Displays suggestions for transaction descriptions based on your history.",
									onContent: "Yes",
									offContent: "No",
									value: true
								}, {
									name: "atmMode",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Use ATM Mode",
									sublabel: "Amount field will be automatically formatted as you type.",
									onContent: "Yes",
									offContent: "No",
									value: true
								}, {
									name: "autoTransfer",
									kind: "gts.SelectorBar",
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
											kind: "gts.SelectorBar",

											label: "Transfer to...",
											classes: "iconListSelector"
										}
									]
								}, {
									name: "expenseCategories",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Add Expense Categories",
									sublabel: "Add a field to record the expense category in the add/edit transaction screen.",
									onContent: "Yes",
									offContent: "No",
									value: true
								}, {
									name: "checkNumber",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Add Check Number Field",
									sublabel: "Add a field to record the check number in the add/edit transaction screen.",
									onContent: "Yes",
									offContent: "No"
								}, {
									name: "payeeField",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Add Payee Field",
									sublabel: "Add a field to record the payee in the add/edit transaction screen.",
									onContent: "Yes",
									offContent: "No",
									value: false
								}, {
									showing: false,

									name: "hideCleared",
									kind: "gts.ToggleBar",
									classes: "bordered",

									label: "Hide cleared transactions",
									sublabel: "",
									onContent: "Yes",
									offContent: "No"
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
			classes: "text-center two-button-toolbar",
			components: [
				{
					kind: "onyx.Button",
					content: "Cancel",
					ontap: "doFinish"
				}, {
					content: ""
				}, {
					kind: "onyx.Button",
					content: "Save",
					classes: "onyx-affirmative",
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
			kind: "onyx.Spinner",
			classes: "size-double",

			style: "z-index: 2; position: absolute; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
		},

		{
			name: "acctCategoryManager",
			kind: "Checkbook.accountCategory.manager"
		}
	],

	/**
	 * @protected
	 * @function
	 * @name Checkbook.accounts.modify#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.$['loadingScrim'].show();
		this.$['loadingSpinner'].show();

		//Account Category Options
		this.$['acctCategoryManager'].fetchCategories( { "onSuccess": enyo.bind( this, this.buildAccountCategories ) } );
	},

	/**
	 * @protected
	 * @function
	 * @name Checkbook.accounts.modify#buildAccountCategories
	 *
	 * @param {Object} results	SQL results of account categories
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
							kind: "gts.MenuImageItem",

							content: row['name'],
							src: "assets/" + row['icon'],

							color: row['color'],
							value: row['name']
						}
					);
			}
		}

		this.$['accountCategory'].setChoices( this.categories['choices'] );

		//Transaction Sort Options
		if( transactionSortOptions.length <= 0 ) {

			Checkbook.transactions.manager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	buildTransactionSorting: function() {

		this.$['transactionSorting'].setChoices( transactionSortOptions );

		//Transaction Sort Options
		Checkbook.accounts.manager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAutoTransferLink ) } );
	},

	buildAutoTransferLink: function( accounts ) {

		if( accounts.length > 0) {

			this.$['autoTransferLink'].setChoices( accounts );

			this.$['autoTransfer'].setDisabled( false );
			this.$['autoTransferLink'].setDisabled( false );
		} else {

			this.$['autoTransfer'].setValue( 0 );
			this.$['autoTransfer'].setDisabled( true );
			this.$['autoTransferLink'].setDisabled( true );
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

			this.$['transactionSorting'].setSublabel( results[0]['desc'] );
		} else {

			this.$['transactionSorting'].setSublabel( "" );
		}
	},

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

	togglePINStatus: function() {

		this.$['pinLockDrawer'].setOpen( this.$['pinLock'].getValue() );
		return true;
	},

	changePinCode: function() {

		this.createComponent(
				{
					name: "pinPopup",
					kind: "Checkbook.pinChangePopup",

					onFinish: "changePinCodeHandler",
					onHide: "resized"
				}
			);

		this.$['pinPopup'].show();
	},

	changePinCodeHandler: function( inSender, inEvent ) {

		if( enyo.isString( inEvent.value ) ) {

			this.$['pinCode'].setValue( inEvent.value );
			this.pinChanged = true;
		}

		this.$['pinPopup'].hide();
		this.$['pinPopup'].destroy();
	},

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

	//Set up UI & Data
	setAccountValues: function() {

		this.log();

		if( this.acctId >= 0 ) {

			Checkbook.accounts.manager.fetchAccount(
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
							"auto_savings_link": -1,
							"payeeField": 0
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
		this.$['payeeField'].setValue( results['payeeField'] === 1 );
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

		this.resized();
	},

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
				"payeeField": this.$['payeeField'].getValue(),
				"hide_cleared": false
			};

		var options = {
				"onSuccess": enyo.bind( this, this.saveFinished )
			};

		if( this.acctId < 0 ) {

			Checkbook.accounts.manager.createAccount( data, options );
		} else {

			Checkbook.accounts.manager.updateAccount( data, this.acctId, this.pinChanged, options );
		}
	},

	saveFinished: function( status ) {

		enyo.asyncMethod( this, this.doFinish, { "action": 1, "actionStatus": status } );
	},

	deleteAccount: function() {

		if( this.acctId < 0 ) {

			this.doFinish( 0 );
		} else {

			this.createComponent( {
					name: "deleteAccountConfirm",
					kind: "gts.ConfirmDialog",

					title: "Delete Account",
					message: "Are you sure you want to delete this account?",

					confirmText: "Delete",
					confirmClass: "onyx-negative",

					cancelText: "Cancel",
					cancelClass: "",

					onConfirm: "deleteAccountHandler",
					onCancel: "deleteAccountConfirmClose"
				});

			this.$['deleteAccountConfirm'].show();
		}
	},

	deleteAccountConfirmClose: function() {

		this.$['deleteAccountConfirm'].hide();
		this.$['deleteAccountConfirm'].destroy();
	},

	deleteAccountHandler: function() {

		this.deleteAccountConfirmClose();

		Checkbook.accounts.manager.deleteAccount(
				this.acctId,
				{
					"onSuccess": enyo.bind( this, this.deleteFinished )
				}
			);
	},

	deleteFinished: function( status ) {

		enyo.asyncMethod( this, this.doFinish, { "action": 2, "actionStatus": status } );
	}
});
