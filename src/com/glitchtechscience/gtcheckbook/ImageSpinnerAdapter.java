package com.glitchtechscience.gtcheckbook;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;

public class ImageSpinnerAdapter extends ArrayAdapter<String> {

	ArrayList<String> data;
	checkbook appState;
	Context context;
	int layout;

	public ImageSpinnerAdapter( Context arg_context, ArrayList<String> objects, checkbook arg_appState ) {
		
		this( arg_context, R.layout.l_icon_item, objects, arg_appState );
	}

	public ImageSpinnerAdapter( Context arg_context, int resource, ArrayList<String> objects, checkbook arg_appState ) {

		super( arg_context, resource, objects );

		context = arg_context;
		data = objects;
		appState = arg_appState;
		layout = resource;
	}

	@Override
	public View getView( int position, View convertView, ViewGroup parent ) {

		return getImageView( position, convertView, parent );
	}

	@Override
	public View getDropDownView( int position, View convertView, ViewGroup parent ) {

		return getImageView( position, convertView, parent );
	}

	private View getImageView( int position, View convertView, ViewGroup parent ) {

		View v = convertView;
		if( v == null ) {

			v = LayoutInflater.from( context ).inflate( layout, parent, false );
		}

		String iconStr = data.get( position );
		ImageView ico_item = ( ImageView )v.findViewById( R.id.l_icon_item );

		if( iconStr != null && ico_item != null ) {

			ico_item.setImageResource( appState.getResourceFromString( iconStr ) );
		}

		return v;
	}
}
