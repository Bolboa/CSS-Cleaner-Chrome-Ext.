
/*------GET STYLESHEETS---------*/
const getStyle = (CSS) => {

	//array of stylesheets being used
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

/*-------SAVE SELECTED CSS--------*/
const cssSelect = (selected) => {

	return {
		type: "CSS_SELECTED",
		payload: selected
	}
}

export {
	getStyle,
	cssSelect
}