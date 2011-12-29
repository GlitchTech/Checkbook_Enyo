package com.glitchtechscience.gtcheckbook;

import android.app.Dialog;
import android.content.Context;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class pin_set extends Dialog implements OnClickListener {

	private EditText pin_1, pin_2;
	private Button okButton, cancelButton;

	public interface ReadyListener {

		public void ready( String key, String disp );
	}

	@SuppressWarnings("unused" )
	private String name, disp;
	private ReadyListener readyListener;

	public pin_set( Context context, ReadyListener readyListener ) {

		super( context );
		requestWindowFeature( Window.FEATURE_NO_TITLE );

		this.readyListener = readyListener;
	}

	@Override
	public void onCreate( Bundle savedInstanceState ) {

		super.onCreate( savedInstanceState );

		setContentView( R.layout.pin_set );

		setTitle( "PIN Code" );

		okButton = ( Button ) findViewById( R.id.okButton );
		okButton.getBackground().setColorFilter( 0xFF00FF00, PorterDuff.Mode.MULTIPLY );

		cancelButton = ( Button ) findViewById( R.id.cancelButton );
		cancelButton.getBackground().setColorFilter( 0xFFFF0000, PorterDuff.Mode.MULTIPLY );

		pin_1 = ( EditText ) findViewById( R.id.pin_1 );
		pin_2 = ( EditText ) findViewById( R.id.pin_2 );

		okButton.setOnClickListener( this );
		cancelButton.setOnClickListener( this );
	}

	public void onClick( View v ) {

		switch( v.getId() ) {
			case R.id.okButton:
				// check to see if they match
				String pin1T = pin_1.getText().toString();
				String pin2T = pin_2.getText().toString();

				if( !( pin1T.equals( "" ) || pin1T.length() <= 0 ) && pin1T.equals( pin2T ) ) {

					int limit = pin1T.length();
					String falseKey = "";
					for( int i = 0; i < limit; i++ ) {

						falseKey += "*";
					}

					readyListener.ready( pin1T, falseKey );
					dismiss();
				} else {

					TextView error = ( TextView ) findViewById( R.id.pin_error );
					error.setText( "PIN Codes do not match.\nPlease try again." );
					error.setError( "" );
					error.setVisibility( View.VISIBLE );
				}
				break;
			case R.id.cancelButton:
				cancel();
				break;
		}
	}
}