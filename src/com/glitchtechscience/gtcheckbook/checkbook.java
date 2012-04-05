package com.glitchtechscience.gtcheckbook;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import android.app.AlertDialog;
import android.app.Application;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.text.Html;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.SubMenu;
import android.widget.TextView;
import android.widget.Toast;

public class checkbook extends Application {

	/** Constants **/
	public final int NEG_TRSN = Color.parseColor( "#cc0000" );
	public final int NEG_TRSN_LIGHT = Color.parseColor( "#ff0000" );

	public final int POS_TRSN = Color.parseColor( "#006600" );
	public final int POS_TRSN_LIGHT = Color.parseColor( "#009900" );

	private HashMap<String, String> systemIcons;

	private static final String QRY_SELECT = "*," +
	// Get category icon
	" IFNULL( ( SELECT accountCategories.icon FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ), '|-NOICON-|' ) AS acctCategoryIcon," +
	// Get category color
	" ( SELECT accountCategories.color FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCategoryColor," +
	// Get category order
	" ( SELECT accountCategories.catOrder FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCatOrder," +
	// Get category ID
	" ( SELECT accountCategories.rowid FROM accountCategories WHERE accountCategories.name = accounts.acctCategory ) AS acctCatId," +

	// Start bal_view = 0 -- Available Balance
	" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId" + //
	" AND (" + //
	" ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR" + //
	" ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 )" + //
	" ) ), 0 ) AS balance0," +
	// End bal_view

	// Start bal_view = 1 -- Cleared Balance
	" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId" + //
	" AND (" + //
	" ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR" + //
	" ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 )" + //
	" ) AND expenses.cleared = 1 ), 0 ) AS balance1," +
	// End bal_view

	// Start bal_view = 3 -- Pending Balance
	" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId" + //
	" AND expenses.cleared = 0 ), 0 ) AS balance3," +
	// End bal_view

	// Start bal_view = 2 -- Final Balance
	" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId ), 0 ) AS balance2";
	// End bal_view

	private static final String QRY_TABLE = "accounts";

	/** System Vars **/
	private static checkbook instance = null;

	// need interface for acctItems, mimic sql-model.js
	public boolean acctItemsChanged = false;
	public boolean trsnItemsChanged = false;
	private SQLiteDatabase cbDB;

	// App preferences
	public int currAcctSort = 2;// TODO load from DB
	public SortOptObj[] accountSortOptions;

	// Array Objects
	SortOptObj[] acctTrsnSorts;
	List<HashMap<String, String>> acctCategories;
	String[] acctDisplayModes;
	String[] acctBalanceViews;

	public checkbook() {

		super();
		// resizeImage( this, R.drawable.ICON, 32, 32 )
	}

	@Override
	public void onCreate() {

		super.onCreate();

		// provide an instance for our static accessors
		instance = this;
		buildImageMap();
	}

	public static checkbook getInstance() {

		checkInstance();
		return instance;
	}

	private static void checkInstance() {

		if( instance == null ) {

			throw new IllegalStateException( "Application not created yet!" );
		}
	}

	public void setAppDatabase() {

		try {

			GTSCBDBHelper openHelper = new GTSCBDBHelper( getBaseContext() );
			this.cbDB = openHelper.getWritableDatabase();
		} catch( Exception ex ) {

			Log.e( "setAppDatabase()", "ERROR: " + ex.toString() );
		}
	}

	public SQLiteDatabase getAppDatabase() {

		// TODO insert kill switch here
		// TODO change app id for beta mode

		return this.cbDB;
	}

	public void closeAppDatabase() {

		this.cbDB.close();
	}

	public void loadAppDataDrops() {

		setAcctSortOptions();
		setAcctCategory();
		setAcctTrsnSorts();
		setAcctDisplayModes();
		setAcctBalanceViews();
	}

	public void loadAppPrefs() {

	// TODO create the app prefs obj from the DB
	}

