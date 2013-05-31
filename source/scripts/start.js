enyo.ready( function() {

	if( !window.Checkbook.app ) {

		alert( "No application build found." );
	}

	//Logging level based on release status
	//enyo.setLogLevel( enyo.fetchAppInfo()['id'].match( "beta" ) ? enyo.logging['levels']['log'] : enyo.logging['levels']['error'] );

	enyo.log( "Checkbook :: Activating touch scrolling mode" );
	enyo.Scroller.touchScrolling = true;

	enyo.log( "Checkbook :: Applying webworks listenter" );
	enyo.dispatcher.listen( document, "webworksready" );

	enyo.log( "Checkbook :: Rendering application" );
	new Checkbook.app().renderInto( document.body );

	//Not a mobile device
	if( !enyo.platform.touch ) {

		enyo.log( "Checkbook :: Touchless environment, launching application" );
		enyo.Signals.send( "ondeviceready", {} );
	}

});
