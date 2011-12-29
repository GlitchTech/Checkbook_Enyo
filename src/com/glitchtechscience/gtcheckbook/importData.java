package com.glitchtechscience.gtcheckbook;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpParams;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.DialogInterface.OnDismissListener;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
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

public class importData extends Activity {

	private checkbook appState;
	private SQLiteDatabase appdb;
	private ProgressDialog dialog;

	protected String[] importSheetList;
	protected String[] importSheetIdList;

	private static final String TOKEN_TYPE = "wise";
	private static final String ACCT_TYPE = "HOSTED_OR_GOOGLE";
	private static final String APP_NAME = "GlitchTechScience-CheckbookAndroid";
	private String token;

	ArrayList<importObj> acctList;
	ArrayList<trsnObj> trsnList;
	private int index;
	private int importTrsnCount;

	private ContentValues knownAccts;

	// Need handler for callbacks to the UI thread
	final Handler importHandler = new Handler();

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.import_data );

		appState = ( (checkbook) getApplicationContext() );
		appdb = appState.getAppDatabase();

		dialog = new ProgressDialog( importData.this );
		dialog.setTitle( "Checkbook Import" );
		dialog.setMessage( "" );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );
		dialog.setProgressStyle( ProgressDialog.STYLE_HORIZONTAL );

		dialog.setOnDismissListener( new OnDismissListener() {

			public void onDismiss( DialogInterface arg0 ) {

				importData.this.finish();
			}
		} );

		dialog.hide();

		importSheetList = new String[ 0 ];
		importSheetIdList = new String[ 0 ];

		knownAccts = new ContentValues();

		getGoogleLogIn();
		setUpListeners();

		importTrsnCount = 0;
	}

	private void getGoogleLogIn() {

		CheckBox saveCreds = (CheckBox) findViewById( R.id.importSaveCreds );
		EditText username = (EditText) findViewById( R.id.importUser );
		EditText password = (EditText) findViewById( R.id.importPass );

		Cursor results = appdb.rawQuery( "SELECT saveGSheetsData, gSheetUser, gSheetPass FROM prefs LIMIT 1", null );
		results.moveToFirst();

		saveCreds.setChecked( results.getInt( results.getColumnIndex( "saveGSheetsData" ) ) == 1 );

		if( saveCreds.isChecked() ) {

			username.setText( results.getString( results.getColumnIndex( "gSheetUser" ) ) );
			password.setText( ( (checkbook) getApplicationContext() ).decrypt( results.getString( results.getColumnIndex( "gSheetPass" ) ) ) );
		}

		results.close();
	}

	private void setUpListeners() {

		findViewById( R.id.confirmInstruct ).setOnClickListener( new confirmInstructButton() );

		Button logInBttn = (Button) findViewById( R.id.importLogInBttn );
		logInBttn.setOnClickListener( new logInButton() );
		logInBttn.getBackground().setColorFilter( 0xFF00CC00, PorterDuff.Mode.MULTIPLY );// Green button
		logInBttn.setTextColor( Color.WHITE );

		Button control_bttn = (Button) findViewById( R.id.importListSet_control_bttn );
		control_bttn.setOnClickListener( new importSheetsButton() );
		control_bttn.getBackground().setColorFilter( 0xFF00CC00, PorterDuff.Mode.MULTIPLY );// Green button
		control_bttn.setTextColor( Color.WHITE );
	}

	private class confirmInstructButton implements OnClickListener {

		public void onClick( View v ) {

			showLogIn();
		}
	}

	private void showLogIn() {

		findViewById( R.id.importInstruction ).setVisibility( View.GONE );
		findViewById( R.id.importLogIn ).setVisibility( View.VISIBLE );
		findViewById( R.id.importListSet ).setVisibility( View.GONE );
		dialog.hide();
	}

	private class logInButton implements OnClickListener {

		public void onClick( View v ) {

			dialog.setMessage( "Processing log in information" );
			dialog.setProgress( 0 );
			dialog.show();

			importHandler.postDelayed( logInCheck, 500 );// Continue in 0.500 sec
		}
	}

	private Runnable logInCheck = new Runnable() {

		public void run() {
			
			Log.v( "Progress", "logInCheck->run()" );

			EditText password = (EditText) findViewById( R.id.importPass );
			EditText username = (EditText) findViewById( R.id.importUser );

			// Both fields have text entered in them?
			if( password.toString().length() <= 0 || username.toString().length() <= 0 ) {

				TextView errTxt = (TextView) findViewById( R.id.importError );
				errTxt.setText( "Did you enter your username and password correctly?" );
				errTxt.setVisibility( View.VISIBLE );

				dialog.hide();

				return;
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

				dialog.setProgress( 20 );//TODO X

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

				// wr.close();
				authReturn.close();

				if( token.toLowerCase().contains( "error=" ) || token.length() <= 0 ) {

					googleCommError( token );
					return;
				} else {

					saveAndContinue();
				}
			} catch( ClientProtocolException e ) {

				Log.w( "Error", "ClientProtocolException" );
				e.printStackTrace();
				failure = true;
			} catch( IOException e ) {

				Log.w( "Error", "IOException" );
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
		
		Log.v( "Progress", "saveAndContinue" );

		ContentValues googlePrefs = new ContentValues();
		CheckBox saveCreds = (CheckBox) findViewById( R.id.importSaveCreds );

		if( saveCreds.isChecked() ) {

			EditText username = (EditText) findViewById( R.id.importUser );
			EditText password = (EditText) findViewById( R.id.importPass );

			googlePrefs.put( "saveGSheetsData", 1 );
			googlePrefs.put( "gSheetUser", username.getText().toString() );
			googlePrefs.put( "gSheetPass", ( (checkbook) getApplicationContext() ).encrypt( password.getText().toString() ) );
		} else {

			googlePrefs.put( "saveGSheetsData", 0 );
			googlePrefs.put( "gSheetUser", "" );
			googlePrefs.put( "gSheetPass", "" );
		}

		appdb.update( "prefs", googlePrefs, null, null );
		googlePrefs.clear();

		dialog.setMessage( "Retrieving spreadsheets" );

		importHandler.postDelayed( fetchSheetList, 500 );// Continue in 0.500 sec
	}

	/**
	 * Retrieve XML from Google Docs containing list of all spreadsheets. Placed in runnable to allow for delay
	 * 
	 * @param
	 */
	private Runnable fetchSheetList = new Runnable() {

		public void run() {
			
			Log.v( "Progress", "fetchSheetList->run()" );

			dialog.setProgress( 30 );

			try {

	            URL url = new URL( "https://spreadsheets.google.com/feeds/spreadsheets/private/full" );
	            HttpGet httpRequest = null;

	            httpRequest = new HttpGet( url.toURI() );
	            httpRequest.setHeader( "GData-Version", "3.0" );
	            httpRequest.setHeader( "Authorization", token );

	            HttpClient httpclient = new DefaultHttpClient();
	            HttpResponse response = ( HttpResponse ) httpclient.execute( httpRequest );

	            HttpEntity entity = response.getEntity();
	            BufferedHttpEntity bufHttpEntity = new BufferedHttpEntity( entity );
	            
				// Get the response
				InputStream docList = bufHttpEntity.getContent();
				buildSheetList( docList );
			} catch( ClientProtocolException e ) {

				Log.e("fetchSheetList ClientProtocolException", e.toString() );
				googleCommError( "Import List Fetch ClientProtocolException: " + e.toString() );
				return;
			} catch( IOException e ) {

				Log.e("fetchSheetList IOException", e.toString() );//TODO HERE
				googleCommError( "Import List Fetch IOException: " + e.toString() );
				return;
			} catch( URISyntaxException e ) {
				
				Log.e("fetchSheetList URISyntaxException", e.toString() );
				googleCommError( "Import List Fetch URISyntaxException: " + e.toString() );
				return;
			}
		}
	};

	/**
	 * Take InputStream and place results in accounts array
	 * 
	 * @param docList
	 */
	private void buildSheetList( final InputStream docList ) {
		
		Log.v( "Progress", "buildSheetList" );

		Thread t = new Thread() {

			public void run() {

				Looper.prepare();

				try {

					Document doc = null;
					DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
					DocumentBuilder db;

					try {

						db = dbf.newDocumentBuilder();
						doc = db.parse( docList );
					} catch( ParserConfigurationException e ) {

						Log.e("buildSheetList ParserConfigurationException", e.toString() );
						googleCommError( e.toString() );
						return;
					} catch( SAXException e ) {

						Log.e("buildSheetList SAXException", e.toString() );
						googleCommError( e.toString() );
						return;
					}

					doc.getDocumentElement().normalize();

					NodeList itemNodes = doc.getElementsByTagName( "entry" );

					importSheetList = new String[ itemNodes.getLength() ];
					importSheetIdList = new String[ itemNodes.getLength() ];

					dialog.setProgress( 35 );

					for( int i = 0; i < itemNodes.getLength(); i++ ) {

						Node itemNode = itemNodes.item( i );

						if( itemNode.getNodeType() == Node.ELEMENT_NODE ) {

							importSheetList[i] = nodeToString( itemNode, "title" );
							importSheetIdList[i] = nodeToString( itemNode, "id" );

							dialog.setProgress( 35 + ( 60 / itemNodes.getLength() ) * ( i + 1 ) );
						}
					}
				} catch( IOException e ) {

					Log.e("buildSheetList IOException", e.toString() );
					googleCommError( "IOException Building Spreadsheet List: " + e.toString() );
					return;
				}

				importHandler.post( showSheetList );
			}
		};
		t.start();
	}

	/**
	 * Finisher for processing thread, show list
	 * 
	 * @param
	 */
	private Runnable showSheetList = new Runnable() {

		public void run() {
			
			Log.v( "Progress", "showSheetList->run()" );

			ListView importAcctList = (ListView) findViewById( R.id.importAcctList );
			importAcctList.setAdapter( new ArrayAdapter<String>( importData.this, R.layout.import_data_item, importSheetList ) );
			importAcctList.setChoiceMode( ListView.CHOICE_MODE_MULTIPLE );

			dialog.setProgress( 100 );

			findViewById( R.id.importInstruction ).setVisibility( View.GONE );
			findViewById( R.id.importLogIn ).setVisibility( View.GONE );
			findViewById( R.id.importListSet ).setVisibility( View.VISIBLE );

			dialog.hide();
		}
	};

	/**
	 * Import all marked when button is clicked
	 */
	private class importSheetsButton implements OnClickListener {

		public void onClick( View v ) {

			dialog.setMessage( "Importing information" );
			dialog.setProgress( 0 );
			dialog.show();

			acctList = new ArrayList<importObj>();
			trsnList = new ArrayList<trsnObj>();

			ListView importAcctList = (ListView) findViewById( R.id.importAcctList );
			SparseBooleanArray checkedItems = importAcctList.getCheckedItemPositions();

			for( int i = 0; i < importSheetList.length; i++ ) {

				if( checkedItems.get( i ) ) {

					acctList.add( new importObj( importSheetList[i], importSheetIdList[i].replaceAll( "(?i).*feeds/spreadsheets/", "" ) ) );
				}
			}

			index = 0;
			
			if( acctList.size() <= 0 ) {

				dialog.setMessage( "Imported 0 transactions" );

				importHandler.postDelayed( cleanUp, 1500 );
				return;
			}

			importAccount();
		}
	}

	/**
	 * Talk to server and return with data. Check data to ensure proper columns. Place data into vars. While data left to fetch, loop.
	 * 
	 * @param index
	 */
	private void importAccount() {

		Thread t = new Thread() {

			public void run() {

				// finish sheet -> push to db -> start next sheet

				String[] docSheets = new String[ 0 ];
				int[] rowCounts = new int[ 0 ];
				boolean loopDoc = true;
				int sheetIndex = 0;

				int errCount = 0;

				updateMessageHandler( "Importing: " + acctList.get( index ).title );

				while( loopDoc ) {// sheets left to query

					updateProgressHandler( ( (float) index / acctList.size() ) * 100 );

					if( errCount > 5 ) {

						importErrorSend( "error=connection" );
						return;
					}

					int currStart = 1;
					int itemsPerPage = 100;

					if( docSheets.length <= 0 ) {

						while( docSheets.length <= 0 ) {

							if( errCount > 5 ) {

								importErrorSend( "error=connection" );
								return;
							}

							try {

								String urlString = "https://spreadsheets.google.com/feeds/worksheets/" + acctList.get( index ).gId + "/private/full";
					            URL url = new URL( urlString );
					            HttpGet httpRequest = null;

					            httpRequest = new HttpGet( url.toURI() );
					            httpRequest.setHeader( "GData-Version", "3.0" );
					            httpRequest.setHeader( "Authorization", token );

					            HttpClient httpclient = new DefaultHttpClient();
					            HttpResponse response = ( HttpResponse ) httpclient.execute( httpRequest );

					            HttpEntity entity = response.getEntity();
					            BufferedHttpEntity bufHttpEntity = new BufferedHttpEntity( entity );
					            
								InputStream sheetConnection = bufHttpEntity.getContent();

								Document doc = null;
								DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
								DocumentBuilder db;

								db = dbf.newDocumentBuilder();
								doc = db.parse( sheetConnection );

								doc.getDocumentElement().normalize();

								NodeList itemNodes = doc.getElementsByTagName( "entry" );

								docSheets = new String[ itemNodes.getLength() ];
								rowCounts = new int[ itemNodes.getLength() ];
								Node itemNode = null;

								for( int i1 = 0; i1 < itemNodes.getLength(); i1++ ) {

									itemNode = itemNodes.item( i1 );

									if( itemNode.getNodeType() == Node.ELEMENT_NODE ) {

										String[] temp = nodeToString( itemNode, "id" ).split( "/" );
										docSheets[i1] = temp[temp.length - 1];

										rowCounts[i1] = nodeToInt( itemNode, "gs:rowCount" );
									}
								}

								if( docSheets.length <= 0 ) {

									loopDoc = false;
								}
							} catch( ParserConfigurationException e ) {

								e.printStackTrace();
								errCount++;
							} catch( SAXException e ) {

								e.printStackTrace();
								errCount++;
							} catch( ClientProtocolException e ) {

								e.printStackTrace();
								errCount++;
							} catch( IOException e ) {

								e.printStackTrace();
								errCount++;
							} catch (URISyntaxException e) {
								
								e.printStackTrace();
								errCount++;
							}
						}
					} else {

						while( currStart <= rowCounts[sheetIndex] ) {

							if( errCount > 5 ) {

								importErrorSend( "error=connection" );
								return;
							}

							try {

								String addy = "https://spreadsheets.google.com/feeds/list/" + // Base link
								acctList.get( index ).gId + "/" + // Doc id
								docSheets[sheetIndex] + // Sheet id
								"/private/full?start-index=" + currStart + "&max-results=" + itemsPerPage;


					            URL url = new URL( addy );
					            HttpGet httpRequest = null;

					            httpRequest = new HttpGet( url.toURI() );
					            httpRequest.setHeader( "GData-Version", "3.0" );
					            httpRequest.setHeader( "Authorization", token );

					            HttpClient httpclient = new DefaultHttpClient();
					            HttpResponse response = ( HttpResponse ) httpclient.execute( httpRequest );

					            HttpEntity entity = response.getEntity();
					            BufferedHttpEntity bufHttpEntity = new BufferedHttpEntity( entity );
					            
								InputStream listConnection = bufHttpEntity.getContent();

								Document doc = null;
								DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
								DocumentBuilder db;

								db = dbf.newDocumentBuilder();
								doc = db.parse( listConnection );

								doc.getDocumentElement().normalize();

								NodeList itemNodes = doc.getElementsByTagName( "entry" );
								Node itemNode = null;

								for( int i1 = 0; i1 < itemNodes.getLength(); i1++ ) {

									itemNode = itemNodes.item( i1 );

									if( itemNode.getNodeType() == Node.ELEMENT_NODE ) {

										int gtId = nodeToInt( itemNode, "gsx:gtid" );
										String date = nodeToString( itemNode, "gsx:date" );
										String desc = nodeToString( itemNode, "gsx:description" );
										Double amount = nodeToDollar( itemNode, "gsx:amount" );
										String checkNum = nodeToString( itemNode, "gsx:checknum" );
										String note = nodeToString( itemNode, "gsx:note" );
										String category = nodeToString( itemNode, "gsx:gtcat" );
										int linkedRecord = nodeToInt( itemNode, "gsx:gtlinkid" );
										String linkedAccount = nodeToString( itemNode, "gsx:gtlinkedaccount" );
										String linkedAccountCat = nodeToString( itemNode, "gsx:gtlinkedaccountcat" );

										String account = nodeToString( itemNode, "gsx:account" );
										if( account.length() <= 0 ) {

											account = acctList.get( index ).title;
										}

										String accountCat = nodeToString( itemNode, "gsx:accountcat" );
										if( accountCat.length() <= 0 ) {

											accountCat = "Imported Account";
										}

										boolean cleared = false;
										String clearedString = nodeToString( itemNode, "gsx:cleared" ).toLowerCase();

										if( clearedString == "0" || clearedString == "no" || clearedString == "not" || clearedString == "false" || clearedString == "" ) {

											cleared = false;
										} else {

											cleared = true;
										}

										trsnList.add( new trsnObj( gtId, account, accountCat, date, desc, amount, cleared, checkNum, note, category, linkedRecord, linkedAccount, linkedAccountCat ) );
									}
								}

								updateProgressHandler( ( ( index + ( ( ( ( (float) currStart / rowCounts[sheetIndex] ) * ( sheetIndex + 1 ) ) / docSheets.length ) ) / 2 ) / ( acctList.size() ) ) * 100 );

								// Next group
								currStart = currStart + itemsPerPage;
							} catch( ParserConfigurationException e ) {

								e.printStackTrace();
								errCount++;
							} catch( SAXException e ) {

								e.printStackTrace();
								errCount++;
							} catch( ClientProtocolException e ) {

								e.printStackTrace();
								errCount++;
							} catch( IOException e ) {

								e.printStackTrace();
								errCount++;
							} catch (URISyntaxException e) {
								
								e.printStackTrace();
								errCount++;
							}
						}

						sheetIndex++;

						if( sheetIndex >= docSheets.length ) {

							loopDoc = false;
						}
					}
				}

				int row = 0;

				ArrayList<ContentValues> trsnGroup = new ArrayList<ContentValues>();

				while( row < trsnList.size() ) {

					trsnObj currObj = trsnList.get( row );
					trsnGroup.add( buildDBObject( currObj ) );

					// every hundred or so records, do a batch insert
					if( row % 100 == 0 ) {

						updateTrsnDb( trsnGroup );

						updateProgressHandler( ( ( ( ( index + ( 1 / 2 ) ) + ( (float) row / trsnList.size() ) / 2 ) / ( acctList.size() ) ) * 100 ) );
					}

					row++;
				}

				// Do the final insert
				updateTrsnDb( trsnGroup );
				updateProgressHandler( ( (float) ( index + 1 ) / ( acctList.size() ) ) * 100 );

				importHandler.post( queryAccountNext );
			}
		};
		
		t.start();
	}

	/**
	 * Decides if import is done
	 */
	private Runnable queryAccountNext = new Runnable() {

		public void run() {

			index++;

			if( index < acctList.size() ) {

				importAccount();
			} else {

				dialog.setMessage( "Imported " + importTrsnCount + " transaction(s)" );

				appState.acctItemsChanged = true;
				appState.trsnItemsChanged = true;

				importHandler.postDelayed( cleanUp, 1500 );
			}
		}
	};

	private Runnable cleanUp = new Runnable() {

		public void run() {

			dialog.dismiss();
			importData.this.finish();
		}
	};

	/**
	 * Takes an XML Node and a NodeName and returns the content of the named node
	 * 
	 * @param itemNode
	 * @param NodeName
	 * @return
	 */
	private String nodeToString( Node itemNode, String NodeName ) {

		try {

			Element itemElement = (Element) itemNode;

			NodeList descNodes = ( itemElement ).getElementsByTagName( NodeName );

			Element descElement = (Element) descNodes.item( 0 );

			NodeList descTextNodes = ( (Node) descElement ).getChildNodes();

			return appState.stringFormatter( ( (Node) descTextNodes.item( 0 ) ).getNodeValue() );
		} catch( Exception ex ) {

			return "";
		}
	}

	/**
	 * Returns int version of above
	 * 
	 * @param itemNode
	 * @param NodeName
	 * @return
	 */
	private int nodeToInt( Node itemNode, String NodeName ) {

		try {

			return Integer.parseInt( nodeToString( itemNode, NodeName ) );
		} catch( NumberFormatException nfe ) {

			return -1;
		}
	}

	/**
	 * Returns double version of above
	 * 
	 * @param itemNode
	 * @param NodeName
	 * @return
	 */
	private double nodeToDollar( Node itemNode, String NodeName ) {

		try {

			String nodeText = nodeToString( itemNode, NodeName );

			StringBuffer strBuff = new StringBuffer();
			char c;
			boolean decimalFound = false;
			boolean negative = false;

			for( int i = 0; i < nodeText.length(); i++ ) {

				c = nodeText.charAt( i );

				if( Character.isDigit( c ) ) {

					strBuff.append( c );
				} else if( c == '.' && decimalFound == false ) {

					strBuff.append( c );
					decimalFound = true;
				} else if( c == '-' ) {

					negative = true;
				}
			}

			Double value = Double.parseDouble( strBuff.toString() );

			if( negative ) {

				value = value * -1;
			}

			return value;
		} catch( NumberFormatException nfe ) {

			return 0.0;
		}
	}

	/**
	 * Takes a trsnObj and converts it to a ContentValue for DB insert
	 * 
	 * @param trsn
	 * @return
	 */
	private ContentValues buildDBObject( trsnObj trsn ) {

		ContentValues currTrsn = new ContentValues();

		trsn.accountId = findOrCreateAccount( trsn.account, trsn.accountCat );

		if( trsn.linkedAccount.length() > 0 && trsn.linkedAccountCat.length() > 0 && trsn.linkedRecord >= 0 ) {

			trsn.linkedAccountId = findOrCreateAccount( trsn.linkedAccount, trsn.linkedAccountCat );

			if( trsn.linkedAccountId >= 0 && trsn.linkedRecord >= 0 ) {

				currTrsn.put( "linkedRecord", trsn.linkedRecord );
				currTrsn.put( "linkedAccount", trsn.linkedAccountId );
			}
		}

		currTrsn.put( "itemId", trsn.gtId );
		currTrsn.put( "desc", trsn.desc );
		currTrsn.put( "amount", trsn.amount );
		currTrsn.put( "note", trsn.note );
		currTrsn.put( "account", trsn.accountId );
		currTrsn.put( "category", trsn.category );
		currTrsn.put( "cleared", ( trsn.cleared ? "1" : "0" ) );
		currTrsn.put( "checkNum", trsn.checkNum );

		Date trsnDate;

		SimpleDateFormat curFormater = new SimpleDateFormat( "MM/dd/yyyy hh:mm:ss" );

		try {

			trsnDate = curFormater.parse( trsn.date );
		} catch( java.text.ParseException e ) {

			curFormater = new SimpleDateFormat( "MM/dd/yyyy" );

			try {

				trsnDate = curFormater.parse( trsn.date );
			} catch( java.text.ParseException e1 ) {

				curFormater = new SimpleDateFormat( "EEE, dd MMM yyyy HH:mm:ss Z" );

				try {

					trsnDate = curFormater.parse( trsn.date );
				} catch( java.text.ParseException e2 ) {

					DateFormat df = DateFormat.getDateInstance( DateFormat.FULL, Locale.ENGLISH );

					try {

						trsnDate = df.parse( trsn.date );
					} catch( java.text.ParseException e3 ) {

						df = DateFormat.getDateInstance( DateFormat.LONG, Locale.ENGLISH );

						try {

							trsnDate = df.parse( trsn.date );
						} catch( java.text.ParseException e4 ) {

							df = DateFormat.getDateInstance( DateFormat.MEDIUM, Locale.ENGLISH );

							try {

								trsnDate = df.parse( trsn.date );
							} catch( java.text.ParseException e5 ) {

								df = DateFormat.getDateInstance( DateFormat.SHORT, Locale.ENGLISH );

								try {

									trsnDate = df.parse( trsn.date );
								} catch( java.text.ParseException e6 ) {

									trsnDate = new Date();
								}
							}
						}
					}
				}
			}
		}

		currTrsn.put( "date", trsnDate.getTime() );

		return currTrsn;
	}

	/**
	 * Find or create account with posted name and category
	 * 
	 * @param name
	 * @param cat
	 * @return long
	 */
	public long findOrCreateAccount( String name, String cat ) {

		// TODO check for account cat?

		Long acctId;

		if( knownAccts.containsKey( name + "|+|" + cat ) ) {

			acctId = knownAccts.getAsLong( name + "|+|" + cat );
		} else {

			Cursor accts = appdb.query( "accounts", new String[] { "acctId" }, "acctName=? AND acctCategory=?", new String[] { name, cat }, null, null, null );

			if( accts.getCount() <= 0 ) {

				ContentValues newAcct = new ContentValues();

				newAcct.put( "acctName", name );
				newAcct.put( "acctNotes", "" );
				newAcct.put( "acctCategory", cat );
				newAcct.put( "sort", "1" );
				newAcct.put( "defaultAccount", 0 );
				newAcct.put( "frozen", 0 );
				newAcct.put( "hidden", 0 );
				newAcct.put( "acctLocked", 0 );
				newAcct.put( "lockedCode", "" );
				newAcct.put( "transDescMultiLine", 0 );
				newAcct.put( "showTransTime", 0 );
				newAcct.put( "useAutoComplete", 1 );
				newAcct.put( "atmEntry", 0 );

				acctId = appdb.insert( "accounts", null, newAcct );
			} else {

				accts.moveToFirst();
				acctId = accts.getLong( accts.getColumnIndex( "acctId" ) );
			}

			accts.close();

			knownAccts.put( name + "|+|" + cat, acctId );
		}

		return acctId;
	}

	/**
	 * Takes a group of ContentValues and inserts them in a batch to the DB
	 * 
	 * @param trsnGroup
	 */
	public void updateTrsnDb( ArrayList<ContentValues> trsnGroup ) {

		try {

			appdb.beginTransaction();

			for( int i = 0; i < trsnGroup.size(); i++ ) {

				ContentValues trsn = trsnGroup.get( i );

				if( trsn.getAsInteger( "itemId" ) < 0 ) {

					trsn.remove( "itemId" );
					appdb.insert( "expenses", null, trsn );
				} else {

					boolean isLinked = false;

					try {

						ContentValues linked = new ContentValues();
						linked.putAll( trsn );

						int linkedRecord = linked.getAsInteger( "linkedRecord" );
						long linkedAccount = linked.getAsLong( "linkedAccount" );

						if( linkedRecord > 0 && linkedAccount >= 0 ) {

							linked.put( "amount", ( -1 * linked.getAsDouble( "amount" ) ) );
							linked.put( "linkedRecord", linked.getAsInteger( "itemId" ) );
							linked.put( "linkedAccount", linked.getAsLong( "account" ) );

							linked.put( "itemId", linkedRecord );
							linked.put( "account", linkedAccount );

							if( appdb.update( "expenses", linked, "itemId=?", new String[] { linkedRecord + "" } ) >= 1 ) {

								isLinked = true;
							}
						}
					} catch( Exception e ) {

						// Do nothing, record actually doesn't exist
					}

					if( !isLinked ) {

						trsn.remove( "linkedRecord" );
						trsn.remove( "linkedAccount" );
						appdb.replace( "expenses", null, trsn );
					} else {

						appdb.replace( "expenses", null, trsn );
					}
				}
			}

			appdb.setTransactionSuccessful();

			importTrsnCount += trsnGroup.size();

			trsnGroup.clear();// only empty group if transaction is successful
		} catch( SQLException e ) {

			e.printStackTrace();
		} finally {

			appdb.endTransaction();
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

	/**
	 * This, associated handler, and associated function revert to the log in page and display the error message.
	 * 
	 * @param err
	 */
	private void importErrorSend( String err ) {

		Message errMsg = importError.obtainMessage();
		Bundle bErr = new Bundle();
		bErr.putString( "err", err );
		errMsg.setData( bErr );
		importError.sendMessage( errMsg );
	}

	final Handler importError = new Handler() {

		public void handleMessage( Message msg ) {

			googleCommError( msg.getData().getString( "err" ) );
		}
	};

	private void googleCommError( String err ) {

		TextView errTxt = (TextView) findViewById( R.id.importError );

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

	private class importObj {

		String title;
		String gId;

		public importObj( String name, String id ) {

			title = name;
			gId = id;
		}
	}

	private class trsnObj {

		int gtId;
		String account;
		String accountCat;
		long accountId;
		String date;
		String desc;
		Double amount;
		boolean cleared;
		String checkNum;
		String note;
		String category;
		int linkedRecord;
		String linkedAccount;
		String linkedAccountCat;
		long linkedAccountId;

		trsnObj( int gtIdIn, String accountIn, String accountCatIn, String dateIn, String descIn, Double amountIn, boolean clearedIn, String checkNumIn, String noteIn, String categoryIn, int linkedRecordIn, String linkedAccountIn, String linkedAccountCatIn ) {

			gtId = gtIdIn;
			account = accountIn;
			accountCat = accountCatIn;
			accountId = -1;
			date = dateIn;
			desc = descIn;
			amount = amountIn;
			cleared = clearedIn;
			checkNum = checkNumIn;
			note = noteIn;
			category = categoryIn;
			linkedRecord = linkedRecordIn;
			linkedAccount = linkedAccountIn;
			linkedAccountCat = linkedAccountCatIn;
			linkedAccountId = -1;
		}
	}
}