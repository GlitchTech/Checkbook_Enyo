package com.glitchtechscience.gtcheckbook;

import java.util.Date;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

public class account_obj {

	int index;

	long rowId;

	String acctCat;
	String acctCatIcon;
	String acctCatColor;
	int acctCatId;
	int acctCatOrder;

	String name;
	String description;

	String fontColor;

	int sort;
	int sectOrder;
	boolean defaultAccount;

	boolean frozen;
	int hidden;

	boolean locked;
	String lockedCode;

	boolean atmEntry;
	int balView;
	boolean checkField;
	boolean enableCategories;
	boolean hideNotes;
	boolean hideCleared;
	boolean runningBalance;
	boolean showTransTime;
	boolean transDescMultiLine;
	boolean useAutoComplete;

	double balance0;
	double balance1;
	double balance2;
	double balance3;
	double balance4;

	String lastSync;

	account_obj( int in_index, long acctId, SQLiteDatabase db ) {

		this.index = in_index;

		this.rowId = acctId;

		// Query DB for rest of the information on this account
		reloadAcct( db );
	}

	account_obj() {

		account_obj_handler( -1, -1, "", "", "", -1, -1, "", "", 0, -1, false, false, 0, false, "", true, 0, false, true, false, false, true, true, false, true, "", 0.0, 0.0, 0.0, 0.0 );
	}

	account_obj( int in_index, long in_rowId, String in_acctCat, String in_acctCatIcon, String in_acctCatColor, int in_acctCatId, int in_acctCatOrder, String in_name, String in_description, int in_sort, int in_sectOrder, boolean in_defaultAccount, boolean in_frozen, int in_hidden, boolean in_locked, String in_lockedCode, boolean in_atmEntry, int in_balView, boolean in_checkField, boolean in_enableCategories, boolean in_hideNotes, boolean in_hideCleared, boolean in_runningBalance, boolean in_showTransTime, boolean in_transDescMultiline, boolean in_useAutoComplete, String in_lastSync, double bal0, double bal1, double bal2, double bal3 ) {

		account_obj_handler( in_index, in_rowId, in_acctCat, in_acctCatIcon, in_acctCatColor, in_acctCatId, in_acctCatOrder, in_name, in_description, in_sort, in_sectOrder, in_defaultAccount, in_frozen, in_hidden, in_locked, in_lockedCode, in_atmEntry, in_balView, in_checkField, in_enableCategories, in_hideNotes, in_hideCleared, in_runningBalance, in_showTransTime, in_transDescMultiline, in_useAutoComplete, in_lastSync, bal0, bal1, bal2, bal3 );
	}

	public void account_obj_handler( int in_index, long in_rowId, String in_acctCat, String in_acctCatIcon, String in_acctCatColor, int in_acctCatId, int in_acctCatOrder, String in_name, String in_description, int in_sort, int in_sectOrder, boolean in_defaultAccount, boolean in_frozen, int in_hidden, boolean in_locked, String in_lockedCode, boolean in_atmEntry, int in_balView, boolean in_checkField, boolean in_enableCategories, boolean in_hideNotes, boolean in_hideCleared, boolean in_runningBalance, boolean in_showTransTime, boolean in_transDescMultiline, boolean in_useAutoComplete, String in_lastSync, double bal0, double bal1, double bal2, double bal3 ) {

		this.index = in_index;

		this.rowId = in_rowId;

		this.acctCat = in_acctCat;
		this.acctCatIcon = in_acctCatIcon;
		this.acctCatColor = in_acctCatColor;
		this.acctCatId = in_acctCatId;
		this.acctCatOrder = in_acctCatOrder;

		this.name = in_name;
		this.description = in_description;

		this.sort = in_sort;
		this.sectOrder = in_sectOrder;
		this.defaultAccount = in_defaultAccount;
		this.frozen = in_frozen;
		this.hidden = in_hidden;

		this.locked = in_locked;
		this.lockedCode = in_lockedCode;

		this.atmEntry = in_atmEntry;
		this.balView = in_balView;
		this.checkField = in_checkField;
		this.enableCategories = in_enableCategories;
		this.hideNotes = in_hideNotes;
		this.hideCleared = in_hideCleared;
		this.runningBalance = in_runningBalance;
		this.showTransTime = in_showTransTime;
		this.transDescMultiLine = in_transDescMultiline;
		this.useAutoComplete = in_useAutoComplete;

		this.lastSync = in_lastSync;

		this.balance0 = bal0;
		this.balance1 = bal1;
		this.balance2 = bal2;
		this.balance3 = bal3;

		switch( this.balView ) {
			case 0:
				this.balance4 = this.balance0;
				break;
			case 1:
				this.balance4 = this.balance1;
				break;
			case 2:
				this.balance4 = this.balance2;
				break;
			case 3:
				this.balance4 = this.balance3;
				break;
			default:
				this.balance4 = 0;
		}
	}

