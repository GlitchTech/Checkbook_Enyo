package com.glitchtechscience.gtcheckbook;

import java.util.HashMap;
import java.util.List;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.SimpleAdapter;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.AdapterView.OnItemSelectedListener;

public class accounts_AddEdit extends Activity {

	// TODO Several systems hidden via XML

	private checkbook appState;
	private SQLiteDatabase db;
	private account_obj acct;

	private ProgressDialog dialog;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.account_addedit );

		appState = ( ( checkbook )getApplicationContext() );
		db = appState.getAppDatabase();

		dialog = new ProgressDialog( accounts_AddEdit.this );

		long acctId = -1;
		int acctIndex = -1;

		Bundle b = getIntent().getExtras();

		try {

			acctId = b.getLong( "acctId", -1 );// DB id
			acctIndex = b.getInt( "acctIndex", -1 );// Array index
		} catch( Exception ex ) {

			Toast.makeText( getBaseContext(), "Error: " + ex.toString(), Toast.LENGTH_LONG ).show();
		}

		// Hide these for now
		findViewById( R.id.hideClearedLabel ).setVisibility( View.GONE );
		findViewById( R.id.hideCleared ).setVisibility( View.GONE );

		setUpButtons();
		setUpSpinners();
		setUpLocked();

		if( acctId < 0 || acctIndex < 0 ) {

			acct = new account_obj();

			findViewById( R.id.acctDelete ).setVisibility( View.INVISIBLE );
		} else {

			acct = new account_obj( acctIndex, acctId, db );
		}

		setAcctChoices();
	}

	private void setUpButtons() {

		findViewById( R.id.acctDone ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				saveAccount();
			}
		} );

		findViewById( R.id.acctDelete ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				AlertDialog.Builder builder = new AlertDialog.Builder( accounts_AddEdit.this );
				builder.setMessage( "Are you sure you want to delete this account?" );
				builder.setPositiveButton( android.R.string.yes, new DialogInterface.OnClickListener() {

					public void onClick( DialogInterface dialog, int id ) {

						deleteAccount();
					}
				} );
				builder.setNegativeButton( android.R.string.no, new DialogInterface.OnClickListener() {

					public void onClick( DialogInterface dialog, int id ) {

						dialog.cancel();
					}
				} );

				AlertDialog alert = builder.create();
				alert.show();
			}
		} );

		findViewById( R.id.acctCancel ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				// exit, don't save changes
				finish();
			}
		} );
	}

	@SuppressWarnings( "unchecked" )
	private void setUpSpinners() {

		Spinner s;
		ArrayAdapter adapter;

		s = ( Spinner )findViewById( R.id.category );
		s.setAdapter( new SimpleAdapter( this, appState.getAcctCategories(), R.layout.genlisticon_item, new String[] { "name", "icon" }, new int[] { R.id.genlisticon_text, R.id.genlisticon_icon } ) );
		s.setSelection( 0 );
		s.setOnItemSelectedListener( new OnItemSelectedListener() {

			public void onItemSelected( AdapterView<?> parentView, View selectedItemView, int position, long id ) {

				findViewById( R.id.addEditAccountLayout ).requestFocus();
			}

			public void onNothingSelected( AdapterView<?> parentView ) {

			}
		} );

		final String[] arr_sort = appState.getAcctTrsnSorts();
		s = ( Spinner )findViewById( R.id.sorting );
		adapter = new ArrayAdapter( this, android.R.layout.simple_spinner_item, arr_sort );
		s.setAdapter( adapter );
		s.setSelection( 0 );
		s.setOnItemSelectedListener( new OnItemSelectedListener() {

			public void onItemSelected( AdapterView<?> parentView, View selectedItemView, int position, long id ) {

				( ( TextView )findViewById( R.id.sortingPreview ) ).setText( appState.getAcctTrsnSortsDesc( position ) );
				findViewById( R.id.addEditAccountLayout ).requestFocus();
			}

			public void onNothingSelected( AdapterView<?> parentView ) {

			}
		} );

		final String[] arr_disp = appState.getAcctDisplayModes();
		s = ( Spinner )findViewById( R.id.hidden );
		adapter = new ArrayAdapter( this, android.R.layout.simple_spinner_item, arr_disp );
		s.setAdapter( adapter );
		s.setSelection( 0 );
		s.setOnItemSelectedListener( new OnItemSelectedListener() {

			public void onItemSelected( AdapterView<?> parentView, View selectedItemView, int position, long id ) {

				( ( TextView )findViewById( R.id.hiddenPreview ) ).setText( appState.getAcctDisplayModeDesc( position ) );
				findViewById( R.id.addEditAccountLayout ).requestFocus();
			}

			public void onNothingSelected( AdapterView<?> parentView ) {

			}
		} );

		final String[] arr_balview = appState.getAcctBalanceViews();
		s = ( Spinner )findViewById( R.id.balView );
		adapter = new ArrayAdapter( this, android.R.layout.simple_spinner_item, arr_balview );
		s.setAdapter( adapter );
		s.setSelection( 0 );
		s.setOnItemSelectedListener( new OnItemSelectedListener() {

			public void onItemSelected( AdapterView<?> parentView, View selectedItemView, int position, long id ) {

				( ( TextView )findViewById( R.id.balViewPreview ) ).setText( appState.getAcctBalanceViewDesc( position ) );
				findViewById( R.id.addEditAccountLayout ).requestFocus();
			}

			public void onNothingSelected( AdapterView<?> parentView ) {

			}
		} );
	}

	private void setUpLocked() {

		// TODO unlock system
		CheckBox lockBox = ( CheckBox )findViewById( R.id.locked );
		lockBox.setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				toggleLockBox();
			}
		} );

		TextView lockKey = ( TextView )findViewById( R.id.lockedCode );
		lockKey.setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				// Create inputs for pin & confirm
				pin_set pin_panel = new pin_set( accounts_AddEdit.this, new OnReadyListener() );
				pin_panel.show();
			}
		} );
	}

	private class OnReadyListener implements pin_set.ReadyListener {

		public void ready( String key, String disp ) {

			acct.lockedCode = appState.encrypt( key );
			( ( TextView )findViewById( R.id.lockedCode ) ).setText( disp );
		}
	}

	private void toggleLockBox() {

		CheckBox lockBox = ( CheckBox )findViewById( R.id.locked );
		TextView lockKey = ( TextView )findViewById( R.id.lockedCode );

		if( lockBox.isChecked() != true ) {
			// hide

			acct.lockedCode = "";
			lockKey.setVisibility( View.GONE );
		} else {
			// show

			lockKey.setVisibility( View.VISIBLE );
		}

		lockKey.setText( acct.lockedCode );
	}

	private void setAcctChoices() {

		if( acct.index >= 0 && acct.rowId >= 0 ) {
			// Only run through this if the account is being edited, otherwise use defaults

			( ( EditText )findViewById( R.id.accountName ) ).setText( acct.name );
			( ( EditText )findViewById( R.id.accountNotes ) ).setText( acct.description );

			List<HashMap<String, String>> arr_cat = appState.getAcctCategories();
			int setVal = 0;
			for( int i = 0; i < arr_cat.size(); i++ ) {

				if( arr_cat.get( i ).get( "name" ).equalsIgnoreCase( acct.acctCat ) ) {

					setVal = i;
					break;
				}
			}
			( ( Spinner )findViewById( R.id.category ) ).setSelection( setVal );

			// Security Options
			( ( CheckBox )findViewById( R.id.frozen ) ).setChecked( acct.frozen );
			( ( CheckBox )findViewById( R.id.locked ) ).setChecked( acct.locked );

			String falseKey = "";
			for( int i = 0; i < appState.decrypt( acct.lockedCode ).length(); i++ ) {

				falseKey += "*";
			}
			( ( TextView )findViewById( R.id.lockedCode ) ).setText( falseKey );

			// Display Options
			( ( Spinner )findViewById( R.id.sorting ) ).setSelection( appState.getAcctTrsnSortIndexViaId( acct.sort ) );

			( ( Spinner )findViewById( R.id.hidden ) ).setSelection( acct.hidden );
			( ( Spinner )findViewById( R.id.balView ) ).setSelection( acct.balView );
			( ( CheckBox )findViewById( R.id.defaultAccount ) ).setChecked( acct.defaultAccount );
			( ( CheckBox )findViewById( R.id.showTransTime ) ).setChecked( acct.showTransTime );
			( ( CheckBox )findViewById( R.id.runningBalance ) ).setChecked( acct.runningBalance );
			( ( CheckBox )findViewById( R.id.hideNotes ) ).setChecked( acct.hideNotes );
			( ( CheckBox )findViewById( R.id.hideCleared ) ).setChecked( acct.hideCleared );

			// Trsn Options
			( ( CheckBox )findViewById( R.id.transDescMultiline ) ).setChecked( acct.transDescMultiLine );
			( ( CheckBox )findViewById( R.id.useAutoComplete ) ).setChecked( acct.useAutoComplete );
			( ( CheckBox )findViewById( R.id.atmEntry ) ).setChecked( acct.atmEntry );
			( ( CheckBox )findViewById( R.id.checkField ) ).setChecked( acct.checkField );
			( ( CheckBox )findViewById( R.id.enableCategories ) ).setChecked( acct.enableCategories );
		}

		toggleLockBox();
	}

	// Create runnable for posting
	final Handler mHandler = new Handler();
	final Runnable mUpdateResults = new Runnable() {

		public void run() {

			dialog.dismiss();
			finish();
		}
	};

	private void saveAccount() {

		dialog.setTitle( "Saving Account" );
		dialog.setMessage( "Please wait..." );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );
		dialog.show();

		// update object with data
		acct.name = ( ( EditText )findViewById( R.id.accountName ) ).getText().toString();
		acct.name = ( acct.name.length() <= 0 ? "Account Name" : acct.name );
		acct.description = ( ( EditText )findViewById( R.id.accountNotes ) ).getText().toString();

		acct.acctCat = appState.getAcctCategoryName( ( ( Spinner )findViewById( R.id.category ) ).getSelectedItemPosition() );

		// Security Options
		acct.frozen = ( ( CheckBox )findViewById( R.id.frozen ) ).isChecked();
		acct.locked = ( ( CheckBox )findViewById( R.id.locked ) ).isChecked();
		// acct.lockedCode -- set in the popup

		// Display Options
		try {

			acct.sort = Integer.parseInt( appState.acctTrsnSorts[( ( Spinner )findViewById( R.id.sorting ) ).getSelectedItemPosition()].data );
		} catch( Exception ex ) {

			acct.sort = 0;
		}

		acct.hidden = ( ( Spinner )findViewById( R.id.hidden ) ).getSelectedItemPosition();
		acct.balView = ( ( Spinner )findViewById( R.id.balView ) ).getSelectedItemPosition();
		acct.defaultAccount = ( ( CheckBox )findViewById( R.id.defaultAccount ) ).isChecked();
		acct.showTransTime = ( ( CheckBox )findViewById( R.id.showTransTime ) ).isChecked();
		acct.runningBalance = ( ( CheckBox )findViewById( R.id.runningBalance ) ).isChecked();
		acct.hideNotes = ( ( CheckBox )findViewById( R.id.hideNotes ) ).isChecked();
		acct.hideCleared = ( ( CheckBox )findViewById( R.id.hideCleared ) ).isChecked();

		// Trsn Options
		acct.transDescMultiLine = ( ( CheckBox )findViewById( R.id.transDescMultiline ) ).isChecked();
		acct.useAutoComplete = ( ( CheckBox )findViewById( R.id.useAutoComplete ) ).isChecked();
		acct.atmEntry = ( ( CheckBox )findViewById( R.id.atmEntry ) ).isChecked();
		acct.checkField = ( ( CheckBox )findViewById( R.id.checkField ) ).isChecked();
		acct.enableCategories = ( ( CheckBox )findViewById( R.id.enableCategories ) ).isChecked();

		acct.lastSync = "";

		Thread t = new Thread() {

			public void run() {

				if( acct.index < 0 || acct.rowId < 0 ) {
					// Account does not exist

					acct.createAcctDb( db );
				} else {
					// Account exists

					acct.updateAcctDb( db );
				}

				appState.acctItemsChanged = true;

				// Thread done running handler
				mHandler.post( mUpdateResults );
			}
		};
		t.start();
	}

	private void deleteAccount() {

		dialog.setTitle( "Deleting Account" );
		dialog.setMessage( "Please wait..." );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );
		dialog.show();

		Thread t = new Thread() {

			public void run() {

				if( acct.index < 0 || acct.rowId < 0 ) {

					// Account does not exist, do nothing
				} else {
					// Account exists

					acct.deleteAcctDb( db );
					appState.acctItemsChanged = true;
				}

				// Thread done running handler
				mHandler.post( mUpdateResults );
			}
		};
		t.start();
	}
}