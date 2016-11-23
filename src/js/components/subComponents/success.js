import React, { Component } from 'react';

export default class Success extends Component{
	constructor(){
		super();
	}

	close() {
		window.close();
	}

	render(){
        return(
        	<div className="success">
        		<i class="fa fa-check" aria-hidden="true"></i>
        		<div className="text">
        			<h1>SUCCESS!</h1>
        			<div className="stat">{this.props.removedStat}% of CSS was removed!</div>
        		</div>
        		<i class="fa fa-times-circle" aria-hidden="true" onClick={this.close.bind(this)}></i>
			</div>
        )

    }
}