import chatReducer from "./chat/chat-reducers";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  chat: chatReducer,
});
export default allReducers;
