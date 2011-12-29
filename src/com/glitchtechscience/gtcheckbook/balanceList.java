package com.glitchtechscience.gtcheckbook;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

public class balanceList extends Dialog {

	public interface ReadyListener {

		public void ready( String string );
	}

	private ReadyListener readyListener;

	private checkbook appState;

	private String title;
	private double[] balances;

	public balanceList( Context context, String title, double[] balances, ReadyListener readyListener ) {

		super( context );
		requestWindowFeature( Window.FEATURE_NO_TITLE );

		this.readyListener = readyListener;

		this.title = title;
		this.balances = balances;

		this.appState = ( ( checkbook )this.getContext().getApplicationContext() );
	}

	@Override
	public void onCreate( Bundle savedInstanceState ) {

		super.onCreate( savedInstanceState );

		setContentView( R.layout.balancelist );

		( ( TextView )findViewById( R.id.balancelist_title ) ).setText( this.title );

		ListView l1 = ( ListView )findViewById( R.id.balancelist_list );
		balanceListAdapter bladapter = new balanceListAdapter( this.getContext(), R.layout.balancelist_item, 0, this.balances );
		l1.setAdapter( bladapter );
	}

	public class balanceListAdapter extends ArrayAdapter<String> {

		private double[] values;

		public balanceListAdapter( Context context, int resource, int textViewResourceId, double[] objects ) {

			super( context, resource, textViewResourceId, new String[objects.length] );

			this.values = objects;
		}

		class ViewHolder {

			public TextView value;
			public TextView desc;
			public TextView idx;
		}

		public View getView( int position, View convertView, ViewGroup parent ) {

			ViewHolder holder;

			View rowView = convertView;

			if( rowView == null ) {

				LayoutInflater inflater = getLayoutInflater();
				rowView = inflater.inflate( R.layout.balancelist_item, null, true );

				holder = new ViewHolder();
				holder.value = ( TextView )rowView.findViewById( R.id.balancelist_value );
				holder.desc = ( TextView )rowView.findViewById( R.id.balancelist_desc );
				holder.idx = ( TextView )rowView.findViewById( R.id.balancelist_i );

				rowView.setTag( holder );
			} else {

				holder = ( ViewHolder )rowView.getTag();
			}

			appState.setAccountBalanceColorLight( holder.value, values[position] );
			holder.idx.setText( "" + position );

			switch( position ) {
				case 0:
					holder.desc.setText( "Available" );
					break;
				case 1:
					holder.desc.setText( "Cleared" );
					break;
				case 2:
					holder.desc.setText( "Pending" );
					break;
				case 3:
					holder.desc.setText( "Final" );
					break;
				case 4:
					holder.desc.setText( "Default" );
					break;
				default:
					holder.desc.setText( "N/A" );
			}

			rowView.setOnClickListener( new View.OnClickListener() {

				public void onClick( View v ) {

					TextView tv = ( TextView )v.findViewById( R.id.balancelist_i );

					readyListener.ready( tv.getText().toString() );
					dismiss();
				}
			} );

			return rowView;
		}
	}
}