	public double[] getTotalBalance() {

		// TODO db query to create a 4 item string for the total balance
		String balanceQry = "SELECT " + "SUM( IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND ( ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) ) AS balance0, " + //
		"SUM( IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND ( ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND expenses.cleared = 1 ), 0 ) ) AS balance1, " + //
		"SUM( IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId ), 0 ) ) AS balance2, " + //
		"SUM( IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND expenses.cleared = 0 ), 0 ) ) AS balance3, " + //
		"SUM( " + //
		"CASE " + //
		"WHEN bal_view = 0 THEN IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND ( ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) ), 0 ) " + //
		"WHEN bal_view = 1 THEN IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND ( ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 ) ) AND expenses.cleared = 1 ), 0 ) " + //
		"WHEN bal_view = 2 THEN IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId ), 0 ) " + //
		"WHEN bal_view = 3 THEN IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND expenses.cleared = 0 ), 0 ) " + //
		"ELSE 0 " + //
		"END " + //
		") AS stdBal " + //
		"FROM accounts " + //
		"WHERE hidden = 0";

		Date date = new Date();
		String now = date.getTime() + "";

		date.setHours( 23 );
		date.setMinutes( 59 );
		date.setSeconds( 59 );
		String today = date.getTime() + "";

		String[] acctQryArgs = { now, today, now, today, now, today, now, today };

		Cursor results = this.cbDB.rawQuery( balanceQry, acctQryArgs );

		double[] totalBalance;

		results.moveToFirst();
		if( results.getCount() <= 0 ) {

			totalBalance = new double[] { 0.0, 0.0, 0.0, 0.0, 0.0 };
		} else {

			totalBalance = new double[] { results.getDouble( results.getColumnIndex( "balance0" ) ), results.getDouble( results.getColumnIndex( "balance1" ) ), results.getDouble( results.getColumnIndex( "balance2" ) ), results.getDouble( results.getColumnIndex( "balance3" ) ), results.getDouble( results.getColumnIndex( "stdBal" ) ) };
		}
		results.close();

		return totalBalance;
	}

	public Cursor getBasicAccountList() {

		return getBasicAccountList( 0, false );
	}

	public Cursor getBasicAccountList( int sort, boolean hidden ) {

		String qryAccts = "SELECT acctId AS _id, " + QRY_SELECT + " FROM " + QRY_TABLE + ( hidden ? "": " WHERE hidden != 2" );

		if( sort == 0 ) {

			qryAccts += " ORDER BY acctName";
		} else if( sort == 1 ) {
			
			try {
				
				
				qryAccts += " ORDER BY " + this.accountSortOptions[currAcctSort].data;
			} catch( NullPointerException ex ) {
				
				Log.e( "Caught Error", ex.toString() );
			}
		}

		Date date = new Date();
		String now = date.getTime() + "";

		date.setHours( 23 );
		date.setMinutes( 59 );
		date.setSeconds( 59 );
		String today = date.getTime() + "";

		String[] acctQryArgs = { now, today, now, today };
		
		return this.cbDB.rawQuery( qryAccts, acctQryArgs );
	}

	public ArrayList<account_obj> getAcctItems() {

		String accountQry = "SELECT " + QRY_SELECT + " FROM " + QRY_TABLE + " ORDER BY " + this.accountSortOptions[currAcctSort].data;

		Date date = new Date();
		String now = date.getTime() + "";

		date.setHours( 23 );
		date.setMinutes( 59 );
		date.setSeconds( 59 );
		String today = date.getTime() + "";

		String[] acctQryArgs = { now, today, now, today };

		Cursor results = this.cbDB.rawQuery( accountQry, acctQryArgs );

		ArrayList<account_obj> acctItems = new ArrayList<account_obj>();

		results.moveToFirst();
		while( results.isAfterLast() == false ) {

			acctItems.add( new account_obj( results.getPosition(),// item index
			this.getDBIndex( results, "acctId" ),// rowId
			results.getString( results.getColumnIndex( "acctCategory" ) ), // category
			( results.getString( results.getColumnIndex( "acctCategoryIcon" ) ) == "|-NOICON-|" ? "icon.2.png" : results.getString( results.getColumnIndex( "acctCategoryIcon" ) ) ), // category
			// icon
			results.getString( results.getColumnIndex( "acctCategoryColor" ) ), // category color
			results.getInt( results.getColumnIndex( "acctCatId" ) ), // category id
			results.getInt( results.getColumnIndex( "acctCatOrder" ) ), // category order
			results.getString( results.getColumnIndex( "acctName" ) ), // name
			results.getString( results.getColumnIndex( "acctNotes" ) ), // note
			results.getInt( results.getColumnIndex( "sort" ) ), // sort
			results.getInt( results.getColumnIndex( "sect_order" ) ), // order number
			( results.getInt( results.getColumnIndex( "defaultAccount" ) ) == 1 ), // default account
			( results.getInt( results.getColumnIndex( "frozen" ) ) == 1 ), // frozen
			results.getInt( results.getColumnIndex( "hidden" ) ), // hidden status
			( results.getInt( results.getColumnIndex( "acctLocked" ) ) == 1 ), // locked
			results.getString( results.getColumnIndex( "lockedCode" ) ), // locked code
			( results.getInt( results.getColumnIndex( "atmEntry" ) ) == 1 ), // atm mode
			results.getInt( results.getColumnIndex( "bal_view" ) ), // balance mode
			( results.getInt( results.getColumnIndex( "checkField" ) ) == 1 ), // check field
			( results.getInt( results.getColumnIndex( "enableCategories" ) ) == 1 ), // category field
			( results.getInt( results.getColumnIndex( "hideNotes" ) ) == 1 ), // note visibility
			( results.getInt( results.getColumnIndex( "hide_cleared" ) ) == 1 ), // cleared visibility NYI
			( results.getInt( results.getColumnIndex( "runningBalance" ) ) == 1 ), // running balance
			( results.getInt( results.getColumnIndex( "showTransTime" ) ) == 1 ), // transaction time
			( results.getInt( results.getColumnIndex( "transDescMultiLine" ) ) == 1 ), // transDescMultiline
			( results.getInt( results.getColumnIndex( "useAutoComplete" ) ) == 1 ), // auto complete
			results.getString( results.getColumnIndex( "last_sync" ) ),// last sync
			results.getDouble( results.getColumnIndex( "balance0" ) ),// Available Balance
			results.getDouble( results.getColumnIndex( "balance1" ) ),// Cleared Balance
			results.getDouble( results.getColumnIndex( "balance2" ) ),// Final Balance
			results.getDouble( results.getColumnIndex( "balance3" ) )// Pending Balance
			) );

			results.moveToNext();
		}

		results.close();

		return acctItems;
	}

