/* Copyright © 2013, GlitchTech Science */

enyo.kind({
	name: "Checkbook.appmenu",
	kind: "gts.EventMenu",

	openOnTop: true,
	floating: true,
	scrim: true,
	scrimclasses: "onyx-scrim-translucent",

	components: [
		{
			content: "Preferences",
			ontap: "openPreferences"
		}, {
			classes: "onyx-menu-divider"
		}, {
			showing: false,
			content: "Sync",
			ontap: "openSync"
		}, {
			content: "Import",
			ontap: "openImport"
		}, {
			content: "Export",
			ontap: "openExport"
		}, {
			classes: "onyx-menu-divider"
		}, {
			content: "Search",
			ontap: "openSearch"
		}, {
			content: "Budget",
			ontap: "openBudget"
		}, {
			showing: false,
			content: "Reports (NYI)",
			ontap: "openReport"
		}, {
			showing: false,
			classes: "onyx-menu-divider"
		}, {
			showing: false,
			content: "Report Bug (NYI)",
			ontap: "errorReport"
		}, {
			classes: "onyx-menu-divider"
		}, {
			content: "About",
			ontap: "openAbout"
		}
	],

	openAbout: function() {

		enyo.Signals.send( "showPopup", { "popup": "about" } );
	},

	errorReport: function() {

		console.log( "ERROR REPORT SYSTEM GO" );
		//enyo.Signals.send( "showPopup", { "popup": "about" } );
	},

	/** Checkbook.preferences **/

	openPreferences: function() {

		enyo.Signals.send(
				"showPanePopup",
				{
					name: "preferences",
					kind: "Checkbook.preferences"
				}
			);
	},

	/** Checkbook.sync.* **/

	openSync: function( inSender, inEvent ) {

		enyo.Signals.send(
				"showPanePopup",
				{
					name: "sync",
					kind: "Checkbook.sync.main",
					onFinish: enyo.bind( this, this.syncComplete )
				}
			);
	},

	syncComplete: function( inSender, importStatus ) {

		if( importStatus['success'] === true ) {

			enyo.Signals.send( "resetSystem", {} );
		}
	},

	openImport: function( inSender, inEvent ) {

		enyo.Signals.send(
				"showPanePopup",
				{
					name: "import",
					kind: "Checkbook.sync.import",
					onFinish: enyo.bind( this, this.importComplete )
				}
			);
	},

	importComplete: function( inSender, importStatus ) {

		if( importStatus['success'] === true ) {

			enyo.Signals.send( "resetSystem", {} );
		}
	},

	openExport: function( inSender, inEvent ) {

		enyo.Signals.send(
				"showPanePopup",
				{
					name: "export",
					kind: "Checkbook.sync.export"
				}
			);
	},

	/** Other modules **/

	openSearch: function( inSender, inEvent ) {

		enyo.Signals.send( "showSearch", {} );
	},

	openBudget: function( inSender, inEvent ) {

		enyo.Signals.send( "showBudget", {} );
	},

	openReport: function( inSender, inEvent ) {

		enyo.Signals.send( "showReport", {} );
	}
});
