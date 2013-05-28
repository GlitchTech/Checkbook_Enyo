/* Copyright © 2011-2012, GlitchTech Science */

/*
Extension of onyx.MoreToolbar to change the styling of overflow button.
*/

enyo.kind({
	name: "Checkbook.MoreToolbar",
	kind: "onyx.MoreToolbar",
	tools: [
		{
			name: "client",
			noStretch:true,
			fit: true,
			classes: "onyx-toolbar-inline"
		}, {
			name: "nard",
			kind: "onyx.MenuDecorator",
			showing: false,
			onActivate: "activated",
			components: [
				{
					kind: "onyx.Button",
					classes: "padding-none margin-none transparent",
					style: "vertical-align: middle; margin: 4px 6px 5px; box-sizing: border-box;",
					components: [
						{
							kind: "onyx.Icon",
							classes: "onyx-more-button"
						}
					]
				}, {
					name: "menu",
					kind: "onyx.Menu",
					scrolling: false,
					classes: "onyx-more-menu"
				}
			]
		}
	],

	reflow: function() {

		this.inherited(arguments);
		//this.warn( this.$['menu'].children.length, this.$['menu'], this.$['menu'].childComponents );
	}
});

enyo.kind({
	name: "DUMMYCOMPONENTNAMETHATWONTEVERBEUSEDBECAUSEITISHEREFORREFERENCE",
	//* @public
	classes: "onyx-toolbar onyx-more-toolbar",
	//* Style class to be applied to the menu
	menuClass: "",
	//* Style class to be applied to individual controls moved from the toolbar to the menu
	movedClass: "",
	//* @protected
	layoutKind: "FittableColumnsLayout",
	noStretch: true,
	handlers: {
		onHide: "reflow"
	},
	published: {
		//* Layout kind that will be applied to the client controls.
		clientLayoutKind: "FittableColumnsLayout"
	},
	tools: [
		{name: "client", noStretch:true, fit: true, classes: "onyx-toolbar-inline"},
		{name: "nard", kind: "onyx.MenuDecorator", showing: false, onActivate: "activated", components: [
			{kind: "onyx.IconButton", classes: "onyx-more-button"},
			{name: "menu", kind: "onyx.Menu", scrolling:false, classes: "onyx-more-menu"}
		]}
	],
	initComponents: function() {
		if(this.menuClass && this.menuClass.length>0 && !this.$.menu.hasClass(this.menuClass)) {
			this.$.menu.addClass(this.menuClass);
		}
		this.createChrome(this.tools);
		this.inherited(arguments);
		this.$.client.setLayoutKind(this.clientLayoutKind);
	},
	clientLayoutKindChanged: function(){
		this.$.client.setLayoutKind(this.clientLayoutKind);
	},
	reflow: function() {
		this.warn( this.$.menu.children.length, this.$.menu, this.$.menu.childComponents );
		this.inherited(arguments);
		if (this.isContentOverflowing()) {
			this.$.nard.show();
			if (this.popItem()) {
				this.reflow();
			}
		} else if (this.tryPushItem()) {
			this.reflow();
		} else if (!this.$.menu.children.length) {
			this.$.nard.hide();
			this.$.menu.hide();
		}
	},
	activated: function(inSender, inEvent) {
		this.addRemoveClass("active",inEvent.originator.active);
	},
	popItem: function() {
		var c = this.findCollapsibleItem();
		if (c) {
			//apply movedClass is needed
			if(this.movedClass && this.movedClass.length>0 && !c.hasClass(this.movedClass)) {
				c.addClass(this.movedClass);
			}
			// passing null to add child to the front of the control list
			this.$.menu.addChild(c, null);
			var p = this.$.menu.hasNode();
			if (p && c.hasNode()) {
				c.insertNodeInParent(p);
			}
			return true;
		}
	},
	pushItem: function() {
		var c$ = this.$.menu.children;
		var c = c$[0];
		if (c) {
			//remove any applied movedClass
			if(this.movedClass && this.movedClass.length>0 && c.hasClass(this.movedClass)) {
				c.removeClass(this.movedClass);
			}
			this.$.client.addChild(c);
			var p = this.$.client.hasNode();
			if (p && c.hasNode()) {
				var nextChild;
				var currIndex;
				for(var i=0; i<this.$.client.children.length; i++) {
					var curr = this.$.client.children[i];
					if(curr.toolbarIndex !== undefined && curr.toolbarIndex != i) {
						nextChild = curr;
						currIndex = i;
						break;
					}
				}
				if(nextChild && nextChild.hasNode()) {
					c.insertNodeInParent(p, nextChild.node);
					var newChild = this.$.client.children.pop();
					this.$.client.children.splice(currIndex, 0, newChild);
				} else {
					c.appendNodeToParent(p);
				}
			}
			return true;
		}
	},
	tryPushItem: function() {
		if (this.pushItem()) {
			if (!this.isContentOverflowing()) {
				return true;
			} else {
				this.popItem();
			}
		}
	},
	isContentOverflowing: function() {
		if (this.$.client.hasNode()) {
			var c$ = this.$.client.children;
			var n = c$.length && c$[c$.length-1].hasNode();
			if(n) {
				this.$.client.reflow();
				//Workaround: scrollWidth value not working in Firefox, so manually compute
				//return (this.$.client.node.scrollWidth > this.$.client.node.clientWidth);
				return ((n.offsetLeft + n.offsetWidth) > this.$.client.node.clientWidth);
			}
		}
	},
	findCollapsibleItem: function() {
		var c$ = this.$.client.children;
		var c;
		for (var i=c$.length-1; (c=c$[i]); i--) {
			if (!c.unmoveable) {
				return c;
			} else {
				if(c.toolbarIndex===undefined) {
					c.toolbarIndex = i;
				}
			}
		}
	},
	findHiddenItem: function() {
		var c$ = this.$.client.children;
		var c;
		for (var i=c$.length-1; (c=c$[i]); i--) {
			if (c.hidden) {
				return c;
			} else {
				if(c.toolbarIndex===undefined) {
					c.toolbarIndex = i;
				}
			}
		}
	}
});
