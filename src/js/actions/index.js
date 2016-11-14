const getSource = (html) => {
	console.log("recieved", html);
	return {
		type: "SOURCE_RECEIVED",
		payload: html
	}
}

const getStyle = (CSS) => {
	var stylesheets = [];
	for (var i=0; i<CSS.styles.length; i++) {
		stylesheets.push(CSS.styles[i]);
	}
	console.log("recieved", stylesheets);
	return {
		type: "CSS_RECEIVED",
		payload: stylesheets
	}
}

export {
	getSource,
	getStyle
}