	private ContentValues buildDBObject() {

		// Occurs before each save
		if( !this.locked || this.lockedCode.equalsIgnoreCase( "" ) || this.lockedCode.length() <= 0 ) {
			// No code || Setting off

			this.locked = false;
			this.lockedCode = "";

			this.locked = false;
			this.lockedCode = "";
		} else {
			// Set to on, code valid
			// Nothing to do here, code is already encrypted
		}

		ContentValues currAcct = new ContentValues();
		// currAcct.put( "acctId", this.rowId ) // Do not include this row, for where clause only
		currAcct.put( "acctName", this.name );
		currAcct.put( "acctNotes", this.description );
		currAcct.put( "acctCategory", this.acctCat );
		currAcct.put( "sort", this.sort );
		currAcct.put( "defaultAccount", this.defaultAccount );
		currAcct.put( "frozen", this.frozen );
		currAcct.put( "hidden", this.hidden );
		currAcct.put( "acctLocked", this.locked );
		currAcct.put( "lockedCode", this.lockedCode );
		currAcct.put( "transDescMultiLine", this.transDescMultiLine );
		currAcct.put( "showTransTime", this.showTransTime );
		currAcct.put( "useAutoComplete", this.useAutoComplete );
		currAcct.put( "atmEntry", this.atmEntry );
		currAcct.put( "bal_view", this.balView );
		currAcct.put( "runningBalance", this.runningBalance );
		currAcct.put( "checkField", this.checkField );
		currAcct.put( "hideNotes", this.hideNotes );
		currAcct.put( "enableCategories", this.enableCategories );
		currAcct.put( "sect_order", this.sectOrder );
		currAcct.put( "hide_cleared", this.hideCleared );
		currAcct.put( "last_sync", this.lastSync );

		return currAcct;
	}

	public long createAcctDb( SQLiteDatabase db ) {

		this.sectOrder = 9000;// If someone has more accounts then this, then WTF!?

		ContentValues currAcct = this.buildDBObject();

		this.rowId = db.insert( "accounts", null, currAcct );
		currAcct.clear();

		return this.rowId;
	}

	public long updateAcctDb( SQLiteDatabase db ) {

		if( this.index < 0 || this.rowId < 0 ) {
			// Account is new to the system

			return createAcctDb( db );
		}

		ContentValues currAcct = this.buildDBObject();

		String[] whereArgs = { this.rowId + "" };
		long temp = db.update( "accounts", currAcct, "acctId=?", whereArgs );
		currAcct.clear();

		return temp;// Returns rows affected
	}

