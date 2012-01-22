/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

//Convert to popup
	//See how email does it & retains connection to main app
enyo.kind( {
	name: "Checkbook.transactions.modify",
	kind: enyo.VFlexBox,

	style: "height: 100%;",

	accountList: [],

	published: {
		accountObj: {},
		trsnObj: {},
		transactionType: ""
	},

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: enyo.PageHeader,
			components: [
				{
					layoutKind: enyo.HFlexLayout,
					pack: "center",
					className: "narrow-column",
					components: [
						{
							name: "transTypeText",
							content: "Modify Transaction",
							className: "bigger"
						}
					]
				}
			]
		},

		{
			kind: enyo.Scroller,
			autoHorizontal: false,
			horizontal: false,
			className: "light",//"deep-green-gradient",
			flex: 1,
			components: [
				{
					layoutKind: enyo.VFlexLayout,
					className: "light narrow-column",
					flex: 1,
					components: [
						{
							kind: enyo.Group,
							tapHightlight: false,
							components: [
								{
									kind: enyo.Item,
									tapHightlight: false,
									components: [
										{
											name: "desc",
											kind: enyo.RichText,
											hint: $L( "Enter Description" ),

											onkeypress: "descKeyPress",
											oninput: "descContentChanged",
											autoKeyModifier: "shift-single",

											flex: 1
										}
									]
								}, {
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,
									tapHightlight: false,
									components: [
										{
											kind: enyo.ToolButtonGroup,
											style: "padding-right: 1em;",
											components: [
												{
													name: "transTypeIcon",
													className: "enyo-radiobutton-dark",
													//icon: "source/images/menu_icons/income.png",
													//icon: "source/images/menu_icons/transfer.png",
													//icon: "source/images/menu_icons/expense.png",

													onclick: "amountTypeChanged"
												}
											]
										}, {
											name: "amount",
											kind: enyo.Input,
											hint: "0.00",
											oldValue: "",

											//inputType: "number",//Does not work
											//autoKeyModifier: "num-lock",//Does not work

											oninput: "amountContentChanged",//ATM Function
											onkeypress: "amountKeyPress",//Key possibility filter

											flex: 1,
											components: [
												{
													content: $L( "Amount" ),
													className: "enyo-label"
												}
											]
										}
									]
								}, {
									name: "account",
									kind: "GTS.ListSelectorBar",
									labelText: "Account",
									onChange: "accountChanged",
									className: "iconListSelector custom-background"
								}, {
									name: "linkedAccount",
									kind: "GTS.ListSelectorBar",
									labelText: "Transfer To...",
									onChange: "linkedAccountChanged",
									className: "iconListSelector custom-background"
								}
							]
						}, {
							kind: enyo.Group,
							tapHightlight: false,

							className: "dividerDrawerBlack",
							style: "padding:2px;",

							components: [
								{
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,

									className: "enyo-single",
									tapHightlight: false,

									onclick: "toggleDateDrawer",
									components: [
										{
											kind: enyo.Image,
											src: "source/images/calendar.png",
											className: "img-icon",
											style: "margin-right: 1em;"
										}, {
											name: "dateDisplay",
											style: "margin-top: 2px;",
											flex: 1
										}, {
											name: "dateArrow",
											className: "enyo-listselector-arrow"
										}
									]
								}, {
									name: "dateDrawer",
									kind: enyo.Drawer,
									open: false,

									components: [
										{
											name: "date",
											kind: "GTS.DateTimePicker",
											onChange: "dateChanged"
										}
									]
								}
							]
						}, {
							showing: false,

							kind: enyo.Group,
							tapHightlight: false,
							components: [
								{
									kind: enyo.Item,
									content: "repeat row"
								}
							]
						}, {
							name: "categoryHolder",
							kind: enyo.Group,
							tapHightlight: false,

							style: "padding:2px;",

							components: [
								{
									kind: enyo.Item,
									layoutKind: enyo.HFlexLayout,

									className: "enyo-single",
									tapHightlight: false,

									onclick: "categoryTapped",
									components: [
										{
											name: "category",
											json: "",

											className: "enyo-text-ellipsis",
											flex: 1
										}, {
											content: $L( "Category" ),
											className: "enyo-listselector-label enyo-label"
										}, {
											className: "enyo-listselector-arrow"
										}
									]
								}
							]
						}, {
							name: "checkNumHolder",
							kind: enyo.Item,
							tapHightlight: false,
							components: [
								{
									name: "checkNum",
									kind: enyo.Input,
									hint: $L( "# (optional)" ),
									onfocus: "autofillCheckNo",
									components: [
										{
											content: $L( "Check Number" ),
											className: "enyo-label"
										}
									]
								}
							]
						}, {
							name: "cleared",
							kind: "GTS.ToggleBarRev",
							mainText: "Cleared",
							subText: "",

							onText: "Cleared",
							offText: "Pending",

							value: false
						}, {
							name: "autoTrans",
							kind: "GTS.ToggleBarRev",
							mainText: "Auto Transfer",
							subText: "",

							onText: "On",
							offText: "Off",

							value: true
						},

						{
							kind: enyo.Group,
							align: "center",
							tapHightlight: false,
							layoutKind: enyo.HFlexLayout,
							components: [
								{
									name: "notes",
									kind: enyo.RichText,
									hint: "Transaction Notes",
									flex: 1,

									style: "min-height: 150px;",
									alwaysLooksFocused: true
								}
							]
						},

						{
							name: "transactionDeleteButton",
							kind: enyo.Button,
							content: "Delete Transaction",
							className: "enyo-button-negative",
							style: "margin-top: 1.5em;",
							onclick: "deleteTransaction"
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
					onclick: "saveTransaction"
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
					kind: enyo.SpinnerLarge,
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
			name: "autocomplete",
			kind: "Checkbook.transactions.autocomplete",
			onSelect: "descAutoSuggestMade"
		},

		{
			name: "categorySystem",
			kind: "Checkbook.transactionCategory.select"
		}
	],

	rendered: function() {

		this.log();

		this.inherited( arguments );

		//Delete useless data
		delete this.trsnObj['dispRunningBalance'];
		delete this.trsnObj['runningBalance'];

		//Mix in default data;
		this.trsnObj = enyo.mixin(
				{
					"itemId": -1,
					"desc": "",
					"amount": "",
					"amount_old": "NOT_A_VALUE",
					"note": "",
					"date": ( new Date() ).getTime(),
					"account": this.accountObj['acctId'],
					"linkedRecord": -1,
					"linkedAccount": -1,
					"cleared": 0,
					"repeatId": -1,
					"checkNum": "",
					"category": "Uncategorized",
					"category2": "Other"
				},
				this.trsnObj
			);

		if( this.trsnObj['itemId'] < 0 ) {

			this.$['transTypeText'].setContent( "New Transaction" );
			this.$['transactionDeleteButton'].setShowing( false );
		} else {

			this.$['transTypeText'].setContent( "Modify Transaction" );
		}

		enyo.application.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAccountSystems ) } );
	},

	/** Data Load Handlers **/

	buildAccountSystems: function( accounts ) {

		this.log();

		this.accountList = accounts;

		this.$['account'].setChoices( this.accountList );

		this.$['account'].setDisabled( false );
		this.$['account'].$['listName'].setDisabled( false );

		this.$['account'].render();

		if( this.accountList.length > 1 ) {

			this.$['linkedAccount'].setChoices( this.accountList );

			this.$['linkedAccount'].setDisabled( false );
			this.$['linkedAccount'].$['listName'].setDisabled( false );

			this.$['linkedAccount'].render();

		} else {

			this.$['linkedAccount'].setDisabled( true );
			this.$['linkedAccount'].$['listName'].setDisabled( true );
		}

		//Check this.accountObj properties
		var count = 0;
		for( var k in this.accountObj ) {

			if( this.accountObj.hasOwnProperty( k ) ) {

				count++;
			}
		}

		if( count <= 5 ) {

			enyo.application.accountManager.fetchAccount( this.accountObj['acctId'], { "onSuccess": enyo.bind( this, this.initialAccountLoadHandler ) } );
		} else {

			this.$['categorySystem'].loadCategories( enyo.bind( this, this.loadTransactionData ) );
		}
	},

	initialAccountLoadHandler: function( result ) {

		this.$['account'].removeClass( this.accountObj['acctCategoryColor'] );

		this.accountObj = result;

		this.$['categorySystem'].loadCategories( enyo.bind( this, this.loadTransactionData ) );
	},

	loadTransactionData: function() {

		this.log();

		if( Object.validNumber( this.trsnObj['amount'] ) ) {

			this.trsnObj['amount_old'] = this.trsnObj['amount'];
		}

		if( this.trsnObj['itemId'] >= 0 ) {

			if( Object.validNumber( this.trsnObj['linkedRecord'] ) && this.trsnObj['linkedRecord'] >= 0 ) {

				this.transactionType = "transfer";
			} else if( this.trsnObj['amount'] < 0 ) {

				this.transactionType = "expense";
			} else {

				this.transactionType = "income";
			}
		}

		this.trsnObj['amount'] = Math.abs( this.trsnObj['amount'] ).toFixed( 2 );

		this.trsnObj['date'] = new Date( parseInt( this.trsnObj['date'] ) );
		this.trsnObj['cleared'] = ( this.trsnObj['cleared'] === 1 );

		this.$['desc'].setValue( this.trsnObj['desc'] );
		this.$['amount'].setValue( this.trsnObj['amount'] );

		this.$['account'].setValue( this.trsnObj['account'] );
		this.$['linkedAccount'].setValue( this.trsnObj['linkedAccount'] );

		this.$['date'].setValue( this.trsnObj['date'] );

		this.$['checkNum'].setValue( this.trsnObj['checkNum'] );
		this.$['cleared'].setValue( this.trsnObj['cleared'] );
		this.$['notes'].setValue( this.trsnObj['note'] );

		//Split category (HANDLE SPLIT CATEGORY - incomplete)
		if( this.trsnObj['category2'] === 'PARSE_CATEGORY' ) {

			//JSON formatted string [{ category, category2, amount }]
			this.trsnObj['category'] = enyo.json.parse( this.trsnObj['category'] );
		} else {

			//Old Format Category
			if( this.trsnObj['category2'] === '' ) {

				this.trsnObj['category2'] = this.trsnObj['category'].split( "|", 2 )[1];
				this.trsnObj['category'] = this.trsnObj['category'].split( "|", 2 )[0];
			}

			this.trsnObj['category'] = [
						{
							"category": this.trsnObj['category'],
							"category2": this.trsnObj['category2'],
							"amount": ""
						}
					];
		}

		//Run the formatters
		this.$['transTypeIcon'].setIcon( "source/images/menu_icons/" + this.transactionType + ".png" );

		this.adjustSystemViews();
		this.dateChanged();

		enyo.nextTick(
				this.$['loadingScrim'],
				this.$['loadingScrim'].setShowing,
				false
			);
	},

	/** Data Change Handlers **/
	descKeyPress: function( inSender, inEvent ) {
		//Prevent return when not multiLine

		if( this.accountObj['transDescMultiLine'] !== 1 && inEvent.keyCode === 13 ) {

			inEvent.preventDefault();
		}
	},

	descContentChanged: function() {
		//Autocomplete

		if( this.accountObj['useAutoComplete'] === 1 ) {

			this.$['autocomplete'].setSearchValue( this.$['desc'].getValue() );
		}
	},

	descAutoSuggestMade: function( inSender, suggestTrsnObj ) {

		this.trsnObj['desc'] = suggestTrsnObj['desc'];
		this.$['desc'].setValue( this.trsnObj['desc'] );

		this.trsnObj['linkedAccount'] = ( this.transactionType === "transfer" ? suggestTrsnObj['linkedAccount'] : -1 );
		this.$['linkedAccount'].setValue( this.trsnObj['linkedAccount'] );

		this.trsnObj['category'] = suggestTrsnObj['category'];
		this.trsnObj['category2'] = suggestTrsnObj['category2'];
		this.categoryChanged();

		this.$['amount'].forceFocus();
	},

	amountTypeChanged: function( inSender, inEvent ) {

		switch( this.transactionType ) {
			case 'expense':
				this.transactionType = 'income';
				break;
			case 'transfer':
				break;
			case 'income':
				this.transactionType = 'expense';
				break;
		}

		this.$['transTypeIcon'].setIcon( "source/images/menu_icons/" + this.transactionType + ".png" );
	},

	amountContentChanged: function( inSender, inEvent ) {
		//ATM Mode

		var amountStr = inSender.getValue()

		if( this.accountObj['atmEntry'] === 1 ) {

			amountStr = amountStr.trim();
			var oldAmountStr = inSender.oldValue.trim();

			//Save cursor position
			var curPos = this.$['amount'].getSelection();

			if( !amountStr || amountStr.length <= 0 ) {

				curPos['start'] = 4;
				curPos['end'] = 4;
			} else if( ( oldAmountStr.length - 1 ) === amountStr.length ) {
				//Char deleted

				curPos['start']++;
				curPos['end']++;
			}

			//Format number
			if( amountStr == "" || amountStr == 0 ) {

				amountStr = "0.00";
			} else {

				amountStr = amountStr.replace( /[^0-9]/g, "" );
				amountStr = amountStr.replace( /^0*/, "" );

				amountStr = ( parseInt( amountStr ) / 100 ).toFixed( 2 );
			}

			//Update values
			inSender.oldValue = amountStr;
			inSender.setValue( amountStr );

			//Restore cursor position
			inSender.setSelection( curPos );//Ignoring command when string length < 4
		} else {

			inSender.setValue( amountStr.trim().replace( /[^0-9\.]/g, "" ) );
		}
	},

	amountKeyPress: function( inSender, inEvent ) {

		if( !( inEvent.keyCode >= 48 && inEvent.keyCode <= 57 ) && inEvent.keyCode !== 46 ) {

			inEvent.preventDefault();
		}
	},

	adjustSystemViews: function() {

		this.log();

		this.$['linkedAccount'].setShowing( this.transactionType === "transfer" );

		this.$['date'].setShowTime( this.accountObj['showTransTime'] == 1 );

		this.$['autoTrans'].setShowing(
				this.trsnObj['itemId'] < 0 &&
				this.transactionType !== "transfer" &&
				this.accountObj['auto_savings'] > 0 &&
				this.accountObj['auto_savings_link'] > -1
			);//Must be new, not a transfer, and set by account

		if( this.accountObj['atmEntry'] == 1 ) {

			this.$['amount'].setValue( deformatAmount( this.$['amount'].getValue() ).toFixed( 2 ) );
			this.$['amount'].setSelectAllOnFocus( false );
		} else {

			this.$['amount'].setSelectAllOnFocus( true );
		}

		this.amountContentChanged( this.$['amount'], null );

		if( this.accountObj['enableCategories'] == 1 ) {

			this.categoryChanged();
			this.$['categoryHolder'].setShowing( true );
		} else {

			this.$['categoryHolder'].setShowing( false );
		}

		if( this.accountObj['checkField'] == 1 ) {

			this.$['checkNumHolder'].setShowing( true );

			enyo.application.transactionManager.fetchMaxCheckNumber(
					this.$['account'].getValue(),
					{
						"onSuccess": enyo.bind( this, this.adjustMaxCheckNumber )
					}
				);
		} else {

			this.$['checkNumHolder'].setShowing( false );
		}

		if( enyo.application.checkbookPrefs['dispColor'] === 1 ) {

			this.$['account'].addClass( this.accountObj['acctCategoryColor'] );

			if( !this.$['linkedAccount'].getDisabled() && !this.$['linkedAccount'].$['listName'].getDisabled() ) {

				enyo.application.accountManager.fetchAccount( this.$['linkedAccount'].getValue(), { "onSuccess": enyo.bind( this, this.linkedAccountChangedFollower, "set" ) } );
			}
		} else {

			this.$['account'].removeClass( "custom-background" );
			this.$['linkedAccount'].removeClass( "custom-background" );
		}

		this.$['desc'].forceFocus();
	},

	accountChanged: function( inSender, newIndex, oldIndex ) {

		enyo.application.accountManager.fetchAccount( this.$['account'].getValue(), { "onSuccess": enyo.bind( this, this.accountChangedFollower ) } );
	},

	accountChangedFollower: function( result ) {

		//Remove old color (if set)
		this.$['account'].removeClass( this.accountObj['acctCategoryColor'] );

		this.accountObj = result;

		this.adjustSystemViews();
		this.dateChanged();
	},

	linkedAccountChanged: function( inSender, newAcctId, oldAcctId ) {

		enyo.application.accountManager.fetchAccount( oldAcctId, { "onSuccess": enyo.bind( this, this.linkedAccountChangedFollower, "unset" ) } );
	},

	linkedAccountChangedFollower: function( mode, result ) {

		if( mode === "unset" ) {

			this.$['linkedAccount'].removeClass( result['acctCategoryColor'] );
			enyo.application.accountManager.fetchAccount( this.$['linkedAccount'].getValue(), { "onSuccess": enyo.bind( this, this.linkedAccountChangedFollower, "set" ) } );
		} else if( mode === "set" ) {

			this.$['linkedAccount'].addClass( result['acctCategoryColor'] );
		}
	},

	toggleDateDrawer: function() {

		this.$['dateArrow'].addRemoveClass( "invert", !this.$['dateDrawer'].getOpen() );

		this.$['dateDrawer'].toggleOpen();
	},

	dateChanged: function( inSender, inDate ) {

		this.$['dateDisplay'].setContent( this.$['date'].getValue().format( { date: 'long', time: ( this.accountObj['showTransTime'] === 1 ? 'short' : '' ) } ) );
	},

	categoryTapped: function() {

		//change this to dynamic
		var index = 0;

		this.$['categorySystem'].getCategoryChoice( enyo.bind( this, this.categorySelected, index ), this.trsnObj['category'][index] );
	},

	categorySelected: function( index, catObj ) {

		this.trsnObj['category'][index] = catObj;

		this.categoryChanged();
	},

	categoryChanged: function() {

		//JSON formatted string [{ category, category2, amount }]
			//Need to change this to a repeater(?)

		this.$['category'].setContent( ( this.trsnObj['category'][0]['category'] + " >> " + this.trsnObj['category'][0]['category2'] ).dirtyString() );
	},

	adjustMaxCheckNumber: function( checkNum ) {

		this.$['checkNum'].autofillValue = checkNum;
	},

	autofillCheckNo: function() {

		if( this.accountObj['checkField'] == 1 && this.$['checkNum'].getValue().length <= 0 ) {

			this.$['checkNum'].setValue( this.$['checkNum'].autofillValue );
		}
	},

	/** Data Save Handlers **/

	saveTransaction: function() {

		//this.transactionType

		this.trsnObj['itemId'] = this.trsnObj['itemId'];
		this.trsnObj['desc'] = this.$['desc'].getValue();

		this.trsnObj['amount'] = this.$['amount'].getValue();
		//this.trsnObj['amount_old']

		this.trsnObj['account'] = this.$['account'].getValue();
		this.trsnObj['linkedAccount'] = this.$['linkedAccount'].getValue();
		//this.trsnObj['linkedRecord']

		this.trsnObj['date'] = this.$['date'].getValue();

		//this.trsnObj['category']
		//this.trsnObj['category2']

		this.trsnObj['checkNum'] = this.$['checkNum'].getValue();
		this.trsnObj['cleared'] = this.$['cleared'].getValue();
		this.trsnObj['note'] = this.$['notes'].getValue();

		//this.trsnObj['repeatId']

		this.trsnObj['autoTransfer'] = ( ( this.$['autoTrans'].getShowing() && this.$['autoTrans'].getValue() ) ? this.accountObj['auto_savings'] : 0 );
		this.trsnObj['autoTransferLink'] = this.accountObj['auto_savings_link'];

		var options = {
				"onSuccess": enyo.bind(
						this,
						this.doFinish,
						1,
						{
							"account": this.trsnObj['account'],
							"linkedAccount": ( this.transactionType == 'transfer' ? this.trsnObj['linkedAccount'] : -1 ),
							"atAccount": ( ( this.trsnObj['autoTransfer'] > 0 && this.trsnObj['autoTransferLink'] >= 0 ) ? this.trsnObj['autoTransferLink'] : -1 )
						}
					),
				"onFailure": null
			};

		if( this.trsnObj['itemId'] < 0 ) {

			enyo.application.transactionManager.createTransaction( this.trsnObj, this.transactionType, options );
		} else {

			enyo.application.transactionManager.updateTransaction( this.trsnObj, this.transactionType, options );
		}
	},

	deleteTransaction: function() {

		if( this.trsnObj['itemId'] < 0 ) {

			this.doFinish( 0 );
		} else {

			this.createComponent( {
					name: "deleteTransactionConfirm",
					kind: "GTS.deleteConfirm",

					owner: this,

					confirmTitle: "Delete Transaction",
					confirmMessage: "Are you sure you want to delete this transaction?",
					confirmButtonYes: "Delete",
					confirmButtonNo: "Cancel",

					onYes: "deleteTransactionHandler",
					onNo: "deleteTransactionConfirmClose"
				});

			this.$['deleteTransactionConfirm'].render();
			this.$['deleteTransactionConfirm'].openAtCenter();
		}
	},

	deleteTransactionConfirmClose: function() {

		this.$['deleteTransactionConfirm'].destroy();
	},

	deleteTransactionHandler: function() {

		enyo.application.transactionManager.deleteTransaction(
				this.trsnObj['itemId'],
				{
					"onSuccess": enyo.bind( this, this.doFinish, 2 )
				}
			);
	}
} );