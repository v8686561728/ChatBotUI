import React, { Suspense, useState, useEffect } from "react";
import { Avatar } from "antd";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import "../styles/chatScreen.css";
import "../styles/avatar.css";
import "../styles/badge.css";
import {
  addMessageToConversation,
  createChannel,
} from "../redux/chat/chat-actions";
import {
  getChannel,
  getChannelId,
  getConversation,
  getInitialData,
  getUserId,
  isLoading
} from "../redux/chat/chat-selectors";
import { getCookie, setCookie } from "../helpers/cookies-helper";
import { generateConveration } from "../helpers/conversation-helper";
const CustomScrollbars = React.lazy(() =>
  import("../components/common/CustomScrollbars")
);
const Conversation = React.lazy(() =>
  import("../components/application/chat/Conversation/index")
);

const ChatScreen = () => {
  const [chatOpen, setChatOpen] = useState(false); // controls modal open/close
  const [isSubScriptionComplete, setIsSubScriptionComplete] = useState(false);
  const dispatch = useDispatch();
  const conversationData = useSelector((state) => getConversation(state));
  const userId = useSelector((state) => getUserId(state));
  const { settings, popupMessage } = useSelector((state) =>
    getInitialData(state)
  );
  const channelId = useSelector((state) => getChannelId(state));
  const channel = useSelector((state) => getChannel(state));
  const loading = useSelector((state) => isLoading(state));
  useEffect(() => {
    const user = getCookie("user-id");
    dispatch(createChannel(user)); // user id creation / channel id creation
  }, []);
  useEffect(() => {
    setCookie("user-id", userId);
  }, [userId]);

  useEffect(() => {
    // server event is binded with the client

    if (channel) {
      channel.bind("pusher:subscription_succeeded", () => {
        setIsSubScriptionComplete(true);
      });
    }
  }, [channel]);

  useEffect(() => {
    if (isSubScriptionComplete) {
      if (conversationData.length == 1) {
        channel.trigger("client-widget-message", {
          message: {
            lastMessageTimeStamp: new Date().getTime(),
          },
          senderId: userId,
          channelName: channelId,
        });
      }
      channel.bind("server-message", (data) => {
        const result = generateConveration([], data.messages);
        console.log(result);
        dispatch(addMessageToConversation(result));
        const { component } =
          result.length > 0 ? result.pop() : { component: "" };
        if (component && component === "text") {
          channel.trigger("client-widget-message", {
            message: {
              lastMessageTimeStamp: new Date().getTime(),
            },
            senderId: userId,
            channelName: channelId,
          });
        }
      });
    }
  }, [isSubScriptionComplete]);

  // triggers an client event when button is clicked
  const handleOptionClick = (data) => {
    let timeStamp = new Date().getTime();
    let eventData = {
      senderId: userId,
      channelName: channelId,
      message: {
        [data.optionCode]: [data.text],
        lastMessageTimeStamp: timeStamp,
      },
      display: {
        img: "https://staging-uploads.insent.ai/insentstaging/logo-insentstaging-1653120577857?1653120577919",
        name: null,
        lastMessageTimeStamp: timeStamp,
        lead: true,
        time: timeStamp,
        type: "text",
        userId: "bot",
        key: data.optionCode,
        channelId: channelId,
        text: data.text,
      },
    };

    const message = {
      type: "sent",
      text: data.text,
      component: "text",
      sentAt: new Date(),
    };

    document
      .querySelectorAll(".button-function-class")
      .forEach((el) => el.remove());

    dispatch(addMessageToConversation([message]));
    channel.trigger("client-widget-message", eventData);
  };

  // triggers an client event when input is submitted
  const handleInputSubmit = (data) => {
    let timeStamp = new Date().getTime();
    let eventData = {
      senderId: userId,
      channelName: channelId,
      message: {
        [data.key]: data.value,
        lastMessageTimeStamp: timeStamp,
      },
      display: {
        img: "https://staging-uploads.insent.ai/insentstaging/logo-insentstaging-1653120577857?1653120577919",
        name: "Discuter",
        lastMessageTimeStamp: timeStamp,
        lead: false,
        time: timeStamp,
        type: "input",
        userId: "bot",
        input: {
          key: data.key,
          type: data.key,
          text: data.Text,
          validateDomains: true,
          value: data.value,
          disabled: true,
        },
        channelId: channelId,
      },
    };
    channel.trigger("client-widget-message", eventData);
  };

  // handles chat model open and close
  const handleChatOpen = (value, e) => {
    e.preventDefault();
    setChatOpen(value);
  };

  const handleReset = () => {
    let timeStamp = new Date().getTime();
    const eventData = {
      senderId: userId,
      channelName: channelId,
      message: {
        text: "@Discuter",
      },
      display: {
        img: null,
        name: null,
        lead: true,
        text: "@Discuter",
        time: timeStamp,
        type: "text",
      },
    };
    const message = [{ type: "sent", text: "@Discuter" }];
    dispatch(addMessageToConversation(message));
    channel.trigger("client-widget-message", eventData);
  };
  return !loading && (
    <div className={chatOpen ? "gx-chat-main" : "gx-right-corner"}>
      {chatOpen && (
        <span className="gx-close" onClick={(e) => handleChatOpen(false, e)}>
          X
        </span>
      )}
      {chatOpen ? (
        <div className="container">
          <Suspense fallback={<>Loading...</>}>
            <div className="gx-chat-container">
              <div className="gx-chat-main-header">
                <span className="gx-d-block gx-d-lg-none gx-chat-btn">
                  <i
                    className="gx-icon-btn icon icon-chat"
                    //  onClick={this.onToggleDrawer.bind(this)}
                  />
                </span>
                <div className="gx-chat-main-header-info">
                  <div className="gx-chat-avatar gx-mr-2">
                    <div
                      className="gx-status-pos"
                      style={
                        settings && {
                          backgroundColor: settings.color.headerBackgroundColor,
                        }
                      }
                    >
                      <Avatar
                        src={settings && settings.bot.img}
                        className="gx-rounded-circle gx-size-60"
                        alt=""
                      />
                    </div>
                  </div>
                  <div>
                    <div>{settings && settings.bot.company}</div>
                    <div className="gx-chat-contact-name">
                      You are chatting with {settings && settings.bot.name}
                    </div>
                  </div>
                </div>
              </div>
              <CustomScrollbars className="gx-chat-list-scroll">
                <Conversation
                  conversationData={conversationData}
                  handleInputSubmit={handleInputSubmit}
                  handleOptionClick={handleOptionClick}
                />
              </CustomScrollbars>

              <div className="gx-chat-main-footer">
                <div className="gx-flex-row gx-align-items-center">
                  <div className="gx-col">
                    <div className="gx-form-group" onClick={handleReset}>
                      Restart conversation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      ) : (
        <div
          className="popup-container"
          onClick={(e) => handleChatOpen(true, e)}
        >
          <div className="popup-wrapper">
            <div className="popup-message">
              {popupMessage && parse(popupMessage.message)}
            </div>
            <Avatar
              src={settings && settings.bot.img}
              className="gx-rounded-circle gx-size-60 "
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
