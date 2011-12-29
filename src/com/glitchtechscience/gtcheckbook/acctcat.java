package com.glitchtechscience.gtcheckbook;

import java.util.HashMap;
import java.util.List;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;

public class acctcat extends Activity {

	private checkbook appState;

	private catListAdapter catListAdapter;
	private List<HashMap<String, String>> cats;

	private ProgressDialog dialog;

	@Override
	public void onCreate( Bundle icicle ) {

		super.onCreate( icicle );
		setContentView( R.layout.acctcat );

		appState = ( ( checkbook )getApplicationContext() );

		dialog = new ProgressDialog( acctcat.this );
		dialog.setIndeterminate( false );
		dialog.setCancelable( false );

		setUpBttnBindings();

		// TODO tap to edit one (two edit text fields in a popup)
	}

	@Override
	public void onResume() {

		super.onResume();

		setUpListView();

		try {

			dialog.hide();
		} catch( Exception ex ) {

		}
	}

	@Override
	public void onDestroy() {

		dialog.dismiss();

		super.onDestroy();
	}

	public void setUpListView() {

		appState.setAcctCategory();

		cats = appState.getAcctCategories();

		String[] dataCols = new String[] { "name" };
		int[] dispFields = new int[] { R.id.acctcat_item_name };

		catListAdapter = new catListAdapter( this, cats, R.layout.acctcat_item, dataCols, dispFields );

		ListView l1 = ( ListView )findViewById( android.R.id.list );
		l1.setAdapter( catListAdapter );
	}

	/** Bottom control bindings **/
	public void setUpBttnBindings() {

		findViewById( R.id.addAcctCatBttn ).setOnClickListener( new OnClickListener() {

			public void onClick( View arg0 ) {

				dialog.setTitle( "Processing" );
				dialog.setMessage( "Please wait..." );
				dialog.show();

				Intent i = new Intent( acctcat.this, acctcat_AddEdit.class );
				Bundle b = new Bundle();

				b.putLong( "catId", -1 );
				b.putString( "name", "" );

				i.putExtras( b );
				startActivity( i );
			}
		} );
	}

	/** List Adapter **/
	private class catListAdapter extends SimpleAdapter {

		private List<HashMap<String, String>> catListData;

		public catListAdapter( Context context, List<HashMap<String, String>> data, int resource, String[] from, int[] to ) {

			super( context, data, resource, from, to );

			layout = resource;
			catListData = data;
		}

		private int layout;

		@Override
		public View getView( int position, View convertView, ViewGroup parent ) {

			View v = convertView;
			if( v == null ) {

				v = LayoutInflater.from( getBaseContext() ).inflate( layout, parent, false );
			}

			HashMap<String, String> obj = catListData.get( position );

			// rowid AS _id, rowid, name, icon, color, catOrder

			final String id = obj.get( "rowid" );
			final String name = obj.get( "name" );
			String icon = obj.get( "icon" );
			// String color = obj.get( "color" );

			v.setOnClickListener( new OnClickListener() {

				public void onClick( View v ) {

					dialog.setTitle( "Loading Data" );
					dialog.setMessage( "Please wait..." );
					dialog.show();

					Intent i = new Intent( acctcat.this, acctcat_AddEdit.class );
					Bundle b = new Bundle();

					try {

						b.putLong( "catId", Integer.parseInt( id ) );
					} catch( NumberFormatException ex ) {

						b.putLong( "catId", -1 );
					}

					b.putString( "name", name );

					i.putExtras( b );
					startActivity( i );
				}
			} );

			( ( TextView )v.findViewById( R.id.acctcat_item_name ) ).setText( name );

			try {

				( ( ImageView )v.findViewById( R.id.acctcat_item_icon ) ).setImageResource( Integer.parseInt( icon ) );
			} catch( NumberFormatException ex ) {

				( ( ImageView )v.findViewById( R.id.acctcat_item_icon ) ).setImageResource( R.drawable.icon );
			}

			return v;
		}
	}
};