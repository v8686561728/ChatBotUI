import React from "react";

import ReceivedMessageCell from "./ReceivedMessageCell/index";
import SentMessageCell from "./SentMessageCell/index";

const Conversation = (data) => {

  return (
    <div className="gx-chat-main-content">
      {data.conversationData.map((conversation, index) => conversation.type === 'sent' ?
        <SentMessageCell key={index} data={data} conversation={conversation}/> :
        <ReceivedMessageCell key={index} data={data} conversation={conversation}/>
      )}
    </div>
  )
};

export default Conversation;
