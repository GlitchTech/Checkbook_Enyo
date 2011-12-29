package com.glitchtechscience.gtcheckbook;

// TODO Transactions
// TODO Transactions (Add/Edit)
// TODO Prefences
// TODO Trans Cat
// TODO Trans Cat Add/Edit
// TODO Acct Cat
// TODO Acct Cat Add/Edit
// TODO Budget
// TODO Budget Add/Edit
// TODO Reports
// TODO Running balance
// TODO Security system

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;

public class splash extends Activity {

	private ProgressDialog dialog;

	// Handler for callbacks to the UI thread
	final Handler mHandler = new Handler();

	/*
	 * // License Verification
	 * private LicenseCheckerCallback mCheckerCallback;
	 * private LicenseChecker mChecker;
	 * private static final String BASE64_PUBLIC_KEY =
	 * "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmjdLmvsFKeZa4RKfOnVuzwvJ40qHRiB2vvqPzMOlvqwqdu5Mx/Ip4GyxFv6P/HNBT3d4n+LknY69hq6FauDHftsMnXiR1dsei5MxonxbyC1Q+z2WzgtHjEIU+NvsVVmtwR4oLNBYIdGyBdi/6U+qvKI4qaylq23TAtF4jriHLStU8GJCqNHx6420Pd2oYHKbkBVlIMvnAfaWIkeFTa47DdtI73avd9ya15Zzt8mdnJnZq/M41vJ5Q20rd5ItPR0u2vLoWyp+4gs6wgFGbz7qQZ8C4TcmeiCbYPQaR3LXafJIatpiH2h7tgOypv86gLqwXiNY8j8zu9ISGCks4455OQIDAQAB"
	 * ;
	 * private static final byte[] SALT = new byte[] { -10, -11, -13, -107, -82, -23, -36, -45, -57, -65, -84, -45, 123, 32, 111, 68, 44, 65, 27, 78, 43, 32 };
	 */
	public String licenseErrorStr = "";

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.splash );

		// Build and display dialog
		dialog = new ProgressDialog( splash.this );
		dialog.setTitle( "Loading Checkbook" );
		dialog.setMessage( "Please wait..." );
		dialog.setIndeterminate( true );
		dialog.setCancelable( false );
		dialog.show();

		startApp();// TESTING PURPOSES ONLY! DO NOT USE WITH verifyLicense();
		// verifyLicense();
	}

	protected void startApp() {

		// Set up the DB & global accounts in a separate thread
		dialog.setMessage( "Building data services..." );

		Thread t = new Thread() {

			public void run() {

				checkbook appState = ( (checkbook) getApplicationContext() );
				appState.setAppDatabase();

				appState.loadAppPrefs();

				appState.loadAppDataDrops();

				appState.acctItemsChanged = false;

				// TODO check for default account

				// Thread done running handler
				mHandler.post( mUpdateResults );
			}
		};
		t.start();
	}

	/*
	 * private void verifyLicense() {
	 * dialog.setMessage( getString( R.string.checking_license ) );
	 * // Get device information
	 * String deviceId = Settings.Secure.getString( getContentResolver(), Settings.Secure.ANDROID_ID );
	 * // Verify license
	 * mCheckerCallback = new checkbookLicenseCheck();
	 * mChecker = new LicenseChecker( this, new ServerManagedPolicy( this, new AESObfuscator( SALT, getPackageName(), deviceId ) ), BASE64_PUBLIC_KEY );
	 * mChecker.checkAccess( mCheckerCallback );
	 * }
	 * private class checkbookLicenseCheck implements LicenseCheckerCallback {
	 * public void allow() {
	 * mHandler.post( licenseAllow );
	 * }
	 * public void dontAllow() {
	 * mHandler.post( licenseDontAllow );
	 * }
	 * public void applicationError( ApplicationErrorCode errorCode ) {
	 * licenseErrorStr = errorCode.toString();
	 * mHandler.post( licenseError );
	 * }
	 * }
	 */
	// Create runnable for posting
	final Runnable mUpdateResults = new Runnable() {

		public void run() {

			dialog.setMessage( "Loading account information..." );
			loadAccts();
		}
	};
	final Runnable licenseAllow = new Runnable() {

		public void run() {

			startApp();
		}
	};

	final Runnable licenseDontAllow = new Runnable() {

		public void run() {

			dialog.setTitle( "Checkbook Error" );
			dialog.setMessage( "Unable to verify license. Please verify app has been purchased." );
		}
	};

	final Runnable licenseError = new Runnable() {

		public void run() {

			dialog.setTitle( "Checkbook Error" );
			dialog.setMessage( "Something wrong and the system is unable to verify license. Please contact the developer with the following message: " + ( licenseErrorStr.length() > 0 ? licenseErrorStr : "" ) );
		}
	};

	protected void loadAccts() {

		startActivity( new Intent( splash.this, accounts.class ) );
		this.finish();
		dialog.dismiss();
	}

	@Override
	public void onDestroy() {

		super.onDestroy();

		try {

			//mChecker.onDestroy();
		} catch( Exception ex ) {}
	}
}
