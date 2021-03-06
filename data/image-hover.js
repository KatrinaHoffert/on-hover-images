///////////////////
// Configuration //
///////////////////

/**
 * These are extensions at the end of URLs that will cause the URL to be treated like an image.
 * Separate extensions with a vertical bar. Case insensitive. Note that if the URL cannot be
 * displayed in an <img> tag, it will not be displayed no matter what extension it has.
 */
var imageExtensions = "jpg|jpeg|gif|png|svg";

/**
 * Percentage of padding to use for large images. We don't want to flood the entire screen with an
 * image, so we shrink it to fit within the screen and the padding.
 */
var padding = 0.10;

/**
 * If true, additional output is created in the console.
 */
var DEBUG = true;

//////////////////////////////////////
// From here on is the regular code //
// Nothing further configurable     //
//////////////////////////////////////

if(DEBUG) console.log("On-hover image is working correctly. Page is: " + window.location.href);

/**
 * The URL of the currently active hover. Used so that we can enforce only one hover being shown at
 * a time, but not remove hovers if we move over the same link (or a different part of the same
 * anchor).
 */
var hoverUrl;

/**
 * Main div that is displayed when hovering over image link (and destroyed when we remove the
 * mouse).
 */
var hoverDiv;

/**
 * Stores x-coord of mouse at time of hover. Used so we can determine when the mouse moves away
 * (since the link may be underneith the hover).
 */
var hoverX;

/**
 * Corresponding y-coord for `hoverX`.
 */
var hoverY;

/**
 * Called when the script is fully loaded, initializing all anchors to images with the hover script.
 */
function init()
{
	var allAnchors = document.getElementsByTagName("a");
	var foundImage = false;

	for(var i = 0; i < allAnchors.length; i++)
	{
		var anchor = allAnchors[i];

		// Finds all anchors that link to images
		var matcher = new RegExp(".*\\.(" + imageExtensions + ")$");
		if(matcher.test(anchor.href, "i"))
		{
			foundImage = true;
			anchor.addEventListener("mouseover", mouseOver);
		}
	}

	if(foundImage) document.body.addEventListener("mousemove", mouseOut);
}

/**
 * Called when the mouse hovers over an image link.
 * @param event The MouseEvent that triggered this function.
 */
function mouseOver(event)
{
	var url = event.target.href;
	hoverX = event.clientX;
	hoverY = event.clientY;

	if(DEBUG) console.log("Hovered over: " + url);
	isValidImageUrl(url, constructHover);
}

/**
 * Called when the mouse moves. Used to check whether or not we've moved from the "hover location",
 * which is the coordinates where we hovered. A grace area is used to prevent minor mouse movements
 * from removing the hover by accident.
 * @param event The MouseEvent that triggered this function.
 */
function mouseOut(event)
{
	var xCoordOutsideGraceArea = Math.abs(event.clientX - hoverX) > 20;
	var yCoordOutsideGraceArea = Math.abs(event.clientY - hoverY) > 20;

	if(hoverUrl && xCoordOutsideGraceArea && yCoordOutsideGraceArea)
	{
		if(DEBUG) console.log("Removed hover from: " + hoverUrl);
		document.body.removeChild(hoverDiv);
		hoverUrl = undefined;
		hoverDiv = null;
	}
}

/**
 * Determines if a URL is a valid image, and calls a callback with parameters:
 *
 *  - The URL of that was passed to this function
 *  - True if the URL is a valid image and false otherwise
 *
 * Code by Martin Jespersen <http://stackoverflow.com/a/4669862/1968462>
 * @param url The URL that we're checking.
 * @param callback Function that is called with results of the check.
 */
function isValidImageUrl(url, callback)
{
	var img = new Image();
	img.onerror = function() { callback(url, false, -1, -1); }
	img.onload =  function() { callback(url, true, img.width, img.height); }
	img.src = url
}

/**
 * Constructs the hover that will display the image (if it's valid).
 * @param url The URL that was checked.
 * @param valid True if the image is valid and false otherwise.
 * @param width The width of the image in pixels.
 * @param height The height of the image in pixels.
 */
function constructHover(url, valid, width, height)
{
	// If the div already exists, remove it
	if(hoverUrl)
	{
		if(DEBUG) console.log("Removed hover from: " + hoverUrl);
		document.body.removeChild(hoverDiv);
		hoverUrl = undefined;
		hoverDiv = null;
	}

	if(DEBUG) console.log((valid ? "VALID" : "INVALID") + " image URL: " + url);
	if(DEBUG) console.log("Image width " + width + "; height: " + height);
	if(!valid) return;

	// Create the hover div. It's fixed (so it has the correct scroll position) and has a large
	// z-index so that it's above everything else. In fact, this should be the maximum z-index.
	// It's not clear, however, how it'll react to something with the same z-index.
	hoverDiv = document.createElement("div");
	hoverDiv.style.position = "fixed";
	hoverDiv.style.zIndex = "2147483647";

	// Figure out how to size and position this
	var innerWidth = window.innerWidth;
	var innerHeight = window.innerHeight;
	var tooWide = width * (1.0 - padding) > innerWidth;
	var tooTall = height * (1.0 - padding) > innerHeight;
	var aspectRatio = width / height;
	var screenAspectRatio = innerWidth / innerHeight;

	var adaptedWidth;
	var adaptedHeight;

	if(tooWide && tooTall)
	{
		// Figure out if we need to scale on the width or the height
		if((width / innerWidth) > (height / innerHeight))
		{
			adaptedWidth = (1.0 - padding) * innerWidth;
			adaptedHeight = adaptedWidth / aspectRatio;
		}
		else
		{
			adaptedHeight = (1.0 - padding) * innerHeight;
			adaptedWidth = adaptedHeight * aspectRatio;
		}
	}
	else if(tooWide)
	{
		adaptedWidth = (1.0 - padding) * innerWidth;
		adaptedHeight = adaptedWidth / aspectRatio;
	}
	else if(tooTall)
	{
		adaptedHeight = (1.0 - padding) * innerHeight;
		adaptedWidth = adaptedHeight * aspectRatio;
	}
	else
	{
		adaptedWidth = width;
		adaptedHeight = height;
	}

	// Centre the image in the screen
	var top = (innerHeight - adaptedHeight) / 2;
	var left = (innerWidth - adaptedWidth) / 2;

	hoverDiv.style.top = top + "px";
	hoverDiv.style.left = left + "px";
	hoverDiv.style.minWidth = "50px";
	hoverDiv.style.minHeight = "50px";
	hoverDiv.style.backgroundColor = "white";
	hoverDiv.innerHTML = "<img width='" + adaptedWidth + "' height='" + adaptedHeight +
			"' src='" + url + "' />";

	hoverUrl = url;
	document.body.appendChild(hoverDiv);
}

init();