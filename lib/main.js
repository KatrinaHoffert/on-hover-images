var data = require("sdk/self").data;
var tabs = require("sdk/tabs");

// Load the content script into all tabs
tabs.on('ready', function(tab) {
	tab.attach({
		contentScriptFile: data.url("image-hover.js")
	});
});