export default function (state=null, action) {
	switch(action.type) {
		case "CSS_SELECTED":
			return action.payload;
			break;
	}
	return state;
}