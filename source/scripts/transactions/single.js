/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.viewSingle",
	kind: "onyx.Popup",

	classes: "large-popup",

	centered: true,
	floating: true,

	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	autoDismiss: false,

	published: {
		index: -1,
		account: null,
		transaction: null
	},

	events: {
		onClear: "",
		onEdit: "",
		onDelete: ""
	},

	components: [
		{
			content: "Transaction Details",
			classes: "biggest bold text-center padding-half-bottom"
		},
		{
			name: "scroller",
			kind: "enyo.Scroller",

			horizontal: "hidden",

			classes: "light popup-scroller",
			components: [
				{
					kind: "onyx.Groupbox",
					components: [
						{
							name: "desc",
							classes: "bordered bigger padding-std",
							style: "min-height: 65px;"
						}, {
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "bordered padding-std text-middle",

							components: [
								{
									classes: "img-icon margin-half-right",
									style: "overflow: hidden;",
									components: [
										{
											name: "transTypeIcon",
											kind: "enyo.Image",
											style: "width: 32px; height: 64px;"
										}
									]
								}, {
									name: "amount",
									classes: "big",
									fit: true
								}, {
									content: "amount",
									classes: "label"
								}
							]
						},{
							name: "fromAccountHolder",
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "expenseIcon custom-background bordered padding-std padding-left text-middle",

							components: [
								{
									name: "fromAccountImg",
									kind: "enyo.Image",
									classes: "img-icon margin-right"
								}, {
									name: "fromAccount",
									fit: true
								}, {
									content: "from",
									classes: "label"
								}
							]
						}, {
							name: "toAccountHolder",
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "incomeIcon custom-background bordered padding-std padding-left text-middle",

							components: [
								{
									name: "toAccountImg",
									kind: "enyo.Image",
									classes: "img-icon margin-right"
								}, {
									name: "toAccount",
									fit: true
								}, {
									content: "to",
									classes: "label"
								}
							]
						}, {
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "bordered padding-std text-middle",

							components: [
								{
									kind: "enyo.Image",
									src: "assets/calendar.png",
									classes: "img-icon margin-right"
								}, {
									name: "time"
								}
							]
						}, {
							showing: false,
							content: "Repeat"
						}, {
							name: "categoryHolder",
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "bordered padding-std text-middle",

							components: [
								{
									name: "category",
									allowHtml: true,
									fit: true
								}, {
									content: "category",
									classes: "label"
								}
							]
						}, {
							name: "checkNumHolder",
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "bordered padding-std text-middle",

							components: [
								{
									name: "checkNum",
									fit: true
								}, {
									content: "check number",
									classes: "label"
								}
							]
						}, {
							name: "payeeHolder",
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "bordered padding-std text-middle",

							components: [
								{
									name: "payee",
									fit: true
								}, {
									content: "payee",
									classes: "label"
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

							onChange: "clearToggled"
						}, {
							name: "noteHolder",
							kind: "enyo.FittableColumns",
							noStretch: true,

							classes: "bordered padding-std text-top",

							components: [
								{
									name: "note",
									allowHtml: true,
									fit: true
								}, {
									content: "note",
									classes: "label"
								}
							]
						}
					]
				}
			]
		}, {
			classes: "padding-std text-center h-box pack-center",
			components:[
				{
					name: "btnCancel",
					kind: "onyx.Button",
					content: "Close",

					ontap: "hide",

					classes: "margin-right box-flex"
				}, {
					name: "btnDelete",
					kind: "onyx.Button",
					content: "Delete",

					ontap: "deleteClicked",

					classes: "onyx-negative box-flex"
				}, {
					name: "btnEdit",
					kind: "onyx.Button",
					content: "Edit",

					ontap: "editClicked",

					classes: "tardis-blue margin-left box-flex"
				}
			]
		}
	],

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.log();

		this.inherited( arguments );

		this._binds = {
				"renderFromAccount": enyo.bind( this, this.renderFromAccount ),
				"renderToAccount": enyo.bind( this, this.renderToAccount )
			};
	},

	/**
	 * @protected
	 * @extends onyx.Popup#show
	 *
	 * @param boolean shortTerm Hide popup without closing procedure
	 */
	show: function( shortTerm ) {

		this.log();

		if( !shortTerm ) {

			if( !this.account['acctId'] ) {

				this.hide();
				return;
			}

			//Check this.account properties
			var count = 0;
			for( var k in this.account ) {

				if( this.account.hasOwnProperty( k ) ) {

					count++;
				}
			}

			var finishRender = enyo.bind( this, this.inherited, arguments );

			if( count <= 5 ) {

				Checkbook.globals.accountManager.fetchAccount( this.account['acctId'], { "onSuccess": enyo.bind( this, this.loadAccount, finishRender ) } );
			} else {

				this.renderDisplay( finishRender );
			}
		} else {

			this.inherited( arguments );
		}
	},

	/**
	 * @protected
	 * @extends onyx.Popup#reflow
	 */
	reflow: function() {

		this.log();

		this.$['scroller'].applyStyle( "height", null );

		this.inherited( arguments );

		this.$['scroller'].applyStyle( "height", this.$['scroller'].getBounds().height + "px" );
	},

	/**
	 * @protected
	 * @extends onyx.Popup#hide
	 *
	 * @param boolean shortTerm Hide popup without closing procedure
	 */
	hide: function( shortTerm ) {

		this.log();

		if( !shortTerm ) {

			for( var i = 0; i < appColors.length; i++ ) {

				this.$['desc'].removeClass( appColors[i]['name'] );
				this.$['toAccountHolder'].removeClass( appColors[i]['name'] );
				this.$['fromAccountHolder'].removeClass( appColors[i]['name'] );
			}

			this.$['desc'].removeClass( "custom-background legend" );
		}

		this.inherited( arguments );
	},

	loadAccount: function( finishRender, result ) {

		this.log();

		this.account = result;
		this.renderDisplay( finishRender );
	},

	renderDisplay: function( finishRender ) {

		this.log();

		if( this.account['frozen'] === 1 ) {

			this.$['btnEdit'].hide();
			this.$['btnDelete'].hide();
		} else {

			this.$['btnEdit'].show();
			this.$['btnDelete'].show();
		}

		//Description
		this.$['desc'].addRemoveClass( "custom-background legend " + this.account['acctCategoryColor'], ( Checkbook.globals.prefs['dispColor'] === 1 ) );
		this.$['desc'].setContent( this.transaction['desc'] );

		//Amount
		if( GTS.Object.isNumber( this.transaction['linkedRecord'] ) && this.transaction['linkedRecord'] >= 0 ) {

			this.transactionType = "transfer";
		} else if( this.transaction['amount'] < 0 ) {

			this.transactionType = "expense";
		} else {

			this.transactionType = "income";
		}

		this.$['transTypeIcon'].setSrc( "assets/menu_icons/" + this.transactionType + ".png" );
		this.$['amount'].setContent( formatAmount( Math.abs( this.transaction['amount'] ) ) );

		if( this.transactionType === "transfer" ) {

			this.$['fromAccountHolder'].show();
			this.$['toAccountHolder'].show();

			if( this.transaction['amount'] < 0 ) {
				//from here

				this._binds['renderFromAccount']( this.account );
				Checkbook.globals.accountManager.fetchAccount( this.transaction.linkedAccount, { "onSuccess": this._binds['renderToAccount'] } );
			} else {
				//to here

				Checkbook.globals.accountManager.fetchAccount( this.transaction.linkedAccount, { "onSuccess": this._binds['renderFromAccount'] } );
				this._binds['renderToAccount']( this.account );
			}
		} else {

			this.$['fromAccountHolder'].hide();
			this.$['toAccountHolder'].hide();
		}

		//Date
		var dateObj = new Date( parseInt( this.transaction['date'] ) );
		this.$['time'].setContent( dateObj.format( { date: "long", time: ( this.account["showTransTime"] === 1 ? "short" : "" ) } ) );

		//Categories
		if( this.account['enableCategories'] === 1 ) {

			this.$['categoryHolder'].show();
			this.$['category'].setContent( Checkbook.globals.transactionManager.formatCategoryDisplay( this.transaction['category'], this.transaction['category2'], false, "" ) );
		} else {

			this.$['categoryHolder'].hide();
		}

		//Check Number
		if( this.account['checkField'] === 1 && this.transaction['checkNum'] && this.transaction['checkNum'] !== "" ) {

			this.$['checkNumHolder'].show();
			this.$['checkNum'].setContent( "#" + this.transaction['checkNum'] );
		} else {

			this.$['checkNumHolder'].hide();
			this.$['checkNum'].setContent( "" );
		}

		//Cleared
		this.$['cleared'].setValue( this.transaction['cleared'] == 1 );

		//Payee
		if( this.account['payeeField'] === 1 && this.transaction['payee'] && this.transaction['payee'] !== "" ) {

			this.$['payeeHolder'].show();
			this.$['payee'].setContent( this.transaction['payee']  );
		} else {

			this.$['payeeHolder'].hide();
		}

		//Note
		if( this.transaction['note'] != "" ) {

			this.$['noteHolder'].show();
			this.$['note'].setContent( this.transaction['note'].replace( /\n/g, "<br />" )  );
		} else {

			this.$['noteHolder'].hide();
		}

		//Show once content is updated
		finishRender();
	},

	renderFromAccount: function( acct ) {

		this.$['fromAccountImg'].setSrc( "assets/" + acct['acctCategoryIcon'] );
		this.$['fromAccount'].setContent( acct['acctName'] );

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			this.$['fromAccountHolder'].addClass( acct['acctCategoryColor'] );
		} else {

			this.$['fromAccountHolder'].removeClass( "custom-background" );
		}
	},

	renderToAccount: function( acct ) {

		this.$['toAccountImg'].setSrc( "assets/" + acct['acctCategoryIcon'] );
		this.$['toAccount'].setContent( acct['acctName'] );

		if( Checkbook.globals.prefs['dispColor'] === 1 ) {

			this.$['toAccountHolder'].addClass( acct['acctCategoryColor'] );
		} else {

			this.$['toAccountHolder'].removeClass( "custom-background" );
		}
	},

	/** Event Handlers **/

	clearToggled: function() {

		var cleared = this.doClear( { "rowIndex": this.index, "callback": enyo.bind( this, this.clearToggledHandler ) } );

		return true;
	},

	clearToggledHandler: function( cleared ) {

		this.$['cleared'].setValue( cleared );

		return true;
	},

	editClicked: function() {

		this.doEdit( { "rowIndex": this.index } );
		enyo.asyncMethod( this, this.hide );
	},

	deleteClicked: function() {

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

		this.hide( true );
		this.$['deleteTransactionConfirm'].show();
	},

	deleteTransactionConfirmClose: function() {

		this.$['deleteTransactionConfirm'].hide();
		this.$['deleteTransactionConfirm'].destroy();
		this.show( true );
	},

	deleteTransactionHandler: function() {

		this.deleteTransactionConfirmClose();

		this.doDelete( { "rowIndex": this.index } );
		enyo.asyncMethod( this, this.hide );
	}
});
