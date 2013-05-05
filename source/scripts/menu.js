/* Copyright © 2011-2012, GlitchTech Science */

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
			content: "Import Data",
			ontap: "openImport"
		}, {
			content: "Export Data",
			ontap: "openExport"
		}, {
			classes: "onyx-menu-divider"
		}, {
			content: "Search",
			ontap: "openSearch"
		}, {
			showing: false,
			content: "Budget (NYI)",
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

	/** Checkbook.import && Checkbook.export **/

	openImport: function( inSender, inEvent ) {

		enyo.Signals.send(
				"showPanePopup",
				{
					name: "import",
					kind: "Checkbook.import",
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
					kind: "Checkbook.export"
				}
			);
	},

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