	public int deleteAcctDb( SQLiteDatabase db ) {

		String[] whereArgs = { this.rowId + "" };

		// Delete all transactions in the account
		db.delete( "expenses", "account = ?", whereArgs );

		// Change transfers linked to the account into expenses or income
		ContentValues la = new ContentValues();
		la.put( "linkedAccount", "" );
		la.put( "linkedRecord", "" );
		db.update( "expenses", la, "linkedAccount = ?", whereArgs );

		// Delete all repeats that are linked to transactions in the account
		db.delete( "repeats", "acctId = ? OR linkedAcctId = ?", new String[] { this.rowId + "", this.rowId + "" } );

		// Delete account
		return db.delete( "accounts", "acctId = ?", whereArgs );
	}

	public void reloadAcct( SQLiteDatabase db ) {

		String accountQry = "SELECT *," +
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
		" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId ), 0 ) AS balance2" +
		// End bal_view

		" FROM accounts " +

		" WHERE acctId = ?" +

		// Limit data
		" LIMIT 1";

		Date date = new Date();
		String now = date.getTime() + "";

		date.setHours( 23 );
		date.setMinutes( 59 );
		date.setSeconds( 59 );
		String today = date.getTime() + "";

		String[] acctQryArgs = { now, today, now, today, "" + rowId };

		Cursor results = db.rawQuery( accountQry, acctQryArgs );

		results.moveToFirst();
		while( results.isAfterLast() == false ) {

			this.account_obj_handler( results.getPosition(),// item index
			results.getInt( results.getColumnIndex( "acctId" ) ),// rowId
			results.getString( results.getColumnIndex( "acctCategory" ) ), // category
			( results.getString( results.getColumnIndex( "acctCategoryIcon" ) ) == "|-NOICON-|" ? "icon.2.png" : results.getString( results.getColumnIndex( "acctCategoryIcon" ) ) ), // category icon
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

		return;
	}

	public void updateBalance( SQLiteDatabase db ) {

		String accountQry = "SELECT bal_view," +

		// Start bal_view = 0 -- Available Balance
		" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId" + //
		" AND (" + // 
		" ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 )" + //
		" ) ), 0 ) AS balance0," +
		// End bal_view

		// Start bal_view = 1 -- Cleared Balance
		" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId" + //
		" AND (" + //
		" ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 1 ) OR ( CAST( expenses.date AS INTEGER ) <= ? AND showTransTime = 0 )" + //
		" ) AND expenses.cleared = 1 ), 0 ) AS balance1," +
		// End bal_view

		// Start bal_view = 3 -- Pending Balance
		" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId AND expenses.cleared = 0 ), 0 ) AS balance3," +
		// End bal_view

		// Start bal_view = 2 -- Final Balance
		" IFNULL( ( SELECT SUM( expenses.amount ) FROM expenses WHERE expenses.account = accounts.acctId ), 0 ) AS balance2" +
		// End bal_view

		" FROM accounts " + " WHERE acctId = ? LIMIT 1";

		Date date = new Date();
		String now = date.getTime() + "";

		date.setHours( 23 );
		date.setMinutes( 59 );
		date.setSeconds( 59 );
		String today = date.getTime() + "";

		String[] acctQryArgs = { now, today, now, today, "" + this.rowId };

		Cursor results = db.rawQuery( accountQry, acctQryArgs );

		results.moveToFirst();
		while( results.isAfterLast() == false ) {

			this.balance0 = results.getDouble( results.getColumnIndex( "balance0" ) );
			this.balance1 = results.getDouble( results.getColumnIndex( "balance1" ) );
			this.balance2 = results.getDouble( results.getColumnIndex( "balance2" ) );
			this.balance3 = results.getDouble( results.getColumnIndex( "balance3" ) );

			switch( results.getInt( results.getColumnIndex( "bal_view" ) ) ) {
				case 0:
					this.balance4 = this.balance0;
					break;
				case 1:
					this.balance4 = this.balance1;
					break;
				case 2:
					this.balance4 = this.balance2;
					break;
				case 3:
					this.balance4 = this.balance3;
					break;
				default:
					this.balance4 = 0;
			}

			results.moveToNext();
		}
		results.close();

		return;
	}
}