	public account_obj getAccount( long acctId ) {

		try {
			String accountQry = "SELECT " + QRY_SELECT + " FROM " + QRY_TABLE + " WHERE " + "acctId = ?" + " LIMIT 1";

			Date date = new Date();
			String now = date.getTime() + "";

			date.setHours( 23 );
			date.setMinutes( 59 );
			date.setSeconds( 59 );
			String today = date.getTime() + "";

			String[] acctQryArgs = { now, today, now, today, acctId + "" };

			Cursor results = this.cbDB.rawQuery( accountQry, acctQryArgs );

			account_obj acctItem = null;

			results.moveToFirst();
			while( results.isAfterLast() == false ) {

				acctItem = new account_obj( results.getPosition(),// item index
				this.getDBIndex( results, "acctId" ),// rowId
				results.getString( results.getColumnIndex( "acctCategory" ) ), // category
				( results.getString( results.getColumnIndex( "acctCategoryIcon" ) ) == "|-NOICON-|" ? "icon.2.png" : results.getString( results.getColumnIndex( "acctCategoryIcon" ) ) ), // category
				// icon
				results.getString( results.getColumnIndex( "acctCategoryColor" ) ), // category color
				results.getInt( results.getColumnIndex( "acctCatId" ) ), // category id
				results.getInt( results.getColumnIndex( "acctCatOrder" ) ), // category order
				results.getString( results.getColumnIndex( "acctName" ) ), // name
				results.getString( results.getColumnIndex( "acctNotes" ) ), // note
				results.getInt( results.getColumnIndex( "sort" ) ), // sort
				results.getInt( results.getColumnIndex( "sect_order" ) ), // order number
				( results.getInt( results.getColumnIndex( "defaultAccount" ) ) == 1 ), // default account
				( results.getInt( results.getColumnIndex( "frozen" ) ) == 1 ), // frozen
				results.getInt( results.getColumnIndex( "hidden" ) ), // hidden status
				( results.getInt( results.getColumnIndex( "acctLocked" ) ) == 1 ), // locked
				results.getString( results.getColumnIndex( "lockedCode" ) ), // locked code
				( results.getInt( results.getColumnIndex( "atmEntry" ) ) == 1 ), // atm mode
				results.getInt( results.getColumnIndex( "bal_view" ) ), // balance mode
				( results.getInt( results.getColumnIndex( "checkField" ) ) == 1 ), // check field
				( results.getInt( results.getColumnIndex( "enableCategories" ) ) == 1 ), // category field
				( results.getInt( results.getColumnIndex( "hideNotes" ) ) == 1 ), // note visibility
				( results.getInt( results.getColumnIndex( "hide_cleared" ) ) == 1 ), // cleared visibility NYI
				( results.getInt( results.getColumnIndex( "runningBalance" ) ) == 1 ), // running balance
				( results.getInt( results.getColumnIndex( "showTransTime" ) ) == 1 ), // transaction time
				( results.getInt( results.getColumnIndex( "transDescMultiLine" ) ) == 1 ), // transDescMultiline
				( results.getInt( results.getColumnIndex( "useAutoComplete" ) ) == 1 ), // auto complete
				results.getString( results.getColumnIndex( "last_sync" ) ),// last sync
				results.getDouble( results.getColumnIndex( "balance0" ) ),// Available Balance
				results.getDouble( results.getColumnIndex( "balance1" ) ),// Cleared Balance
				results.getDouble( results.getColumnIndex( "balance2" ) ),// Final Balance
				results.getDouble( results.getColumnIndex( "balance3" ) )// Pending Balance
				);

				results.moveToNext();
			}

			results.close();

			return acctItem;
		} catch( Exception ex ) {

			Log.e( "getAccount - Checkbook.java", ex.toString() );
			return null;
		}
	}

	public long getDefaultAccountId() {

		String accountQry = "SELECT acctId FROM " + QRY_TABLE + " WHERE defaultAccount = 1 LIMIT 1";

		String[] acctQryArgs = {};

		Cursor results = this.cbDB.rawQuery( accountQry, acctQryArgs );

		long acctId = -1;

		results.moveToFirst();
		while( results.isAfterLast() == false ) {

			acctId = this.getDBIndex( results, "acctId" );

			results.moveToNext();
		}

		results.close();
		
		return acctId;
	}

