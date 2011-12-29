package com.glitchtechscience.gtcheckbook;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

public class transcat extends Activity {

	private checkbook appState;

	private SeparatedListAdapter catListAdapter;

	private ProgressDialog dialog;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.transcat );

		appState = ( ( checkbook )getApplicationContext() );

		dialog = new ProgressDialog( transcat.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		setUpListView();
		setUpBttnBindings();

		// TODO tap to edit one (two edit text fields in a popup
		// TODO tap to create new (autosuggest on primary category)
	}

	@Override
	public void onResume() {

		super.onResume();

		// catListAdapter.notifyDataSetChanged();
		setUpListView();

		try {

			dialog.hide();
		} catch( Exception ex ) {

		}
	}

	@Override
	public void onDestroy() {

		dialog.dismiss();

		super.onDestroy();
	}

	public void setUpListView() {

		String[] dataCols = new String[] {
			"specCat"
		};
		int[] dispFields = new int[] {
			R.id.transcat_item_text
		};

		catListAdapter = new SeparatedListAdapter( this );

		Cursor genCat = appState.getAppDatabase().rawQuery( "SELECT DISTINCT genCat FROM expenseCategories ORDER BY genCat", null );

		genCat.moveToFirst();
		while( genCat.isAfterLast() == false ) {

			final String genCatName = appState.stringFormatter( genCat.getString( genCat.getColumnIndex( "genCat" ) ) );

			Cursor specCat = appState.getAppDatabase().rawQuery( "SELECT rowid AS _id, genCat, specCat FROM expenseCategories WHERE genCat = ? ORDER BY genCat, specCat", new String[] {
				genCatName
			} );
			startManagingCursor( specCat );

			catListAdapter x = new catListAdapter( this, R.layout.transcat_item, specCat, dataCols, dispFields );

			catListAdapter.addSection( genCatName, x );

			genCat.moveToNext();
		}
		genCat.close();

		ListView l1 = ( ListView )findViewById( android.R.id.list );
		l1.setAdapter( catListAdapter );
	}

	/** Bottom control bindings **/
	public void setUpBttnBindings() {

		findViewById( R.id.addTransCatBttn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Processing" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				// TODO Create new transaction category
				Intent i = new Intent( transcat.this, transcat_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "catId", -1 );
				b.putString( "genCat", "" );
				b.putString( "specCat", "" );

				i.putExtras( b );
				startActivity( i );
			}
		} );
	}

	/** List Adapter **/
	private class catListAdapter extends SimpleCursorAdapter {

		private int layout;

		public catListAdapter( Context context, int layout, Cursor c, String[] from, int[] to ) {

			super( context, layout, c, from, to );

			this.layout = layout;
		}

		@Override
		public View newView( Context context, Cursor c, ViewGroup parent ) {

			return LayoutInflater.from( context ).inflate( layout, parent, false );
		}

		@Override
		public void bindView( View v, Context context, Cursor c ) {

			final long id = appState.getDBIndex( c, "_id" );
			final String genCatText = appState.stringFormatter( c.getString( c.getColumnIndex( "genCat" ) ) );
			final String specCatText = appState.stringFormatter( c.getString( c.getColumnIndex( "specCat" ) ) );

			v.setOnClickListener( new OnClickListener() {

				public void onClick( View v ) {

					dialog.setTitle( "Loading Data" );
					dialog.setMessage( "Please wait..." );
					dialog.show();

					// TODO Edit transaction category
					Intent i = new Intent( transcat.this, transcat_AddEdit.class );
					Bundle b = new Bundle();

					b.putLong( "catId", id );
					b.putString( "genCat", genCatText );
					b.putString( "specCat", specCatText );

					i.putExtras( b );
					startActivity( i );
				}
			} );

			TextView specCat = ( TextView )v.findViewById( R.id.transcat_item_text );
			specCat.setText( specCatText );
		}
	}
};