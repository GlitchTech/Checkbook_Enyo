package com.glitchtechscience.gtcheckbook;

import java.util.Date;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;
import android.widget.CompoundButton.OnCheckedChangeListener;

public class transactions extends Activity {

	private checkbook appState;
	private SQLiteDatabase db;
	private account_obj acct;

	private ProgressDialog dialog;

	private static final String QRY_SELECT = "DISTINCT itemId, itemId AS _id, *," + // All the expense data
	" '' AS repeatFrequency," + // Repeat frequency
	" '' AS repeatDaysOfWeek," + // Repeat days of the week
	" '' AS repeatItemSpan," + // Span between occurrences
	" '' AS repeatEndingCondition," + // Date or Count
	" '' AS repeatEndDate," + // Ending date
	" '' AS repeatEndCount," + // Ending count
	" '' AS repeatCurrCount";// Current count of repeats
	private static final String QRY_TABLE = "expenses";
	private static final String QRY_WHERE = "account = ?";

	private ListView trsnList;
	private trsnListAdapter trsnListAdp;
	private Cursor trsnListCursor;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.transactions );

		appState = ( ( checkbook )getApplicationContext() );
		db = appState.getAppDatabase();

		long acctId = -1;

		Bundle b = getIntent().getExtras();

		try {

			acctId = b.getLong( "acctId", -1 );// DB id
		} catch( Exception ex ) {

			Log.e( "transactions - onCreate", ex.toString() );
		}

		if( acctId < 0 ) {
			// DNE - exit

			finish();
			return;
		}

		dialog = new ProgressDialog( transactions.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		acct = appState.getAccount( acctId );

		setUpButtons();
		setUpBalances();
		setUpData();
	} 

	@Override
	public void onResume() {

		super.onResume();

		if( appState.trsnItemsChanged ) {

			appState.trsnItemsChanged = false;

			setUpData();
			trsnListAdp.notifyDataSetChanged();

			acct.updateBalance( this.db );
			setUpBalances();
		}

		dialog.hide();
	}

	@Override
	public void onDestroy() {

		dialog.dismiss();
		trsnListCursor.close();

		super.onDestroy();
	}

	/** hook into menu button for activity */
	public boolean onCreateOptionsMenu( Menu menu ) {

		appState.populateOptionsMenu( menu );
		return super.onCreateOptionsMenu( menu );
	}

	/** when menu button option selected */
	public boolean onOptionsItemSelected( MenuItem item ) {

		return appState.applyMenuChoice( item, transactions.this ) || super.onOptionsItemSelected( item );
	}

	public void setUpData() {

		// Set up trsnList query & system
		String expenseQry = "SELECT " + QRY_SELECT + " FROM " + QRY_TABLE + " WHERE " + QRY_WHERE + " ORDER BY " + appState.getAcctTrsnSortsQryViaId( acct.sort );

		try {

			trsnListCursor.close();
		} catch( Exception ex ) {}

		trsnListCursor = this.db.rawQuery( expenseQry, new String[] { acct.rowId + "" } );

		String[] dataCols = new String[] { "desc" };
		int[] dispFields = new int[] { R.id.trsnName };

		this.trsnList = ( ListView )findViewById( R.id.trsnList );
		this.trsnListAdp = new trsnListAdapter( transactions.this, R.layout.trsn_item, trsnListCursor, dataCols, dispFields );
		this.trsnList.setAdapter( this.trsnListAdp );
	}

	private void setUpButtons() {

		findViewById( R.id.trsnSortBtn ).setVisibility( View.INVISIBLE );
		( ( ImageButton )findViewById( R.id.trsnSortBtn ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

			// TODO submenu with sorting options
			}
		} );

		( ( ImageButton )findViewById( R.id.addIncomeTrsn ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Loading" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				Intent i = new Intent( transactions.this, transaction_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "acctId", acct.rowId );// Account ID
				b.putInt( "acctIndex", acct.index );// Account Index
				b.putLong( "trsnId", -1 );// Transaction ID
				b.putString( "type", "income" );// Transaction Type

				i.putExtras( b );
				startActivity( i );
			}
		} );
		( ( ImageButton )findViewById( R.id.addTransferTrsn ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Loading" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				Intent i = new Intent( transactions.this, transaction_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "acctId", acct.rowId );// Account ID
				b.putInt( "acctIndex", acct.index );// Account Index
				b.putLong( "trsnId", -1 );// Transaction ID
				b.putString( "type", "transfer" );// Transaction Type

				i.putExtras( b );
				startActivity( i );
			}
		} );
		( ( ImageButton )findViewById( R.id.addExpenseTrsn ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Loading" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				Intent i = new Intent( transactions.this, transaction_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "acctId", acct.rowId );// Account ID
				b.putInt( "acctIndex", acct.index );// Account Index
				b.putLong( "trsnId", -1 );// Transaction ID
				b.putString( "type", "expense" );// Transaction Type

				i.putExtras( b );
				startActivity( i );
			}
		} );

		findViewById( R.id.trsnUtilBtn ).setVisibility( View.INVISIBLE );
		( ( ImageButton )findViewById( R.id.trsnUtilBtn ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

			// TODO submenu with search, budget, trends (disabled for now)
			}
		} );

		/** Balance mode change **/
		( ( Button )findViewById( R.id.trsnViewBal ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				double[] balances = new double[] { acct.balance0, acct.balance1, acct.balance3, acct.balance2 };

				balanceList changeBal = new balanceList( transactions.this, "Change Account Balance View", balances, new OnChangeBalanceReadyListener() );
				changeBal.show();
			}
		} );

		/** Account change **/
		( ( ImageView )findViewById( R.id.trsnViewIcon ) ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				Cursor c = appState.getBasicAccountList();

				// Dialog for Choosing Accounts
				genListIcon changeAccount = new genListIcon( transactions.this, "Switch account to...", c, "acctName", "acctCategoryIcon", "acctId", new OnChangeAccountReadyListener() );
				changeAccount.show();
			}
		} );
	}

	private class OnChangeBalanceReadyListener implements balanceList.ReadyListener {

		public void ready( String key ) {

			try {

				acct.balView = Integer.parseInt( key );
			} catch( NumberFormatException ex ) {

				acct.balView = 0;
			}

			switch( acct.balView ) {
				case 2:
					acct.balView = 3;
					break;
				case 3:
					acct.balView = 2;
					break;
			}

			acct.updateAcctDb( db );
			acct.updateBalance( db );
			setUpBalances();
		}
	}

	private class OnChangeAccountReadyListener implements genListIcon.ReadyListener {

		public void ready( String key ) {

			appState.trsnItemsChanged = true;

			Intent i = new Intent( transactions.this, transactions.class );
			Bundle b = new Bundle();

			long id = -1;

			try {

				id = Long.parseLong( key );
			} catch( NumberFormatException ex ) {

				id = -1;
			}

			b.putLong( "acctId", id );

			i.putExtras( b );

			transactions.this.finish();

			startActivity( i );
		}
	}

	private void setUpBalances() {

		try {

			( ( ImageView )findViewById( R.id.trsnViewIcon ) ).setImageResource( appState.getResourceFromString( acct.acctCatIcon ) );
		} catch( NullPointerException ex ) {

			//TODO handle this
		}

		( ( TextView )findViewById( R.id.trsnAccountName ) ).setText( acct.name );

		Button trsnViewBal = ( ( Button )findViewById( R.id.trsnViewBal ) );

		trsnViewBal.setText( appState.formatAccountBalance( acct.balance4 ) );

		if( acct.balance4 < 0 ) {

			trsnViewBal.setTextColor( appState.NEG_TRSN );
		} else {

			trsnViewBal.setTextColor( appState.POS_TRSN );
		}
	}

	private class trsnListAdapter extends SimpleCursorAdapter {

		private int layout;

		public trsnListAdapter( Context context, int layout, Cursor c, String[] from, int[] to ) {

			super( context, layout, c, from, to );

			this.layout = layout;
		}

		@Override
		public View newView( Context context, Cursor c, ViewGroup parent ) {

			return LayoutInflater.from( context ).inflate( layout, parent, false );
		}

		@Override
		public void bindView( View v, Context context, Cursor c ) {

			final long id = appState.getDBIndex( c, "itemId" );

			TextView trsnIdView = ( TextView )v.findViewById( R.id.trsnId );
			if( trsnIdView != null ) {

				trsnIdView.setText( id + "" );
			}

			Date trsnDateObj = new Date( c.getLong( c.getColumnIndex( "date" ) ) );

			v.setOnClickListener( null );// Reset listener
			v.setOnClickListener( new OnClickListener() {

				public void onClick( View vSub ) {

					dialog.setTitle( "Loading" );
					dialog.setMessage( "Please wait..." );
					dialog.show();

					Intent i = new Intent( transactions.this, transaction_AddEdit.class );
					Bundle b = new Bundle();

					b.putLong( "acctId", acct.rowId );// Account ID
					b.putInt( "acctIndex", acct.index );// Account Index
					b.putLong( "trsnId", id );// Transaction ID
					b.putString( "type", "" );// Transaction Type

					i.putExtras( b );
					startActivity( i );
				}
			} );

			long linked_record;
			long linked_acct_id;

			try {

				linked_record = appState.getDBIndex( c, "linkedRecord" );
				linked_acct_id = appState.getDBIndex( c, "linkedAccount" );
			} catch( Exception ex ) {

				linked_record = -1;
				linked_acct_id = -1;
			}

			// set background
			ImageView xfer = ( ImageView )v.findViewById( R.id.trsnHolder );
			if( xfer != null ) {

				if( !Double.isNaN( linked_acct_id ) && linked_acct_id >= 0 && !Double.isNaN( linked_record ) && linked_record >= 0 ) {

					xfer.setVisibility( View.VISIBLE );
					xfer.setImageResource( R.drawable.transfer_3 );
					xfer.setAlpha( 80 );
				} else {

					xfer.setVisibility( View.GONE );
				}
			}

			TextView trsnName = ( TextView )v.findViewById( R.id.trsnName );
			if( trsnName != null ) {

				trsnName.setText( appState.stringFormatter( c.getString( c.getColumnIndex( "desc" ) ) ) );

				if( trsnDateObj.after( new Date() ) ) {

					trsnName.setTextColor( 0xff0000cc );
				}
			}

			CheckBox trsnCleared = ( CheckBox )v.findViewById( R.id.trsnCleared );
			if( trsnCleared != null ) {

				// Remove any old node listeners
				trsnCleared.setOnCheckedChangeListener( null );
				// Set status
				trsnCleared.setChecked( c.getInt( c.getColumnIndex( "cleared" ) ) == 1 );
				// Add new listener
				trsnCleared.setOnCheckedChangeListener( new OnCheckedChangeListener() {

					public void onCheckedChanged( CompoundButton arg0, boolean cleared ) {

						ContentValues currTrsn = new ContentValues();
						currTrsn.put( "cleared", ( cleared ? "1" : "0" ) );
						db.update( QRY_TABLE, currTrsn, "itemId=?", new String[] { id + "" } );
						currTrsn.clear();

						// Fetch fresh data, system was not refreshing list item properly
						setUpData();

						acct.updateBalance( db );
						setUpBalances();
					}
				} );
			}

			TextView trsnAmt = ( TextView )v.findViewById( R.id.trsnAmt );
			if( trsnAmt != null ) {

				appState.setAccountBalanceColor( trsnAmt, c.getDouble( c.getColumnIndex( "amount" ) ) );
			}

			TextView trsnRunningBal = ( TextView )v.findViewById( R.id.trsnRunningBal );
			if( trsnRunningBal != null && acct.runningBalance ) {

				// TODO figure out running balance
				// appState.setAccountBalanceColor( trsnRunningBal, c.getDouble( c.getColumnIndex( "RUNNING_BALANCE_FIELD" ) ) );
			}

			TextView trsnDate = ( TextView )v.findViewById( R.id.trsnDate );
			if( trsnDate != null ) {

				java.text.DateFormat dateFormat = android.text.format.DateFormat.getDateFormat( getApplicationContext() );
				java.text.DateFormat timeFormat = android.text.format.DateFormat.getTimeFormat( getApplicationContext() );

				if( acct.showTransTime ) {

					trsnDate.setText( dateFormat.format( trsnDateObj ) + " " + timeFormat.format( trsnDateObj ) );
				} else {

					trsnDate.setText( dateFormat.format( trsnDateObj ) );
				}
			}

			TextView trsnNote = ( TextView )v.findViewById( R.id.trsnNote );
			if( trsnNote != null ) {

				String trsnNoteData = "";

				// Cat
				if( acct.enableCategories ) {

					trsnNoteData += c.getString( c.getColumnIndex( "category" ) ).length() <= 0 ? "" : appState.stringFormatter( c.getString( c.getColumnIndex( "category" ) ) ).replace( "|", " >> " );
				}

				// Check Number
				if( acct.checkField ) {

					trsnNoteData += c.getString( c.getColumnIndex( "checkNum" ) ).length() <= 0 ? "" : ( trsnNoteData.length() > 0 ? "\n" : "" ) + "Check #" + c.getString( c.getColumnIndex( "checkNum" ) ) + "\n";
				}

				// Note
				if( acct.hideNotes ) {

					trsnNoteData += ( trsnNoteData.length() > 0 ? "\n" : "" ) + appState.stringFormatter( c.getString( c.getColumnIndex( "note" ) ) );
				}

				if( trsnNoteData.length() <= 0 ) {

					trsnNote.setVisibility( View.GONE );
					trsnNote.setText( "" );
				} else {

					trsnNote.setVisibility( View.VISIBLE );
					trsnNote.setText( trsnNoteData );
				}
			}
		}
	}
}