package com.glitchtechscience.gtcheckbook;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.EditText;
import android.widget.Spinner;

public class acctcat_AddEdit extends Activity {

	private checkbook appState;
	private SQLiteDatabase db;

	private long catId;
	private String name;
	private String icon;

	private ProgressDialog dialog;

	private ArrayList<String> icons;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.acctcat_addedit );

		appState = ( ( checkbook )getApplicationContext() );
		db = appState.getAppDatabase();

		Bundle b = getIntent().getExtras();

		try {

			catId = b.getLong( "catId", -1 );// DB id
			name = b.getString( "name" );
		} catch( Exception ex ) {

			Log.e( "transaction categories add edit - onCreate", ex.toString() );
			catId = -1;
		}

		dialog = new ProgressDialog( acctcat_AddEdit.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		appState = ( ( checkbook )getApplicationContext() );

		startSystem();

		// TODO make popup
	}

	@Override
	public void onResume() {

		super.onResume();
	}

	@Override
	public void onDestroy() {

		super.onDestroy();
	}

	private void startSystem() {

		// Load data
		if( catId < 0 ) {

			name = "";
			icon = "";
		} else {

			Cursor c = db.query( "accountCategories", new String[] { "rowid", "name", "icon", "color", "catOrder" }, "rowid=?", new String[] { catId + "" }, null, null, null, "1" );

			c.moveToFirst();

			while( !c.isAfterLast() ) {

				name = c.getString( c.getColumnIndex( "name" ) );
				icon = c.getString( c.getColumnIndex( "icon" ) );
				// color = c.getString( c.getColumnIndex( "color" ) );//TODO account category color NYI
				// catOrder = c.getString( c.getColumnIndex( "catOrder" ) );//TODO account category order NYI

				c.moveToNext();
			}

			c.close();
		}

		// Build array list for viewing
		icons = new ArrayList<String>();

		HashMap<String, String> temp = appState.getImageMap();
		String key = "";

		for( Map.Entry<String, String> entry : temp.entrySet() ) {

			key = entry.getKey();

			if( !( key.equalsIgnoreCase( "logo.png" ) || key.equalsIgnoreCase( "calendar.png" ) || key.equalsIgnoreCase( "future_transfer_1.png" ) || key.equalsIgnoreCase( "padlock_1.png" ) || key.equalsIgnoreCase( "transfer_3.png" ) ) ) {
				// Not any of these items, add to spinner

				icons.add( key );
			}
		}

		// Bind stuff
		EditText nameField = ( EditText )findViewById( R.id.acctcat_name );
		nameField.setText( name );

		int selection = icons.indexOf( icon );
		Spinner iconField = ( Spinner )findViewById( R.id.acctcat_icon );
		iconField.setAdapter( new ImageSpinnerAdapter( acctcat_AddEdit.this, icons, appState ) );
		iconField.setSelection( selection >= 0 ? selection : 0 );

		findViewById( R.id.acctcat_save ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Saving" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				ContentValues temp = new ContentValues();
				temp.put( "name", ( ( EditText )findViewById( R.id.acctcat_name ) ).getText().toString() );
				temp.put( "icon", ( ( Spinner )findViewById( R.id.acctcat_icon ) ).getSelectedItem().toString() );
				temp.put( "color", "green" );// TODO account category color NYI
				temp.put( "catOrder", "0" );// TODO account category order NYI

				if( catId < 0 ) {

					db.insert( "accountCategories", null, temp );
				} else {

					db.update( "accountCategories", temp, "rowid=?", new String[] { catId + "" } );
				}

				temp.clear();

				dialog.dismiss();

				finish();
			}
		} );

		findViewById( R.id.acctcat_delete ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				AlertDialog.Builder builder = new AlertDialog.Builder( acctcat_AddEdit.this );
				builder.setMessage( "Are you sure you want to delete this item?" );
				builder.setPositiveButton( android.R.string.yes, new DialogInterface.OnClickListener() {

					public void onClick( DialogInterface dialog, int id ) {

						db.delete( "accountCategories", "rowid=?", new String[] { catId + "" } );
						acctcat_AddEdit.this.finish();
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

		findViewById( R.id.acctcat_cancel ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Loading" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				dialog.dismiss();
				finish();
			}
		} );
	}
}