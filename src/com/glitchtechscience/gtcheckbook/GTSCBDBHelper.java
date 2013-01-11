package com.glitchtechscience.gtcheckbook;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class GTSCBDBHelper extends SQLiteOpenHelper {

	private static final int DATABASE_VERSION = 25;
	private static final String DATABASE_NAME = "glitchtechsciencecheckbook";

	public GTSCBDBHelper( Context context ) {

		super( context, DATABASE_NAME, null, DATABASE_VERSION );

	}

	@Override
	public void onCreate( SQLiteDatabase db ) {

		// Do nothing, JS handled
	}

	@Override
	public void onUpgrade( SQLiteDatabase db, int oldVersion, int newVersion ) {

		// Do nothing, JS handled
	}
}
