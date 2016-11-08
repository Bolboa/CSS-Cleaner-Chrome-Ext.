import React from 'react';

export default class Layout extends React.Component {
	constructor(){
		super();
	}


	componentWillMount(){
		console.log("hello");
		var result = '';
	    chrome.tabs.executeScript(null, {
	        file: 'src/js/scripts/getPageSource.js'
	     }, function() {
	     	console.log("batcch");
	        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
	        if (chrome.runtime.lastError) {
	            result = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
	            console.log(result);
	        }
	    });
	}

	componentDidMount() {
		chrome.runtime.onMessage.addListener(function(request, sender) {
  			if (request.action == "getSource") {
    			console.log(request.source);
  			}
		});

	}

	render() {
		return (
			<div>
				<h1>Helloworld</h1>
			</div>
		)
	}
}