	public account_obj getDefaultAccountObj() {
		
		long acctId = this.getDefaultAccountId();

		if( acctId < 0 ) {

			return null;
		} else {

			return( new account_obj( 1, acctId, cbDB ) );
		}
	}

	public void setDefaultAcc( long acctId ) {

		account_obj temp = new account_obj( 1, acctId, cbDB );

		temp.defaultAccount = true;

		temp.updateAcctDb( cbDB );
	}

	public int getAcctCount() {

		String acctCountQry = "SELECT COUNT( acctId ) AS acctCount FROM accounts";

		Cursor results = this.cbDB.rawQuery( acctCountQry, new String[] {} );

		int acctCount = 0;

		results.moveToFirst();
		if( results.getCount() <= 0 ) {

			acctCount = 0;
		} else {

			acctCount = results.getInt( results.getColumnIndex( "acctCount" ) );
		}
		results.close();

		return acctCount;
	}

	/** Account Sorting Data **/
	public void setAcctSortOptions() {

		// Try to make number based when storing & transmitting
		accountSortOptions = new SortOptObj[4];
		accountSortOptions[0] = new SortOptObj( "Custom Category", "acctCatOrder, acctCategory COLLATE NOCASE, sect_order, acctName COLLATE NOCASE" );
		accountSortOptions[1] = new SortOptObj( "Custom Account", "sect_order, acctName COLLATE NOCASE, acctCatOrder, acctCategory COLLATE NOCASE" );
		accountSortOptions[2] = new SortOptObj( "Alphabetical Name", "acctName COLLATE NOCASE, acctCategory COLLATE NOCASE" );
		accountSortOptions[3] = new SortOptObj( "Alphabetical Category", "acctCategory COLLATE NOCASE, acctName COLLATE NOCASE" );
	}

	public String[] getAcctSortOptions() {

		String[] str = new String[accountSortOptions.length];

		for( int i = 0; i < accountSortOptions.length; i++ ) {

			str[i] = accountSortOptions[i].label;
		}

		return str;
	}

	public String getAcctSortOptionQry( int i ) {

		try {

			if( i > accountSortOptions.length ) {

				return accountSortOptions[0].data;
			} else {

				return accountSortOptions[i].data;
			}
		} catch( NullPointerException ex ) {

			return "acctCatOrder, acctCategory COLLATE NOCASE, sect_order, acctName COLLATE NOCASE";
		}
	}

	/** Account Category Data **/
	public void setAcctCategory() {

		//Cursor results = this.cbDB.query( "accountCategories", new String[] { "name", "icon", "color", "rowid", "catOrder" }, null, null, null, null, "catOrder, name" );
		Cursor results = this.cbDB.query( "accountCategories", new String[] { "name", "icon", "color", "rowid", "catOrder" }, null, null, null, null, "name" );

		acctCategories = new ArrayList<HashMap<String, String>>();
		int i = 0;

		while( results.moveToPosition( i ) && i < results.getCount() ) {

			HashMap<String, String> map = new HashMap<String, String>();

			map.put( "index", i + "" );
			map.put( "rowid", results.getString( results.getColumnIndex( "rowid" ) ) );
			map.put( "name", results.getString( results.getColumnIndex( "name" ) ) );
			map.put( "icon", "" + this.getResourceFromString( results.getString( results.getColumnIndex( "icon" ) ) ) );
			map.put( "color", results.getString( results.getColumnIndex( "color" ) ) );
			map.put( "catOrder", results.getString( results.getColumnIndex( "catOrder" ) ) );

			acctCategories.add( map );

			i++;
		}

		results.close();
	}

	public List<HashMap<String, String>> getAcctCategories() {

		return acctCategories;
	}

	public String getAcctCategoryName( int i ) {

		return acctCategories.get( i ).get( "name" );
	}

	public String getAcctCategoryIcon( int i ) {

		return acctCategories.get( i ).get( "icon" );
	}

	public String getAcctCategoryColor( int i ) {

		// TODO Used classes in webOS, need something different here

		return acctCategories.get( i ).get( "color" );
	}

	public int getAcctCategoryId( int i ) {

		int index = -1;

		try {

			index = Integer.parseInt( acctCategories.get( i ).get( "rowid" ) );
		} catch( NumberFormatException ex ) {

			index = -1;
		}

		return index;
	}

	public int getAcctCategoryOrder( int i ) {

		int index = -1;

		try {

			index = Integer.parseInt( acctCategories.get( i ).get( "catOrder" ) );
		} catch( NumberFormatException ex ) {

			index = -1;
		}

		return index;
	}

