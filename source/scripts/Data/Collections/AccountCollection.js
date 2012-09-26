var AccountCollection = Backbone.Collection.extend({

	model: Account,

	initialize: function() {

		this.transactions = new TransactionCollection;

		this.transactions.url = "/account/" + this.id + "/transaction";
		this.transactions.on( "reset", this.updateCounts );
	}
});
