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
 * If true, additional output is created in the console.
 */
var DEBUG = true;

//////////////////////////////////////
// From here on is the regular code //
// Nothing further configurable     //
//////////////////////////////////////

if(DEBUG) console.log("On-hover image is working correctly. Page is: " + window.location.href);

/**
 * Called when the script is fully loaded, initializing all anchors to images with the hover script.
 */
function init()
{
	var allAnchors = document.getElementsByTagName("a");

	for(var i = 0; i < allAnchors.length; i++)
	{
		var anchor = allAnchors[i];

		// Finds all anchors that link to images
		var matcher = new RegExp(".*\\.(" + imageExtensions + ")$");
		if(matcher.test(anchor.href, "i"))
		{
			anchor.addEventListener("mouseover", mouseOver);
		}
	}
}

/**
 * Called when the mouse hovers over an image link.
 * @param event The event that triggered this function. Contains a reference to the element that
 * we're hovering over.
 */
function mouseOver(event)
{
	var url = event.target.href;
	isValidImageUrl(url, constructHover);
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
	img.onerror = function() { callback(url, false); }
	img.onload =  function() { callback(url, true); }
	img.src = url
}

/**
 * Constructs the hover that will display the image (if it's valid).
 * @param url The URL that was checked.
 * @param valid True if the image is valid and false otherwise.
 */
function constructHover(url, valid)
{
	if(DEBUG) console.log((valid ? "VALID" : "INVALID") + " image URL: " + url);
	if(!valid) return;

	var div = document.createElement("div");
	div.style.position = "fixed";
	div.style.top = "10px";
	div.style.left = "10px";
	div.innerHTML = "<img src='" + url + "' />";

	document.body.appendChild(div);
}

init();