	/** Account Transaction Sort Data **/
	public void setAcctTrsnSorts() {

		Cursor results = this.cbDB.query( "acctTrsnSortOptn", new String[] { "sortGroup", "label", "sortId" }, null, null, null, null, "groupOrder ASC, label" );

		acctTrsnSorts = new SortOptObj[results.getCount()];
		int i = 0;

		while( results.moveToPosition( i ) && i < results.getCount() ) {

			acctTrsnSorts[i] = new SortOptObj( "[" + results.getString( results.getColumnIndex( "sortGroup" ) ) + "] " + results.getString( results.getColumnIndex( "label" ) ), results.getString( results.getColumnIndex( "sortId" ) ) );

			i++;
		}

		results.close();
	}

	public String[] getAcctTrsnSorts() {

		String[] str = new String[acctTrsnSorts.length];

		for( int i = 0; i < acctTrsnSorts.length; i++ ) {

			str[i] = acctTrsnSorts[i].label;
		}

		return str;
	}

	public String getAcctTrsnSortsQry( int i ) {

		String qry = "";

		try {

			Cursor results = this.cbDB.query( "acctTrsnSortOptn", new String[] { "qry" }, "sortId = ?", new String[] { acctTrsnSorts[i].data }, null, null, null );

			results.moveToFirst();

			qry = results.getString( results.getColumnIndex( "qry" ) );

			results.close();
		} catch( Exception ex ) {

			Log.e( "getAcctTrsnSortsQry", ex.toString() );
		}

		return qry;
	}

	public String getAcctTrsnSortsDesc( int i ) {

		String desc = "";

		try {

			Cursor results = this.cbDB.query( "acctTrsnSortOptn", new String[] { "desc" }, "sortId = ?", new String[] { acctTrsnSorts[i].data }, null, null, null );

			results.moveToFirst();

			desc = results.getString( results.getColumnIndex( "desc" ) );

			results.close();
		} catch( Exception ex ) {

			Log.e( "getAcctTrsnSortsDesc", ex.toString() );
		}

		return desc;
	}

	public int getAcctTrsnSortIndexViaId( int id ) {

		int itemIndex = 0;

		for( int i = 0; i < acctTrsnSorts.length; i++ ) {

			try {

				if( Integer.parseInt( acctTrsnSorts[i].data ) == id ) {

					itemIndex = i;
					break;
				}
			} catch( Exception ex ) {

				Log.e( "getAcctTrsnSortIndexViaId", ex.toString() );
			}
		}

		return itemIndex;
	}

	public String getAcctTrsnSortsQryViaId( int i ) {

		String qry = "";

		try {

			Cursor results = this.cbDB.query( "acctTrsnSortOptn", new String[] { "qry" }, "sortId = ?", new String[] { i + "" }, null, null, null );

			results.moveToFirst();

			qry = results.getString( results.getColumnIndex( "qry" ) );

			results.close();
		} catch( Exception ex ) {

			Log.e( "getAcctTrsnSortsQry", ex.toString() );
		}

		return qry;
	}

	/** Transaction Add/Edit/Delete systems **/

	/** Account Display Mode Data **/
	public void setAcctDisplayModes() {

		acctDisplayModes = new String[3];
		acctDisplayModes[0] = "Show Account";
		acctDisplayModes[1] = "Mask Account";
		acctDisplayModes[2] = "Hide Account";
	}

	public String[] getAcctDisplayModes() {

		return acctDisplayModes;
	}

	public String getAcctDisplayModeDesc( int i ) {

		switch( i ) {
			case 0:
				return "Account is visible.";
			case 1:
				return "Account is visible, but removed from total balance calculations.";
			case 2:
				return "Account is hidden and removed from total balance calculations. Account can still be accessed via Preferences.";
			default:
				return "";
		}
	}

	/** Account Balance View Data **/
	public void setAcctBalanceViews() {

		acctBalanceViews = new String[4];
		acctBalanceViews[0] = "Available";
		acctBalanceViews[1] = "Cleared";
		acctBalanceViews[2] = "Pending";
		acctBalanceViews[3] = "Final";
	}

	public String[] getAcctBalanceViews() {

		return acctBalanceViews;
	}

	public String getAcctBalanceViewDesc( int i ) {

		switch( i ) {
			case 0:
				return "Includes all transactions up to current date/time.";
			case 1:
				return "Includes only cleared transactions up to current date/time.";
			case 2:
				return "Includes only pending transactions.";
			case 3:
				return "Includes all transactions.";
			default:
				return "";
		}
	}

	/** Object for simpler sorting data array **/
	protected class SortOptObj {

		String label;
		String data;// dbId or query depending on the sort source

		SortOptObj( String in1, String in2 ) {

			this.label = in1;
			this.data = in2;
		}
	}

