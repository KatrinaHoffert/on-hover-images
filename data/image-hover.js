var imageExtensions = "jpg|jpeg|gif|png|svg";

console.log("On-hover image is working correctly. Page is: " + window.location.href);

/**
 * Called when the script is fully loaded, initializing all anchors to images
 * with the hover script.
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
 */
function isValidImageUrl(url, callback)
{
	var img = new Image();
	img.onerror = function() { callback(url, false); }
	img.onload =  function() { callback(url, true); }
	img.src = url
}

function constructHover(url, valid)
{
	alert((valid ? "VALID" : "INVALID") + ": " + url);
}

init();