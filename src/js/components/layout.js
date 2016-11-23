import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getStyle, cssSelect} from '../actions/index';
import Main from './subComponents/main';
import Success from './subComponents/success';
import Fail from './subComponents/fail';

class Layout extends React.Component {
	constructor(){
		super();
		this.state = {
			tabs:'',
			selectedStyle:'',
			success:'default',
			percentage:''
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
  			else if (request.action == "getSourceCSS") {
  				this.setState({success:request.source[0]});
  				this.setState({percentage:request.source[1]});
  				console.log(request.source);
  			}
		}.bind(this));

		
	}

	saveCSS() {
		var style = this.state.selectedStyle;
		chrome.tabs.query(
    		{ currentWindow: true, active: true },
    		function (tabArray) {
        		chrome.tabs.executeScript(tabArray[0].id, {
            		file: 'src/js/scripts/extractCSS.js'
         		}, function() {
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
				{this.state.success == 'default' && <Main css={this.props.css} select={this.selectedCSS.bind(this)} save={this.saveCSS.bind(this)} />}
				{this.state.success == true && <Success removedStat={this.state.percentage} />}
				{this.state.success == false && <Fail />}
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