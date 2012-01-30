/* Copyright © 2011, GlitchTech Science */

/**
 * Checkbook.balanceMenu ( Menu )
 *
 * Override kind for balance menu items. Need to be changable on the fly so this implements a setItems function (which should exist but doesn't).
 */
enyo.kind({

	name: "Checkbook.balanceMenu",
	kind: enyo.Menu,

	allowHtml: true,
	scrim: true,

	lazy: false,//Prevents oddness when rending for first view

	style: "min-width: 200px;",

	published: {
		localize: true
	},

	events: {
		onMenuItemClick: ""
	},

	/**
	 * Updates menu items to be as sent in; designed to be balance menu;
	 *
	 * @param	newItems	(array of objs):
	 *	each item should have a minimum of caption, balance, value
	 *	menuParent is optional. If not set, will be balanceMenu
	 */
	setItems: function( newItems, selected ) {

		if( !Object.validNumber( selected ) ) {

			selected = -1;
		}

		if( enyo.isArray( newItems ) ) {

			this.deleteChildren();

			for( var i = 0; i < newItems.length; i++ ) {

				this.createItemComponent(
						newItems[i]['caption'],
						newItems[i]['balance'],
						newItems[i]['value'],
						enyo.isString( newItems[i]['menuParent'] ) ? newItems[i]['menuParent'] : "balanceMenu",
						( selected === newItems[i]['value'] )
					);
			}

			this.render();
		}
	},

	deleteChildren: function() {

		var componentList = this.getComponents();

		for( var i = 0; i < componentList.length; i++ ) {

			if( enyo.isString( componentList[i]['menuParent'] ) ) {

				componentList[i].destroy();
			}
		}
	},

	createItemComponent: function( captionIn, balanceIn, valueIn, menuParentIn, selected ) {

		var balanceColor = "neutralFunds";
		if( ( Math.round( balanceIn * 100 ) / 100 ) > 0 ) {

			balanceColor = 'positiveFunds';
		} else if( ( Math.round( balanceIn * 100 ) / 100 ) < 0 ) {

			balanceColor = 'negativeFunds';
		}

		this.createComponent(
				{
					kind: enyo.HFlexBox,

					menuParent: menuParentIn,
					value: valueIn,

					onclick: "menuItemClick",

					className: "enyo-item enyo-menuitem " + ( selected ? "selected" : "normal" ),
					style: "min-width: 200px;",

					components: [
						{
							content: ( this.localize ? $L( captionIn ) : captionIn ),
							className: "enyo-menuitem-caption",
							flex: 1
						}, {
							content: formatAmount( balanceIn ),
							className: "enyo-menuitem-caption " + balanceColor,
							style: "margin-left: 10px;"
						}
					]
				}
			);
	},

	menuItemClick: function( inSender, inEvent ) {

		this.doMenuItemClick( inSender, inEvent );
		this.close();
	}
});