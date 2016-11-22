import React, { Component } from 'react';

export default class Main extends Component{
	render(){
        return(
        	<div className="default">
	            <div className="cssList">
					<h1>Select the stylesheet you wish to clean</h1>
					{
						this.props.css.map((style) => {
							if (style) {
								return (
									<div className="inputWrap">
										<input type="radio" name="style_name" onClick={() => this.props.select(style)}/>
										<span></span>
										<a key={style}>{style}</a>
									</div>
								);
							}
						})
					}
					
					</div>
					<button className="cleanBtn" onClick={this.props.save}>Clean!</button>
				</div>
        )

    }
}