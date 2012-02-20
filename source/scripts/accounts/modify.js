/* Copyright © 2011, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.accounts.modify",
	kind: enyo.VFlexBox,

	style: "height: 100%;",

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
			kind: enyo.Scroller,
			autoHorizontal: false,
			horizontal: false,
			className: "rich-brown-gradient",
			flex: 1,
			components: [
				{
					layoutKind: enyo.VFlexLayout,
					className: "light narrow-column",
					flex: 1,
					components: [
						{
							kind: enyo.Group,
							align: "center",
							tapHightlight: false,
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									name: "accountName",
									kind: enyo.Input,
									flex: 1,
									hint: $L( "Enter Account Name..." ),
									components: [
										{
											content: $L( "Account Name" ),
											className: "enyo-label"
										}
									]
								}
							]
						}, {
							name: "accountCategory",
							kind: "GTS.ListSelectorBar",
							labelText: "Account Category",
							className: "iconListSelector custom-background",
							onChange: "categoryChanged"
						},

						{
							kind: enyo.DividerDrawer,
							caption: $L( "Security Options" ),
							open: true,
							components: [
								{
									name: "freezeAccount",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Freeze Internal Transactions",
									subText: "Prevent any changes from being made only in this account.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "pinLock",
									kind: "GTS.ToggleBar",
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

													hint: $L( "Tap to set..." ),
													components: [
														{
															content: $L( "Code" ),
															className: "enyo-label"
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
							caption: $L( "Display Options" ),
							open: true,
							components: [
								{
									name: "transactionSorting",
									kind: "GTS.ListSelectorBar",
									labelText: "Sorting",
									onChange: "transactionSortingUpdateLabel"
								}, {
									name: "accountDisplay",
									kind: "GTS.ListSelectorBar",
									localizeOptions: false,
									labelText: "Display",
									onChange: "accountDisplayUpdateLabel",
									value: 0,
									choices: [
										{
											caption: "Show Account",
											value: 0
										}, {
											caption: "Mask Account",
											value: 1
										}, {
											caption: "Hide Account",
											value: 2
										}
									]
								}, {
									name: "balance",
									kind: "GTS.ListSelectorBar",
									labelText: "Balance",
									onChange: "balanceUpdateLabel",
									value: 0,
									choices: [
										{
											caption: "Available",
											value: 0
										}, {
											caption: "Cleared",
											value: 1
										}, {
											caption: "Pending",
											value: 3
										}, {
											caption: "Final",
											value: 2
										}
									]
								}, {
									name: "defaultAccount",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Default Account",
									subText: "This account is launched automatically on start.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "showTransTime",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Show Transaction Time",
									subText: "Displays the transaction time in addition to the date.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									name: "showRunningBal",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Show Running Balance",
									subText: "Running balance will be shown beneath transaction amount. The transaction amount will be black and the current balance will be colored. Only available in certain sort modes.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "hideTransNotes",
									kind: "GTS.ToggleBar",
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
							caption: $L( "Transaction Options" ),
							open: true,
							components: [
								{
									name: "descriptionMultilineMode",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Description Multiline Mode",
									subText: "Allows the transaction description to take up multiple lines in the add/edit transaction screen.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "autoComplete",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Use Auto-Complete",
									subText: "Displays suggestions for transaction descriptions based on your history.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									name: "atmMode",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Use ATM Mode",
									subText: "Amount field will be automatically formatted as you type.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									name: "autoTransfer",
									kind: "GTS.ListSelectorBar",
									labelText: "Auto Transfer",
									onChange: "toggleAutoTransferDrawer",
									value: 0,
									choices: [
										{
											caption: "Do not transfer",
											value: 0
										}, {
											caption: "Transfer remainder",
											value: 1
										}, {
											caption: "Transfer additional dollar",
											value: 2
										}
									]
								}, {
									name: "autoTransferDrawer",
									kind: enyo.BasicDrawer,
									components: [
										{
											name: "autoTransferLink",
											kind: "GTS.ListSelectorBar",
											labelText: $L( "Transfer to..." ),
											className: "iconListSelector"
										}
									]
								}, {
									name: "checkNumber",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Add Check Number Field",
									subText: "Add a field to record the check number in the add/edit transaction screen.",
									onText: "Yes",
									offText: "No"
								}, {
									name: "expenseCategories",
									kind: "GTS.ToggleBar",
									style: "padding-left: 0;",
									mainText: "Add Expense Categories",
									subText: "Add a field to record the expense category in the add/edit transaction screen.",
									onText: "Yes",
									offText: "No",
									value: true
								}, {
									style: "display: none;",

									name: "hideCleared",
									kind: "GTS.ToggleBar",
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
									hint: $L( "Account specific notes" ),
									style: "min-height: 150px;",
									flex: 1,
									components: [
										{
											content: $L( "Notes" ),
											className: "enyo-label"
										}
									]
								}
							]
						},

						{
							name: "accountDeleteButton",
							kind: enyo.Button,
							content: $L( "Delete Account" ),
							className: "enyo-button-negative",
							style: "margin-top: 1.5em;",
							onclick: "deleteAccount"
						}, {
							kind: enyo.Spacer,
							style: "height: 1.5em;"
						}
					]
				}
			]
		},

		{
			kind: enyo.Toolbar,
			components: [
				{
					kind: enyo.Spacer,
					flex: 4
				}, {
					kind: enyo.Button,
					flex: 2,
					content: $L( "Cancel" ),
					style: "width: 150px",
					onclick: "doFinish"
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.Button,
					flex: 2,
					content: $L( "Save" ),
					className: "enyo-button-affirmative deep-green",
					style: "width: 150px;",
					onclick: "saveAccount"
				}, {
					kind: enyo.Spacer,
					flex: 4
				}
			]
		},

		{
			name: "loadingScrim",
			kind: enyo.Scrim,
			layoutKind: enyo.VFlexLayout,
			align: "center",
			pack: "center",
			showing: true,
			components: [
				{
					kind: "GTS.SpinnerLarge",
					showing: true
				}
			]
		},

		{
			name: "appMenu",
			kind: enyo.AppMenu,
			scrim: true,
			components: [
				{
					kind: "EditMenu"
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
							icon: "source/images/" + row['icon'],
							color: row['color']
						};

				this.categories['choices'].push(
						{
							caption: row['name'],
							icon: "source/images/" + row['icon'],
							color: row['color'],
							value: row['name']
						}
					);
			}
		}

		this.$['accountCategory'].setChoices( this.categories['choices'] );
		this.$['accountCategory'].render();

		//Transaction Sort Options
		if( transactionSortOptions.length <= 0 ) {

			enyo.application.transactionManager.fetchTransactionSorting( { "onSuccess": enyo.bind( this, this.buildTransactionSorting ) } );
		} else {

			this.buildTransactionSorting();
		}
	},

	buildTransactionSorting: function() {

		this.$['transactionSorting'].setChoices( transactionSortOptions );
		this.$['transactionSorting'].render();

		//Transaction Sort Options
		enyo.application.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAutoTransferLink ) } );
	},

	buildAutoTransferLink: function( accounts ) {

		if( accounts.length > 0) {

			this.$['autoTransferLink'].setChoices( accounts );

			this.$['autoTransferLink'].setDisabled( false );
			this.$['autoTransferLink'].$['listName'].setDisabled( false );

			this.$['autoTransferLink'].render();

		} else {

			this.$['autoTransferLink'].setDisabled( true );
			this.$['autoTransferLink'].$['listName'].setDisabled( true );
		}

		enyo.nextTick(
				this,
				this.setAccountValues
			);
	},

	transactionSortingUpdateLabel: function() {

		enyo.application.gts_db.query(
				enyo.application.gts_db.getSelect( "acctTrsnSortOptn", [ "desc" ], { "sortId": this.$['transactionSorting'].getValue() } ),
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

		if( enyo.application.checkbookPrefs['dispColor'] === 1 ) {

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

			enyo.application.accountManager.fetchAccount(
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

		this.categoryChanged( null, this.$['accountCategory'].getValue(), null );

		if( this.acctId < 0 ) {
			//Can"t delete an account that doesn"t exist

			this.$['accountDeleteButton'].setShowing( false );
		}

		this.$['loadingScrim'].setShowing( false );

		this.$['accountName'].forceFocusEnableKeyboard();
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

			enyo.application.accountManager.createAccount( data, options );
		} else {

			enyo.application.accountManager.updateAccount( data, this.acctId, this.pinChanged, options );
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

		enyo.application.accountManager.deleteAccount(
				this.acctId,
				{
					"onSuccess": enyo.bind( this, this.doFinish, 2 )
				}
			);
	}
} );