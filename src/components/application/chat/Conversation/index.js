import React from "react";

import ReceivedMessageCell from "./ReceivedMessageCell/index";
import SentMessageCell from "./SentMessageCell/index";

const Conversation = (data) => {

  return (
      data.conversationData.map((conversation, index) => conversation.type === 'sent' ?
        <SentMessageCell key={index} data={data} conversation={conversation}/> :
        <ReceivedMessageCell key={index} data={data} conversation={conversation}/>
      )
  )
};

export default Conversation;
