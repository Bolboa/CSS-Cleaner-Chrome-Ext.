export default function (state=null, action) {
	switch(action.type) {
		case "SOURCE_RECEIVED":
			return action.payload;
			break;
	}
	return state;
}