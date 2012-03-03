/* Copyright © 2011, GlitchTech Science */

/**
 * Checkbook.autocompleteprefs.view ( VFlexBox )
 */
enyo.kind( {
	name: "Checkbook.autocompleteprefs.view",
	kind: enyo.VFlexBox,

	style: "height: 100%;",
	flex: 1,

	events: {
		onFinish: ""
	},

	components: [
		{
			kind: enyo.PageHeader,
			className: "enyo-header-dark",
			components: [
				{
					kind: enyo.Spacer
				}, {
					content: $L( "Auto-Complete Preferences" ),
					className: "bigger"
				}, {
					kind: enyo.Spacer
				}
			]
		},

		{
			name: "entries",
			kind: enyo.VirtualList,

			flex: 1,

			onSetupRow: "buildRow",
			//onAcquirePage: "fetchGroup",
			//pageSize: 15,

			components: [
				{
					kind: enyo.SwipeableItem,
					layoutKind: enyo.HFlexLayout,
					className: "light narrow-column",

					tapHighlight: true,
					onclick: "itemTapped",
					onConfirm: "itemDeleted",

					components: [
						{
							name: "desc",
							className: "enyo-text-ellipsis",
							flex: 1
						}, {
							name: "icon",
							kind: enyo.Image,
							className: "img-icon"
						}
					]
				}
			]
		},

		{
			kind: enyo.Toolbar,
			className: "tardis-blue",
			components: [
				{
					kind: enyo.ToolButtonGroup,
					components: [
						{
							caption: $L( "Close" ),
							className: "enyo-grouped-toolbutton-dark",
							onclick: "doFinish"
						}, {
							icon: "source/images/menu_icons/sort.png",
							className: "enyo-grouped-toolbutton-dark",
							onclick: ""
						}
					]
				}, {
					kind: enyo.Spacer,
					flex: 1
				}, {
					kind: enyo.ToolButtonGroup,
					components: [
						{
							icon: "source/images/menu_icons/new.png",
							className: "enyo-grouped-toolbutton-dark",
							onclick: ""
						}
					]
				}
			]
		}
	],

	/** List Control **/

	itemTapped: function() {

		this.log( arguments );
	},

	itemDeleted: function() {

		this.log( arguments );
	},

	buildRow: function( inSender, inIndex ) {

		if( inIndex >= 0 && inIndex < 100 ) {

			this.$['desc'].setContent( "description name: " + inIndex );
			this.$['icon'].setSrc( "source/images/" + ( ( inIndex % 2 ) == 0 ? "green-plus.png" : "red-cross.png" ) );

			return true;
		}
	},

	fetchGroup: function( inSender, inPage ) {

		var index = inPage * inSender.getPageSize();

		if( index < 0 ) {
			//No indexes below zero, don't bother calling

			return;
		}

		//call to manager: fetch items between limit( inSender.getPageSize() ) and offset( index ) according to sort mode
	}
});