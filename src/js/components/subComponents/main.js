import React, { Component } from 'react';

export default class Main extends Component{
	constructor(){
		super();
	}
	
	/*----CLOSE EXTENSION----*/
	close() {
		window.close();
	}
	
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
                <i class="fa fa-times-circle" aria-hidden="true" onClick={this.close.bind(this)}></i>
            </div>
        )
	}
}
