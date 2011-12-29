package com.glitchtechscience.gtcheckbook;

import java.util.Date;

import android.content.ContentValues;
import android.content.Context;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class GTSCBDBHelper extends SQLiteOpenHelper {

	private static final String TAG = "GTSCBDBHelper";

	private static final int DATABASE_VERSION = 16;
	private static final String DATABASE_NAME = "glitchtechsciencecheckbook";

	public GTSCBDBHelper( Context context ) {

		super( context, DATABASE_NAME, null, DATABASE_VERSION );

	}

	@Override
	public void onCreate( SQLiteDatabase db ) {

		Log.w( TAG, "Creating database." );

		// Make sure nothing exists
		db.execSQL( "DROP TABLE IF EXISTS accounts;" );
		db.execSQL( "DROP TABLE IF EXISTS accountCategories;" );
		db.execSQL( "DROP TABLE IF EXISTS expenses;" );
		db.execSQL( "DROP TABLE IF EXISTS expenseCategories;" );
		db.execSQL( "DROP TABLE IF EXISTS repeats;" );
		db.execSQL( "DROP TABLE IF EXISTS budget;" );
		db.execSQL( "DROP TABLE IF EXISTS prefs;" );

		// Checkbook Tables
		db.execSQL( "CREATE TABLE accounts( acctId INTEGER UNIQUE PRIMARY KEY ASC, acctName TEXT, acctNotes TEXT, acctCategory TEXT, sort TEXT, defaultAccount INTEGER NOT NULL DEFAULT 0, frozen INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0, acctLocked INTEGER NOT NULL DEFAULT 0, lockedCode TEXT, transDescMultiLine INTEGER NOT NULL DEFAULT 1, showTransTime INTEGER NOT NULL DEFAULT 1, useAutoComplete INTEGER NOT NULL DEFAULT 1, atmEntry INTEGER NOT NULL DEFAULT 0, bal_view INTEGER NOT NULL DEFAULT 0, runningBalance INTEGER NOT NULL DEFAULT 0, checkField INTEGER NOT NULL DEFAULT 0, hideNotes INTEGER NOT NULL DEFAULT 0, enableCategories INTEGER NOT NULL DEFAULT 1, sect_order INTEGER NOT NULL DEFAULT 0, hide_cleared INTEGER NOT NULL DEFAULT 0, last_sync TEXT);" );
		db.execSQL( "CREATE TABLE accountCategories( name TEXT, catOrder INTEGER NOT NULL DEFAULT 0, icon TEXT , color TEXT NOT NULL DEFAULT 'green', view_status INTEGER NOT NULL DEFAULT 1, last_sync TEXT);" );

		db.execSQL( "CREATE TABLE expenses( itemId INTEGER UNIQUE PRIMARY KEY, desc TEXT, amount REAL, note TEXT, date TEXT, account INTEGER, category TEXT, linkedRecord INTEGER, linkedAccount INTEGER, cleared INTEGER NOT NULL DEFAULT 0, repeatId INTEGER, checkNum TEXT , last_sync TEXT);" );
		db.execSQL( "CREATE TABLE expenseCategories( catId INTEGER PRIMARY KEY ASC, genCat TEXT, specCat TEXT , last_sync TEXT);" );

		db.execSQL( "CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, eventId TEXT, endTimestamp TEXT, endValidity TEXT, externalId TEXT, originalStartTimestamp TEXT, parentId TEXT, rrule TEXT, rruleTZ TEXT, desc TEXT, amount REAL, cleared INTEGER NOT NULL DEFAULT 0, note TEXT, date TEXT, category TEXT, account INTEGER, linkedAccount INTEGER );" );

		db.execSQL( "CREATE TABLE budgets( budgetId INTEGER PRIMARY KEY ASC, category TEXT, spending_limit REAL, span INTEGER, rollOver INTEGER, budgetOrder INTEGER );" );

		db.execSQL( "CREATE TABLE prefs( dbVer INTEGER, useCode INTEGER, code TEXT, saveGSheetsData INTEGER, gSheetUser TEXT, gSheetPass TEXT, repeatUpdate TEXT , updateCheck TEXT, synergyAcctId TEXT, synergyCalId TEXT, updateCheckNotification INTEGER NOT NULL DEFAULT 1, dispColor INTEGER NOT NULL DEFAULT 0, bsSave INTEGER NOT NULL DEFAULT 1, custom_sort INTEGER NOT NULL DEFAULT 0, gts_name TEXT, gts_pass TEXT, gts_last_connection TEXT, spike TEXT);" );

		// Initial Data
		try {

			db.beginTransaction();

			// Set initial preferences
			ContentValues prefSet = new ContentValues();
			prefSet.put( "dbVer", 14 );
			prefSet.put( "useCode", 0 );
			prefSet.put( "saveGSheetsData", 0 );

			// Generate Spike
			String[] chars = ( "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz" + ( new Date() ).getTime() ).split( "" );

			int spike_length = ( int ) Math.floor( Math.random() * chars.length );

			String spike = "";
			for( int i = 0; i < spike_length; i++ ) {

				spike += chars[( int ) Math.floor( Math.random() * chars.length )];
			}

			prefSet.put( "spike", spike );

			db.insert( "prefs", null, prefSet );
			prefSet.clear();

			// Add basic account categories
			ContentValues acctCats = new ContentValues();

			acctCats.put( "name", "Checking" );
			acctCats.put( "catOrder", 1 );
			acctCats.put( "icon", "checkbook_1.png" );
			db.insert( "accountCategories", null, acctCats );

			acctCats.put( "name", "Savings" );
			acctCats.put( "catOrder", 2 );
			acctCats.put( "icon", "safe_1.png" );
			db.insert( "accountCategories", null, acctCats );

			acctCats.put( "name", "Credit Card" );
			acctCats.put( "catOrder", 3 );
			acctCats.put( "icon", "credit_card_3.png" );
			db.insert( "accountCategories", null, acctCats );

			acctCats.put( "name", "Other" );
			acctCats.put( "catOrder", 4 );
			acctCats.put( "icon", "coins_3.png" );
			db.insert( "accountCategories", null, acctCats );

			acctCats.clear();

			// Add basic expense categories
			ContentValues trsnCats = new ContentValues();

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Auto Insurance" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Auto Payment" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Gas & Fuel" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Parking" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Public Transportation" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Service & Parts" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Auto & Transport" );
			trsnCats.put( "specCat", "Car Wash" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Bills & Utilities" );
			trsnCats.put( "specCat", "Home Phone" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Bills & Utilities" );
			trsnCats.put( "specCat", "Internet" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Bills & Utilities" );
			trsnCats.put( "specCat", "Mobile Phone" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Bills & Utilities" );
			trsnCats.put( "specCat", "Television" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Bills & Utilities" );
			trsnCats.put( "specCat", "Utilities" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Business Services" );
			trsnCats.put( "specCat", "Advertising" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Business Services" );
			trsnCats.put( "specCat", "Legal" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Business Services" );
			trsnCats.put( "specCat", "Office Supplies" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Business Services" );
			trsnCats.put( "specCat", "Printing" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Business Services" );
			trsnCats.put( "specCat", "Shipping" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Education" );
			trsnCats.put( "specCat", "Books & Supplies" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Education" );
			trsnCats.put( "specCat", "Student Loan" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Education" );
			trsnCats.put( "specCat", "Tuition" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Entertainment" );
			trsnCats.put( "specCat", "Amusement" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Entertainment" );
			trsnCats.put( "specCat", "Arts" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Entertainment" );
			trsnCats.put( "specCat", "Movies & DVDs" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Entertainment" );
			trsnCats.put( "specCat", "Music" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Entertainment" );
			trsnCats.put( "specCat", "Newspapers & Magazines" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Fees & Charges" );
			trsnCats.put( "specCat", "ATM Fee" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Fees & Charges" );
			trsnCats.put( "specCat", "Bank Fee" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Fees & Charges" );
			trsnCats.put( "specCat", "Finance Charge" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Fees & Charges" );
			trsnCats.put( "specCat", "Late Fee" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Fees & Charges" );
			trsnCats.put( "specCat", "Service Fee" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Financial" );
			trsnCats.put( "specCat", "Financial Advisor" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Financial" );
			trsnCats.put( "specCat", "Life Insurance" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Food & Dining" );
			trsnCats.put( "specCat", "Alcohol & Bars" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Food & Dining" );
			trsnCats.put( "specCat", "Coffee Shops" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Food & Dining" );
			trsnCats.put( "specCat", "Fast Food" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Food & Dining" );
			trsnCats.put( "specCat", "Groceries" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Food & Dining" );
			trsnCats.put( "specCat", "Restaurants" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Gifts & Donations" );
			trsnCats.put( "specCat", "Charity" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Gifts & Donations" );
			trsnCats.put( "specCat", "Gift" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Dentist" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Doctor" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Eyecare" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Gym" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Health Insurance" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Pharmacy" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Health & Fitness" );
			trsnCats.put( "specCat", "Sports" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Furnishings" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Home Improvement" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Home Insurance" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Home Services" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Home Supplies" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Lawn & Garden" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Home" );
			trsnCats.put( "specCat", "Mortgage & Rent" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Income" );
			trsnCats.put( "specCat", "Bonus" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Income" );
			trsnCats.put( "specCat", "Paycheck" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Income" );
			trsnCats.put( "specCat", "Reimbursement" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Income" );
			trsnCats.put( "specCat", "Rental Income" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Income" );
			trsnCats.put( "specCat", "Returned Purchase" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Kids" );
			trsnCats.put( "specCat", "Allowance" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Kids" );
			trsnCats.put( "specCat", "Baby Supplies" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Kids" );
			trsnCats.put( "specCat", "Babysitter & Daycare" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Kids" );
			trsnCats.put( "specCat", "Child Support" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Kids" );
			trsnCats.put( "specCat", "Kids Activities" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Kids" );
			trsnCats.put( "specCat", "Toys" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Personal Care" );
			trsnCats.put( "specCat", "Hair" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Personal Care" );
			trsnCats.put( "specCat", "Laundry" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Personal Care" );
			trsnCats.put( "specCat", "Spa & Massage" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Pets" );
			trsnCats.put( "specCat", "Pet Food & Supplies" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Pets" );
			trsnCats.put( "specCat", "Pet Grooming" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Pets" );
			trsnCats.put( "specCat", "Veterinary" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Shopping" );
			trsnCats.put( "specCat", "Books" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Shopping" );
			trsnCats.put( "specCat", "Clothing" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Shopping" );
			trsnCats.put( "specCat", "Electronics & Software" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Shopping" );
			trsnCats.put( "specCat", "Hobbies" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Shopping" );
			trsnCats.put( "specCat", "Sporting Goods" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Taxes" );
			trsnCats.put( "specCat", "Federal Tax" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Taxes" );
			trsnCats.put( "specCat", "Local Tax" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Taxes" );
			trsnCats.put( "specCat", "Property Tax" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Taxes" );
			trsnCats.put( "specCat", "Sales Tax" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Taxes" );
			trsnCats.put( "specCat", "State Tax" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Transfer" );
			trsnCats.put( "specCat", "Credit Card Payment" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Travel" );
			trsnCats.put( "specCat", "Air Travel" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Travel" );
			trsnCats.put( "specCat", "Hotel" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Travel" );
			trsnCats.put( "specCat", "Rental Car & Taxi" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Travel" );
			trsnCats.put( "specCat", "Vacation" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Uncategorized" );
			trsnCats.put( "specCat", "Cash & ATM" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Uncategorized" );
			trsnCats.put( "specCat", "Check" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.put( "genCat", "Uncategorized" );
			trsnCats.put( "specCat", "Other" );
			db.insert( "expenseCategories", null, trsnCats );

			trsnCats.clear();

			db.setTransactionSuccessful();
		} catch( SQLException e ) {

			Log.e( TAG, "Something went to hell during the creation." );
		} finally {
			db.endTransaction();
		}

		onUpgrade( db, 0, DATABASE_VERSION );
	}

	@Override
	public void onUpgrade( SQLiteDatabase db, int oldVersion, int newVersion ) {

		Log.w( TAG, "Upgrading database from version " + oldVersion + " to " + newVersion + "." );

		int versionCheck = oldVersion;
		boolean do_final_stage = true;

		switch( oldVersion ) {
			// Anything before version 14 is initially created. Started with v14 to match up with webOS structure
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
				// Create account transaction sort data table
				try {

					db.beginTransaction();
					db.execSQL( "DROP TABLE IF EXISTS acctTrsnSortOptn;" );
					db.execSQL( "CREATE TABLE acctTrsnSortOptn( sortId INTEGER PRIMARY KEY ASC, label TEXT, sortGroup TEXT, groupOrder INTEGER NOT NULL DEFAULT 0, desc TEXT, qry TEXT );" );

					ContentValues acctSortItem = new ContentValues();

					/* Date Sorts */
					acctSortItem.put( "sortGroup", "Date" );
					acctSortItem.put( "groupOrder", 0 );
					acctSortItem.put( "label", "Oldest to Newest, Show Newest" );
					acctSortItem.put( "desc", "Sorts transactions from oldest to newest. Displays the newest transactions." );
					acctSortItem.put( "qry", "date ASC, itemId ASC" );
					acctSortItem.put( "sortId", 0 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.put( "sortGroup", "Date" );
					acctSortItem.put( "groupOrder", 0 );
					acctSortItem.put( "label", "Newest to Oldest, Show Newest" );
					acctSortItem.put( "desc", "Sorts transactions from newest to oldest. Displays the newest transactions." );
					acctSortItem.put( "qry", "date DESC, itemId DESC" );
					acctSortItem.put( "sortId", 1 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.put( "sortGroup", "Date" );
					acctSortItem.put( "groupOrder", 0 );
					acctSortItem.put( "label", "Oldest to Newest, Show Oldest" );
					acctSortItem.put( "desc", "Sorts transactions from oldest to newest. Displays the oldest transactions." );
					acctSortItem.put( "qry", "date ASC, itemId ASC" );
					acctSortItem.put( "sortId", 8 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					/* Description Sorts */
					acctSortItem.put( "sortGroup", "Description" );
					acctSortItem.put( "groupOrder", 1 );
					acctSortItem.put( "label", "A-Z" );
					acctSortItem.put( "desc", "Sorts transactions from A to Z. Displays the newest transactions." );
					acctSortItem.put( "qry", "desc COLLATE NOCASE ASC, itemId ASC" );
					acctSortItem.put( "sortId", 2 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.put( "sortGroup", "Description" );
					acctSortItem.put( "groupOrder", 1 );
					acctSortItem.put( "label", "Z-A" );
					acctSortItem.put( "desc", "Sorts transactions from A to Z. Displays the newest transactions." );
					acctSortItem.put( "qry", "desc COLLATE NOCASE DESC, itemId ASC" );
					acctSortItem.put( "sortId", 3 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					/* Amount Sorts */
					acctSortItem.put( "sortGroup", "Amount" );
					acctSortItem.put( "groupOrder", 2 );
					acctSortItem.put( "label", "Ascending" );
					acctSortItem.put( "desc", "Sorts transactions by amount, ascending. Displays the greatest expense." );
					acctSortItem.put( "qry", "amount ASC, itemId ASC" );
					acctSortItem.put( "sortId", 4 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.put( "sortGroup", "Amount" );
					acctSortItem.put( "groupOrder", 2 );
					acctSortItem.put( "label", "Descending" );
					acctSortItem.put( "desc", "Sorts transactions by amount, descending. Displays the greatest income." );
					acctSortItem.put( "qry", "amount DESC, itemId ASC" );
					acctSortItem.put( "sortId", 5 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					/* Status Sorts */
					acctSortItem.put( "sortGroup", "Status" );
					acctSortItem.put( "groupOrder", 3 );
					acctSortItem.put( "label", "Cleared first" );
					acctSortItem.put( "desc", "Sorts transactions by cleared status with Cleared transactions first. Transactions are then sorted by date from newest to oldest." );
					acctSortItem.put( "qry", "cleared DESC, QUERY" );
					acctSortItem.put( "sortId", 6 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.put( "sortGroup", "Status" );
					acctSortItem.put( "groupOrder", 3 );
					acctSortItem.put( "label", "Pending first" );
					acctSortItem.put( "desc", "Sorts transactions by cleared status with Uncleared transactions first. Transactions are then sorted by date from newest to oldest." );
					acctSortItem.put( "qry", "cleared ASC, date DESC, itemId ASC" );
					acctSortItem.put( "sortId", 7 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					/* Check # Sorts */
					acctSortItem.put( "sortGroup", "Check Number" );
					acctSortItem.put( "groupOrder", 4 );
					acctSortItem.put( "label", "Ascending Numbers" );
					acctSortItem.put( "desc", "Sorts transactions by check number. Displays the lowest numbered check first. Transactions without check numbers are sorted last." );
					acctSortItem.put( "qry", "IFNULL( NULLIF( checkNum, '' ), ( SELECT IFNULL( MAX( checkNum ), 0 ) FROM expenses LIMIT 1 ) ) ASC, itemId ASC" );
					acctSortItem.put( "sortId", 9 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.put( "sortGroup", "Check Number" );
					acctSortItem.put( "groupOrder", 4 );
					acctSortItem.put( "label", "Descending Numbers" );
					acctSortItem.put( "desc", "Sorts transactions by check number. Displays the highest numbered check first. Transactions without check numbers are sorted last." );
					acctSortItem.put( "qry", "checkNum DESC, itemId ASC" );
					acctSortItem.put( "sortId", 10 );
					db.insert( "acctTrsnSortOptn", null, acctSortItem );

					acctSortItem.clear();

					db.setTransactionSuccessful();
				} catch( SQLException e ) {

					Log.e( TAG, "Something went to hell during the update (" + versionCheck + ")." );
				} finally {
					db.endTransaction();
				}

				versionCheck = 15;
			case 15:
				// webOS updated acct cats
				db.execSQL( "ALTER TABLE accounts ADD COLUMN auto_savings INTEGER NOT NULL DEFAULT 0;" );// OPTIONS: +1$, +remainder of dollar, none
				db.execSQL( "ALTER TABLE accounts ADD COLUMN auto_savings_link INTEGER NOT NULL DEFAULT 0;" );// Linked account

				db.execSQL( "DROP TABLE IF EXISTS repeats;" );
				db.execSQL( "CREATE TABLE repeats( repeatId INTEGER PRIMARY KEY ASC, frequency TEXT, daysOfWeek TEXT, itemSpan INTEGER, endingCondition TEXT, endDate TEXT, endCount INTEGER, currCout INTEGER, origDate TEXT, lastOccurance TEXT, desc TEXT, amount REAL, note TEXT, category TEXT, acctId INTEGER, linkedAcctId INTEGER );" );

				versionCheck = 16;
			case 16:
				db.execSQL( "ALTER TABLE expenses ADD COLUMN repeatUnlinked INTEGER NOT NULL DEFAULT 0;" );

				versionCheck = 17;
			case 17:

				// versionCheck = 18;
		}

		if( do_final_stage == true ) {

			ContentValues prefUpdate = new ContentValues();
			prefUpdate.put( "dbVer", versionCheck );
			db.update( "prefs", prefUpdate, "", null );
			prefUpdate.clear();
		} else {

			onUpgrade( db, versionCheck, DATABASE_VERSION );// How to call this again for the auto update system
		}
	}
}