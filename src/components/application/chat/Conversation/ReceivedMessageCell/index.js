import React from "react";
import { Avatar } from "antd";
import bot from "../../../../../assets/images/bot.jpg";
import MessageComponent from "../MessageComponent";
import SentMessageCell from "../SentMessageCell";
import { useSelector } from "react-redux";
import { getInitialData } from "../../../../../redux/chat/chat-selectors";

const ReceivedMessageCell = ({ data, conversation }) => {
  const { settings } = useSelector((state) => getInitialData(state));
  return (
    <div className="gx-chat-item">
      <div className="chat-icon"
        style={
          settings && { backgroundColor: settings.color.headerBackgroundColor }
        }
      >
        <Avatar
          src={settings && settings.bot.img}
          className="gx-rounded-circle gx-size-60"
          alt=""
        />
      </div>
      <MessageComponent data={data} conversation={conversation} />
    </div>
  );
};

export default ReceivedMessageCell;
