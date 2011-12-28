/* Copyright 2011 and forward GlitchTech Science. All rights reserved. */

/**
 * Checkbook.selectedMenu ( Menu )
 *
 * Override kind for select indicated menu items.
 */
enyo.kind({

	name: "Checkbook.selectedMenu",
	kind: enyo.Menu,

	allowHtml: true,
	scrim: true,

	lazy: false,//Prevents oddness when rending for first view

	setItems: function( items ) {

		this.destroyComponents();
		this.render();

		this.lazy = true;
		this.components = items;
	},

	openAtControl: function( inSender, value ) {

		for( var i = 0; i < this.components.length; i++ ) {

			if( this.components[i].value === value ) {

				this.components[i].className = "selected";
			} else {

				this.components[i].className = "normal";
			}
		}

		var items = this.components;

		this.setItems( items );

		this.inherited( arguments );
	}
});