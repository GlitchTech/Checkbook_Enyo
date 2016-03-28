package com.glitchtechscience.gtcheckbook;

import java.util.HashMap;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteStatement;
import android.util.Log;

// Plugings & Threading -- http://docs.phonegap.com/en/2.4.0/guide_plugin-development_android_index.md.html#Developing%20a%20Plugin%20on%20Android

public class SQLitePlugin extends CordovaPlugin {

	/**
	 * Multiple database map.
	 */
	protected HashMap<String, SQLiteDatabase> dbmap;

	/**
	 * Constructor.
	 */
	public SQLitePlugin() {

		this.dbmap = new HashMap<String, SQLiteDatabase>();
	}

	/**
	 * Destructor
	 */
	public void onDestroy() {

		while( !this.dbmap.isEmpty() ) {

			String dbname = this.dbmap.keySet().iterator().next();
			this.closeDatabase( dbname );
			this.dbmap.remove( dbname );
		}
	}

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
	protected void openDatabase( String dbname, String password ) {

		if( this.getDatabase( dbname ) != null ) {

			this.closeDatabase( dbname );
		}

		checkbook appState = ( (checkbook) this.cordova.getActivity().getApplication() );
		appState.setAppDatabase();

		SQLiteDatabase mydb = appState.getAppDatabase();

		Log.v( "info", "Open sqlite db: " + mydb.getPath() );

		dbmap.put( dbname, mydb );
	}

	/**
	 * Close a database.
	 * 
	 * @param dbName
	 *            The name of the database-NOT including its extension.
	 * 
	 */
	protected void closeDatabase( String dbName ) {

		SQLiteDatabase mydb = this.getDatabase( dbName );

		if( mydb != null ) {

			Log.v( "info", "Close sqlite db: " + mydb.getPath() );

			mydb.close();
			this.dbmap.remove( dbName );
		}
	}

	/**
	 * Get a database from the db map.
	 * 
	 * @param dbname
	 *            The name of the database.
	 * 
	 */
	protected SQLiteDatabase getDatabase( String dbname ) {

		return dbmap.get( dbname );
	}

	/**
	 * Handles JavaScript requests
	 * 
	 * @param action
	 *            The action to execute.
	 * 
	 * @param args
	 *            JSONArry of arguments for the plugin.
	 * 
	 * @param cbctx
	 *            Callback context from Cordova API (not used here)
	 * 
	 */
	@Override
	public boolean execute( String action, JSONArray args, final CallbackContext cbctx ) {

		try {

			if( action.equals( "open" ) ) {

				JSONObject o = args.getJSONObject( 0 );
				String dbname = o.getString( "name" );

				this.openDatabase( dbname, null );

				return true;
			} else if( action.equals( "close" ) ) {

				this.closeDatabase( args.getString( 0 ) );

				return true;
			} else if( action.equals( "executePragmaStatement" ) ) {

				String dbName = args.getString( 0 );
				String query = args.getString( 1 );

				Cursor myCursor = this.getDatabase( dbName ).rawQuery( query, null );
				this.processPragmaResults( myCursor, id );

				return true;
			} else if( action.equals( "executeSqlBatch" ) ) {

				String[] queries = null;
				String[] queryIDs = null;
				String trans_id = null;
				JSONObject a = null;
				JSONArray jsonArr = null;
				int paramLen = 0;
				JSONArray[] jsonparams = null;

				String dbName = args.getString( 0 );
				JSONArray txargs = args.getJSONArray( 1 );

				if( txargs.isNull( 0 ) ) {

					queries = new String[0];
				} else {

					int len = txargs.length();
					queries = new String[len];
					queryIDs = new String[len];
					jsonparams = new JSONArray[len];

					for( int i = 0; i < len; i++ ) {

						a = txargs.getJSONObject( i );
						queries[i] = a.getString( "query" );
						queryIDs[i] = a.getString( "query_id" );
						trans_id = a.getString( "trans_id" );
						jsonArr = a.getJSONArray( "params" );
						paramLen = jsonArr.length();
						jsonparams[i] = jsonArr;
					}
				}

				if( trans_id != null ) {

					this.executeSqlBatch( dbName, queries, jsonparams, queryIDs, trans_id );

					return true;
				} else {

					Log.v( "error", "null trans_id" );

					return false;
				}
			}
		}
		catch( JSONException e ) {
			// TODO: signal JSON problem to JS

			Log.e( "error", e.getMessage() );
		}

		return false;
	}

