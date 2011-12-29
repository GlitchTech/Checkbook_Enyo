package com.glitchtechscience.gtcheckbook;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnKeyListener;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.ToggleButton;

public class transaction_AddEdit extends Activity {

	private checkbook appState;
	private SQLiteDatabase db;
	private static final String QRY_TABLE = "expenses";

	private DecimalFormat numberFormat;

	private account_obj currAcct;
	private trsn_obj trsn;

	private ProgressDialog dialog;

	private boolean activityLeft;
	private boolean dataSet;

	private ArrayList<String> genCatList;
	private ArrayList<specCat> specCatList;

	private class specCat {

		ArrayList<String> content;
	}

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.transaction_addedit );

		appState = ( ( checkbook )getApplicationContext() );
		db = appState.getAppDatabase();

		activityLeft = true;
		dataSet = false;

		trsn = new trsn_obj();

		trsn.acct_id = -1;
		trsn.trsn_id = -1;
		trsn.type = "";

		Bundle b = getIntent().getExtras();

		this.numberFormat = new DecimalFormat( "#.##" );
		this.numberFormat.setMinimumFractionDigits( 2 );
		this.numberFormat.setMaximumFractionDigits( 2 );

		try {

			trsn.acct_id = b.getLong( "acctId", -1 );// Account DB id
			trsn.trsn_id = b.getLong( "trsnId", -1 );// Transaction DB id
			trsn.type = b.getString( "type" );// Type
		} catch( Exception ex ) {

			Log.e( "transactions add/edit - onCreate", ex.toString() );
		}

		if( trsn.acct_id < 0 ) {
			// DNE - exit

			finish();
			return;
		}

		dialog = new ProgressDialog( transaction_AddEdit.this );
		dialog.setTitle( "Loading data" );
		dialog.setMessage( "Please wait..." );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		currAcct = appState.getAccount( trsn.acct_id );
	}

	@Override
	public void onResume() {

		super.onResume();

		if( activityLeft ) {

			dialog.show();

			Thread t = new Thread() {

				public void run() {

					setUpCategoryChoices();

					mHandler.post( new Runnable() {

						public void run() {

							if( dataSet == false ) {

								setUpSystem();
							}

							setUpBindings();

						}
					} );

					mHandler.post( mUpdateResults );
				}
			};
			t.start();
		}
	}

	@Override
	public void onPause() {

		super.onPause();

		dialog.dismiss();
	}

	final Handler mHandler = new Handler();
	final Runnable mUpdateResults = new Runnable() {

		public void run() {

			dialog.hide();
			activityLeft = false;
		}
	};

	private void setUpCategoryChoices() {

		Cursor cats_c = db.query( "expenseCategories", new String[] {
		"genCat", "specCat"
		}, null, null, null, null, null );

		genCatList = new ArrayList<String>();
		specCatList = new ArrayList<specCat>();

		String currGen = "";
		int genIndex = -1;

		cats_c.moveToFirst();
		while( cats_c.isAfterLast() == false ) {

			if( !currGen.equalsIgnoreCase( cats_c.getString( cats_c.getColumnIndex( "genCat" ) ) ) ) {

				genIndex++;
				currGen = cats_c.getString( cats_c.getColumnIndex( "genCat" ) );

				genCatList.add( genIndex, currGen );

				specCatList.add( genIndex, new specCat() );
				specCatList.get( genIndex ).content = new ArrayList<String>();
			}

			specCatList.get( genIndex ).content.add( cats_c.getString( cats_c.getColumnIndex( "specCat" ) ) );

			cats_c.moveToNext();
		}

		cats_c.close();
	}

	private void setUpBindings() {

		account_obj main = appState.getAccount( trsn.acct_id );

		AutoCompleteTextView searchBar = ( AutoCompleteTextView )findViewById( R.id.aeTrsnDesc );
		if( main.useAutoComplete ) {

			Cursor c = this.db.rawQuery( "SELECT desc, itemId AS _id FROM " + QRY_TABLE + " GROUP BY desc ORDER BY desc ASC LIMIT 100", null );

			AutoCompleteCursorAdapter adapter = new AutoCompleteCursorAdapter( this, c, this.db, "SELECT desc, itemId AS _id FROM " + QRY_TABLE + " WHERE desc LIKE ? GROUP BY desc ORDER BY desc ASC LIMIT 50", "desc" );
			searchBar.setAdapter( adapter );

			startManagingCursor( adapter.getCursor() );
		} else {

			AutoCompleteCursorAdapter adapter = null;
			searchBar.setAdapter( adapter );
		}

		searchBar.setSingleLine( !main.transDescMultiLine );

		// Set up account change button
		findViewById( R.id.aeTrsnAcctBttn ).setOnClickListener( null );
		findViewById( R.id.aeTrsnAcctBttn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				String qrySwapAccts = "SELECT acctId, acctId AS _id, IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ), '|-NOICON-|' ) AS acctCategoryIcon, acctName FROM accounts";
				Cursor c = transaction_AddEdit.this.db.rawQuery( qrySwapAccts, new String[] {} );

				// Dialog for Choosing Accounts
				genListIcon changeAccount = new genListIcon( transaction_AddEdit.this, "Primary Account", c, "acctName", "acctCategoryIcon", "acctId", new OnReadyListener_SourceAccount() );
				changeAccount.show();
			}
		} );

		// Set up linked account change button
		if( trsn.type.equalsIgnoreCase( "transfer" ) ) {

			findViewById( R.id.aeTrsnLinkAcctBttn ).setVisibility( View.VISIBLE );
			findViewById( R.id.aeTrsnLinkAcctBttn ).setOnClickListener( new OnClickListener() {

				public void onClick( View v ) {

					String qrySwapAccts = "SELECT acctId, acctId AS _id, IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ), '|-NOICON-|' ) AS acctCategoryIcon, acctName FROM accounts";
					Cursor c = transaction_AddEdit.this.db.rawQuery( qrySwapAccts, new String[] {} );

					// Dialog for Choosing Accounts
					genListIcon changeAccount = new genListIcon( transaction_AddEdit.this, "Linked Account", c, "acctName", "acctCategoryIcon", "acctId", new OnReadyListener_LinkedAccount() );
					changeAccount.show();
				}
			} );
		} else {

			findViewById( R.id.aeTrsnLinkAcctBttn ).setVisibility( View.GONE );
			findViewById( R.id.aeTrsnLinkAcctBttn ).setOnClickListener( null );
		}

		// Set up transaction type button (+ or -)
		findViewById( R.id.aeTrsnType ).setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				if( trsn.type.equalsIgnoreCase( "income" ) ) {

					trsn.type = "expense";
				} else if( trsn.type.equalsIgnoreCase( "expense" ) ) {

					trsn.type = "income";
				} else {// transfer

					// do nothing
				}

				changeAccountMode();
			}
		} );

		// Set up ATM mode
		EditText amtField = ( EditText )findViewById( R.id.aeTrsnAmount );

		if( main.atmEntry ) {

			// bind atm mode
			amtField.setOnKeyListener( numberListener );
		} else {

			amtField.setOnKeyListener( null );
		}

		// Set up transaction category button
		Button catButton = ( Button )findViewById( R.id.aeTrsnCategory );
		if( main.enableCategories ) {

			catButton.setVisibility( View.VISIBLE );
			catButton.setOnClickListener( new OnClickListener() {

				public void onClick( View arg0 ) {

					buildGeneralAlert();
				}
			} );
		} else {

			catButton.setVisibility( View.GONE );
			catButton.setOnClickListener( null );
		}

		// Set up check field button
		if( main.checkField ) {

			findViewById( R.id.aeTrsnCheckNumHolder ).setVisibility( View.VISIBLE );
		} else {

			findViewById( R.id.aeTrsnCheckNumHolder ).setVisibility( View.GONE );
		}

		/** Bottom control buttons **/
		findViewById( R.id.aeTrsnDone ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Saving" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				saveTransaction();
			}
		} );

		findViewById( R.id.aeTrsnDelete ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				AlertDialog.Builder builder = new AlertDialog.Builder( transaction_AddEdit.this );
				builder.setMessage( "Are you sure you want to delete this transaction?" );
				builder.setPositiveButton( android.R.string.yes, new DialogInterface.OnClickListener() {

					public void onClick( DialogInterface dialog, int id ) {

						appState.trsnItemsChanged = true;

						trsn.deleteAcctDb( db );
						transaction_AddEdit.this.finish();
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

		findViewById( R.id.aeTrsnCancel ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				closeActivity();
			}
		} );
	}

	@Override
	public boolean onKeyDown( int keyCode, KeyEvent event ) {

		if( keyCode == KeyEvent.KEYCODE_BACK ) {

			closeActivity();
			return true;
		}

		return super.onKeyDown( keyCode, event );
	}

	private void closeActivity() {

		dialog.setTitle( "Loading" );
		dialog.setMessage( "Please wait..." );
		dialog.show();
		finish();
	}

	private void setUpSystem() {

		trsn.loadTransactions( this.db );

		dataSet = true;

		// Description
		AutoCompleteTextView trsnDesc = ( AutoCompleteTextView )findViewById( R.id.aeTrsnDesc );
		trsnDesc.setText( trsn.desc );
		trsnDesc.setSelection( trsn.desc.length() );

		// Account
		( ( Button )findViewById( R.id.aeTrsnAcctBttn ) ).setText( currAcct.name );

		// Linked Account
		if( trsn.type.equalsIgnoreCase( "transfer" ) ) {

			account_obj linked = new account_obj( 1, trsn.linked_acct_id, db );
			try {

				( ( TextView )findViewById( R.id.aeTrsnLinkAcctBttn_name ) ).setText( linked.name );
				( ( ImageView )findViewById( R.id.aeTrsnLinkAcctBttn_icon ) ).setImageResource( appState.getResourceFromString( linked.acctCatIcon ) );
			} catch( Exception ex ) {

				( ( TextView )findViewById( R.id.aeTrsnLinkAcctBttn_name ) ).setText( currAcct.name );
				( ( ImageView )findViewById( R.id.aeTrsnLinkAcctBttn_icon ) ).setImageResource( appState.getResourceFromString( currAcct.acctCatIcon ) );
			}
		}

		// Amount (Button)
		changeAccountMode();
		( ( EditText )findViewById( R.id.aeTrsnAmount ) ).setText( this.numberFormat.format( trsn.amount ) );

		findViewById( R.id.aeTrsnDateTime ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				showDateTimeDialog();
			}
		} );
		formatDate();

		// Category
		if( trsn.category_gen.length() > 0 && trsn.category_spec.length() > 0 ) {

			( ( Button )findViewById( R.id.aeTrsnCategory ) ).setText( trsn.category_gen + " >> " + trsn.category_spec );
		} else {

			( ( Button )findViewById( R.id.aeTrsnCategory ) ).setText( "Select a Category" );
		}

		// Check number
		( ( EditText )findViewById( R.id.aeTrsnCheckNum ) ).setText( trsn.check_num );

		// Cleared
		( ( ToggleButton )findViewById( R.id.aeTrsnCleared ) ).setChecked( trsn.cleared );

		// Notes
		( ( EditText )findViewById( R.id.aeTrsnNotes ) ).setText( trsn.note );
	}

	private void buildGeneralAlert() {

		final String[] temp = genCatList.toArray( new String[genCatList.size() + 1] );
		temp[temp.length - 1] = "Add/Edit Categories";

		AlertDialog.Builder builder = new AlertDialog.Builder( transaction_AddEdit.this );
		builder.setTitle( "General Category" );
		builder.setItems( temp, new DialogInterface.OnClickListener() {

			public void onClick( DialogInterface dialogInterface, int item ) {

				if( item == temp.length - 1 ) {

					activityLeft = true;

					Intent i = new Intent( transaction_AddEdit.this, transcat.class );
					startActivity( i );
				} else {

					buildSpecAlert( item );
				}
				return;
			}
		} );
		builder.create().show();
	}

	private void buildSpecAlert( int index ) {

		final String generalCat = genCatList.get( index ).toString();
		final String[] temp = specCatList.get( index ).content.toArray( new String[specCatList.get( index ).content.size() + 1] );
		temp[temp.length - 1] = "Back";

		AlertDialog.Builder builder = new AlertDialog.Builder( transaction_AddEdit.this );
		builder.setTitle( "Specific Category" );
		builder.setItems( temp, new DialogInterface.OnClickListener() {

			public void onClick( DialogInterface dialogInterface, int item ) {

				if( item == temp.length - 1 ) {

					buildGeneralAlert();
				} else {

					trsn.category_gen = generalCat;
					trsn.category_spec = temp[item];

					if( trsn.category_gen.length() > 0 && trsn.category_spec.length() > 0 ) {

						( ( Button )findViewById( R.id.aeTrsnCategory ) ).setText( trsn.category_gen + " >> " + trsn.category_spec );
					} else {

						( ( Button )findViewById( R.id.aeTrsnCategory ) ).setText( "Select a Category" );
					}
				}

				return;
			}
		} );
		builder.create().show();
	}

	private void showDateTimeDialog() {

		final DateTimePicker getDT = new DateTimePicker( this, trsn.dateTime );

		getDT.confirm.setOnClickListener( new OnClickListener() {

			public void onClick( View v ) {

				trsn.dateTime = getDT.mCalendar.getTime();
				formatDate();
				getDT.dismiss();
			}
		} );

		getDT.show();
	}

	protected void formatDate() {

		java.text.DateFormat dateFormat = android.text.format.DateFormat.getDateFormat( getApplicationContext() );
		java.text.DateFormat timeFormat = android.text.format.DateFormat.getTimeFormat( getApplicationContext() );

		( ( TextView )findViewById( R.id.aeTrsnDateTime_name ) ).setText( dateFormat.format( trsn.dateTime ) + " " + timeFormat.format( trsn.dateTime ) );
	}

	private void changeAccountMode() {

		ImageButton amt_img = ( ImageButton )findViewById( R.id.aeTrsnType );

		if( trsn.type.equalsIgnoreCase( "income" ) ) {

			amt_img.setImageResource( R.drawable.menu_icon_income );
		} else if( trsn.type.equalsIgnoreCase( "transfer" ) ) {

			amt_img.setImageResource( R.drawable.menu_icon_transfer );
		} else {// expense

			amt_img.setImageResource( R.drawable.menu_icon_expense );
		}
	}

	protected void saveTransaction() {

		trsn.desc = ( ( AutoCompleteTextView )findViewById( R.id.aeTrsnDesc ) ).getText().toString();
		currAcct.name = ( ( Button )findViewById( R.id.aeTrsnAcctBttn ) ).getText().toString();

		trsn.linked_acct_id = ( trsn.type.equalsIgnoreCase( "transfer" ) ? trsn.linked_acct_id : -1 );

		try {

			trsn.amount = Double.valueOf( ( ( EditText )findViewById( R.id.aeTrsnAmount ) ).getText().toString() );
		} catch( Exception ex ) {

			trsn.amount = 0;
		}

		trsn.check_num = ( ( EditText )findViewById( R.id.aeTrsnCheckNum ) ).getText().toString();
		trsn.cleared = ( ( ToggleButton )findViewById( R.id.aeTrsnCleared ) ).isChecked();
		trsn.note = ( ( EditText )findViewById( R.id.aeTrsnNotes ) ).getText().toString();

		if( trsn.amount == 0 && trsn.desc.length() <= 0 && trsn.note.length() <= 0 ) {
			// Bad name, bad amount and bad note

			finish();
			return;
		}

		appState.trsnItemsChanged = true;

		Thread t = new Thread() {

			public void run() {

				if( trsn.desc.length() <= 0 ) {

					trsn.desc = "Description";
				}

				if( trsn.type.equalsIgnoreCase( "income" ) ) {

					trsn.amount = Math.abs( trsn.amount );
				} else if( trsn.type.equalsIgnoreCase( "transfer" ) ) {

					if( trsn.trsn_id >= 0 && trsn.amount_orig < 0 ) {
						// Money transfered from here

						trsn.amount = -Math.abs( trsn.amount );
					} else if( trsn.trsn_id >= 0 && trsn.amount_orig >= 0 ) {
						// Money transfered to here

						trsn.amount = Math.abs( trsn.amount );
					} else {

						trsn.amount = -Math.abs( trsn.amount );
					}
				} else {// expense

					trsn.amount = -Math.abs( trsn.amount );
				}
				
				try {
					
				    BigDecimal bd = new BigDecimal( trsn.amount );
				    BigDecimal rounded = bd.setScale( 2, BigDecimal.ROUND_HALF_UP );
				    trsn.amount = rounded.doubleValue();
				} catch( java.lang.NumberFormatException ex ) {
					
					trsn.amount = 0;
					Log.e("AMOUNT NumberFormatException", ex.toString() );
				}

				if( trsn.trsn_id < 0 ) {
					// New

					trsn.createTrsnDb( transaction_AddEdit.this.db );// sets
					// trsn_id
					// to its
					// newly
					// created
					// db index

					if( trsn.type.equalsIgnoreCase( "transfer" ) ) {

						trsn_obj linked = new trsn_obj();
						linked.type = trsn.type;
						linked.desc = trsn.desc;
						linked.category_gen = trsn.category_gen;
						linked.category_spec = trsn.category_spec;
						linked.amount = -trsn.amount;
						linked.amount_orig = trsn.amount_orig;
						linked.dateTime = trsn.dateTime;
						linked.check_num = trsn.check_num;
						linked.cleared = trsn.cleared;
						linked.note = trsn.note;

						linked.acct_id = trsn.linked_acct_id;

						linked.linked_acct_id = trsn.acct_id;
						linked.linked_record = trsn.trsn_id;

						linked.createTrsnDb( transaction_AddEdit.this.db );

						trsn.linked_record = linked.trsn_id;
						trsn.updateTrsnDb( transaction_AddEdit.this.db );
					}
				} else {
					// update

					trsn.updateTrsnDb( transaction_AddEdit.this.db );

					if( trsn.type.equalsIgnoreCase( "transfer" ) ) {

						trsn_obj linked = new trsn_obj();
						linked.trsn_id = trsn.linked_record;

						linked.loadTransactions( transaction_AddEdit.this.db );

						linked.type = trsn.type;
						linked.desc = trsn.desc;
						linked.category_gen = trsn.category_gen;
						linked.category_spec = trsn.category_spec;
						linked.amount = -trsn.amount;
						linked.amount_orig = trsn.amount_orig;
						linked.dateTime = trsn.dateTime;
						linked.check_num = trsn.check_num;
						linked.note = trsn.note;

						linked.acct_id = trsn.linked_acct_id;

						linked.linked_acct_id = trsn.acct_id;

						linked.updateTrsnDb( transaction_AddEdit.this.db );
					}
				}

				// Thread done running handler
				mHandler.post( saveComplete );
			}
		};
		t.start();
	}

	final Runnable saveComplete = new Runnable() {

		public void run() {

			finish();
		}
	};

	private class OnReadyListener_SourceAccount implements genListIcon.ReadyListener {

		public void ready( String key ) {

			long id = -1;

			try {

				id = Long.parseLong( key );
			} catch( NumberFormatException ex ) {

				id = -1;
			}

			trsn.acct_id = id;
			( ( Button )findViewById( R.id.aeTrsnAcctBttn ) ).setText( appState.getAccount( trsn.acct_id ).name );

			dialog.dismiss();
			setUpBindings();
		}
	}

	private class OnReadyListener_LinkedAccount implements genListIcon.ReadyListener {

		public void ready( String key ) {

			long id = -1;

			try {

				id = Long.parseLong( key );
			} catch( NumberFormatException ex ) {

				id = -1;
			}

			trsn.linked_acct_id = id;

			account_obj temp = appState.getAccount( trsn.linked_acct_id );

			( ( TextView )findViewById( R.id.aeTrsnLinkAcctBttn_name ) ).setText( temp.name );
			( ( ImageView )findViewById( R.id.aeTrsnLinkAcctBttn_icon ) ).setImageResource( appState.getResourceFromString( temp.acctCatIcon ) );
		}
	}

	OnKeyListener numberListener = new OnKeyListener() {

		public boolean onKey( View v, int keyCode, KeyEvent event ) {
			
			EditText input = ( EditText )v;

			if( event.getAction() == KeyEvent.ACTION_UP ) {

				int pos = input.getSelectionEnd();

				String raw = input.getText().toString();

				raw = "00" + raw.replaceAll( "[^\\d]", "" );
				int s1 = 0;

				try {

					s1 = Integer.parseInt( raw.substring( 0, raw.length() - 2 ) );
				} catch( NumberFormatException ex ) {}

				String s2 = raw.substring( raw.length() - 2, raw.length() );

				// Catch for short numbers, ie first entry
				if( input.getText().length() <= 4 ) {

					pos = ( s1 + "." + s2 ).length();
				}

				if( keyCode == KeyEvent.KEYCODE_BACK || keyCode == KeyEvent.KEYCODE_DEL ) {

					pos += 1;
				}

				input.setText( s1 + "." + s2 );

				if( pos > input.getText().length() ) {

					pos = input.getText().length();
				}

				input.setSelection( pos );
			}

			return false;
		}
	};

	private class trsn_obj {

		long trsn_id;

		String type;// [ income, transfer, expense ]

		String desc;

		String category_gen;
		String category_spec;

		double amount;
		double amount_orig;

		Date dateTime;

		long acct_id;

		long linked_acct_id;
		long linked_record;

		String check_num;

		boolean cleared;

		String note;

		// TODO unused repeat system
		// long repeat_id;
		// long repeat_oid;
		//
		// String repeatFrequency;
		// String repeatDaysOfWeek;
		// String repeatItemSpan;
		// String repeatEndingCondition;
		//
		// Date repeatEndDate;
		// int repeatEndCount;
		// int repeatCurrCount;

		public void loadTransactions( SQLiteDatabase db ) {

			Cursor c = db.query( QRY_TABLE, new String[] {
			"desc", "amount", "cleared", "note", "date", "account", "category", "linkedRecord", "linkedAccount", "checkNum"
			}, "itemId=?", new String[] {
				"" + trsn.trsn_id
			}, null, null, null, "1" );

			if( c.getCount() <= 0 || this.trsn_id < 0 ) {

				this.desc = "";
				this.category_gen = "";
				this.category_spec = "";

				this.amount = 0.0;
				this.amount_orig = 0.0;

				this.dateTime = new Date();

				this.linked_acct_id = this.acct_id;
				this.linked_record = 0;

				this.cleared = false;

				this.note = "";

				this.check_num = "";
			} else {

				c.moveToFirst();

				this.desc = c.getString( c.getColumnIndex( "desc" ) );

				this.amount_orig = c.getDouble( c.getColumnIndex( "amount" ) );
				this.amount = Math.abs( this.amount_orig );

				this.cleared = c.getInt( c.getColumnIndex( "cleared" ) ) == 1;

				this.note = c.getString( c.getColumnIndex( "note" ) );

				this.dateTime = new Date( c.getLong( c.getColumnIndex( "date" ) ) );

				this.acct_id = c.getLong( c.getColumnIndex( "account" ) );

				String fullCat = c.getString( c.getColumnIndex( "category" ) );
				try {

					String[] temp = fullCat.split( "\\|", 2 );

					this.category_gen = temp[0];
					this.category_spec = temp[1];
				} catch( Exception ex ) {

					this.category_gen = "";
					this.category_spec = "";

					Log.w( "transaction_AddEdit", "String split failure: [" + ex.toString() + "]" );
				}

				try {

					this.linked_record = appState.getDBIndex( c, "linkedRecord" );
					this.linked_acct_id = appState.getDBIndex( c, "linkedAccount" );
				} catch( Exception ex ) {

					this.linked_record = -1;
					this.linked_acct_id = -1;
				}

				this.check_num = c.getString( c.getColumnIndex( "checkNum" ) );

				if( !Double.isNaN( this.linked_record ) && this.linked_record >= 0 && !Double.isNaN( this.linked_acct_id ) && this.linked_acct_id >= 0 ) {

					this.type = "transfer";
				} else if( this.amount_orig < 0 ) {

					this.type = "expense";
				} else {

					this.type = "income";
				}
			}

			c.close();
		}

		private ContentValues buildDBObject() {

			ContentValues currTrsn = new ContentValues();
			// currTrsn.put( "itemId", this.trsn_id );// Do not include this
			// row, for where clause only
			// this.type/ [ income, transfer, expense ]
			currTrsn.put( "desc", this.desc );

			if( this.category_gen.length() > 0 && this.category_spec.length() > 0 ) {

				currTrsn.put( "category", this.category_gen + "|" + this.category_spec );
			} else {

				currTrsn.put( "category", "" );
			}

			currTrsn.put( "amount", this.amount );
			// amount_orig
			currTrsn.put( "date", this.dateTime.getTime() );
			currTrsn.put( "account", this.acct_id );
			// acct_index;
			currTrsn.put( "linkedAccount", this.linked_acct_id );
			currTrsn.put( "linkedRecord", this.linked_record );
			currTrsn.put( "checkNum", this.check_num );
			currTrsn.put( "cleared", ( this.cleared ? "1" : "0" ) );
			currTrsn.put( "note", this.note );

			return currTrsn;
		}

		public long createTrsnDb( SQLiteDatabase db ) {

			ContentValues currTrsn = this.buildDBObject();
			this.trsn_id = db.insert( QRY_TABLE, null, currTrsn );
			currTrsn.clear();

			return this.trsn_id;
		}

		public long updateTrsnDb( SQLiteDatabase db ) {

			if( this.trsn_id < 0 ) {
				// Account is new to the system

				return createTrsnDb( db );
			}

			ContentValues currTrsn = this.buildDBObject();

			String[] whereArgs = {
				this.trsn_id + ""
			};
			long temp = db.update( QRY_TABLE, currTrsn, "itemId=?", whereArgs );
			currTrsn.clear();

			return temp;// Returns rows affected
		}

		public int deleteAcctDb( SQLiteDatabase db ) {

			String[] whereArgs = {
			this.trsn_id + "", this.trsn_id + ""
			};
			return db.delete( QRY_TABLE, "itemId=? OR linkedRecord = ?", whereArgs );
		}
	}
}