	/** Image Resources **/
	protected void buildImageMap() {

		systemIcons = new HashMap<String, String>();

		systemIcons.put( "calendar.png", R.drawable.calendar + "" );
		systemIcons.put( "cash_1.png", R.drawable.cash_1 + "" );
		systemIcons.put( "cash_2.png", R.drawable.cash_2 + "" );
		systemIcons.put( "cash_3.png", R.drawable.cash_3 + "" );
		systemIcons.put( "cash_4.png", R.drawable.cash_4 + "" );
		systemIcons.put( "cash_5.png", R.drawable.cash_5 + "" );
		systemIcons.put( "checkbook_1.png", R.drawable.checkbook_1 + "" );
		systemIcons.put( "checkbook_2.png", R.drawable.checkbook_2 + "" );
		systemIcons.put( "coins_1.png", R.drawable.coins_1 + "" );
		systemIcons.put( "coins_2.png", R.drawable.coins_2 + "" );
		systemIcons.put( "coins_3.png", R.drawable.coins_3 + "" );
		systemIcons.put( "coins_4.png", R.drawable.coins_4 + "" );
		systemIcons.put( "credit_card_1.png", R.drawable.credit_card_1 + "" );
		systemIcons.put( "credit_card_2.png", R.drawable.credit_card_2 + "" );
		systemIcons.put( "credit_card_3.png", R.drawable.credit_card_3 + "" );
		systemIcons.put( "dollar_sign_1.png", R.drawable.dollar_sign_1 + "" );
		systemIcons.put( "dollar_sign_2.png", R.drawable.dollar_sign_2 + "" );
		systemIcons.put( "dollar_sign_3.png", R.drawable.dollar_sign_3 + "" );
		systemIcons.put( "echeck.png", R.drawable.echeck + "" );
		systemIcons.put( "future_transfer_1.png", R.drawable.future_transfer + "" );
		systemIcons.put( "icon.png", R.drawable.icon + "" );
		systemIcons.put( "jewel_1.png", R.drawable.jewel_1 + "" );
		systemIcons.put( "jewel_2.png", R.drawable.jewel_2 + "" );
		systemIcons.put( "logo.png", R.drawable.logo + "" );
		systemIcons.put( "money_bag_1.png", R.drawable.money_bag_1 + "" );
		systemIcons.put( "money_bag_2.png", R.drawable.money_bag_2 + "" );
		systemIcons.put( "money_bag_3.png", R.drawable.money_bag_3 + "" );
		systemIcons.put( "money_bag_4.png", R.drawable.money_bag_4 + "" );
		systemIcons.put( "padlock_1.png", R.drawable.padlock_1 + "" );
		systemIcons.put( "padlock_2.png", R.drawable.padlock_2 + "" );
		systemIcons.put( "repeat.png", R.drawable.repeat + "" );
		systemIcons.put( "safe_1.png", R.drawable.safe_1 + "" );
		systemIcons.put( "safe_2.png", R.drawable.safe_2 + "" );
		systemIcons.put( "transfer_1.png", R.drawable.transfer_1 + "" );
		systemIcons.put( "transfer_2.png", R.drawable.transfer_2 + "" );
		systemIcons.put( "transfer_3.png", R.drawable.transfer_3 + "" );
		systemIcons.put( "transfer_4.png", R.drawable.transfer_4 + "" );
		systemIcons.put( "logo.png", R.drawable.logo + "" );
	}

	protected HashMap<String, String> getImageMap() {

		return systemIcons;
	}

	protected int getResourceFromString( String icon ) {

		try {

			return Integer.parseInt( systemIcons.get( icon ) );
		} catch( Exception ex ) {

			return R.drawable.logo;
		}
	}

	public String stringFormatter( String in ) {

		return Html.fromHtml( in ).toString();
	}

	public String cleanString( String dirtyString ) {

		if( dirtyString.length() <= 0 ) {

			return "";
		}

		String[] dirtyItem = new String[] { "&", "\"", "<", ">", "`", "\n" };
		String[] cleanItem = new String[] { "&amp;", "&quot;", "$lt;", "&gt;", "'", " " };

		for( int i = 0; i < dirtyItem.length; i++ ) {

			dirtyString = dirtyString.replaceAll( dirtyItem[i], cleanItem[i] );
		}

		return( dirtyString );
	}

	public String dirtyString( String cleanString ) {

		if( cleanString.length() <= 0 ) {

			return "";
		}

		String[] dirtyItem = new String[] { "&", "\"", "<", ">", "`", "\n" };
		String[] cleanItem = new String[] { "&amp;", "&quot;", "$lt;", "&gt;", "'", " " };

		for( int i = 0; i < dirtyItem.length; i++ ) {

			cleanString = cleanString.replaceAll( cleanItem[i], dirtyItem[i] );
		}

		return( cleanString );
	}

	/** Security **/
	protected String encrypt( String cleartext ) {

		try {

			return encrypt( this.getSpike(), cleartext );
		} catch( Exception ex ) {

			return "";
		}
	}

	private static String encrypt( String seed, String cleartext ) throws Exception {

		byte[] rawKey = getRawKey( seed.getBytes() );
		byte[] result = encrypt( rawKey, cleartext.getBytes() );

		return toHex( result );
	}

