enyo.kind({
	name: "Checkbook.transactions.recurrence.delete",
	kind: "onyx.Popup",

	classes: "gts-confirm-dialog",

	centered: true,
	floating: true,
	modal: true,
	autoDismiss: false,
	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	style: "max-width: 325px;",

	published: {
		transactionId: -1,
		recurrenceId: -1
	},

	events: {
		onDeleteOne: "",
		onDeleteFuture: "",
		onDeleteAll: "",
		onFinish: "",
		onCancel: ""
	},

	components: [
		{
			name: "title",
			classes: "title-wrapper",
			content: "Delete Recurring Transaction"
		}, {
			name: "message",
			classes: "message-wrapper",
			content: "Would you like to delete only this transaction, this and all following transactions in the series, or all transactions in the series?"
		}, {
			classes: "block-buttons text-center",
			components: [
				{
					kind: "onyx.Button",
					content: "Only this instance",
					classes: "onyx-negative",
					ontap: "deleteOne"
				}, {
					kind: "onyx.Button",
					content: "This and all following",
					classes: "onyx-negative",
					ontap: "deleteFuture"
				}, {
					kind: "onyx.Button",
					content: "All transactions in the series",
					classes: "onyx-negative",
					ontap: "deleteAll"
				}, {
					kind: "onyx.Button",
					content: "Cancel",
					ontap: "doCancel"
				}
			]
		}
	],

	deleteOne: function() {

		Checkbook.transactions.recurrence.manager.deleteOne(
				this.transactionId,
				this.recurrenceId,
				{
					"onSuccess": enyo.bind( this, this.deleteCompleted, "one" )
				}
			);
	},

	deleteFuture: function() {

		Checkbook.transactions.recurrence.manager.deleteFuture(
				this.transactionId,
				this.recurrenceId,
				{
					"onSuccess": enyo.bind( this, this.deleteCompleted, "future" )
				}
			);
	},

	deleteAll: function() {

		Checkbook.transactions.recurrence.manager.deleteAll(
				this.recurrenceId,
				{
					"onSuccess": enyo.bind( this, this.deleteCompleted, "all" )
				}
			);
	},

	deleteCompleted: function( type ) {

		switch( type ) {
			case "all":
				this.doDeleteAll();
				break;
			case "future":
				this.doDeleteFuture();
				break;
			case "one":
				this.doDeleteOne();
				break;
		}

		this.doFinish();
	}
});
