package com.glitchtechscience.gtcheckbook;

import android.app.Application;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

public class checkbook extends Application {

	/** System Vars **/
	private SQLiteDatabase cbDB;

	public void setAppDatabase() {

		try {

			GTSCBDBHelper openHelper = new GTSCBDBHelper( getBaseContext() );
			this.cbDB = openHelper.getWritableDatabase();
		}
		catch( Exception ex ) {

			Log.e( "setAppDatabase()", "ERROR: " + ex.toString() );
		}
	}

	public SQLiteDatabase getAppDatabase() {

		return this.cbDB;
	}

	public void closeAppDatabase() {

		this.cbDB.close();
	}
}
