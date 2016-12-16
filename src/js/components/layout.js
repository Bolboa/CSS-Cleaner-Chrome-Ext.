
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
			selectedStyle:'',
			success:'default',
			percentage:''
		}
	}
	
	componentWillMount(){
		
	    //result in case of error
	    var result = '';
	    //inject script to extract list of stylesheets being used in the tab
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

		//listens for a response concerning the cleaning of the stylesheet selected
		chrome.runtime.onMessage.addListener(function(request, sender) {
			//store the list of stylesheets in redux
  			if (request.action == "getSource") {
  				this.props.getStyle(request.source);
  			}
  			//CSS has been cleaned
  			else if (request.action == "getSourceCSS") {
  				//success state
  				this.setState({success:request.source[0]});
  				//percentage of CSS removed
  				this.setState({percentage:request.source[1]});
  			}
		}.bind(this));
	}

	/*----SENDS SELECTED STYLESHEET TO SCRIPT-----*/
	saveCSS() {

		//selected stylesheet
		var style = this.state.selectedStyle;
		//inject script in current window
		chrome.tabs.query(
    		{ currentWindow: true, active: true },
    		function (tabArray) {
        		chrome.tabs.executeScript(tabArray[0].id, {
            		file: 'src/js/scripts/extractCSS.js'
         		}, function() {
         			//send selected stylesheet to script so it knows which to clean
            		chrome.tabs.sendMessage(tabArray[0].id, style);
        	}.bind(this))
    	}.bind(this));
	}

	/*------SAVE SELECTED STYLESHEET IN STATE--------*/
	selectedCSS(style) {
		//save in redux
		this.props.cssSelect(style);
		this.setState({selectedStyle: style});
	}

	render() {

		//if CSS store is empty
		if (!this.props.css) {
                    return null;
                }
       	
		return (

			<div>
				{/*MAIN PAGE*/}
				{this.state.success == 'default' && <Main css={this.props.css} select={this.selectedCSS.bind(this)} save={this.saveCSS.bind(this)} />}
				{/*SUCCESS PAGE*/}
				{this.state.success == true && <Success removedStat={this.state.percentage} />}
				{/*FAIL PAGE*/}
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
