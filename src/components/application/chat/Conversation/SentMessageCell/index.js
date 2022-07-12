import React from "react";
import MessageComponent from "../MessageComponent";
const SentMessageCell = ( {data,conversation} ) => {
  return (
    <div className="gx-chat-item gx-flex-row-reverse">
      <MessageComponent data={data} conversation={conversation} />
    </div>
  );
};

export default SentMessageCell;
