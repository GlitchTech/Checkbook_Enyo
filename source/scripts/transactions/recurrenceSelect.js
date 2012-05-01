/* Copyright © 2011, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.repeat.select",
	kind: enyo.Control,

	/** @private variables */
	recurrenceOptions: [],

	/** @public variables */
	published: {
		date: ""
	},

	/** @public events */
	events: {
		onChange: ""
	},

	/** UI */
	components: [
		{
			name: "recurrenceNode",
			kind: "GTS.ListSelectorBar",
			labelText: "Recurrence",

			onChange: "recurrenceNodeChanged",

			className: "force-left-padding",

			value: 0
		}, {
			name: "weeklyOptions",
			kind: enyo.RowItem,
			layoutKind: enyo.HFlexLayout,

			showing: false,

			components: []
		}, {
			name: "durationWrapper",
			showing: false,

			components: [
				{
					kind: enyo.RowItem,
					layoutKind: enyo.HFlexLayout,
					align: "center",
					components: [
						{
							content: "Every "
						}, {
							name: "frequency",
							kind: enyo.IntegerPicker,

							label: "",

							min: 1,
							max: 64,

							style: "margin-right: 3px;",

							onChange: "sendSummary"
						}, {
							name: "frequencyUnits"
						}, {
							content: $L( "Frequency" ),

							flex: 1,

							className: "enyo-label",
							style: "text-align: right;"
						}
					]
				}, {
					name: "endingCondition",
					kind: "GTS.ListSelectorBar",
					labelText: "Ending Condition",

					className: "force-left-padding enyo-last",

					onChange: "endingConditionChanged",

					choices: [
						{
							caption: 'Forever',
							value: 'f'
						}, {
							caption: 'Until Date',
							value: 'd'
						}, {
							caption: 'Occurrences',
							value: 'o'
						}
					],

					value: 'f'
				}, {
					name: "endingDateWrapper",
					kind: enyo.RowItem,

					className: "enyo-single",
					showing: false,

					components: [
						{
							name: "endingDate",
							kind: "GTS.DateTimePicker",

							onChange: "sendSummary"
						}
					]
				}, {
					name: "endingCountWrapper",
					kind: enyo.RowItem,

					layoutKind: enyo.HFlexLayout,
					align: "center",

					className: "enyo-single",
					showing: false,

					components: [
						{
							name: "endingCount",
							kind: enyo.IntegerPicker,

							label: "",

							min: 1,
							max: 100,

							onChange: "sendSummary"
						}, {
							content: $L( "Occurrences" ),

							flex: 1,

							className: "enyo-label",
							style: "text-align: right;"
						}
					]
				}
			]
		}
	],

	/**
	 * @public
	 * Returns recurrence OBJ
	 */
	getValue: function() {

		var robj = {};

		if( this.$['recurrenceNode'].getValue() == 0 ) {

		} else {
			//Recurrence

			robj['startDate'] = this.date;
			robj['frequency'] = this.$['frequency'].getValue();

			switch( this.$['recurrenceNode'].getValue() ) {
				case 1://Daily
					robj['pattern'] = "daily";
					break;
				case 2://Weekly
					robj['pattern'] = "weekly";

					robj['dow'] = [];

					for( i = 0; i < 7; i++ ) {

						if( this.$['weekly' + i].getChecked() ) {

							robj['dow'].push( i );
						}
					}
					break;
				case 3://Monthly
					robj['pattern'] = "monthly";
					break;
				case 4://Yearly
				default:
					robj['pattern'] = "yearly";
			}

			//ending conditions
			switch( this.$['endingCondition'].getValue() ) {
				case 'd':
					robj['endCondition'] = "date";
					robj['endDate'] = this.$['endingDate'].getValue();
					break;
				case 'o':
					robj['endCondition'] = "occurences";
					robj['endCount'] = this.$['endingCount'].getValue();
					break;
				case 'f':
				default:
					robj['endCondition'] = "none";
			}
		}

		return robj;
	},

	/**
	 * @public
	 * Sets recurrence OBJ
	 */
	setValue: function( robj ) {

		if( robj == null || typeof( robj ) === "undefined" ) {

			this.$['recurrenceNode'].setValue( 0 );
		} else {
			//Recurrence

			this.date = robj['startDate'];
			this.$['frequency'].setValue( robj['frequency'] );

			for( i = 0; i < 7; i++ ) {

				this.$['weekly' + i].setChecked( false );
			}

			switch( robj['pattern'] ) {
				case "daily":
					this.$['recurrenceNode'].setValue( 1 );
					break;
				case "weekly":
					this.$['recurrenceNode'].setValue( 2 );

					for( i = 0; i < robj['dow'].length; i++ ) {

						this.$['weekly' + robj['dow'][i]].setChecked( true );
					}
					break;
				case "monthly":
					this.$['recurrenceNode'].setValue( 3 );
					break;
				case "yearly":
					this.$['recurrenceNode'].setValue( 4 );
					break;
				default:
					this.$['recurrenceNode'].setValue( 0 );
			}

			//ending conditions
			switch( robj['endCondition'] ) {
				case "date":
					this.$['endingCondition'].setValue( 'd' );
					this.$['endingDate'].setValue( robj['endDate'] );
					break;
				case "occurences":
					this.$['endingCondition'].setValue( 'o' );
					this.$['endingCount'].setValue( robj['endCount'] );
					break;
				case "none":
				default:
					this.$['endingCondition'].setValue( 'f' );
			}
		}

		this.buildRecurrenceOptions();
		this.recurrenceNodeChanged();
	},

	/**
	 * @private
	 * called when UI is built
	 */
	rendered: function() {

		this.inherited( arguments );

		if( this.date == "" ) {

			this.date = new Date();
		}

		//Build Weekly Repeat Options
		var dowDate = new Date( 2011, 4, 1 );//Sunday, May 1, 2011
		var dowComponents = [];

		for( i = 0; i < 7; i++ ) {

			dowComponents.push( {
					flex: 1,
					style: "text-align: center;",
					components: [
						{
							content: dowDate.format( { format: "EEE" } ),
							className: "enyo-label"
						}, {
							name: "weekly" + i,
							kind: enyo.CheckBox,
							onChange: "sendSummary",
							checked: ( this.date.getDay() == i ),
							dayName: dowDate.format( { format: "EEEE" } )
						}
					]
				});

			dowDate.setDate( dowDate.getDate() + 1 );
		}

		this.$['weeklyOptions'].createComponents( dowComponents, { owner: this } );
		this.$['weeklyOptions'].render();

		this.buildRecurrenceOptions();
		this.recurrenceNodeChanged();
	},

	/**
	 * @protected
	 * Date recurrence is based on changed, called by system
	 */
	dateChanged: function() {

		this.buildRecurrenceOptions();

		if( this.$['recurrenceNode'].getValue() != 2 ) {

			for( i = 0; i < 7; i++ ) {

				this.$['weekly' + i].setChecked( this.date.getDay() == i );
			}
		}
	},

	/**
	 * @private
	 * Builds a text string based on values set and sends to value to the onChange function
	 */
	sendSummary: function() {
		//TODO: Localize

		var summary = "";

		if( this.$['recurrenceNode'].getValue() == 0 ) {

			summary = "No Recurrence";
		} else {
			//Recurrence

			summary = "Repeats every " + this.$['frequency'].getValue() + " ";

			switch( this.$['recurrenceNode'].getValue() ) {
				case 1://Daily
					summary += "day(s)";
					break;
				case 2://Weekly
					var dow = [];
					var dowCheck = [];

					for( i = 0; i < 7; i++ ) {

						if( this.$['weekly' + i].getChecked() ) {

							dow.push( this.$['weekly' + i].dayName );
							dowCheck[i] = this.$['weekly' + i].dayName;
						} else {
							dowCheck[i] = "";
						}
					}

					if( dowCheck[1] != "" && dowCheck[2] != "" && dowCheck[3] != "" && dowCheck[4] != "" && dowCheck[5] != "" ) {

						dow.splice( dow.indexOf( dowCheck[1] ), 1 );
						dow.splice( dow.indexOf( dowCheck[2] ), 1 );
						dow.splice( dow.indexOf( dowCheck[3] ), 1 );
						dow.splice( dow.indexOf( dowCheck[4] ), 1 );
						dow.splice( dow.indexOf( dowCheck[5] ), 1 );

						dow.push( "Weekdays" );
					}

					if( dowCheck[0] != "" && dowCheck[6] != "" ) {

						dow.splice( dow.indexOf( dowCheck[0] ), 1 );
						dow.splice( dow.indexOf( dowCheck[6] ), 1 );

						dow.push( "Weekends" );
					}

					var dowStr = dow.join( ", " );

					if( dow.length > 1 ) {

						dowStr = dowStr.substr( 0, dowStr.lastIndexOf( ", " ) ) + ( dow.length > 2 ? "," : "" ) + " and " + dowStr.substr( dowStr.lastIndexOf( ", " ) + 2 );
					}

					summary += "week(s) on " + dowStr;
					break;
				case 3://Monthly
					summary += "month(s) on the " + this.dateSuffix( this.date.getDate() );
					break;
				case 4://Yearly
					summary += "year(s) on " + this.date.format( { format: "MMMM" } ) + " " + this.dateSuffix( this.date.getDate() );
					break;
				default:
					summary += "span(s)";
			}
		}

		this.doChange( { "summary": summary, "value": this.getValue() } );
	},

	/**
	 * @private
	 * Builds recurrence option dropdown according to currently set date
	 */
	buildRecurrenceOptions: function() {

		this.recurrenceOptions = [
				{
					caption: "No Recurrence",
					value: 0
				}, {
					caption: "Daily",
					value: 1
				}, {
					caption: "Weekly",
					value: 2
				}, {
					caption: "Monthly on the " + this.dateSuffix( this.date.getDate() ),//1st, 2nd, 3rd, etc
					value: 3
				}, {
					caption: "Yearly on " + this.date.format( { format: "MMMM" } ) + " " + this.dateSuffix( this.date.getDate() ),//ex: April 13th
					value: 4
				}
			];

		//Update dropdown choices & keep value
		var temp = this.$['recurrenceNode'].getValue();

		this.$['recurrenceNode'].setChoices( this.recurrenceOptions );
		this.$['recurrenceNode'].render();

		this.$['recurrenceNode'].setValue( temp );
	},

	/**
	 * @private
	 * Shows/Hides settings for recurrence
	 */
	recurrenceNodeChanged: function() {

		this.$['recurrenceNode'].addRemoveClass( "enyo-single", this.$['recurrenceNode'].getValue() == 0 );

		this.$['durationWrapper'].setShowing( this.$['recurrenceNode'].getValue() != 0 );

		this.$['weeklyOptions'].setShowing( this.$['recurrenceNode'].getValue() == 2 );

		switch( this.$['recurrenceNode'].getValue() ) {
			case 1:
				this.$['frequencyUnits'].setContent( $L( "day(s)" ) );
				break;
			case 2:
				this.$['frequencyUnits'].setContent( $L( "week(s)" ) );
				break;
			case 3:
				this.$['frequencyUnits'].setContent( $L( "month(s)" ) );
				break;
			case 4:
				this.$['frequencyUnits'].setContent( $L( "year(s)" ) );
				break;
			default:
				this.$['frequencyUnits'].setContent( $L( "span(s)" ) );
		}

		this.sendSummary();
	},

	/**
	 * @private
	 * Shows/Hides settings for ending conditions
	 */
	endingConditionChanged: function() {

		this.$['endingDateWrapper'].setShowing( this.$['endingCondition'].getValue() == 'd' );
		this.$['endingCountWrapper'].setShowing( this.$['endingCondition'].getValue() == 'o' );

		this.sendSummary();
	},

	/**
	 * @private
	 * Returns 1st, 2nd, 3rd, etc based on input
	 *
	 * @param int
	 * @return string
	 */
	dateSuffix: function( dayOfMonth ) {

		return( dayOfMonth + ["th", "st", "nd", "rd"][( dayOfMonth % 10 > 3 ) ? 0 : ( ( dayOfMonth % 100 - dayOfMonth % 10 != 10 ) * dayOfMonth % 10 )] );
	}
});