import React, { Component } from 'react';

export default class Fail extends Component{
	constructor(){
		super();
	}

	/*----CLOSE EXTENSION----*/
	close() {
		window.close();
	}

	render(){

        return(

        	<div className="fail">
        		<i class="fa fa-times" aria-hidden="true"></i>
        		<div className="text">
	        		<h1>Error</h1>
	        		<div className="errMsg">Stylesheet is unreachable!</div>
	        	</div>
	        	<i class="fa fa-times-circle" aria-hidden="true" onClick={this.close.bind(this)}></i>
			</div>
			
        )

    }
}