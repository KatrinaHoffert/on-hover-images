var imageExtensions = "jpg|jpeg|gif|png|svg";

console.log("Addon is working correctly, page is " + window.location.href);

function init()
{
	var allAnchors = document.getElementsByTagName("a");

	for(var i = 0; i < allAnchors.length; i++)
	{
		var anchorWithImage = allAnchors[i];

		var matcher = new RegExp(".*\\.(" + imageExtensions + ")$");
		if(matcher.test(anchorWithImage.href))
		{
			anchorWithImage.addEventListener("mouseover", mouseOver);
		}
	}
}

function mouseOver(event)
{
	alert(event.target.href);
}

init();