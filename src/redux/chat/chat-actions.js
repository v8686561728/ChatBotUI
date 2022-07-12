import { api } from "../../api";
import * as constants from "./chat-constants";
import Pusher from "pusher-js";
import { getConversation } from "./chat-selectors";
import { config } from "../../../constants";
import { generateConveration } from "../../helpers/conversation-helper";
export const updateConversation = (data) => ({
  type: constants.UPDATE_CONVERSATION,
  data,
});
export const updateUserId = (data) => ({
  type: constants.UPDATE_USER_ID,
  data,
});
export const updateChannelId = (data) => ({
  type: constants.UPDATE_CHANNEL_ID,
  data,
});
export const updateSubsciptionId = (data) => ({
  type: constants.UPDATE_SUBSCRIPTION_ID,
  data,
});
export const setInitialData = (data) => ({
  type: constants.SET_INITIAL_DATA,
  data,
});
export const setChannel=(data)=>({
    type: constants.CHANNEL,
    data,
})

export const addMessageToConversation = (data) => {
  return (dispatch, getState) => {
    let oldConversation = getConversation(getState());
    let newConversation = [...oldConversation, ...data];

    dispatch(updateConversation(newConversation));
  };
};

export const createChannel = (userid) => {
  return async (dispatch) => {
    const { data } = await api({
      method: "GET",
      url: config.USER_ID_API,
      ...(userid && { headers: { userid } }),
    });
    dispatch(updateUserId(data.user.id));
    dispatch(updateChannelId(data.channelId));
    dispatch(updateSubsciptionId(data.subscriptionChannel));
    const initialData = await api({
      method: "GET",
      url: config.INITIAL_DATA_URL + `/${data.channelId}`,
      headers: { userid: data.user.id },
    });
    dispatch(setInitialData(data));
    dispatch(addMessageToConversation( generateConveration(
        initialData.data.prevMessages,
        initialData.data.messages
      )));
      const client = new Pusher(config.KEY, {
        authEndpoint: `${config.AUTH_URL}?userid=${data.user.id}`,
        cluster: config.CLUSTER,
        encrypted: true,
      });
      const channel=client.subscribe(data.subscriptionChannel)
      dispatch(setChannel(channel))
      dispatch({
        type: constants.LOADING,
        data:false,
      })
  };
};
