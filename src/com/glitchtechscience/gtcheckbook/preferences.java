package com.glitchtechscience.gtcheckbook;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

public class preferences extends Activity {

	private checkbook appState;

	private ProgressDialog dialog;

	@Override
	public void onCreate( Bundle icicle ) {

		// TODO not scrolling on emulator, test on device

		super.onCreate( icicle );
		setContentView( R.layout.preferences );

		dialog = new ProgressDialog( preferences.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		appState = ( ( checkbook )getApplicationContext() );

		buildAccountList();
		bindButtons();

		// TODO PIN Code
		// TODO Default account, built but not enabled elsewhere
	}

	@Override
	public void onResume() {

		super.onResume();

		if( appState.acctItemsChanged ) {

			Log.d( "Note", "Preferences: Accounts changed" );
			buildAccountList();
		}

		try {

			dialog.hide();
		} catch( Exception ex ) {

		}
	}

	@Override
	public void onDestroy() {

		super.onDestroy();
	}

	private void bindButtons() {

		( ( Button )findViewById( R.id.prefDefaultAcct ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				Cursor acctList = appState.getBasicAccountList();

				genListIcon changeAccount = new genListIcon( preferences.this, "Set Default Account", acctList, "acctName", "acctCategoryIcon", "acctId", new defaultAcctChangeListener() );
				changeAccount.show();
			}
		} );

		updateDefaultAccount();

		findViewById( R.id.prefAEAcctCat ).setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				dialog.setTitle( "Processing" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				Intent i = new Intent( preferences.this, acctcat.class );
				startActivity( i );
			}
		} );

		findViewById( R.id.prefAETransCat ).setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				dialog.setTitle( "Processing" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				Intent i = new Intent( preferences.this, transcat.class );
				startActivity( i );
			}
		} );

		findViewById( R.id.prefAddAcct ).setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				dialog.setTitle( "Processing" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				// Create new account
				Intent i = new Intent( preferences.this, accounts_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "acctId", -5 );
				b.putInt( "acctIndex", -5 );

				i.putExtras( b );
				startActivity( i );
			}
		} );
	}

	private void buildAccountList() {

		ListView lv = ( ListView )findViewById( R.id.prefAcctList );

		int[] dispFields = new int[] { R.id.genlisticon_id, R.id.genlisticon_icon, R.id.genlisticon_text };

		String[] qryCols = new String[] { "acctId", "acctName", "acctCategoryIcon" };

		Cursor c = appState.getBasicAccountList( 1, true );

		pref_listview gladapter = new pref_listview( this, R.layout.genlisticon_item, c, qryCols, dispFields );
		lv.setAdapter( gladapter );
	}

	private class defaultAcctChangeListener implements genListIcon.ReadyListener {

		public void ready( String key ) {

			long id;

			try {

				id = Long.parseLong( key );
			} catch( NumberFormatException ex ) {

				id = -1;
			}

			appState.setDefaultAcc( id );
			updateDefaultAccount();
		}
	}

	private void updateDefaultAccount() {

		account_obj defaultAcct = appState.getDefaultAcc();

		Button defaultBttn = ( Button )findViewById( R.id.prefDefaultAcct );

		try {

			defaultBttn.setText( "[" + defaultAcct.acctCat + "] " + defaultAcct.name );
		} catch( NullPointerException ex ) {

			defaultBttn.setText( "No default set" );
		}
	}

	public class pref_listview extends SimpleCursorAdapter {

		private int layout;

		private String[] fromCols;

		public pref_listview( Context context, int layout, Cursor c, String[] from, int[] to ) {

			super( context, layout, c, from, to );

			this.layout = layout;
			this.fromCols = from;
		}

		@Override
		public View newView( Context context, Cursor c, ViewGroup parent ) {

			return LayoutInflater.from( context ).inflate( layout, parent, false );
		}

		@Override
		public void bindView( View v, Context context, Cursor c ) {

			TextView id = ( TextView )v.findViewById( R.id.genlisticon_id );
			TextView desc = ( TextView )v.findViewById( R.id.genlisticon_text );
			ImageView icon = ( ImageView )v.findViewById( R.id.genlisticon_icon );

			if( id != null ) {

				id.setText( appState.stringFormatter( c.getString( c.getColumnIndex( this.fromCols[0] ) ) ) );
			}

			if( desc != null ) {

				desc.setText( appState.stringFormatter( c.getString( c.getColumnIndex( this.fromCols[1] ) ) ) );
			}

			if( icon != null ) {

				icon.setImageResource( appState.getResourceFromString( c.getString( c.getColumnIndex( this.fromCols[2] ) ) ) );
			}

			v.setOnClickListener( new android.widget.AdapterView.OnClickListener() {

				public void onClick( View v2 ) {

					TextView tv = ( TextView )v2.findViewById( R.id.genlisticon_id );

					long id = 0;

					try {

						id = Long.parseLong( tv.getText().toString() );
					} catch( NumberFormatException ex ) {}

					dialog.setTitle( "Loading Data" );
					dialog.setMessage( "Please wait..." );
					dialog.show();

					Intent i = new Intent( preferences.this, accounts_AddEdit.class );
					Bundle b = new Bundle();

					b.putLong( "acctId", id );
					b.putInt( "acctIndex", 1 );

					i.putExtras( b );
					startActivity( i );
				}
			} );
		}
	}
}