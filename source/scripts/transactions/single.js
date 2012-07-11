/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.viewSingle",
	kind: enyo.ModalDialog,

	lazy: false,

	scrim: true,
	dismissWithClick: true,

	style: "width: 500px;",

	published: {
		caption: "Transaction Details",

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
			kind: enyo.Pane,
			className: "modal-pane-view",
			components: [
				{
					kind: enyo.VFlexBox,
					components: [
						{
							kind: enyo.VFlexBox,
							className: "group",
							flex: 1,
							components: [
								{
									kind: enyo.Scroller,
									autoHorizontal: false,
									horizontal: false,
									flex: 1,
									components: [
										{
											name: "desc",
											className: "enyo-first bigger"
										}, {
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,
											align: "center",
											className: "first",

											components: [
												{
													className: "img-icon",
													style: "overflow: hidden; margin-right: 1em;",
													components: [
														{
															name: "transTypeIcon",
															kind: enyo.Image,
															style: "width: 32px; height: 64px;"
														}
													]
												}, {
													name: "amount",
													className: "big",
													flex: 1
												}, {
													content: "amount",
													className: "enyo-label"
												}
											]
										}, {
											name: "fromAccountHolder",
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,
											align: "center",
											className: "expenseIcon custom-background",

											components: [
												{
													name: "fromAccountImg",
													kind: enyo.Image,
													className: "img-icon",
													style: "margin-right: 1em;"
												}, {
													name: "fromAccount",
													flex: 1
												}, {
													content: "from",
													className: "enyo-label"
												}
											]
										}, {
											name: "toAccountHolder",
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,
											align: "center",
											className: "incomeIcon custom-background",

											components: [
												{
													name: "toAccountImg",
													kind: enyo.Image,
													className: "img-icon",
													style: "margin-right: 1em;"
												}, {
													name: "toAccount",
													flex: 1
												}, {
													content: "to",
													className: "enyo-label"
												}
											]
										}, {
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,
											align: "center",

											components: [
												{
													kind: enyo.Image,
													src: "assets/calendar.png",
													className: "img-icon",
													style: "margin-right: 1em;"
												}, {
													name: "time"
												}
											]
										}, {
											showing: false,
											kind: enyo.RowItem,
											content: "Repeat"
										}, {
											name: "categoryHolder",
											kind: enyo.RowItem,

											components: [
												{
													content: "category",
													className: "enyo-label",
													style: "text-align: right;"
												}, {
													name: "category",
													allowHtml: true,
													flex: 1
												}
											]
										}, {
											name: "checkNumHolder",
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,
											align: "center",
											components: [
												{
													name: "checkNum",
													flex: 1
												}, {
													content: "check number",
													className: "enyo-label"
												}
											]
										}, {
											name: "cleared",
											kind: "GTS.ToggleBarRev",

											mainText: "Cleared",
											subText: "",

											onText: "Cleared",
											offText: "Pending",

											onChange: "clearToggled"
										}, {
											name: "noteHolder",
											kind: enyo.RowItem,
											layoutKind: enyo.HFlexLayout,

											align: "center",
											className: "enyo-last",

											components: [
												{
													name: "note",
													allowHtml: true,
													flex: 1
												}, {
													content: "note",
													className: "enyo-label"
												}
											]
										}
									]
								},
							]
						}, {
							kind: enyo.VFlexBox,
							components:[
								{
									name: "btnEdit",
									kind: "onyx.Button",
									caption: "Edit",
									onclick: "editClicked",
									flex: 1,
									className: "enyo-button-dark"
								}, {
									name: "btnDelete",
									kind: "onyx.Button",
									caption: "Delete",
									onclick: "deleteClicked",
									flex: 1,
									className: "enyo-button-negative"
								}, {
									name: "btnCancel",
									kind: "onyx.Button",
									caption: "Close",
									onclick: "close",
									flex: 1,
									className: "enyo-button-light"
								}
							]
						}
					]
				}
			]
		}
	],

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		this._binds = {
				"renderFromAccount": enyo.bind( this, this.renderFromAccount ),
				"renderToAccount": enyo.bind( this, this.renderToAccount )
			};
	},

	/**
	 * @protected
	 */
	rendered: function() {

		this.inherited( arguments );

		this.$['cleared'].setStyle( "padding-left: 10px;" );
	},

	openAtCenter: function() {

		if( !this.account['acctId'] ) {

			this.inherited( arguments );
			this.close();
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
	},

	loadAccount: function( finishRender, result ) {

		this.account = result;
		this.renderDisplay( finishRender );
	},

	renderDisplay: function( finishRender ) {

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
		if( Object.isNumber( this.transaction['linkedRecord'] ) && this.transaction['linkedRecord'] >= 0 ) {

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
		this.$['time'].setContent( dateObj.format( { date: 'long', time: ( this.account['showTransTime'] === 1 ? 'short' : '' ) } ) );

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

		//Note
		if( this.transaction['note'] != "" ) {

			this.$['noteHolder'].show();
			this.$['note'].setContent( this.transaction['note'] );
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

	close: function() {

		for( var i = 0; i < appColors.length; i++ ) {

			this.$['desc'].removeClass( appColors[i]['name'] );
			this.$['toAccountHolder'].removeClass( appColors[i]['name'] );
			this.$['fromAccountHolder'].removeClass( appColors[i]['name'] );
		}

		this.$['desc'].removeClass( "custom-background legend" );

		this.inherited( arguments );
	},

	/** Event Handlers **/

	clearToggled: function() {

		var cleared = this.doClear( this.index );

		this.$['cleared'].setValue( cleared == 1 );
	},

	editClicked: function() {

		this.doEdit( this.index );
		enyo.asyncMethod( this, this.close );
	},

	deleteClicked: function() {

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
	},

	deleteTransactionConfirmClose: function() {

		this.$['deleteTransactionConfirm'].destroy();
	},

	deleteTransactionHandler: function() {

		this.deleteTransactionConfirmClose();
		this.doDelete( this.index );
		enyo.asyncMethod( this, this.close );
	}
});
