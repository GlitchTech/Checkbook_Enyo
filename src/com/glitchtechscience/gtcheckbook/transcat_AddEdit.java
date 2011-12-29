package com.glitchtechscience.gtcheckbook;

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
import android.widget.AutoCompleteTextView;
import android.widget.EditText;

public class transcat_AddEdit extends Activity {

	// TODO convert AE Trans Cat to alert?

	private checkbook appState;
	private SQLiteDatabase db;

	private long catId;
	private String genCat;
	private String specCat;

	private ProgressDialog dialog;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.transcat_addedit );

		appState = ( ( checkbook )getApplicationContext() );
		db = appState.getAppDatabase();

		Bundle b = getIntent().getExtras();

		try {

			catId = b.getLong( "catId", -1 );// DB id
			genCat = b.getString( "genCat" );
			specCat = b.getString( "specCat" );
		} catch( Exception ex ) {

			Log.e( "transaction categories add edit - onCreate", ex.toString() );
			catId = -1;
		}

		if( catId < 0 ) {

			genCat = "";
			specCat = "";
		}

		dialog = new ProgressDialog( transcat_AddEdit.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );
	}

	@Override
	public void onResume() {

		super.onResume();

		bindEverything();

		( ( AutoCompleteTextView )findViewById( R.id.transcat_gencat ) ).setText( genCat );
		( ( EditText )findViewById( R.id.transcat_speccat ) ).setText( specCat );

		dialog.hide();
	}

	@Override
	public void onDestroy() {

		super.onDestroy();
	}

	private void bindEverything() {

		AutoCompleteTextView searchBar = ( AutoCompleteTextView )findViewById( R.id.transcat_gencat );

		Cursor c = this.db.rawQuery( "SELECT rowid AS _id, genCat FROM expenseCategories GROUP BY genCat ORDER BY genCat LIMIT 10", null );

		AutoCompleteCursorAdapter adapter = new AutoCompleteCursorAdapter( this, c, this.db, "SELECT rowid AS _id, genCat FROM expenseCategories WHERE genCat LIKE ? GROUP BY genCat ORDER BY genCat ASC LIMIT 50", "genCat" );
		searchBar.setAdapter( adapter );

		startManagingCursor( adapter.getCursor() );

		findViewById( R.id.transcat_save ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Saving" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				appState.acctItemsChanged = true;

				ContentValues temp = new ContentValues();
				temp.put( "genCat", ( ( AutoCompleteTextView )findViewById( R.id.transcat_gencat ) ).getText().toString() );
				temp.put( "specCat", ( ( EditText )findViewById( R.id.transcat_speccat ) ).getText().toString() );

				if( catId < 0 ) {

					db.insert( "expenseCategories", null, temp );
				} else {

					db.update( "expenseCategories", temp, "rowid=?", new String[] { catId + "" } );
				}

				temp.clear();

				finish();
			}
		} );

		findViewById( R.id.transcat_delete ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				AlertDialog.Builder builder = new AlertDialog.Builder( transcat_AddEdit.this );
				builder.setMessage( "Are you sure you want to delete this item?" );
				builder.setPositiveButton( android.R.string.yes, new DialogInterface.OnClickListener() {

					public void onClick( DialogInterface dialog, int id ) {

						appState.acctItemsChanged = true;
						db.delete( "expenseCategories", "rowid=? AND genCat=? AND specCat=?", new String[] { catId + "", genCat, specCat } );
						transcat_AddEdit.this.finish();
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

		findViewById( R.id.transcat_cancel ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Loading" );
				dialog.setMessage( "Please wait..." );
				dialog.show();
				finish();
			}
		} );
	}
}