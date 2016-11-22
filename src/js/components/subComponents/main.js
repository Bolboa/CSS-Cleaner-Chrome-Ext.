import React, { Component } from 'react';

export default class Main extends Component{
	render(){
		console.log("here", this.props.css);
        return(
        	<div>
            <div className="cssList">
				<h1>Select the stylesheet you wish to clean</h1>
				{
					this.props.css.map((function(style){
						console.log("yeah");
						if (style) {
							return (<div className="inputWrap"><input type="radio" name="style_name" onClick={this.props.select(style)}/><span></span><a key={style}>{style}</a></div>)
						}
					}).bind(this))
				}
				
				</div>
				<button className="cleanBtn" onClick={this.props.save}>Clean!</button>
				</div>
        )

    }
}