package com.glitchtechscience.gtcheckbook;

import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

public class SQLitePlugin extends com.phonegap.plugin.sqlitePlugin.SQLitePlugin {

	/**
	 * Open a database.
	 * 
	 * @param dbname
	 *            The name of the database-NOT including its extension.
	 * 
	 * @param password
	 *            The database password or null.
	 * 
	 */
	@Override
	protected void openDatabase( String dbname, String password ) {

		if( this.getDatabase( dbname ) != null ) this.closeDatabase( dbname );

		checkbook appState = ( (checkbook) this.cordova.getActivity().getApplication() );
		appState.setAppDatabase();

		SQLiteDatabase mydb = appState.getAppDatabase();

		Log.v( "info", "Open sqlite db: " + mydb.getPath() );

		dbmap.put( dbname, mydb );
	}
	
	//stuck in loop on requesting new set of transactions
	//slow on update
}
