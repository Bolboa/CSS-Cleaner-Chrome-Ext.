export default function (state=null, action) {
	switch(action.type) {
		case "CSS_RECEIVED":
			return action.payload;
			break;
	}
	return state;
}