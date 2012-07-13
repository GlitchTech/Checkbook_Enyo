/* Copyright � 2011-2012, GlitchTech Science */

/**
 * Checkbook.balanceMenu ( Menu )
 *
 * Override kind for balance menu items. Need to be changable on the fly so this implements a setItems function (which should exist but doesn't).
 */
enyo.kind({
	name: "Checkbook.balanceMenu",
	kind: "onyx.MenuDecorator",

	published: {
		choices: [],
		value: ""
	},

	events: {
		onChange: ""
	},

	components: [
		{
			name: "display"
		}, {
			name: "menu",
			kind: "GTS.SelectedMenu",
			floating: true,
			style: "min-width: 200px;",
			onChange: "selectionChanged"
		}
	],

	/**
	 * @protected
	 * @function
	 * @name Checkbook.balanceMenu#choicesChanged
	 *
	 * Updates menu items to be as sent in; designed to be balance menu;
	 *	each item should have a minimum of caption, balance, value
	 *	menuParent is optional. If not set, will be balanceMenu
	 */
	choicesChanged: function() {

		if( enyo.isArray( this.choices ) ) {

			var options = [];

			for( var i = 0; i < this.choices.length; i++ ) {

				var balanceColor = "neutralBalance";

				if( ( Math.round( this.choices[i]['balance'] * 100 ) / 100 ) > 0 ) {

					balanceColor = 'positiveBalance';
				} else if( ( Math.round( this.choices[i]['balance'] * 100 ) / 100 ) < 0 ) {

					balanceColor = 'negativeBalance';
				}

				options.push( {
						layoutKind: "enyo.FittableColumnsLayout",

						value: this.choices[i]['value'],

						ontap: "menuItemClick",

						components: [
							{
								content: this.choices[i]['caption'],
								classes: "margin-right",
								fit: true
							}, {
								content: formatAmount( this.choices[i]['balance'] ),
								classes: balanceColor
							}
						]
					});
			}

			this.$['menu'].setChoices( options );
		}
	},

	valueChanged: function() {

		this.$['menu'].setValue( this.value );

		var display = 0;

		for( var i = 0; i < this.choices.length; i++ ) {

			if( this.choices[i].value === this.value ) {

				display = this.choices[i]['balance'];
			}
		}

		this.$['display'].setContent( formatAmount( display ) );

		this.$['display'].addRemoveClass( "positiveBalanceLight", display > 0 );
		this.$['display'].addRemoveClass( "negativeBalanceLight", display < 0 );
		this.$['display'].addRemoveClass( "neutralBalanceLight", display == 0 );
	},

	selectionChanged: function( inSender, inEvent ) {

		this.setValue( inEvent.value );

		this.doChange( inEvent );

		return true;
	}
});
