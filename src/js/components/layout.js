import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getStyle, cssSelect} from '../actions/index';

class Layout extends React.Component {
	constructor(){
		super();
		this.state = {
			tabs:'',
			selectedStyle:''
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
  				this.props.getStyle(request.source);
  			}
		}.bind(this));
		
	}

	saveCSS() {
		var style = this.state.selectedStyle;
		chrome.tabs.query(
    		{ currentWindow: true, active: true },
    		function (tabArray) {
    			console.log(tabArray[0].id);
        		chrome.tabs.executeScript(tabArray[0].id, {
            		file: 'src/js/scripts/extractCSS.js'
         		}, function() {
         			console.log(this.state.style);
            		chrome.tabs.sendMessage(tabArray[0].id, style);

        		}.bind(this))
    		}.bind(this));
	}

	selectedCSS(style) {
		this.setState({selectedStyle: style});
	}

	
	render() {
		if (!this.props.css) {
            return null;
        }
       
		return (
			<div>
				
				
				<div className="cssList">
				<h1>Select the stylesheet you wish to clean</h1>
				{
					this.props.css.map(function(style){
						if (style) {
							return (<div className="inputWrap"><input type="radio" name="style_name" onClick={this.selectedCSS.bind(this, style)}/><span></span><a key={style}>{style}</a></div>)
						}
					}.bind(this))
				}
				
				</div>
				<button className="cleanBtn" onClick={this.saveCSS.bind(this)}>Clean!</button>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		css:state.css,
		curr_css:state.curr_css
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({getStyle:getStyle, cssSelect:cssSelect}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Layout);