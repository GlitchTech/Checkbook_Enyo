package com.glitchtechscience.gtcheckbook;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpParams;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.DialogInterface.OnDismissListener;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.util.SparseBooleanArray;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

public class exportData extends Activity {

	private checkbook appState;
	private SQLiteDatabase appdb;
	private ProgressDialog dialog;

	private static final String TOKEN_TYPE = "writely";
	private static final String ACCT_TYPE = "HOSTED_OR_GOOGLE";
	private static final String APP_NAME = "GlitchTechScience-CheckbookAndroid";
	private String token;

	private String[] acctNames;
	private String[] acctIds;

	private int exportAcctCount;

	// Need handler for callbacks to the UI thread
	final Handler exportHandler = new Handler();

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.export_data );

		//setKeepScreenOn( true );

		appState = ( ( checkbook )getApplicationContext() );
		appdb = appState.getAppDatabase();

		dialog = new ProgressDialog( exportData.this );
		dialog.setTitle( "Checkbook Export" );
		dialog.setMessage( "" );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );
		dialog.setProgressStyle( ProgressDialog.STYLE_HORIZONTAL );

		dialog.setOnDismissListener( new OnDismissListener() {

			public void onDismiss( DialogInterface arg0 ) {

				exportData.this.finish();
			}
		} );

		dialog.hide();

		exportAcctCount = 0;

		getGoogleLogIn();
		setUpListeners();
	}

	private void getGoogleLogIn() {

		CheckBox saveCreds = ( CheckBox )findViewById( R.id.exportSaveCreds );
		EditText username = ( EditText )findViewById( R.id.exportUser );
		EditText password = ( EditText )findViewById( R.id.exportPass );

		Cursor results = appdb.rawQuery( "SELECT saveGSheetsData, gSheetUser, gSheetPass FROM prefs LIMIT 1", null );
		results.moveToFirst();

		saveCreds.setChecked( results.getInt( results.getColumnIndex( "saveGSheetsData" ) ) == 1 );

		if( saveCreds.isChecked() ) {

			username.setText( results.getString( results.getColumnIndex( "gSheetUser" ) ) );
			password.setText( ( ( checkbook )getApplicationContext() ).decrypt( results.getString( results.getColumnIndex( "gSheetPass" ) ) ) );
		}

		results.close();
	}

	private void setUpListeners() {

		Button logInBttn = ( Button )findViewById( R.id.exportLogInBttn );
		logInBttn.setOnClickListener( new logInButton() );
		logInBttn.getBackground().setColorFilter( 0xFF00CC00, PorterDuff.Mode.MULTIPLY );// Green button
		logInBttn.setTextColor( Color.WHITE );

		Button control_bttn = ( Button )findViewById( R.id.exportListSet_control_bttn );
		control_bttn.setOnClickListener( new exportDataButton() );
		control_bttn.getBackground().setColorFilter( 0xFF00CC00, PorterDuff.Mode.MULTIPLY );// Green button
		control_bttn.setTextColor( Color.WHITE );
	}

	private void showLogIn() {

		findViewById( R.id.exportLogIn ).setVisibility( View.VISIBLE );
		findViewById( R.id.exportListSet ).setVisibility( View.GONE );
		dialog.hide();
	}

	private class logInButton implements OnClickListener {

		public void onClick( View v ) {

			dialog.setMessage( "Processing log in information" );
			dialog.setProgress( 0 );
			dialog.show();

			exportHandler.postDelayed( logInCheck, 500 );// Continue in 0.500 sec
		}
	}

	private Runnable logInCheck = new Runnable() {

		public void run() {

			EditText password = ( EditText )findViewById( R.id.exportPass );
			EditText username = ( EditText )findViewById( R.id.exportUser );
			Matcher matcher = Pattern.compile( ".+@.+" ).matcher( username.getText().toString() );

			// Both fields have text entered in them?
			if( password.toString().length() <= 0 || username.toString().length() <= 0 ) {

				TextView errTxt = ( TextView )findViewById( R.id.exportError );
				errTxt.setText( "Did you enter your username and password correctly?" );
				errTxt.setVisibility( View.VISIBLE );

				dialog.hide();

				return;
			}

			if( !matcher.matches() && username.getText().toString().length() > 0 ) {

				username.setText( username.getText().toString() + "@gmail.com" );
			}

			boolean failure = false;

			// Create a new HttpClient and Post Header
			HttpClient httpclient = new DefaultHttpClient();
			HttpPost httppost = new HttpPost( "https://www.google.com/accounts/ClientLogin" );
			// this is for proxy settings

			HttpParams params = httpclient.getParams();
			params.setParameter( "content-type", "application/x-www-form-urlencoded" );

			try {

				// Add your data
				List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>( 2 );
				nameValuePairs.add( new BasicNameValuePair( "accountType", ACCT_TYPE ) );
				nameValuePairs.add( new BasicNameValuePair( "Email", username.getText().toString() ) );
				nameValuePairs.add( new BasicNameValuePair( "Passwd", password.getText().toString() ) );
				nameValuePairs.add( new BasicNameValuePair( "service", TOKEN_TYPE ) );
				nameValuePairs.add( new BasicNameValuePair( "source", APP_NAME ) );

				httppost.setEntity( new UrlEncodedFormEntity( nameValuePairs ) );

				// Execute HTTP Post Request
				HttpResponse response = httpclient.execute( httppost );
				BufferedReader authReturn = new BufferedReader( new InputStreamReader( response.getEntity().getContent() ) );
				String line;
				token = "error=badauthentication";

				dialog.setProgress( 20 );

				// process log in information
				while( ( line = authReturn.readLine() ) != null ) {

					if( line.toLowerCase().indexOf( "auth=" ) != -1 ) {

						token = "GoogleLogin auth=" + line.replaceAll( "(?i)Auth=", "" );
						break;
					} else if( line.toLowerCase().contains( "error=" ) ) {

						token = line;
						break;
					}
				}

				authReturn.close();

				if( token.toLowerCase().contains( "error=" ) || token.length() <= 0 ) {

					googleCommError( token );
					return;
				} else {

					saveAndContinue();
				}
			} catch( ClientProtocolException e ) {

				e.printStackTrace();
				failure = true;
			} catch( IOException e ) {

				e.printStackTrace();
				failure = true;
			}

			if( failure == true ) {

				googleCommError( "error=connection" );
				return;
			}
		}
	};

	/**
	 * Authentication was successful
	 *
	 * @param
	 */
	public void saveAndContinue() {

		ContentValues googlePrefs = new ContentValues();
		CheckBox saveCreds = ( CheckBox )findViewById( R.id.exportSaveCreds );

		if( saveCreds.isChecked() ) {

			EditText username = ( EditText )findViewById( R.id.exportUser );
			EditText password = ( EditText )findViewById( R.id.exportPass );

			googlePrefs.put( "saveGSheetsData", 1 );
			googlePrefs.put( "gSheetUser", username.getText().toString() );
			googlePrefs.put( "gSheetPass", ( ( checkbook )getApplicationContext() ).encrypt( password.getText().toString() ) );
		} else {

			googlePrefs.put( "saveGSheetsData", 0 );
			googlePrefs.put( "gSheetUser", "" );
			googlePrefs.put( "gSheetPass", "" );
		}

		appdb.update( "prefs", googlePrefs, null, null );
		googlePrefs.clear();

		dialog.setMessage( "Retrieving accounts" );
		dialog.setProgress( 60 );

		exportHandler.postDelayed( fetchAcctList, 500 );// Continue in 0.500 sec
	}

	/**
	 * Fetches list of accounts and displays.
	 */
	private Runnable fetchAcctList = new Runnable() {

		public void run() {

			Cursor results = appdb.query( "accounts", new String[] { "acctId", "acctCategory", "acctName" }, null, null, null, null, "acctName ASC, acctCategory ASC" );

			acctNames = new String[results.getCount()];
			acctIds = new String[results.getCount()];

			results.moveToFirst();
			while( results.isAfterLast() == false ) {

				acctNames[results.getPosition()] = results.getString( results.getColumnIndex( "acctName" ) ) + " [" + results.getString( results.getColumnIndex( "acctCategory" ) ) + "]";
				acctIds[results.getPosition()] = results.getString( results.getColumnIndex( "acctId" ) );

				dialog.setProgress( 60 + 40 * ( ( results.getPosition() + 1 ) / results.getCount() ) );

				results.moveToNext();
			}

			results.close();

			ListView exportAcctList = ( ListView )findViewById( R.id.exportAcctList );
			exportAcctList.setAdapter( new ArrayAdapter<String>( exportData.this, R.layout.import_data_item, acctNames ) );
			exportAcctList.setChoiceMode( ListView.CHOICE_MODE_MULTIPLE );

			// TODO check by default

			dialog.setProgress( 100 );

			findViewById( R.id.exportLogIn ).setVisibility( View.GONE );
			findViewById( R.id.exportListSet ).setVisibility( View.VISIBLE );

			dialog.hide();
		}
	};

	private class exportDataButton implements OnClickListener {

		public void onClick( View v ) {

			buildExportStrings();
		}
	}

	private void buildExportStrings() {

		dialog.setMessage( "Exporting information" );
		dialog.setProgress( 0 );
		dialog.show();

		Thread t = new Thread() {

			public void run() {

				ListView exportAcctList = ( ListView )findViewById( R.id.exportAcctList );
				SparseBooleanArray checkedItems = exportAcctList.getCheckedItemPositions();

				StringBuilder sheet;
				String dataQry = "SELECT *, ( SELECT accounts.acctName FROM accounts WHERE accounts.acctId = expenses.account ) AS accountName, ( SELECT accounts.acctName FROM accounts WHERE accounts.acctId = expenses.linkedAccount ) AS linkedAccountName, ( SELECT accounts.acctCategory FROM accounts WHERE accounts.acctId = expenses.account ) AS accountCat, ( SELECT accounts.acctCategory FROM accounts WHERE accounts.acctId = expenses.linkedAccount ) AS linkedAccountCat FROM expenses WHERE account = ? ORDER BY date";

				for( int i = 0; i < acctNames.length; i++ ) {

					if( checkedItems.get( i ) ) {

						updateMessageHandler( "Exporting: " + acctNames[i] );

						Cursor results = appdb.rawQuery( dataQry, new String[] { acctIds[i] } );

						sheet = new StringBuilder();

						sheet.append( "account,accountCat,date,amount,description,cleared,checkNum,note,gtId,gtCat,gtLinkId,gtLinkedAccount,gtLinkedAccountCat\n" );

						results.moveToFirst();
						while( results.isAfterLast() == false ) {

							sheet.append( "\"" + getCleanResultString( results, "accountName" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "accountCat" ) + "\"," );
							sheet.append( "\"" + android.text.format.DateFormat.format( "MM/dd/yyyy hh:mm:ss", new Date( results.getLong( results.getColumnIndex( "date" ) ) ) ) + "\"," );
							sheet.append( "\"" + appState.formatAccountBalance( results.getDouble( results.getColumnIndex( "amount" ) ) ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "desc" ) + "\"," );
							sheet.append( "\"" + ( results.getInt( results.getColumnIndex( "cleared" ) ) == 1 ? "Yes" : "No" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "checkNum" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "note" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "itemId" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "category" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "linkedRecord" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "linkedAccountName" ) + "\"," );
							sheet.append( "\"" + getCleanResultString( results, "linkedAccountCat" ) + "\"\n" );

							results.moveToNext();

							updateProgressHandler( ( ( ( ( ( float )results.getPosition() / ( results.getCount() * 2 ) + i ) ) / acctNames.length ) ) * 100 );
						}

						results.close();

						boolean uploading = true;
						int err = 0;

						while( uploading ) {

							try {

								String postData = sheet.toString();
								String title = "[GT Checkbook] " + acctNames[i] + " [" + android.text.format.DateFormat.format( "MM/dd/yyyy", new Date() ) + "]";

								sheet = new StringBuilder();

								URL exportURL = new URL( "https://docs.google.com/feeds/default/private/full" );

								HttpURLConnection exportConnection = ( HttpURLConnection )exportURL.openConnection();
								exportConnection.setDoOutput( true );
								exportConnection.setUseCaches( false );
								exportConnection.setRequestMethod( "POST" );

								exportConnection.addRequestProperty( "GData-Version", "3.0" );
								exportConnection.addRequestProperty( "Authorization", token );
								exportConnection.addRequestProperty( "Slug", title );

								exportConnection.setRequestProperty( "Connection", "Keep-Alive" );
								exportConnection.setRequestProperty( "Content-Type", "multipart/related; boundary=END_OF_PART" );

								sheet.append( "--END_OF_PART\r\n" );
								sheet.append( "Content-Type: application/atom+xml;\r\n\r\n" );
								sheet.append( "<?xml version='1.0' encoding='UTF-8'?>" );
								sheet.append( "<entry xmlns=\"http://www.w3.org/2005/Atom\">" );
								sheet.append( "<category scheme=\"http://schemas.google.com/g/2005kind\"" );
								sheet.append( " term=\"http://schemas.google.com/docs/2007spreadsheet\"/>" );
								sheet.append( "<title>" );
								sheet.append( title );
								sheet.append( "</title>" );
								sheet.append( "</entry>\r\n" );
								sheet.append( "--END_OF_PART\r\n" );
								sheet.append( "Content-Type: text/csv\r\n\r\n" );

								sheet.append( postData );

								sheet.append( "\r\n" );
								sheet.append( "--END_OF_PART--\r\n" );

								OutputStreamWriter wr = new OutputStreamWriter( exportConnection.getOutputStream() );
								wr.write( sheet.toString() );
								wr.flush();
								wr.close();

								Log.i( "Export", "Response Code: " + exportConnection.getResponseCode() );

								updateProgressHandler( ( ( ( float )i + 1 ) / acctNames.length * 100 ) );

								uploading = false;
								exportAcctCount++;
							} catch( MalformedURLException e ) {

								e.printStackTrace();
								err++;
							} catch( IOException e ) {

								e.printStackTrace();
								err++;
							}

							if( err >= 5 ) {
								// Too many failures

								uploading = false;
							}
						}
					}
				}

				updateProgressHandler( 100 );
				updateMessageHandler( "Exported " + exportAcctCount + " accounts(s)" );
				exportHandler.postDelayed( cleanUp, 1500 );
			}
		};
		t.start();
	}

	private Runnable cleanUp = new Runnable() {

		public void run() {

			dialog.dismiss();
			exportData.this.finish();
		}
	};

	private String getCleanResultString( Cursor c, String col ) {

		try {

			String content = c.getString( c.getColumnIndex( col ) );

			if( content.length() > 0 ) {

				return appState.cleanString( content );
			} else {

				return "";
			}
		} catch( NullPointerException ex ) {

			return "";
		}
	}

	/**
	 * This and associated handler update the progress bar in dialog
	 *
	 * @param d
	 */
	private void updateProgressHandler( float d ) {

		int progress = Math.round( d );

		Message msg = updateProgress.obtainMessage();
		Bundle b = new Bundle();
		b.putInt( "progress", progress );
		msg.setData( b );

		updateProgress.sendMessage( msg );
	}

	final Handler updateProgress = new Handler() {

		public void handleMessage( Message msg ) {

			int total = msg.getData().getInt( "progress" );
			dialog.setProgress( total );
		}
	};

	/**
	 * This and associated handler update the progress bar in dialog
	 *
	 * @param d
	 */
	private void updateMessageHandler( String txt ) {

		Message msg = updateProgress.obtainMessage();
		Bundle b = new Bundle();
		b.putString( "txt", txt );
		msg.setData( b );

		updateMessage.sendMessage( msg );
	}

	final Handler updateMessage = new Handler() {

		public void handleMessage( Message msg ) {

			dialog.setMessage( msg.getData().getString( "txt" ) );
		}
	};

	private void googleCommError( String err ) {

		TextView errTxt = ( TextView )findViewById( R.id.exportError );

		err = err.toLowerCase();

		if( err.indexOf( "error=badauthentication" ) >= 0 ) {

			errTxt.setText( "Did you enter your username and password correctly?" );

		} else if( err.indexOf( "error=captcharequired" ) >= 0 ) {

			errTxt.setText( "Google is requesting that you complete a CAPTCHA Challenge. Please go to https://www.google.com/accounts/DisplayUnlockCaptcha to complete it with the account you are trying to log in to." );

		} else if( err.indexOf( "error=notverified" ) >= 0 ) {

			errTxt.setText( "The account email address has not been verified. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application." );

		} else if( err.indexOf( "error=termsnotagreed" ) >= 0 ) {

			errTxt.setText( "You have not agreed to Google's terms. You will need to access your Google account directly to resolve the issue before logging in using a non-Google application." );

		} else if( err.indexOf( "error=accountdeleted" ) >= 0 ) {

			errTxt.setText( "The user account has been deleted and is therefore unable to log in." );

		} else if( err.indexOf( "error=accountdisabled" ) >= 0 ) {

			errTxt.setText( "The user account has been disabled. Please contact Google." );

		} else if( err.indexOf( "error=servicedisabled" ) >= 0 ) {

			errTxt.setText( "Your access to the specified service has been disabled. (Your account may still be valid.)" );

		} else if( err.indexOf( "error=serviceunavailable" ) >= 0 ) {

			errTxt.setText( "The service is not available; try again later." );

		} else if( err.indexOf( "error=unknown" ) >= 0 ) {

			errTxt.setText( "Unknown Error. Did you enter your username and password correctly?" );

		} else if( err.indexOf( "error=connection" ) >= 0 ) {

			errTxt.setText( "Connection error. Please try again later." );

		} else {

			errTxt.setText( "There has been an error: " + errTxt );
		}

		errTxt.setVisibility( View.VISIBLE );

		System.err.println( errTxt );

		showLogIn();
	}
}
