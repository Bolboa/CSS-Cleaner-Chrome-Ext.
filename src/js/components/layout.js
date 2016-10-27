import React from 'react';

export default class Layout extends React.Component {
	constructor(){
		super();
		this.state = {
			title:'welcome'
		};
	}

	render() {
		return (
			<div>
				<h1>Helloworld</h1>
			</div>
		)
	}
}