	/**
	 * Executes a batch request and sends the results via sendJavascriptCB().
	 * 
	 * @param dbname
	 *            The name of the database.
	 * 
	 * @param queryarr
	 *            Array of query strings
	 * 
	 * @param jsonparams
	 *            Array of JSON query parameters
	 * 
	 * @param queryIDs
	 *            Array of query ids
	 * 
	 * @param tx_id
	 *            Transaction id
	 * 
	 */
	private void executeSqlBatch( String dbname, String[] queryarr, JSONArray[] jsonparams, String[] queryIDs, String tx_id ) {

		SQLiteDatabase mydb = this.getDatabase( dbname );

		if( mydb == null ) {
			return;
		}

		String query = "";
		String query_id = "";

		try {
			mydb.beginTransaction();

			int len = queryarr.length;

			for( int i = 0; i < len; i++ ) {

				query = queryarr[i];
				query_id = queryIDs[i];

				if( query.toLowerCase().startsWith( "insert" ) && jsonparams != null ) {

					SQLiteStatement myStatement = mydb.compileStatement( query );

					for( int j = 0; j < jsonparams[i].length(); j++ ) {

						if( jsonparams[i].get( j ) instanceof Float || jsonparams[i].get( j ) instanceof Double ) {

							myStatement.bindDouble( j + 1, jsonparams[i].getDouble( j ) );
						} else if( jsonparams[i].get( j ) instanceof Number ) {

							myStatement.bindLong( j + 1, jsonparams[i].getLong( j ) );
						} else {

							myStatement.bindString( j + 1, jsonparams[i].getString( j ) );
						}
					}

					long insertId = myStatement.executeInsert();

					String result = "{'insertId':'" + insertId + "'}";
					this.webView.sendJavascript( "window.SQLitePluginTransactionCB.queryCompleteCallback('" + tx_id + "','" + query_id + "', " + result + ");" );
				} else {

					String[] params = null;

					if( jsonparams != null ) {

						params = new String[jsonparams[i].length()];

						for( int j = 0; j < jsonparams[i].length(); j++ ) {

							if( jsonparams[i].isNull( j ) ) {

								params[j] = "";
							} else {

								params[j] = jsonparams[i].getString( j );
							}
						}
					}

					Cursor myCursor = mydb.rawQuery( query, params );

					if( query_id.length() > 0 ) {

						this.processResults( myCursor, query_id, tx_id );
					}

					myCursor.close();
				}
			}

			mydb.setTransactionSuccessful();
		}
		catch( SQLiteException ex ) {

			ex.printStackTrace();
			Log.v( "executeSqlBatch", "SQLitePlugin.executeSql(): Error=" + ex.getMessage() );

			this.webView.sendJavascript( "window.SQLitePluginTransactionCB.queryErrorCallback('" + tx_id + "','" + query_id + "', '" + ex.getMessage() + "');" );
			this.webView.sendJavascript( "window.SQLitePluginTransactionCB.txErrorCallback('" + tx_id + "', '" + ex.getMessage() + "');" );
		}
		catch( JSONException ex ) {

			ex.printStackTrace();
			Log.v( "executeSqlBatch", "SQLitePlugin.executeSql(): Error=" + ex.getMessage() );

			this.webView.sendJavascript( "window.SQLitePluginTransactionCB.txErrorCallback('" + tx_id + "', '" + ex.getMessage() + "');" );
		}
		finally {

			mydb.endTransaction();
			Log.v( "executeSqlBatch", tx_id );
			this.webView.sendJavascript( "window.SQLitePluginTransactionCB.txCompleteCallback('" + tx_id + "');" );
		}
	}

	/**
	 * Process query results.
	 * 
	 * @param cur
	 *            Cursor into query results
	 * 
	 * @param query_id
	 *            Query id
	 * 
	 * @param tx_id
	 *            Transaction id
	 * 
	 */
	private void processResults( Cursor cur, String query_id, String tx_id ) {

		String result = this.results2string( cur );

		this.webView.sendJavascript( "window.SQLitePluginTransactionCB.queryCompleteCallback('" + tx_id + "','" + query_id + "', " + result + ");" );
	}

	/**
	 * Process query results.
	 * 
	 * @param cur
	 *            Cursor into query results
	 * 
	 * @param id
	 *            Caller db id
	 * 
	 */
	private void processPragmaResults( Cursor cur, String id ) {

		String result = this.results2string( cur );

		this.webView.sendJavascript( "window.SQLitePluginCallback.p1('" + id + "', " + result + ");" );
	}

	/**
	 * Convert results cursor to JSON string.
	 * 
	 * @param cur
	 *            Cursor into query results
	 * 
	 * @return results in string form
	 * 
	 */
	@SuppressLint( "NewApi" )
	private String results2string( Cursor cur ) {

		String result = "[]";

		// If query result has rows
		if( cur.moveToFirst() ) {

			JSONArray fullresult = new JSONArray();
			String key = "";
			int colCount = cur.getColumnCount();

			// Build up JSON result object for each row
			do {

				JSONObject row = new JSONObject();

				try {

					for( int i = 0; i < colCount; ++i ) {

						key = cur.getColumnName( i );

						if( android.os.Build.VERSION.SDK_INT >= 11 ) {

							switch( cur.getType( i ) ) {
								case Cursor.FIELD_TYPE_NULL:
									row.put( key, null );
									break;
								case Cursor.FIELD_TYPE_INTEGER:
									row.put( key, cur.getInt( i ) );
									break;
								case Cursor.FIELD_TYPE_FLOAT:
									row.put( key, cur.getFloat( i ) );
									break;
								case Cursor.FIELD_TYPE_STRING:
									row.put( key, cur.getString( i ) );
									break;
								case Cursor.FIELD_TYPE_BLOB:
									row.put( key, cur.getBlob( i ) );
									break;
							}
						} else {

							row.put( key, cur.getString( i ) );
						}
					}

					fullresult.put( row );
				}
				catch( JSONException e ) {

					e.printStackTrace();
				}

			} while( cur.moveToNext() );

			result = fullresult.toString();
		}

		return result;
	}
}
