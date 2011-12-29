package com.glitchtechscience.gtcheckbook;

import java.util.Calendar;
import java.util.Date;

import android.app.Dialog;
import android.content.Context;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.TimePicker;
import android.widget.ViewSwitcher;
import android.widget.DatePicker.OnDateChangedListener;
import android.widget.TimePicker.OnTimeChangedListener;

public class DateTimePicker extends Dialog implements OnClickListener, OnDateChangedListener, OnTimeChangedListener {

	private DatePicker datePicker;
	private TimePicker timePicker;
	private ViewSwitcher viewSwitcher;
	private Context host;

	public Calendar mCalendar;
	public Button confirm;

	public DateTimePicker( Context context, Date datetime ) {

		super( context );

		host = context;

		setContentView( R.layout.datetimepicker );

		mCalendar = Calendar.getInstance();
		mCalendar.setTime( datetime );

		updateTitle();

		viewSwitcher = (ViewSwitcher) this.findViewById( R.id.dtDiagViewSwitcher );

		datePicker = (DatePicker) findViewById( R.id.dtDiagDatePicker );
		datePicker.init( mCalendar.get( Calendar.YEAR ), mCalendar.get( Calendar.MONTH ), mCalendar.get( Calendar.DAY_OF_MONTH ), this );

		timePicker = (TimePicker) findViewById( R.id.dtDiagTimePicker );
		timePicker.setOnTimeChangedListener( this );
		updateTime( mCalendar.get( Calendar.HOUR_OF_DAY ), mCalendar.get( Calendar.MINUTE ) );

		confirm = (Button) findViewById( R.id.dtDiagSet );

		// Handle button clicks
		( (Button) findViewById( R.id.dtDiagSwitchToTime ) ).setOnClickListener( this );
		( (Button) findViewById( R.id.dtDiagSwitchToDate ) ).setOnClickListener( this );

		( (Button) findViewById( R.id.dtDiagSet ) ).setOnClickListener( this );
		( (Button) findViewById( R.id.dtDiagReset ) ).setOnClickListener( this );
		( (Button) findViewById( R.id.dtDiagAbort ) ).setOnClickListener( this );
	}

	public void onDateChanged( DatePicker view, int year, int monthOfYear, int dayOfMonth ) {

		mCalendar.set( year, monthOfYear, dayOfMonth, mCalendar.get( Calendar.HOUR_OF_DAY ), mCalendar.get( Calendar.MINUTE ) );
		updateTitle();
	}

	public void onTimeChanged( TimePicker view, int hourOfDay, int minute ) {

		mCalendar.set( mCalendar.get( Calendar.YEAR ), mCalendar.get( Calendar.MONTH ), mCalendar.get( Calendar.DAY_OF_MONTH ), hourOfDay, minute );
		updateTitle();
	}

	public void updateTitle() {

		java.text.DateFormat dateFormat = android.text.format.DateFormat.getDateFormat( host.getApplicationContext() );
		java.text.DateFormat timeFormat = android.text.format.DateFormat.getTimeFormat( host.getApplicationContext() );

		this.setTitle( dateFormat.format( mCalendar.getTime() ) + " " + timeFormat.format( mCalendar.getTime() ) );
	}

	public void onClick( View v ) {

		switch( v.getId() ) {
			case R.id.dtDiagSwitchToDate:
				v.setEnabled( false );
				findViewById( R.id.dtDiagSwitchToTime ).setEnabled( true );
				viewSwitcher.showPrevious();
				break;

			case R.id.dtDiagSwitchToTime:
				v.setEnabled( false );
				findViewById( R.id.dtDiagSwitchToDate ).setEnabled( true );
				viewSwitcher.showNext();
				break;

			case R.id.dtDiagAbort:
				this.cancel();
				break;

			case R.id.dtDiagReset:
				this.reset();
				break;
		}
	}

	public int get( final int field ) {

		return mCalendar.get( field );
	}

	public void reset() {

		Log.e( "!", "1" );
		final Calendar c = Calendar.getInstance();
		updateTime( c.get( Calendar.HOUR_OF_DAY ), c.get( Calendar.MINUTE ) );
		updateDate( c.get( Calendar.YEAR ), c.get( Calendar.MONTH ), c.get( Calendar.DAY_OF_MONTH ) );
	}

	public long getDateTimeMillis() {

		return mCalendar.getTimeInMillis();
	}

	public void setIs24HourView( boolean is24HourView ) {

		timePicker.setIs24HourView( is24HourView );
	}

	public boolean is24HourView() {

		return timePicker.is24HourView();
	}

	public void updateDate( int year, int monthOfYear, int dayOfMonth ) {

		datePicker.updateDate( year, monthOfYear, dayOfMonth );
		mCalendar.set( year, monthOfYear, dayOfMonth, mCalendar.get( Calendar.HOUR_OF_DAY ), mCalendar.get( Calendar.MINUTE ) );
		updateTitle();
	}

	public void updateTime( int currentHour, int currentMinute ) {

		timePicker.setCurrentHour( currentHour );
		timePicker.setCurrentMinute( currentMinute );
	}
}