import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getSource, getStyle, cssSelect} from '../actions/index';

class Layout extends React.Component {
	constructor(){
		super();
		this.state = {
			sourceCode:''
		}

	}
	
	componentWillMount(){
		var result = '';
	    chrome.tabs.executeScript(null, {
	        file: 'src/js/scripts/getPageSource.js'
	     }, function() {
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
  			if (request.action == "getSource") {
  				this.props.getSource(request.source);
  				this.props.getStyle(request.source);
  			}
		}.bind(this));
		
	}

	checkCSS(style){
		console.log(this.props.source);
		console.log(this.props.css);
		console.log(style);
	}

	saveCSS(style) {
		chrome.tabs.query(
    		{ currentWindow: true, active: true },
    		function (tabArray) {
    			console.log(tabArray[0].id);
        		chrome.tabs.executeScript(tabArray[0].id, {
            		file: 'src/js/scripts/extractCSS.js'
         		}, function() {
            		chrome.tabs.sendMessage(tabArray[0].id, [this.props.source, style]);

        		}.bind(this))
    		}.bind(this));
	}

	
	render() {
		if (!this.props.css) {
            return null;
        }
       
		return (
			<div>
				
				<button onClick={this.checkCSS.bind(this)}>click me</button>
				<div className="cssList">
				{
					this.props.css.map(function(style){
						return (<a onClick={this.saveCSS.bind(this,style)} key={style}>{style}</a>)
					}.bind(this))
				}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		source: state.source,
		css:state.css,
		curr_css:state.curr_css
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({getSource:getSource, getStyle:getStyle, cssSelect:cssSelect}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Layout);