	private static byte[] encrypt( byte[] raw, byte[] clear ) throws Exception {

		SecretKeySpec skeySpec = new SecretKeySpec( raw, "AES" );
		Cipher cipher = Cipher.getInstance( "AES" );
		cipher.init( Cipher.ENCRYPT_MODE, skeySpec );
		byte[] encrypted = cipher.doFinal( clear );

		return encrypted;
	}

	protected String decrypt( String cleartext ) {

		try {

			return decrypt( this.getSpike(), cleartext );
		} catch( Exception ex ) {

			return "";
		}
	}

	private static String decrypt( String seed, String encrypted ) throws Exception {

		byte[] rawKey = getRawKey( seed.getBytes() );
		byte[] enc = toByte( encrypted );
		byte[] result = decrypt( rawKey, enc );

		return new String( result );
	}

	private static byte[] decrypt( byte[] raw, byte[] encrypted ) throws Exception {

		SecretKeySpec skeySpec = new SecretKeySpec( raw, "AES" );
		Cipher cipher = Cipher.getInstance( "AES" );
		cipher.init( Cipher.DECRYPT_MODE, skeySpec );
		byte[] decrypted = cipher.doFinal( encrypted );

		return decrypted;
	}

	private String getSpike() {

		Cursor results = this.cbDB.rawQuery( "SELECT spike FROM prefs LIMIT 1", new String[] {} );
		results.moveToFirst();
		String spike = results.getString( results.getColumnIndex( "spike" ) );
		results.close();

		return spike;
	}

	private static byte[] getRawKey( byte[] seed ) throws Exception {

		KeyGenerator kgen = KeyGenerator.getInstance( "AES" );
		SecureRandom sr = SecureRandom.getInstance( "SHA1PRNG" );
		sr.setSeed( seed );
		kgen.init( 128, sr ); // 192 and 256 bits may not be available
		SecretKey skey = kgen.generateKey();
		byte[] raw = skey.getEncoded();
		return raw;
	}

	private static byte[] toByte( String hexString ) {

		int len = hexString.length() / 2;
		byte[] result = new byte[len];
		for( int i = 0; i < len; i++ )
			result[i] = Integer.valueOf( hexString.substring( 2 * i, 2 * i + 2 ), 16 ).byteValue();
		return result;
	}

	private static String toHex( byte[] buf ) {

		if( buf == null ) return "";
		StringBuffer result = new StringBuffer( 2 * buf.length );
		for( int i = 0; i < buf.length; i++ ) {
			appendHex( result, buf[i] );
		}
		return result.toString();
	}

	private final static String HEX = "0123456789ABCDEF";

	private static void appendHex( StringBuffer sb, byte b ) {

		sb.append( HEX.charAt( ( b >> 4 ) & 0x0f ) ).append( HEX.charAt( b & 0x0f ) );
	}

	/** Menu Control Systems **/
	public static final int MENU_PREFS = Menu.FIRST + 1;
	public static final int MENU_IMPORT = MENU_PREFS + 1;
	public static final int MENU_EXPORT = MENU_IMPORT + 1;
	public static final int MENU_BUDGET = MENU_EXPORT + 1;
	public static final int MENU_REPORTS = MENU_BUDGET + 1;
	public static final int MENU_ABOUT = MENU_REPORTS + 1;
	public static final int MENU_HELP = MENU_ABOUT + 1;

	public static final int GROUP_PREFS = MENU_HELP + 100;
	public static final int GROUP_FINANCE = GROUP_PREFS + 1;
	public static final int GROUP_HELP = GROUP_FINANCE + 1;

	public void populateOptionsMenu( Menu menu ) {

		this.populateOptionsMenu( menu, 0 );
	}

	public void populateOptionsMenu( Menu menu, int menuStatus ) {

		SubMenu prefAcct = menu.addSubMenu( GROUP_PREFS, Menu.NONE, Menu.NONE, "Preferences" );
		prefAcct.setIcon( android.R.drawable.ic_menu_preferences );
		prefAcct.add( 1, MENU_PREFS, Menu.NONE, "Preferences" );
		prefAcct.add( 1, MENU_IMPORT, Menu.NONE, "Import" );
		prefAcct.add( 1, MENU_EXPORT, Menu.NONE, "Export" );

		SubMenu financeInfo = menu.addSubMenu( GROUP_FINANCE, Menu.NONE, Menu.NONE, "Finance Information" );
		financeInfo.setIcon( android.R.drawable.ic_menu_search );
		financeInfo.add( 2, MENU_BUDGET, Menu.NONE, "Budget" );
		financeInfo.add( 2, MENU_REPORTS, Menu.NONE, "Reports" );

		MenuItem item_about = menu.add( GROUP_HELP, MENU_ABOUT, Menu.NONE, "About" );
		item_about.setIcon( android.R.drawable.ic_menu_info_details );

		MenuItem item_help = menu.add( GROUP_HELP, MENU_HELP, Menu.NONE, "Help" );
		item_help.setIcon( android.R.drawable.ic_menu_help );

		// menuStatus defines which view. IE 0 means all enabled, 1 means preference sets (preference, import, export) are disabled
		// TODO update when all menu items are created

		menu.setGroupVisible( GROUP_FINANCE, false );

		if( menuStatus == 0 ) {

			menu.setGroupEnabled( GROUP_PREFS, true );
			menu.setGroupEnabled( GROUP_FINANCE, false );
			menu.setGroupEnabled( GROUP_HELP, true );
		} else if( menuStatus == 1 ) {

			menu.setGroupEnabled( GROUP_PREFS, false );
			menu.setGroupEnabled( GROUP_FINANCE, false );
			menu.setGroupEnabled( GROUP_HELP, true );
		} else {

			menu.setGroupEnabled( GROUP_PREFS, false );
			menu.setGroupEnabled( GROUP_FINANCE, false );
			menu.setGroupEnabled( GROUP_HELP, false );
		}
	}

