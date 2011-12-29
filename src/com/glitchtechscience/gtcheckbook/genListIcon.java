package com.glitchtechscience.gtcheckbook;

import android.app.Dialog;
import android.content.Context;
import android.database.Cursor;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.TextView;

public class genListIcon extends Dialog {

	public interface ReadyListener {

		public void ready( String key );
	}

	private ReadyListener readyListener;
	private Cursor c;
	private String[] qryCols;
	private String title;

	private checkbook appState;

	public genListIcon( Context context, String title, Cursor c, String descCol, String iconCol, String idCol, ReadyListener readyListener ) {

		super( context );
		requestWindowFeature( Window.FEATURE_NO_TITLE );

		this.appState = ( (checkbook) this.getContext().getApplicationContext() );

		this.readyListener = readyListener;

		this.c = c;
		this.qryCols = new String[] { idCol, descCol, iconCol };
		this.title = title;
	}

	@Override
	public void onCreate( Bundle savedInstanceState ) {

		super.onCreate( savedInstanceState );

		setContentView( R.layout.genlisticon );

		( (TextView) findViewById( R.id.genlisticon_title ) ).setText( this.title );

		int[] dispFields = new int[] { R.id.genlisticon_id, R.id.genlisticon_icon, R.id.genlisticon_text };

		ListView l1 = (ListView) findViewById( R.id.genlisticon_list );
		genList_listview gladapter = new genList_listview( this.getContext(), R.layout.genlisticon_item, this.c, this.qryCols, dispFields );
		l1.setAdapter( gladapter );
	}

	public void onDestroy() {

		this.c.close();
	}

	public class genList_listview extends SimpleCursorAdapter {

		private int layout;

		private String[] fromCols;

		public genList_listview( Context context, int layout, Cursor c, String[] from, int[] to ) {

			super( context, layout, c, from, to );

			this.layout = layout;
			this.fromCols = from;
		}

		@Override
		public View newView( Context context, Cursor c, ViewGroup parent ) {

			return LayoutInflater.from( context ).inflate( layout, parent, false );
		}

		@Override
		public void bindView( View v, Context context, Cursor c ) {

			TextView id = (TextView) v.findViewById( R.id.genlisticon_id );
			TextView desc = (TextView) v.findViewById( R.id.genlisticon_text );
			ImageView icon = (ImageView) v.findViewById( R.id.genlisticon_icon );

			if( id != null ) {

				id.setText( appState.stringFormatter( c.getString( c.getColumnIndex( this.fromCols[0] ) ) ) );
			}

			if( desc != null ) {

				desc.setText( appState.stringFormatter( c.getString( c.getColumnIndex( this.fromCols[1] ) ) ) );
			}

			if( icon != null ) {

				icon.setImageResource( appState.getResourceFromString( c.getString( c.getColumnIndex( this.fromCols[2] ) ) ) );
			}

			v.setOnClickListener( new android.widget.AdapterView.OnClickListener() {

				public void onClick( View v2 ) {

					TextView tv = (TextView) v2.findViewById( R.id.genlisticon_id );

					readyListener.ready( tv.getText().toString() );
					dismiss();
				}
			} );
		}
	}
}