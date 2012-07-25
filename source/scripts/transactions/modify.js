/* Copyright © 2011-2012, GlitchTech Science */

//Convert to popup
	//See how email does it & retains connection to main app
enyo.kind( {
	name: "Checkbook.transactions.modify",
	kind: "FittableRows",
	classes: "enyo-fit",

	style: "height: 100%;",

	accountList: [],
	renderCategories: false,

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
			kind: "onyx.Toolbar",
			classes: "text-center",
			components: [
				{
					name: "transTypeText",
					content: "Modify Transaction",
					classes: "bigger"
				}
			]
		},

		{
			kind: "enyo.Scroller",
			horizontal: "hidden",
			classes: "deep-green-gradient",
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
									layoutKind: "enyo.FittableColumnsLayout",
									noStretch: true,
									components: [
										{
											name: "desc",
											kind: "onyx.Input",

											fit: true,
											placeholder: "Enter Description",

											onkeypress: "descKeyPress",
											oninput: "descContentChanged",
											autoKeyModifier: "shift-single",
										},{
											name: "autosuggestIcon",
											kind: "enyo.Image",
											src: "assets/search.png"
										}
									]
								}, {
									kind: "onyx.InputDecorator",
									layoutKind: "FittableColumnsLayout",
									noStretch: true,
									components: [
										{
											name: "transTypeIcon",
											kind: "onyx.Icon",

											ontap: "amountTypeChanged",

											classes: "margin-right"
											//src: "assets/menu_icons/income.png",
											//src: "assets/menu_icons/transfer.png",
											//src: "assets/menu_icons/expense.png",
										}, {
											name: "amount",
											kind: "GTS.DecimalInput",

											fit: true,

											placeholder: "0.00"
										}, {
											content: "Amount",
											classes: "label"
										}
									]
								}, {
									name: "account",
									kind: "GTS.SelectorBar",

									label: "Account",
									onChange: "accountChanged",

									classes: "custom-background bordered"
								}, {
									name: "linkedAccount",
									kind: "GTS.SelectorBar",

									label: "Transfer To...",
									onChange: "linkedAccountChanged",

									classes: "custom-background"
								}
							]
						}, {
							kind: "onyx.Groupbox",
							classes: "padding-half-top padding-half-bottom",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "Date",
									classes: "padding-std"
								}, {
									kind: "enyo.FittableColumns",
									noStretch: true,

									classes: "padding-std",

									ontap: "toggleDateDrawer",

									components: [
										{
											kind: "enyo.Image",
											src: "assets/calendar.png",
											classes: "img-icon",
											style: "margin-right: 1em;"
										}, {
											name: "dateDisplay",
											style: "margin-top: 2px;",
											fit: true
										}, {
											name: "dateArrow",
											classes: "arrow"
										}
									]
								}, {
									name: "dateDrawer",
									kind: "onyx.Drawer",
									open: false,

									components: [
										{
											name: "date",
											kind: "GTS.DatePicker",
											onChange: "dateChanged",

											components: [
												{
													name: "time",
													kind: "GTS.TimePicker",

													minuteInterval: 5,
													is24HrMode: false,

													label: "Time"
												}
											]
										}
									]
								}
							]
						}, {
							name: "categoryHolder",
							kind: "onyx.Groupbox",
							classes: "padding-half-top padding-half-bottom",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "Category",
									classes: "padding-std"
								}, {
									name: "categoryList",
									kind: "enyo.Repeater",

									onSetupItem: "getCategoryItem",

									classes: "transaction-category-list",

									components: [
										{
											kind: "enyo.FittableColumns",
											classes: "onyx-item text-middle bordered",
											components: [
												{
													name: "categoryText",
													classes: "margin-right",
													fit: true,

													ontap: "categoryTapped"
												}, {
													kind: "onyx.InputDecorator",

													classes: "margin-right",
													style: "display: inline-block;",

													components: [
														{
															name: "categoryAmount",
															kind: "GTS.DecimalInput",
															oninput: "categoryAmountChanged",

															placeholder: "0.00"
														}
													]
												}, {
													name: "categoryDelete",
													kind: "onyx.Button",
													content: "-",

													classes: "small-padding",

													ontap: "categoryDelete"
												}
											]
										}
									]
								}, {
									name: "categoryFooter",
									kind: "enyo.FittableColumns",
									noStretch: true,

									classes: "padding-std",

									components: [
										{
											kind: "onyx.Button",
											content: "Add Category",

											ontap: "categoryAddNew",

											classes: "margin-right",
											style: "min-width: 45%;"
										}, {
											fit: true
										}, {
											name: "fillValueButton",
											kind: "onyx.Button",
											content: "Fill Values",

											ontap: "categoriesFillValues",

											classes: "margin-left",
											style: "min-width: 25%;"
										}
									]
								}
							]
						}, {//TODO
							showing: false,

							kind: "onyx.Groupbox",
							classes: "padding-half-top padding-half-bottom",
							components: [
								{
									kind: "onyx.GroupboxHeader",
									content: "Recurrence",
									classes: "padding-std"
								}, {
									kind: "enyo.FittableColumns",
									noStretch: true,

									classes: "padding-std",

									ontap: "toggleRecurrenceDrawer",

									components: [
										{
											kind: "enyo.Image",
											src: "assets/repeat.png",
											classes: "img-icon",
											style: "margin-right: 1em;"
										}, {
											name: "recurrenceDisplay",
											style: "margin-top: 2px;",
											fit: true
										}, {
											name: "recurrenceArrow",
											classes: "arrow"
										}
									]
								}, {
									name: "recurrenceDrawer",
									kind: "onyx.Drawer",
									open: false,

									components: [
										{
											name: "recurrence",
											content: "Checkbook.transactions.repeat.select",
											onChange: "recurrenceChanged"
										}
									]
								}
							]
						}, {
							name: "checkNumHolder",
							kind: "onyx.Groupbox",
							classes: "padding-half-top padding-half-bottom",
							components: [
								{
									kind: "onyx.InputDecorator",
									layoutKind: "FittableColumnsLayout",
									noStretch: true,
									classes: "padding-half-top",
									components: [
										{
											name: "checkNum",
											kind: "onyx.Input",
											fit: true,

											placeholder: "# (optional)",

											onfocus: "autofillCheckNo"
										}, {
											content: "Check Number",
											classes: "label"
										}
									]
								}
							]
						}, {
							name: "cleared",
							kind: "GTS.ToggleBar",
							classes: "bordered",

							label: "Cleared",
							sublabel: "",
							onContent: "Cleared",
							offContent: "Pending",

							value: false
						}, {
							name: "autoTrans",
							kind: "GTS.ToggleBar",
							classes: "bordered",

							label: "Auto Transfer",
							sublabel: "",
							onContent: "Yes",
							offContent: "No",

							value: true
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
											name: "notes",
											kind: "onyx.TextArea",
											placeholder: "Transaction Notes",

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
							name: "transactionDeleteButton",
							kind: "onyx.Button",
							content: "Delete Transaction",

							ontap: "deleteTransaction",

							classes: "onyx-negative margin-top",
							style: "width: 100%;"
						}, {
							kind: enyo.Spacer,
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

					ontap: "doFinish",

					style: "width: 150px",
					classes: "margin-half-right"
				}, {
					kind: "onyx.Button",
					content: "Save",

					ontap: "saveTransaction",

					style: "width: 150px;",
					classes: "onyx-affirmative deep-green margin-half-left"
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
			color: "#272D70",
			diameter: "90",
			shape: "spiral",

			style: "z-index: 2; position: absolute; width: 90px; height: 90px; top: 50%; margin-top: -45px; left: 50%; margin-left: -45px;"
		},

		{
			name: "autocomplete",
			kind: "Checkbook.transactions.autocomplete",
			onSelect: "descAutoSuggestMade"
		}, {
			name: "categorySystem",
			kind: "Checkbook.transactionCategory.select"
		},
