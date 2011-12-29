package com.glitchtechscience.gtcheckbook;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;

public class help extends Activity {

	@Override
	public void onCreate( Bundle savedInstanceState ) {

		super.onCreate( savedInstanceState );

		setContentView( R.layout.help );

		findViewById( R.id.websitebutton ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				Intent viewIntent = new Intent( "android.intent.action.VIEW", Uri.parse( "http://glitchtechscience.com" ) );
				startActivity( viewIntent );
			}
		} );

		findViewById( R.id.email ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				Intent emailIntent = new Intent( android.content.Intent.ACTION_SEND );

				emailIntent.putExtra( android.content.Intent.EXTRA_EMAIL, new String[] { "glitchtechscience@gmail.com" } );
				emailIntent.putExtra( android.content.Intent.EXTRA_SUBJECT, "GlitchTech Checkbook Contact Request" );
				emailIntent.putExtra( android.content.Intent.EXTRA_TEXT, "" );

				emailIntent.setType( "text/plain" );

				startActivity( Intent.createChooser( emailIntent, "Send mail..." ) );
			}
		} );
	}
}