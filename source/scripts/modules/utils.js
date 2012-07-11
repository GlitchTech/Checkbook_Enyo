/**********************/
/** Amount Functions **/
/**********************/

function prepAmount( amount ) {

	return( Math.round( amount * 100 ) / 100 );
}

/** Properly format the amount for display **/
function formatAmount( amount ) {

	if( !amount ) {

		amount = 0;
	}

	return amount.formatCurrency( 2, "$", ".", "," );
}

/** Convert amount display version to number **/
function deformatAmount( amount ) {

	amount = amount.trim();

	if( !amount ) {
		//If null or undefined

		return 0;
	}

	if( isNaN( amount ) ) {
		//If not a standard JS number

		//Check for (xxx.xx) style negative
		var negative = ( amount[0] === "(" && amount[amount.length - 1] === ")" );

		//Remove all letters and currency symbols
		amount = amount.replace( /[^0-9\s,'".-]*/g, "" ).trim();

		var decimal = amount.length;

		if( decimal <= 0 ) {

			return 0;
		}

		//Look for decimal character (only check for 1/100 style numbers)
		var i = 3;
		var len = amount.length - 1;
		while( i-- ) {

			if( amount[len - i] && amount[len - i] !== "-" && isNaN( amount[len - i] ) ) {

				decimal = len - i;
				break;
			}
		}

		var major = amount.slice( 0, decimal );
		var minor = amount.slice( decimal );

		amount = ( ( negative || major[0] == "-" ) ? "-" : "" ) + major.replace( /[^0-9]*/g, "" ) + "." + minor.replace( /[^0-9]*/g, "" );
	}

	if( amount == "" || isNaN( amount ) ) {

		return 0;
	}

	return( parseFloat( amount ) );
}

/**********************/
/** Image  Functions **/
/**********************/

/** Create image object **/
function createImageObject( inSrc ) {

	var newImage = document.createElement( "img" );
	newImage.setAttribute( 'src', inSrc );

	return newImage;
}

/** Convert Image to Grayscale **/
function imgToGrey( inSrc ) {

	var colorImage = createImageObject( inSrc );

	var canvas = document.createElement( 'canvas' );
	var canvasContext = canvas.getContext( '2d' );

	canvas.width = colorImage.width;
	canvas.height = colorImage.height;

	canvasContext.drawImage( colorImage, 0, 0 );

	var imgPixels = canvasContext.getImageData( 0, 0, colorImage.width, colorImage.height );

	for( var y = 0; y < imgPixels.height; y++ ){

		for( var x = 0; x < imgPixels.width; x++ ){

			var i = ( y * 4 ) * imgPixels.width + x * 4;
			var avg = ( imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2] ) / 3;

			imgPixels.data[i] = avg;
			imgPixels.data[i + 1] = avg;
			imgPixels.data[i + 2] = avg;
		}
	}

	canvasContext.putImageData( imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height );

	return canvas.toDataURL();
}
