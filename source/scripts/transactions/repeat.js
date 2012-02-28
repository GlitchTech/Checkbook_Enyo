/* Copyright © 2011, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.repeat",
	kind: enyo.Component,

	published: {
	},

	events: {
	},

	components: [
	],

	/**
	 * @private
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		this._binds = {
				//"renderFromAccount": enyo.bind( this, this.renderFromAccount ),
			};
	},

	/**
	 * @private
	 */
	rendered: function() {

		this.inherited( arguments );
	}
});