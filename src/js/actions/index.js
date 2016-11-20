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

const cssSelect = (select) => {

	return {
		type: "CSS_RECEIVED",
		payload: stylesheets
	}
}

export {
	getStyle,
	cssSelect
}