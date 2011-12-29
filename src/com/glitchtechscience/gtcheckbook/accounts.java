package com.glitchtechscience.gtcheckbook;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

public class accounts extends Activity {

	private checkbook appState;

	private acctListAdapter acctListAdapterObj;

	private boolean editMode = false;

	private ProgressDialog dialog;
	private double[] totalBalance;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.accounts );

		appState = ( ( checkbook )getApplicationContext() );

		dialog = new ProgressDialog( accounts.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		setUpListView();
		setUpBttnBindings();
	}

	@Override
	public void onResume() {

		super.onResume();

		if( appState.acctItemsChanged ) {

			Log.d( "Note", "Accounts changed" );

			appState.acctItemsChanged = false;
			acctListAdapterObj.notifyDataSetChanged();

			totalBalance = appState.getTotalBalance();
			appState.setAccountBalanceColor( ( TextView )findViewById( R.id.acctViewBal ), totalBalance[4] );// TODO load value from preferences
		}

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

		ListView l1 = ( ListView )findViewById( android.R.id.list );

		ColorDrawable divcolor = new ColorDrawable( Color.DKGRAY );
		l1.setDivider( divcolor );
		l1.setDividerHeight( 2 );

		Cursor c = appState.getBasicAccountList( 1, false );
		startManagingCursor( c );

		String[] dataCols = new String[] { "acctName" };
		int[] dispFields = new int[] { R.id.acctName };

		acctListAdapterObj = new acctListAdapter( this, R.layout.account_item, c, dataCols, dispFields );
		l1.setAdapter( acctListAdapterObj );

		totalBalance = appState.getTotalBalance();
		appState.setAccountBalanceColor( ( TextView )findViewById( R.id.acctViewBal ), totalBalance[4] );// TODO load value from preferences
	}

	/** Bottom control bindings **/
	public void setUpBttnBindings() {

		// TODO acctSortBtn
		findViewById( R.id.acctSortBtn ).setVisibility( View.INVISIBLE );
		findViewById( R.id.acctSortBtn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

			// TODO submenu with sorting options
			}
		} );
		findViewById( R.id.addAcctBtn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Processing" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				// Create new account
				Intent i = new Intent( accounts.this, accounts_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "acctId", -5 );
				b.putInt( "acctIndex", -5 );

				i.putExtras( b );
				startActivity( i );
			}
		} );
		findViewById( R.id.acctLockBtn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				ImageButton lock = ( ( ImageButton )findViewById( R.id.acctLockBtn ) );

				if( editMode ) {

					editMode = false;
					lock.setImageResource( android.R.drawable.ic_lock_lock );
				} else {

					editMode = true;
					lock.setImageResource( android.R.drawable.ic_partial_secure );
				}
			}
		} );

		// TODO acctUtilBtn
		findViewById( R.id.acctUtilBtn ).setVisibility( View.INVISIBLE );
		findViewById( R.id.acctUtilBtn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

			// TODO submenu with search, budget, trends (disabled for now)
			}
		} );

		findViewById( R.id.acctViewBal ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				// TODO update main balance wording

				balanceList changeBal = new balanceList( accounts.this, "Application Balance", appState.getTotalBalance(), new OnChangeBalanceReadyListener() );
				changeBal.show();
			}
		} );
	}

	private class OnChangeBalanceReadyListener implements balanceList.ReadyListener {

		public void ready( String key ) {

			// TODO main balance change
			int balView;

			try {

				balView = Integer.parseInt( key );
			} catch( NumberFormatException ex ) {

				balView = 0;
			}

			Log.i( "Sys Balance Change", appState.formatAccountBalance( balView ) );
		}
	}

	/** hook into menu button for activity */
	public boolean onCreateOptionsMenu( Menu menu ) {

		appState.populateOptionsMenu( menu );
		return super.onCreateOptionsMenu( menu );
	}

	/** when menu button option selected */
	public boolean onOptionsItemSelected( MenuItem item ) {

		return appState.applyMenuChoice( item, accounts.this ) || super.onOptionsItemSelected( item );
	}

	/** List Adapter **/
	private class acctListAdapter extends SimpleCursorAdapter {

		private int layout;

		public acctListAdapter( Context context, int layout, Cursor c, String[] from, int[] to ) {

			super( context, layout, c, from, to );

			this.layout = layout;
		}

		@Override
		public View newView( Context context, Cursor c, ViewGroup parent ) {

			return LayoutInflater.from( context ).inflate( layout, parent, false );
		}

		@Override
		public void bindView( View v, Context context, Cursor c ) {

			final long id = appState.getDBIndex( c, "acctId" );
			final int index = c.getPosition();

			v.setOnClickListener( new OnClickListener() {

				public void onClick( View v ) {

					dialog.setTitle( "Loading Data" );
					dialog.setMessage( "Please wait..." );
					dialog.show();

					if( editMode ) {
						// Edit account

						Intent i = new Intent( accounts.this, accounts_AddEdit.class );
						Bundle b = new Bundle();

						b.putLong( "acctId", id );
						b.putInt( "acctIndex", index );

						i.putExtras( b );
						startActivity( i );
					} else {
						// View Transactions

						appState.trsnItemsChanged = true;

						Intent i = new Intent( accounts.this, transactions.class );
						Bundle b = new Bundle();

						b.putLong( "acctId", id );

						i.putExtras( b );
						startActivity( i );
					}
				}
			} );

			TextView acctHeader = ( TextView )v.findViewById( R.id.acctHeader );
			TextView acctName = ( TextView )v.findViewById( R.id.acctName );
			TextView acctBal = ( TextView )v.findViewById( R.id.acctBal );
			TextView acctNote = ( TextView )v.findViewById( R.id.acctNote );
			ImageView acctIcon = ( ImageView )v.findViewById( R.id.acctIcon );

			String currCat = appState.stringFormatter( c.getString( c.getColumnIndex( "acctCategory" ) ) );

			boolean x = false;

			if( x ) {// Current category is different from previous

				acctHeader.setVisibility( View.VISIBLE );
				acctHeader.setText( currCat );
			} else {

				acctHeader.setText( "" );
				acctHeader.setVisibility( View.GONE );
			}

			acctName.setText( appState.stringFormatter( c.getString( c.getColumnIndex( "acctName" ) ) ) );
			if( c.getInt( c.getColumnIndex( "hidden" ) ) == 1 ) {

				acctName.setTextColor( Color.parseColor( "#0000cc" ) );
			}

			double balance = 0;

			switch( c.getInt( c.getColumnIndex( "bal_view" ) ) ) {
				case 0:
					balance = c.getDouble( c.getColumnIndex( "balance0" ) );
					break;
				case 1:
					balance = c.getDouble( c.getColumnIndex( "balance1" ) );
					break;
				case 2:
					balance = c.getDouble( c.getColumnIndex( "balance2" ) );
					break;
				case 3:
					balance = c.getDouble( c.getColumnIndex( "balance3" ) );
					break;
				default:
					balance = 0;
			}

			appState.setAccountBalanceColor( acctBal, balance );

			String note = appState.stringFormatter( c.getString( c.getColumnIndex( "acctNotes" ) ) );

			if( note.length() <= 0 ) {

				acctNote.setVisibility( View.GONE );
			} else {

				acctNote.setVisibility( View.VISIBLE );
				acctNote.setText( note );
			}

			acctIcon.setImageResource( appState.getResourceFromString( c.getString( c.getColumnIndex( "acctCategoryIcon" ) ) ) );
		}
	}
};