/* Copyright ? 2013, GlitchTech Science */

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
									name: "autocomplete",
									kind: "Checkbook.transactions.autocomplete",

									onValueChanged: "descAutoSuggestMade",

									components: [
										{
											name: "desc",
											kind: "onyx.Input",

											placeholder: "Enter Description",

											onkeypress: "descKeyPress",
											autoKeyModifier: "shift-single"
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
											kind: "gts.DecimalInput",

											fit: true,

											placeholder: "0.00"
										}, {
											content: "Amount",
											classes: "label"
										}
									]
								}, {
									name: "account",
									kind: "gts.SelectorBar",

									label: "Account",
									onChange: "accountChanged",

									classes: "custom-background bordered",
									menuClasses: "onyx-menu-wider"
								}, {
									name: "linkedAccount",
									kind: "gts.SelectorBar",

									label: "Transfer To...",
									onChange: "linkedAccountChanged",

									classes: "custom-background",
									menuClasses: "onyx-menu-wider"
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
									open: false
								}
							]
						},

						{
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
											name: "categoryWrapper",
											classes: "onyx-item text-middle bordered h-box",
											components: [
												{
													name: "categoryText",
													kind: "onyx.Button",
													classes: "margin-right box-flex",

													ontap: "categoryTapped"
												}, {
													name: "categoryItemBreak",
													tag: "br"
												}, {
													components: [
														{
															kind: "onyx.InputDecorator",

															classes: "inline-force margin-right",

															components: [
																{
																	name: "categoryAmount",
																	kind: "gts.DecimalInput",
																	oninput: "categoryAmountChanged",

																	placeholder: "0.00"
																}
															]
														}, {
															name: "categoryDelete",
															kind: "onyx.Button",
															classes: "small-padding",

															content: "-",

															ontap: "categoryDelete"
														}
													]
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
						},

						{
							name: "recurrenceWrapper",
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

									classes: "padding-std text-middle",

									ontap: "toggleRecurrenceDrawer",

									components: [
										{
											kind: "enyo.Image",
											src: "assets/repeat.png",
											classes: "img-icon margin-right"
										}, {
											name: "recurrenceDisplay",
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
											name: "recurrenceSelect",
											kind: "Checkbook.transactions.recurrence.select",
											onRecurrenceChange: "recurrenceChanged"
										}
									]
								}
							]
						},

						{
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

											placeholder: "# (optional)"
										}, {
											kind: "onyx.Button",
											content: "Check Number",
											classes: "label",
											ontap: "autofillCheckNo"
										}
									]
								}
							]
						}, {
							name: "payeeFieldHolder",
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
											name: "payeeField",
											kind: "onyx.Input",
											fit: true
										}, {
											content: "Payee",
											classes: "label"
										}
									]
								}
							]
						},

						{
							name: "cleared",
							kind: "gts.ToggleBar",
							classes: "bordered",

							label: "Cleared",
							sublabel: "",
							onContent: "Cleared",
							offContent: "Pending",

							value: false
						}, {
							name: "autoTrans",
							kind: "gts.ToggleBar",
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

					ontap: "saveTransaction",

					classes: "deep-green"
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
			name: "categorySystem",
			kind: "Checkbook.transactionCategory.select",
			onHide: "resized"
		}
	],

	create: function() {

		this.inherited( arguments );

		this.buildDateSystem();
	},

	destroy: function() {

		this.$['categorySystem'].hide();

		this.inherited( arguments );
	},

	buildDateSystem: function() {

		if( !enyo.Panels.isScreenNarrow() || Checkbook.globals.prefs['alwaysFullCalendar'] ) {
			//Big Screen

			this.$['dateDrawer'].createComponent(
					{
						name: "date",
						kind: "gts.DatePicker",
						onSelect: "dateChanged",

						components: [
							{
								name: "time",
								kind: "gts.TimePicker",

								label: "Time",

								minuteInterval: 5,
								is24HrMode: false,

								onSelect: "dateChanged"
							}
						]
					}, {
						owner: this
					}
				);
		} else {
			//Small Screen

			this.$['dateDrawer'].createComponents(
					[
						{
							classes: "onyx-toolbar-inline",
							components: [
								{
									name: "label",
									classes: "label",
									content: "Date"
								}, {
									name: "date",
									kind: "onyx.DatePicker",
									onSelect: "dateChanged"
								}
							]
						}, {
							name: "time",
							kind: "gts.TimePicker",

							label: "Time",

							minuteInterval: 5,
							is24HrMode: false,

							onSelect: "dateChanged"
						}
					], {
						owner: this
					}
				);
		}
	},

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
					"repeatUnlinked": 0,
					"checkNum": "",
					"category": "Uncategorized",
					"category2": "Other",
					"payee": ""
				},
				this.trsnObj
			);

		if( this.trsnObj['itemId'] < 0 ) {

			this.$['transTypeText'].setContent( "New Transaction" );
			this.$['transactionDeleteButton'].hide();
		} else {

			this.$['transTypeText'].setContent( "Modify Transaction" );
		}

		Checkbook.accounts.manager.fetchAccountsList( { "onSuccess": enyo.bind( this, this.buildAccountSystems ) } );
	},

	/** Data Load Handlers **/

	buildAccountSystems: function( accounts ) {

		//Setup main account
		this.accountList = accounts;

		this.$['account'].setChoices( this.accountList );

		this.$['account'].setDisabled( false );

		this.$['account'].render();

		//Setup linked account
		if( this.accountList.length > 1 ) {

			this.$['linkedAccount'].setChoices( this.accountList );

			this.$['linkedAccount'].setDisabled( false );
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

			Checkbook.accounts.manager.fetchAccount( this.accountObj['acctId'], { "onSuccess": enyo.bind( this, this.initialAccountLoadHandler ) } );
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

		if( gts.Object.validNumber( this.trsnObj['amount'] ) ) {

			this.trsnObj['amount_old'] = this.trsnObj['amount'];
		}

		if( this.trsnObj['itemId'] >= 0 ) {

			this.transactionType = Checkbook.transactions.manager.determineTransactionType( this.trsnObj );
		}

		this.trsnObj['amount'] = Math.abs( this.trsnObj['amount'] ).toFixed( 2 );

		this.trsnObj['date'] = new Date( parseInt( this.trsnObj['date'] ) );
		this.trsnObj['cleared'] = ( this.trsnObj['cleared'] === 1 );

		this.$['desc'].setValue( this.trsnObj['desc'] );
		this.$['amount'].setValue( this.trsnObj['amount'] );

		this.$['account'].setValue( this.trsnObj['account'] );
		this.$['linkedAccount'].setValue( this.trsnObj['linkedAccount'] );

		this.$['date'].setValue( this.trsnObj['date'] );
		this.$['time'].setValue( this.trsnObj['date'] );

		this.$['checkNum'].setValue( this.trsnObj['checkNum'] );
		this.$['payeeField'].setValue( this.trsnObj['payee'] );
		this.$['cleared'].setValue( this.trsnObj['cleared'] );
		this.$['notes'].setValue( this.trsnObj['note'] );

		if( ( this.trsnObj['repeatId'] > 0 || this.trsnObj['repeatId'] === 0 ) && this.trsnObj['repeatUnlinked'] != 1 ) {
			//Existing recurrence

			Checkbook.transactions.recurrence.manager.fetch( this.trsnObj['repeatId'], { "onSuccess": enyo.bind( this, this.loadRecurrenceData ) } );
		} else if( this.trsnObj['repeatUnlinked'] == 1 ) {
			//Recurrence removed

			this.$['recurrenceWrapper'].hide();
		}

		this.trsnObj['category'] = Checkbook.transactions.manager.parseCategoryDB( this.trsnObj['category'], this.trsnObj['category2'] );
		this.trsnObj['categoryOriginal'] = this.trsnObj['category'];

		this.renderCategories = true;

		//Run the formatters
		this.$['transTypeIcon'].setSrc( "assets/menu_icons/" + this.transactionType + ".png" );

		this.adjustSystemViews();
		this.dateChanged();

		this.$['loadingScrim'].hide();
		this.$['loadingSpinner'].hide();

		this.reflow();
	},

	adjustSystemViews: function() {

		this.$['linkedAccount'].setShowing( this.transactionType === "transfer" );

		//this.$['date'].setShowTime( this.accountObj['showTransTime'] == 1 );

		this.$['autocomplete'].setEnabled( this.accountObj['useAutoComplete'] === 1 );

		this.$['autoTrans'].setShowing(
				this.trsnObj['itemId'] < 0 &&
				this.transactionType !== "transfer" &&
				this.accountObj['auto_savings'] > 0 &&
				this.accountObj['auto_savings_link'] > -1
			);//Must be new, not a transfer, and set by account

		if( this.accountObj['atmEntry'] == 1 ) {

			this.$['amount'].setAtm( true );
			this.$['amount'].setSelectOnFocus( false );
		} else {

			this.$['amount'].setAtm( false );
			this.$['amount'].setSelectOnFocus( true );
		}

		if( this.accountObj['enableCategories'] == 1 ) {

			this.categoryChanged();
			this.$['categoryHolder'].show();
		} else {

			this.$['categoryHolder'].hide();
		}

		if( this.accountObj['checkField'] == 1 ) {

			this.$['checkNumHolder'].show();

			Checkbook.transactions.manager.fetchMaxCheckNumber(
					this.$['account'].getValue(),
					{
						"onSuccess": enyo.bind( this, this.adjustMaxCheckNumber )
					}
				);
		} else {

			this.$['checkNumHolder'].hide();
		}

		if( this.accountObj['payeeField'] == 1 ) {

			this.$['payeeFieldHolder'].show();
		} else {

			this.$['payeeFieldHolder'].hide();
		}

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			this.$['account'].addClass( this.accountObj['acctCategoryColor'] );

			if( !this.$['linkedAccount'].getDisabled() ) {

				for( var i = 0; i < this.accountList.length; i++ ) {

					if( this.accountList[i]['value'] == this.$['linkedAccount'].getValue() ) {

						this.linkedAccountChanged( null, { "selected": { color: this.accountList[i]['color'] } } );
						break;
					}
				}
			}
		} else {

			this.$['account'].removeClass( "custom-background" );
			this.$['linkedAccount'].removeClass( "custom-background" );
		}

		this.adjustLinkedAccountList();

		enyo.asyncMethod( this.$['desc'], this.$['desc'].focus );
	},

	adjustLinkedAccountList: function() {

		if( this.accountList.length <= 1 ) {

			this.log( "not enough accounts" );

			return;
		}

		var accountId = this.$['account'].getValue();

		for( var i = 0; i < this.accountList.length; i++ ) {

			if( this.accountList[i]['value'] == accountId ) {

				this.accountList[i]['disabled'] = true;
			} else {

				this.accountList[i]['disabled'] = false;
			}
		}

		if( this.$['linkedAccount'].getValue() == accountId ) {

			this.trsnObj['linkedAccount'] = null;
			this.$['linkedAccount'].setValue( null );
		}

		this.$['linkedAccount'].setChoices( this.accountList );
		this.$['linkedAccount'].render();

		for( var i = 0; i < this.accountList.length; i++ ) {

			this.accountList[i]['disabled'] = false;
		}
	},

	/** Data Change Handlers **/

	descKeyPress: function( inSender, inEvent ) {
		//Prevent return when not multiLine

		if( this.accountObj['transDescMultiLine'] !== 1 && inEvent.keyCode === 13 ) {

			inEvent.preventDefault();
		}
	},

	/** Autocomplete Controls **/

	descAutoSuggestMade: function( inSender, suggestTrsnObj ) {

		this.trsnObj['desc'] = this.$['desc'].getValue();

		if( suggestTrsnObj['data'] ) {

			this.trsnObj['linkedAccount'] = ( this.transactionType === "transfer" ? suggestTrsnObj['linkedAccount'] : -1 );
			this.$['linkedAccount'].setValue( this.trsnObj['linkedAccount'] );

			this.trsnObj['category'] = suggestTrsnObj['category'];
			this.categoryChanged();
		}

		enyo.asyncMethod( this.$['amount'], this.$['amount'].focus );
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

	accountChanged: function( inSender, inEvent ) {

		Checkbook.accounts.manager.fetchAccount( this.$['account'].getValue(), { "onSuccess": enyo.bind( this, this.accountChangedFollower ) } );
	},

	accountChangedFollower: function( result ) {

		for( var i = 0; i < appColors.length; i++ ) {

			this.$['account'].removeClass( appColors[i]['name'] );
		}

		this.accountObj = result;

		this.adjustSystemViews();
		this.dateChanged();
	},

	/** Linked Account Controls **/

	linkedAccountChanged: function( inSender, inEvent ) {

		for( var i = 0; i < appColors.length; i++ ) {

			this.$['linkedAccount'].removeClass( appColors[i]['name'] );
		}

		this.$['linkedAccount'].addClass( inEvent.selected['color'] );
	},

	/** Date Controls **/

	toggleDateDrawer: function() {

		this.$['dateArrow'].addRemoveClass( "invert", !this.$['dateDrawer'].getOpen() );

		this.$['dateDrawer'].setOpen( !this.$['dateDrawer'].getOpen() );
		this.$['date'].render();
	},

	dateChanged: function( inSender, inEvent ) {

		var date = this.$['date'].getValue();
		var time = this.$['time'].getValue();

		date.setHours( time.getHours() );
		date.setMinutes( time.getMinutes() );

		this.$['dateDisplay'].setContent( date.format( { date: 'long', time: ( this.accountObj['showTransTime'] === 1 ? 'short' : '' ) } ) );

		this.$['recurrenceSelect'].setDate( date );
		this.$['recurrenceSelect'].dateChanged();

		return true;
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

			item.$['categoryWrapper'].addRemoveClass( "h-box", !enyo.Panels.isScreenNarrow() );
			item.$['categoryItemBreak'].setShowing( enyo.Panels.isScreenNarrow() );

			item.$['categoryText'].setContent( row['category'] + " >> " + gts.String.dirtyString( row['category2'] ) );
			item.$['categoryText'].addRemoveClass( "margin-half-bottom", enyo.Panels.isScreenNarrow() );
			item.$['categoryText'].addRemoveClass( "full-width", enyo.Panels.isScreenNarrow() );

			if( this.trsnObj['category'].length > 1 ) {
				//If only one category, takes up full amount

				row['amount'] = Math.abs( row['amount'] ).toFixed( 2 );

				if( this.accountObj['atmEntry'] == 1 ) {

					item.$['categoryAmount'].setAtm( true );
					item.$['categoryAmount'].setSelectOnFocus( false );
				} else {

					item.$['categoryAmount'].setAtm( false );
					item.$['categoryAmount'].setSelectOnFocus( true );
				}

				item.$['categoryAmount'].setValue( row['amount'] );

				item.$['categoryAmount'].setDisabled( false );
				item.$['categoryDelete'].setDisabled( false );

				item.$['categoryDelete'].addClass( "onyx-negative" );
			} else {

				item.$['categoryAmount'].setDisabled( true );
				item.$['categoryDelete'].setDisabled( true );

				item.$['categoryDelete'].removeClass( "onyx-negative" );

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

		this.trsnObj['category'][inEvent.index]['amount'] = inEvent.originator.getValueAsNumber();
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

		if( this.$['categoryList'].getCount() === this.trsnObj['category'].length ) {

			this.$['categoryList'].build();
		} else {

			this.$['categoryList'].setCount( this.trsnObj['category'].length );
		}
	},

	/** Recurrence Controls **/

	loadRecurrenceData: function( results ) {

		if( results['terminated'] == 1 ) {
			//Recurrence ended

			this.$['recurrenceWrapper'].hide();
			return;
		}

		this.trsnObj['rObj'] = enyo.clone( results );

		this.trsnObj['rObj']['endDate'] = new Date( parseInt( results['endDate'] ) );
		this.trsnObj['rObj']['origDate'] = new Date( parseInt( results['origDate'] ) );
		this.trsnObj['rObj']['lastUpdated'] = new Date( parseInt( results['lastUpdated'] ) );
		this.trsnObj['rObj']['lastOccurrence'] = new Date( parseInt( results['lastOccurrence'] ) );

		this.$['recurrenceSelect'].setValue( this.trsnObj['rObj'] );
	},

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

		if( this.trsnObj['itemId'] < 0 ) {
			//New transaction

			this.saveNewTransaction();
		} else {
			//Modofied transaction

			var robj = this.$['recurrenceSelect'].getValue();

			if( ( ( this.trsnObj['repeatId'] > 0 || this.trsnObj['repeatId'] === 0 ) || robj['frequency'] !== "none" ) &&
			   this.trsnObj['repeatUnlinked'] != 1 &&
			   this.trsnObj['terminated'] != 1 ) {
				//Repeating

				var changes = this.checkForChanges();

				if( !changes['major'] && !changes['minor'] && !changes['recurrence'] ) {
					//No changes

					this.doFinish( { "status": 0 } );

					return;
				}

				if( this.trsnObj['repeatId'] > 0 || this.trsnObj['repeatId'] === 0 ) {
					//Existing recurrence event

					if( robj['frequency'] == "none" ) {
						//End recurrence event

						this.createComponent( {
								name: "recurrenceEventDialog",
								kind: "gts.ConfirmDialog",

								title: "End Transaction Series",
								message: "This will end the series and delete all following transactions.",

								confirmText: "Continue",
								confirmClass: "onyx-negative",

								cancelText: "Cancel",
								cancelClass: "",

								onConfirm: "endRecurrenceEvent",
								onCancel: "closeRecurrenceEventDialog"
							});

						this.$['recurrenceEventDialog'].show();

						return;
					} else if( changes['major'] ) {
						//content change: this, following, all

						this.createComponent( {
								name: "recurrenceEventDialog",
								kind: "Checkbook.transactions.recurrence.confirm",

								onOne: "updateSingle",
								onFuture: "updateFuture",
								onAll: "updateAll",
								onCancel: "closeRecurrenceEventDialog"
							});

						this.$['recurrenceEventDialog'].show();

						return;
					} else if( changes['recurrence'] ) {
						//will only change all following events (continue, abort)

						this.createComponent( {
								name: "recurrenceEventDialog",
								kind: "gts.ConfirmDialog",

								title: "Transaction Series",
								message: "This will change this and all following transactions.",

								confirmText: "Continue",
								confirmClass: "",

								cancelText: "Cancel",
								cancelClass: "",

								onConfirm: "updateFuture",
								onCancel: "closeRecurrenceEventDialog"
							});

						this.$['recurrenceEventDialog'].show();

						return;
					} else {

						this.updateTransactionObject( changes['minor'] );
					}
				} else {

					this.updateTransactionObject();
				}

				Checkbook.transactions.manager.updateTransaction( this.trsnObj, this.transactionType, this.getSaveOptions() );
			} else {
				//Nonrepeating or single instance

				this.saveModifiedTransaction();
			}
		}
	},

	getSaveOptions: function() {

		return( {
				"onSuccess": enyo.bind(
						this,
						this.saveCompleteHandler,
						{
							"modifyStatus": 1,
							"account": this.trsnObj['account'],
							"linkedAccount": ( this.transactionType == 'transfer' ? this.trsnObj['linkedAccount'] : -1 ),
							"atAccount": ( ( this.trsnObj['autoTransfer'] > 0 && this.trsnObj['autoTransferLink'] >= 0 ) ? this.trsnObj['autoTransferLink'] : -1 )
						}
					),
				"onFailure": null
			});
	},

	checkForChanges: function() {

		var changes = {
				"minor": false,
				"major": false,
				"recurrence": false
			};

		var time = this.$['date'].getValue();
		time.setHours( this.$['time'].getValue().getHours() );
		time.setMinutes( this.$['time'].getValue().getMinutes() );

		if(
			this.trsnObj['desc'] !== this.$['desc'].getValue() ||
			this.trsnObj['amount_old'] != this.$['amount'].getValue() ||
			this.trsnObj['date'] !== time ||
			this.trsnObj['account'] !== this.$['account'].getValue() ||
			( this.$['linkedAccount'].getShowing() && this.trsnObj['linkedAccount'] !== this.$['linkedAccount'].getValue() ) ||
			enyo.json.stringify( this.trsnObj['categoryOriginal'] ) !== enyo.json.stringify( this.trsnObj['category'] ) ||
			this.trsnObj['payee'] !== this.$['payeeField'].getValue() ||
			this.trsnObj['note'] !== this.$['notes'].getValue() ) {

			changes['major'] = true;
		}

		if(
			this.trsnObj['checkNum'] !== this.$['checkNum'].getValue() ||
			this.trsnObj['cleared'] !== this.$['cleared'].getValue() ) {

			changes['minor'] = true;
		}

		if( !Checkbook.transactions.recurrence.manager.compare( this.trsnObj['rObj'], this.$['recurrenceSelect'].getValue() ) ) {

			changes['recurrence'] = true;
		}

		return changes;
	},

	updateTransactionObject: function( killRObj ) {

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
		delete( this.trsnObj['categoryOriginal'] );

		this.trsnObj['checkNum'] = this.$['checkNum'].getValue();
		this.trsnObj['payee'] = this.$['payeeField'].getValue();
		this.trsnObj['cleared'] = this.$['cleared'].getValue();
		this.trsnObj['note'] = this.$['notes'].getValue();

		//this.trsnObj['repeatId']//Existing repeat
		//this.trsnObj['repeatUnlinked']//Not linked to rest of series

		if( killRObj ) {

			this.trsnObj['rObj'] = false;
		} else {

			if( !this.trsnObj['rObj'] ) {

				this.trsnObj['rObj'] = {};
			}

			enyo.mixin( this.trsnObj['rObj'], enyo.clone( this.$['recurrenceSelect'].getValue() ) );
		}

		this.trsnObj['autoTransfer'] = ( ( this.$['autoTrans'].getShowing() && this.$['autoTrans'].getValue() ) ? this.accountObj['auto_savings'] : 0 );
		this.trsnObj['autoTransferLink'] = this.accountObj['auto_savings_link'];
	},

	saveNewTransaction: function() {

		this.updateTransactionObject();
		Checkbook.transactions.manager.createTransaction( this.trsnObj, this.transactionType, this.getSaveOptions() );
	},

	saveModifiedTransaction: function( killRObj ) {

		this.updateTransactionObject( killRObj );
		Checkbook.transactions.manager.updateTransaction( this.trsnObj, this.transactionType, this.getSaveOptions() );
	},

	saveCompleteHandler: function( inEvent ) {

		enyo.asyncMethod( this, this.doFinish, inEvent );
	},

	closeRecurrenceEventDialog: function() {

		this.$['recurrenceEventDialog'].hide();
		this.$['recurrenceEventDialog'].destroy();
	},

	endRecurrenceEvent: function() {

		this.closeRecurrenceEventDialog();

		Checkbook.transactions.recurrence.manager.deleteOnlyFuture(
				this.trsnObj['itemId'],
				this.trsnObj['repeatId'],
				{
					"onSuccess": enyo.bind( this, this.saveModifiedTransaction, true )
				}
			);
	},

	updateSingle: function() {

		this.closeRecurrenceEventDialog();

		this.trsnObj['repeatUnlinked'] = 1;
		this.saveModifiedTransaction( true );
	},

	updateFuture: function() {

		this.closeRecurrenceEventDialog();
		this.saveModifiedTransaction();
	},

	updateAll: function() {

		var self = this;
		var repeatId = this.trsnObj['repeatId'];

		this.closeRecurrenceEventDialog();

		this.updateTransactionObject();

		//Adjust as if new transaction
		this.trsnObj['repeatId'] = -1;
		this.$['date'].setValue( gts.Object.isDate( this.trsnObj['rObj']['origDate'] ) ? this.trsnObj['rObj']['origDate'].getTime() : this.trsnObj['rObj']['origDate'] );

		Checkbook.transactions.recurrence.manager.deleteAll(
				repeatId,
				{
					"onSuccess": enyo.bind( this, this.saveNewTransaction )
				}
			);
	},

	deleteTransaction: function() {

		if( this.trsnObj['itemId'] < 0 ) {

			this.doFinish( { "status": 0 } );
		} else {

			if( this.trsnObj['repeatId'] > 0 || this.trsnObj['repeatId'] === 0 ) {

				this.createComponent( {
						name: "deleteTransactionConfirm",
						kind: "Checkbook.transactions.recurrence.delete",

						transactionId: this.trsnObj['itemId'],
						recurrenceId: this.trsnObj['repeatId'],

						onFinish: "deleteTransactionConfirmClose",
						onCancel: "deleteTransactionConfirmClose"
					});
			} else {

				this.createComponent( {
						name: "deleteTransactionConfirm",
						kind: "gts.ConfirmDialog",

						title: "Delete Transaction",
						message: "Are you sure you want to delete this transaction?",

						confirmText: "Delete",
						confirmClass: "onyx-negative",

						cancelText: "Cancel",
						cancelClass: "",

						onConfirm: "deleteTransactionHandler",
						onCancel: "deleteTransactionConfirmClose"
					});
			}

			this.$['deleteTransactionConfirm'].show();
		}
	},

	deleteTransactionConfirmClose: function() {

		this.$['deleteTransactionConfirm'].hide();
		this.$['deleteTransactionConfirm'].destroy();
	},

	deleteTransactionHandler: function() {

		this.deleteTransactionConfirmClose();

		Checkbook.transactions.manager.deleteTransaction(
				this.trsnObj['itemId'],
				{
					"onSuccess": enyo.bind( this, this.saveCompleteHandler, { "modifyStatus": 2 } )
				}
			);
	}
});
