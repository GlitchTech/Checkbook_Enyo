/* Copyright © 2011-2012, GlitchTech Science */

enyo.kind( {
	name: "Checkbook.transactions.recurrence.select",

	recurrenceOptions: [],

	systemActive: false,

	published: {
		date: ""
	},

	events: {
		onRecurrenceChange: ""
	},

	components: [
		{
			name: "recurrenceNode",
			kind: "gts.SelectorBar",
			label: "Recurrence",

			onChange: "recurrenceNodeChanged",

			classes: "force-left-padding",

			value: 0
		}, {
			name: "weeklyOptions",

			classes: "h-box bo",
			showing: false,

			components: []
		}, {
			name: "durationWrapper",
			showing: false,

			components: [
				{
					kind: "onyx.Item",
					classes: "text-center bordered h-box box-pack-center box-align-center",
					components: [
						{
							content: "Every"
						}, {
							kind: "onyx.PickerDecorator",
							components: [
								{
									classes: "margin-half-left margin-half-right"
								}, {
									name: "itemSpan",
									kind: "gts.IntegerPicker",

									min: 1,
									max: 64,

									style: "margin-right: 3px;",

									onChange: "sendSummary"
								}
							]
						}, {
							name: "itemSpanUnits"
						}, {
							content: "Frequency",

							classes: "label box-flex-1 text-right"
						}
					]
				}, {
					name: "endingCondition",
					kind: "gts.SelectorBar",
					label: "Ending Condition",

					classes: "bordered",

					onChange: "endingConditionChanged",

					choices: [
						{
							content: 'Forever',
							value: 'f',
							active: true
						}, {
							content: 'Until Date',
							value: 'd'
						}, {
							content: 'Occurrences',
							value: 'o'
						}
					],

					value: 'f'
				}, {
					name: "endingDateWrapper",
					kind: "onyx.Item",

					classes: "bordered",
					showing: false,

					components: []
				}, {
					name: "endingCountWrapper",
					kind: "onyx.Item",

					classes: "text-center bordered h-box box-pack-center box-align-center",
					showing: false,

					components: [
						{
							kind: "onyx.PickerDecorator",
							components: [
								{
									classes: "margin-half-left margin-half-right"
								}, {
									name: "endingCount",
									kind: "gts.IntegerPicker",

									min: 1,
									max: 100,

									onChange: "sendSummary"
								}
							]
						}, {
							content: "Occurrences",

							classes: "label box-flex-1 text-right"
						}
					]
				}
			]
		}
	],

	/**
	 * @protected
	 * called when UI is built
	 */
	create: function() {

		this.inherited( arguments );

		if( this.date == "" ) {

			this.date = new Date();
		}

		this.buildRecurrenceOptions();
		this.buildDateSystem();
		this.buildDayOfWeekSystem();

		this.recurrenceNodeChanged();

		this.systemActive = true;
	},

	/**
	 * @public
	 * Returns recurrence OBJ
	 */
	getValue: function() {

		var robj = {};

		if( this.$['recurrenceNode'].getValue() == 0 ) {

			robj['frequency'] = "none";
		} else {
			//Recurrence

			robj['origDate'] = Date.parse( this.date );
			robj['itemSpan'] = this.$['itemSpan'].getValue();

			switch( this.$['recurrenceNode'].getValue() ) {
				case 1://Daily
					robj['frequency'] = "daily";
					break;
				case 2://Weekly
					robj['frequency'] = "weekly";

					robj['daysOfWeek'] = [];

					for( i = 0; i < 7; i++ ) {

						if( this.$['weekly' + i].getChecked() ) {

							robj['daysOfWeek'].push( i );
						}
					}
					break;
				case 3://Monthly
					robj['frequency'] = "monthly";
					break;
				case 4://Yearly
				default:
					robj['frequency'] = "yearly";
			}

			//ending conditions
			switch( this.$['endingCondition'].getValue() ) {
				case 'd':
					robj['endingCondition'] = "date";
					robj['endDate'] = Date.parse( this.$['endingDate'].getValue() );
					break;
				case 'o':
					robj['endingCondition'] = "occurences";
					robj['endCount'] = this.$['endingCount'].getValue();
					break;
				case 'f':
				default:
					robj['endingCondition'] = "none";
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

			this.date = robj['origDate'];
			this.$['itemSpan'].setValue( robj['itemSpan'] );

			for( i = 0; i < 7; i++ ) {

				this.$['weekly' + i].setChecked( false );
			}

			switch( robj['frequency'] ) {
				case "daily":
					this.$['recurrenceNode'].setValue( 1 );
					break;
				case "weekly":
					this.$['recurrenceNode'].setValue( 2 );

					robj['daysOfWeek'] = enyo.json.parse( robj['daysOfWeek'] );

					for( i = 0; i < robj['daysOfWeek'].length; i++ ) {

						this.$['weekly' + robj['daysOfWeek'][i]].setChecked( true );
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
			switch( robj['endingCondition'] ) {
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
	 * @protected
	 * Builds a text string based on values set and sends to value to the onChange function
	 */
	sendSummary: function() {

		var summary = "";

		if( this.$['recurrenceNode'].getValue() == 0 ) {

			summary = "No Recurrence";
		} else {
			//Recurrence

			summary = "Repeats every " + this.$['itemSpan'].getValue() + " ";

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

		if( this.systemActive ) {

			this.doRecurrenceChange( { "summary": summary, "value": this.getValue() } );
		}
	},

	/** ----- Generators ----- **/

	buildRecurrenceOptions: function() {

		this.recurrenceOptions = [
				{
					content: "No Recurrence",
					value: 0
				}, {
					content: "Daily",
					value: 1
				}, {
					content: "Weekly",
					value: 2
				}, {
					content: "Monthly on the " + this.dateSuffix( this.date.getDate() ),//1st, 2nd, 3rd, etc
					value: 3
				}, {
					content: "Yearly on " + this.date.format( { format: "MMMM" } ) + " " + this.dateSuffix( this.date.getDate() ),//ex: April 13th
					value: 4
				}
			];

		//Update dropdown choices & keep value
		var temp = this.$['recurrenceNode'].getValue();

		this.$['recurrenceNode'].setChoices( this.recurrenceOptions );
		this.$['recurrenceNode'].render();

		this.$['recurrenceNode'].setValue( temp );
	},

	buildDateSystem: function() {

		if( !enyo.Panels.isScreenNarrow() || Checkbook.globals.prefs['alwaysFullCalendar'] ) {
			//Big Screen

			this.$['endingDateWrapper'].createComponent(
					{
						name: "endingDate",
						kind: "gts.DatePicker",
						onSelect: "sendSummary",

						components: [
							{
								name: "endingTime",
								kind: "gts.TimePicker",

								label: "Time",

								minuteInterval: 5,
								is24HrMode: false,

								onSelect: "sendSummary"
							}
						]
					}, {
						owner: this
					}
				);
		} else {
			//Small Screen

			this.$['endingDateWrapper'].createComponents(
					[
						{
							classes: "onyx-toolbar-inline",
							components: [
								{
									name: "label",
									classes: "label",
									content: "Date"
								}, {
									name: "endingDate",
									kind: "onyx.DatePicker",
									onSelect: "sendSummary"
								}
							]
						}, {
							name: "endingTime",
							kind: "gts.TimePicker",

							label: "Time",

							minuteInterval: 5,
							is24HrMode: false,

							onSelect: "sendSummary"
						}
					], {
						owner: this
					}
				);
		}
	},

	buildDayOfWeekSystem: function() {

		//Build Weekly Repeat Options
		var dowDate = new Date( 2011, 4, 1 );//Sunday, May 1, 2011
		var dowComponents = [];

		for( i = 0; i < 7; i++ ) {

			dowComponents.push( {
					classes: "text-center box-flex-1",
					components: [
						{
							content: dowDate.format( { format: "EEE" } ),
							classes: "label"
						}, {
							name: "weekly" + i,
							kind: "onyx.Checkbox",

							onchange: "sendSummary",

							checked: ( this.date.getDay() == i ),
							dayName: dowDate.format( { format: "EEEE" } )
						}
					]
				});

			dowDate.setDate( dowDate.getDate() + 1 );
		}

		this.$['weeklyOptions'].createComponents( dowComponents, { owner: this } );
		this.$['weeklyOptions'].render();
	},

	/** ----- Events ----- **/

	/**
	 * @protected
	 * Shows/Hides settings for recurrence
	 */
	recurrenceNodeChanged: function() {

		this.$['recurrenceNode'].addRemoveClass( "enyo-single", this.$['recurrenceNode'].getValue() == 0 );

		this.$['durationWrapper'].setShowing( this.$['recurrenceNode'].getValue() != 0 );

		this.$['weeklyOptions'].setShowing( this.$['recurrenceNode'].getValue() == 2 );

		switch( this.$['recurrenceNode'].getValue() ) {
			case 1:
				this.$['itemSpanUnits'].setContent( "day(s)" );
				break;
			case 2:
				this.$['itemSpanUnits'].setContent( "week(s)" );
				break;
			case 3:
				this.$['itemSpanUnits'].setContent( "month(s)" );
				break;
			case 4:
				this.$['itemSpanUnits'].setContent( "year(s)" );
				break;
			default:
				this.$['itemSpanUnits'].setContent( "span(s)" );
		}

		this.sendSummary();

		return true;
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

		this.buildRecurrenceOptions();
		this.sendSummary();
	},

	/**
	 * @protected
	 * Shows/Hides settings for ending conditions
	 */
	endingConditionChanged: function() {

		this.$['endingDateWrapper'].setShowing( this.$['endingCondition'].getValue() == 'd' );
		this.$['endingCountWrapper'].setShowing( this.$['endingCondition'].getValue() == 'o' );

		if( this.$['endingDateWrapper'].getShowing() ) {

			this.$['endingDate'].render();
			this.$['endingTime'].render();
		}

		this.sendSummary();

		return true;
	},

	/**************************/

	/**
	 * @protected
	 * Returns 1st, 2nd, 3rd, etc based on input
	 *
	 * @param int
	 * @return string
	 */
	dateSuffix: function( dayOfMonth ) {

		return( dayOfMonth + ["th", "st", "nd", "rd"][( dayOfMonth % 10 > 3 ) ? 0 : ( ( dayOfMonth % 100 - dayOfMonth % 10 != 10 ) * dayOfMonth % 10 )] );
	}
});