/*
		{
			name: "appMenu",
			kind: enyo.AppMenu,
			scrim: true,
			components: [
				{
					kind: "EditMenu"
				}
			]
		}
*/
	],

	rendered: function() {

		this.inherited( arguments );

		this.$['loadingScrim'].show();
		this.$['loadingSpinner'].show();

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
					"date": Date.parse( new Date() ),
					"account": this.accountObj['acctId'],
					"linkedRecord": -1,
					"linkedAccount": -1,
					"cleared": 0,
					"repeatId": -1,
					"checkNum": "",
					"category": "Uncategorized",
					"category2": "Other"
					//TODO default repeat information
				},
				this.trsnObj
			);

		if( this.trsnObj['itemId'] < 0 ) {

			this.$['transTypeText'].setContent( "New Transaction" );
			this.$['transactionDeleteButton'].hide();
		} else {

			this.$['transTypeText'].setContent( "Modify Transaction" );
		}

		Checkbook.globals.accountManager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAccountSystems ) } );
	},

	/** Data Load Handlers **/

	buildAccountSystems: function( accounts ) {

		this.log();

		//Setup main account
		this.accountList = accounts;

		this.$['account'].setChoices( this.accountList );

		this.$['account'].setDisabled( false );

		this.$['account'].render();

		//Setup linked account
		if( this.accountList.length > 1 ) {

			this.$['linkedAccount'].setChoices( this.accountList );

			this.$['linkedAccount'].setDisabled( false );

			this.$['linkedAccount'].render();

		} else {

			this.$['linkedAccount'].setDisabled( true );
		}

		//Check this.accountObj properties
		var count = 0;
		for( var k in this.accountObj ) {

			if( this.accountObj.hasOwnProperty( k ) ) {

				count++;
			}
		}

		if( count <= 5 ) {

			Checkbook.globals.accountManager.fetchAccount( this.accountObj['acctId'], { "onSuccess": enyo.bind( this, this.initialAccountLoadHandler ) } );
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

		this.trsnObj['category'] = Checkbook.globals.transactionManager.parseCategoryDB( this.trsnObj['category'], this.trsnObj['category2'] );

		this.renderCategories = true;

		//Run the formatters
		this.$['transTypeIcon'].setSrc( "assets/menu_icons/" + this.transactionType + ".png" );

		//TODO set repeat values

		this.adjustSystemViews();
		this.dateChanged();

		this.$['loadingScrim'].hide();
		this.$['loadingSpinner'].hide();

		this.reflow();
	},

	adjustSystemViews: function() {

		this.log();

		this.$['linkedAccount'].setShowing( this.transactionType === "transfer" );

		//this.$['date'].setShowTime( this.accountObj['showTransTime'] == 1 );

		this.$['autosuggestIcon'].setShowing( this.accountObj['useAutoComplete'] === 1 );

		this.$['autoTrans'].setShowing(
				this.trsnObj['itemId'] < 0 &&
				this.transactionType !== "transfer" &&
				this.accountObj['auto_savings'] > 0 &&
				this.accountObj['auto_savings_link'] > -1
			);//Must be new, not a transfer, and set by account

		if( this.accountObj['atmEntry'] == 1 ) {

			this.$['amount'].setAtm( true );
			this.$['amount'].setSelectAllOnFocus( false );
		} else {

			this.$['amount'].setAtm( false );
			this.$['amount'].setSelectAllOnFocus( true );
		}

		if( this.accountObj['enableCategories'] == 1 ) {

			this.categoryChanged();
			this.$['categoryHolder'].show();
		} else {

			this.$['categoryHolder'].hide();
		}

		if( this.accountObj['checkField'] == 1 ) {

			this.$['checkNumHolder'].show();

			Checkbook.globals.transactionManager.fetchMaxCheckNumber(
					this.$['account'].getValue(),
					{
						"onSuccess": enyo.bind( this, this.adjustMaxCheckNumber )
					}
				);
		} else {

			this.$['checkNumHolder'].hide();
		}

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			this.$['account'].addClass( this.accountObj['acctCategoryColor'] );

			if( !this.$['linkedAccount'].getDisabled() ) {

				Checkbook.globals.accountManager.fetchAccount( this.$['linkedAccount'].getValue(), { "onSuccess": enyo.bind( this, this.linkedAccountChangedFollower, "set" ) } );
			}
		} else {

			this.$['account'].removeClass( "custom-background" );
			this.$['linkedAccount'].removeClass( "custom-background" );
		}

		this.$['desc'].focus();
	},

	/** Data Change Handlers **/

	descKeyPress: function( inSender, inEvent ) {
		//Prevent return when not multiLine

		if( this.accountObj['transDescMultiLine'] !== 1 && inEvent.keyCode === 13 ) {

			inEvent.preventDefault();
		}
	},

	/** Autocomplete Controls **/

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
		this.categoryChanged();

		this.$['amount'].forceFocus();
	},

	/** Total Amount Controls **/

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

		this.$['transTypeIcon'].setSrc( "assets/menu_icons/" + this.transactionType + ".png" );
	},

	/** Account Controls **/

	accountChanged: function( inSender, newIndex, oldIndex ) {

		Checkbook.globals.accountManager.fetchAccount( this.$['account'].getValue(), { "onSuccess": enyo.bind( this, this.accountChangedFollower ) } );
	},

	accountChangedFollower: function( result ) {

		//Remove old color (if set)
		this.$['account'].removeClass( this.accountObj['acctCategoryColor'] );

		this.accountObj = result;

		this.adjustSystemViews();
		this.dateChanged();
	},

	/** Linked Account Controls **/

	linkedAccountChanged: function( inSender, newAcctId, oldAcctId ) {

		Checkbook.globals.accountManager.fetchAccount( oldAcctId, { "onSuccess": enyo.bind( this, this.linkedAccountChangedFollower, "unset" ) } );
	},

	linkedAccountChangedFollower: function( mode, result ) {

		if( mode === "unset" ) {

			this.$['linkedAccount'].removeClass( result['acctCategoryColor'] );
			Checkbook.globals.accountManager.fetchAccount( this.$['linkedAccount'].getValue(), { "onSuccess": enyo.bind( this, this.linkedAccountChangedFollower, "set" ) } );
		} else if( mode === "set" ) {

			this.$['linkedAccount'].addClass( result['acctCategoryColor'] );
		}
	},

	/** Date Controls **/

	toggleDateDrawer: function() {

		this.$['dateArrow'].addRemoveClass( "invert", !this.$['dateDrawer'].getOpen() );

		this.$['dateDrawer'].setOpen( !this.$['dateDrawer'].getOpen() );
		this.$['date'].render();
	},

	dateChanged: function( inSender, inDate ) {

		var date = this.$['date'].getValue();
		var time = this.$['time'].getValue();

		date.setHours( time.getHours() );
		date.setMinutes( time.getMinutes() );

		this.$['dateDisplay'].setContent( date.format( { date: 'longDate', time: ( this.accountObj['showTransTime'] === 1 ? 'shortTime' : '' ) } ) );

		//this.$['recurrence'].setDate( date );//TEMP
	},

	/** Category Controls **/

	getCategoryItem: function( inSender, inEvent ) {

		if( !this.renderCategories ) {
			//Don't build before data is ready

			return;
		}

		var row = this.trsnObj['category'][inEvent.index];
		var item = inEvent.item;

		if( row && item ) {

			item.$['categoryText'].setContent( ( row['category'] + " >> " + row['category2'] ).dirtyString() );

			if( this.trsnObj['category'].length > 1 ) {
				//If only one category, takes up full amount

				row['amount'] = Math.abs( row['amount'] ).toFixed( 2 );

				if( this.accountObj['atmEntry'] == 1 ) {

					item.$['categoryAmount'].setValue( deformatAmount( row['amount'] ) );

					item.$['categoryAmount'].setAtm( true );
					item.$['categoryAmount'].setSelectAllOnFocus( false );
				} else {

					item.$['categoryAmount'].setAtm( false );
					item.$['categoryAmount'].setSelectAllOnFocus( true );
				}

				item.$['categoryAmount'].setDisabled( false );
				item.$['categoryDelete'].setDisabled( false );
			} else {

				item.$['categoryAmount'].setDisabled( true );
				item.$['categoryDelete'].setDisabled( true );

				row['amount'] = 0;
			}

			return true;
		}
	},

	categoryTapped: function( inSender, inEvent ) {
		//Show category selector based on current row

		this.$['categorySystem'].getCategoryChoice( enyo.bind( this, this.categorySelected, inEvent.index ), this.trsnObj['category'][inEvent.index] );
	},

	categorySelected: function( index, catObj ) {

		enyo.mixin( this.trsnObj['category'][index], catObj );

		this.categoryChanged();
	},

	categoriesFillValues: function( inSender, inEvent ) {

		var amount;

		var remainder = 0;

		var emptyItems = [];
		var eiLen = 0;

		for( var i = 0; i < this.trsnObj['category'].length; i++ ) {
			//Get total amount in categories; Get 0val categories

			amount = deformatAmount( this.trsnObj['category'][i]['amount'] );
			remainder += amount;

			if( amount == 0 ) {

				emptyItems.push( i );
			}
		}

		remainder = deformatAmount( this.$['amount'].getValue() ) - remainder;

		eiLen = emptyItems.length;

		if( remainder > 0 && eiLen > 0 ) {

			//Divide up remaining amount into 0val categories && Limit to 2 decimal places
			var divAmount = ( remainder / eiLen ).toFixed( 2 );

			for( var i = 0; i < ( eiLen - 1 ); i++ ) {

				this.trsnObj['category'][emptyItems[i]]['amount'] = divAmount;
			}

			//For uneven divisions
			this.trsnObj['category'][emptyItems[eiLen - 1]]['amount'] = remainder - ( divAmount * ( eiLen - 1 ) );
		}

		this.categoryChanged();
	},

	categoryAmountChanged: function( inSender, inEvent ) {

		this.trsnObj['category'][inEvent.index]['amount'] = inSender.getValueAsNumber();
	},

	categoryAddNew: function() {

		this.trsnObj['category'].push( {
				"category": "Uncategorized",
				"category2": "Other",
				"amount": ""
			});

		this.categoryChanged();
	},

	categoryDelete: function( inSender, inEvent ) {

		this.trsnObj['category'].splice( inEvent.index, 1 );

		this.categoryChanged();
	},

	categoryChanged: function() {

		this.$['fillValueButton'].setShowing( this.trsnObj['category'].length > 1 );
		this.$['categoryFooter'].reflow();

		this.$['categoryList'].setCount( this.trsnObj['category'].length );
	},

	/** Recurrence Controls **/

	toggleRecurrenceDrawer: function() {

		this.$['recurrenceArrow'].addRemoveClass( "invert", !this.$['recurrenceDrawer'].getOpen() );

		this.$['recurrenceDrawer'].setOpen( !this.$['recurrenceDrawer'].getOpen() );
	},

	recurrenceChanged: function( inSender, rObj ) {

		this.$['recurrenceDisplay'].setContent( rObj['summary'] );
	},

	/** Check Number Controls **/

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

		//this.trsnObj['itemId']
		this.trsnObj['desc'] = this.$['desc'].getValue();

		this.trsnObj['amount'] = this.$['amount'].getValue();
		//this.trsnObj['amount_old']

		this.trsnObj['account'] = this.$['account'].getValue();
		this.trsnObj['linkedAccount'] = this.$['linkedAccount'].getValue();
		//this.trsnObj['linkedRecord']

		var time = this.$['time'].getValue();
		this.trsnObj['date'] = this.$['date'].getValue();
		this.trsnObj['date'].setHours( time.getHours() );
		this.trsnObj['date'].setMinutes( time.getMinutes() );

		//this.trsnObj['category']
		//this.trsnObj['category2']

		this.trsnObj['checkNum'] = this.$['checkNum'].getValue();
		this.trsnObj['cleared'] = this.$['cleared'].getValue();
		this.trsnObj['note'] = this.$['notes'].getValue();

		this.trsnObj['rObj'] = { "pattern": "none" };//this.$['recurrence'].getValue();//TEMP
		//this.trsnObj['repeatId']
		//this.trsnObj['repeatUnlinked']

		this.trsnObj['autoTransfer'] = ( ( this.$['autoTrans'].getShowing() && this.$['autoTrans'].getValue() ) ? this.accountObj['auto_savings'] : 0 );
		this.trsnObj['autoTransferLink'] = this.accountObj['auto_savings_link'];

		var options = {
				"onSuccess": enyo.bind(
						this,
						this.doFinish,
						{
							"modifyStatus": 1,
							"account": this.trsnObj['account'],
							"linkedAccount": ( this.transactionType == 'transfer' ? this.trsnObj['linkedAccount'] : -1 ),
							"atAccount": ( ( this.trsnObj['autoTransfer'] > 0 && this.trsnObj['autoTransferLink'] >= 0 ) ? this.trsnObj['autoTransferLink'] : -1 )
						}
					),
				"onFailure": null
			};

		if( this.trsnObj['itemId'] < 0 ) {
			//New transaction

			Checkbook.globals.transactionManager.createTransaction( this.trsnObj, this.transactionType, options );
		} else if( this.trsnObj['repeatId'] >= 0 && this.trsnObj['repeatUnlinked'] != 1 ) {
			//Modified repeating transaction

//if this.trsnObj['rObj']['pattern'] == "none"
	//confirm that this will end the series & remove transactions after today

/*
Would you like to delete only this transaction, all transactions in the series, or this and all future transactions in the series?
---
Only this instance
All other transactions in the series will remain.
//change repeatUnlinked to 1
---
All following
This and all the following transactions will be deleted.
---
All transactions in the series
All transactions in the series will be deleted.
---
*/
		} else {
			//Modified transaction

			Checkbook.globals.transactionManager.updateTransaction( this.trsnObj, this.transactionType, options );
		}
	},

	deleteTransaction: function() {

		if( this.trsnObj['itemId'] < 0 ) {

			this.doFinish( { status: 0 } );
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

		Checkbook.globals.transactionManager.deleteTransaction(
				this.trsnObj['itemId'],
				{
					"onSuccess": enyo.bind( this, this.doFinish, { status: "2" } )
				}
			);
	}
});
