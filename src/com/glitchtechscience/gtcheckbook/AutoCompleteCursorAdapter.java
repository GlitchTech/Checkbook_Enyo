package com.glitchtechscience.gtcheckbook;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CursorAdapter;
import android.widget.Filterable;
import android.widget.TextView;

public class AutoCompleteCursorAdapter extends CursorAdapter implements Filterable {
	
	SQLiteDatabase db;
	String filterQuery;
	String dispCol;

	public AutoCompleteCursorAdapter( Context context, Cursor c, SQLiteDatabase arg_db, String arg_filterQuery, String arg_dispCol ) {

		super( context, c );
		
		this.db = arg_db;
		this.filterQuery = arg_filterQuery;
		this.dispCol = arg_dispCol;
	}

	@Override
	public View newView( Context context, Cursor c, ViewGroup parent ) {

		return LayoutInflater.from( context ).inflate( R.layout.l_item, parent, false );

	}

	@Override
	public void bindView( View v, Context context, Cursor c ) {

		TextView descField = ( TextView )v.findViewById( R.id.text1 );

		descField.setText( this.convertToString( c ) );
	}

	@Override
	public String convertToString( Cursor c ) {

		return c.getString( c.getColumnIndex( this.dispCol ) );
	}

	@Override
	public Cursor runQueryOnBackgroundThread( CharSequence constraint ) {

		if( getFilterQueryProvider() != null ) {

			return getFilterQueryProvider().runQuery( constraint );
		}

		String[] args = null;

		if( constraint != null ) {

			args = new String[] {
				"%" + constraint.toString().toUpperCase() + "%"
			};
		} else {

			args = new String[] {
				""
			};
		}

		Cursor c = this.db.rawQuery( this.filterQuery, args );

		return c;
	}
}