enyo.kind({
	name: "Checkbook.transactions.recurrence.confirm",
	kind: "onyx.Popup",

	classes: "gts-confirm-dialog",

	centered: true,
	floating: true,
	modal: true,
	autoDismiss: false,
	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	style: "max-width: 325px;",

	events: {
		onOne: "",
		onFuture: "",
		onAll: "",
		onCancel: ""
	},

	components: [
		{
			name: "title",
			classes: "title-wrapper",
			content: " Recurring Transaction"
		}, {
			name: "message",
			classes: "message-wrapper",
			content: "Would you like to change only this transaction, all transactions in the series, or this and all following transactions in the series?"
		}, {
			classes: "block-buttons text-center",
			components: [
				{
					kind: "onyx.Button",
					content: "Only this instance",
					ontap: "doOne"
				}, {
					kind: "onyx.Button",
					content: "This and all following",
					ontap: "doFuture"
				}, {
					kind: "onyx.Button",
					content: "All transactions in the series",
					ontap: "doAll"
				}, {
					kind: "onyx.Button",
					content: "Cancel",
					ontap: "doCancel"
				}
			]
		}
	]
});