	public boolean applyMenuChoice( MenuItem item, Context ctx ) {

		switch( item.getItemId() ) {
			case MENU_PREFS:
				Intent intent_prefs = new Intent( ctx, preferences.class );
				ctx.startActivity( intent_prefs );
				return true;
			case MENU_IMPORT:
				Intent intent_importSheet = new Intent( ctx, importData.class );
				ctx.startActivity( intent_importSheet );
				return true;
			case MENU_EXPORT:
				Intent intent_exportData = new Intent( ctx, exportData.class );
				ctx.startActivity( intent_exportData );
				return true;
			case MENU_BUDGET:
				Toast.makeText( getApplicationContext(), "GOTO Budget", Toast.LENGTH_LONG ).show();// TODO budget
				return true;
			case MENU_REPORTS:
				Toast.makeText( getApplicationContext(), "GOTO Reports", Toast.LENGTH_LONG ).show();// TODO reports
				return true;
			case MENU_ABOUT:
				AlertDialog alertDialog = new AlertDialog.Builder( ctx ).create();
				alertDialog.setTitle( "GlitchTech Checkbook" );
				alertDialog.setIcon( R.drawable.icon );
				alertDialog.setMessage( "Developed by\nGlitchTech Science\n\nCopywrite 2010 and forward.\nAll rights reserved.\n\nhttp://glitchtechscience.com/" );

				alertDialog.setButton( "OK", new DialogInterface.OnClickListener() {

					public void onClick( DialogInterface dialog, int which ) {

						dialog.cancel();
					}
				} );
				alertDialog.show();

				return true;
			case MENU_HELP:
				Intent intent_help = new Intent( ctx, help.class );
				ctx.startActivity( intent_help );
				return true;
		}

		return false;
	}

	/** Utility Method **/
	public static Drawable resizeImage( Context ctx, int resId, int w, int h ) {

		// load the origial Bitmap
		Bitmap BitmapOrg = BitmapFactory.decodeResource( ctx.getResources(), resId );

		int width = BitmapOrg.getWidth();
		int height = BitmapOrg.getHeight();
		int newWidth = w;
		int newHeight = h;

		// calculate the scale
		float scaleWidth = ( ( float )newWidth ) / width;
		float scaleHeight = ( ( float )newHeight ) / height;

		// create a matrix for the manipulation
		Matrix matrix = new Matrix();
		// resize the Bitmap
		matrix.postScale( scaleWidth, scaleHeight );
		// if you want to rotate the Bitmap
		// matrix.postRotate(45);

		// recreate the new Bitmap
		Bitmap resizedBitmap = Bitmap.createBitmap( BitmapOrg, 0, 0, width, height, matrix, true );

		// make a Drawable from Bitmap to allow to set the Bitmap
		// to the ImageView, ImageButton or what ever
		return new BitmapDrawable( resizedBitmap );
	}

	public void setAccountBalanceColor( TextView tv, double amt ) {

		tv.setText( formatAccountBalance( amt ) );
		if( amt < 0 ) {

			tv.setTextColor( NEG_TRSN );
		} else {

			tv.setTextColor( POS_TRSN );
		}
	}

	public void setAccountBalanceColorLight( TextView tv, double amt ) {

		tv.setText( formatAccountBalance( amt ) );
		if( amt < 0 ) {

			tv.setTextColor( NEG_TRSN_LIGHT );
		} else {

			tv.setTextColor( POS_TRSN_LIGHT );
		}
	}

	public String formatAccountBalance( double amt ) {

		java.text.NumberFormat nf = java.text.NumberFormat.getCurrencyInstance();

		return nf.format( amt );
	}

	public long getDBIndex( Cursor c, String col ) {

		try {

			int colIndex = c.getColumnIndex( col );

			if( c.getString( colIndex ).length() > 0 ) {

				return c.getLong( colIndex );
			} else {

				return -1;
			}
		} catch( Exception ex ) {

			return -1;
		}
	}
}