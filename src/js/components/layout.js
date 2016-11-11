import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Layout extends React.Component {
	constructor(){
		super();
		this.state = {
			sourceCode:'',
			sourceCSS:''
		}

	}
	


	componentWillMount(){
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
		var source = "";
		chrome.runtime.onMessage.addListener(function(request, sender) {
			console.log("here");
  			if (request.action == "getSource") {
  				console.log(request.source);
    			//this.setState({sourceCode: request.source});
  			}
		});
		
	}
	handleCssChange(event) {
		this.setState({sourceCSS: event.target.value});
	}


	render() {
		return (
			<div>
				<textarea rows="4" cols="50" onChange={this.handleCssChange.bind(this)}></textarea>
				<button>Check</button>
				<div>{this.state.sourceCode}</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		users: state.users
	};
}

export default connect(mapStateToProps)(Layout);