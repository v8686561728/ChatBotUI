import React, { Suspense, useState, useEffect, useRef } from "react";
import { Avatar } from "antd";
import { RedoOutlined ,LoadingOutlined} from "@ant-design/icons";
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
  isLoading,
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
  const messagesEndRef = useRef(); // reference to scroll to bottom of the messages
  const [conversationLoading, setConversationLoading] = useState(false); // loader to wait for server meaages
  const [isSubScriptionComplete, setIsSubScriptionComplete] = useState(false); // to check is channel subscription is complete to trigger the events
  const dispatch = useDispatch();
  const conversationData = useSelector((state) => getConversation(state)); 
  const userId = useSelector((state) => getUserId(state));
  const { settings, popupMessage } = useSelector((state) =>
    getInitialData(state)
  );
  const channelId = useSelector((state) => getChannelId(state));
  const channel = useSelector((state) => getChannel(state));
  const loading = useSelector((state) => isLoading(state));

  // getting inital data of conversation
  useEffect(() => {
    const user = getCookie("user-id"); // to retrive previous message of the conversation
    dispatch(createChannel(user)); // pusher channel creation
  }, []);
  useEffect(() => {
    setCookie("user-id", userId); // saving the user id in cookies
  }, [userId]);

  useEffect(() => {
    // check if subscription is complete to trigger the events
    if (channel) {
      channel.bind("pusher:subscription_succeeded", () => {
        setIsSubScriptionComplete(true);
      });
    }
  }, [channel]);

  // scroll to bottom of the conversation
  useEffect(() => {
    messagesEndRef && messagesEndRef.current && messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [conversationData]);

  // Binding client and server events
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
        setConversationLoading(false)
        const result = generateConveration([], data.messages);
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
          setConversationLoading(true)
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
    channel.trigger("client-widget-message", eventData)
    setConversationLoading(true)
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
    channel.trigger("client-widget-message", eventData)
    setConversationLoading(true)
  };

  // handles chat model open and close
  const handleChatOpen = (value, e) => {
    e.preventDefault();
    setChatOpen(value);
  };

  // resets the conversation
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
    channel.trigger("client-widget-message", eventData)
    setConversationLoading(true)
  };
  return (
    !loading && (
      <div className={chatOpen ? "gx-chat-main" : "gx-right-corner"}>
        {chatOpen && (
          <span className="gx-close" onClick={(e) => handleChatOpen(false, e)}>
            X
          </span>
        )}
        {chatOpen ? (
          <div className="container">
           
              <div className="gx-chat-container">
                <div className="gx-chat-main-header">
                    <div className=" gx-chat-avatar gx-mr-2">
                      <div
                        className="gx-status-pos"
                        style={
                          settings && {
                            backgroundColor:
                              settings.color.headerBackgroundColor,
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
                
                <Suspense fallback={ <LoadingOutlined className="loading-content"/>}>
                  <CustomScrollbars className="gx-chat-list-scroll">
                    <Conversation
                      conversationData={conversationData}
                      handleInputSubmit={handleInputSubmit}
                      handleOptionClick={handleOptionClick}
                    />
                   { conversationLoading && <LoadingOutlined className="conv-loading"/>}
                   <div ref={messagesEndRef} />
                  </CustomScrollbars>
                  </Suspense>
                
                  <div
                    className="gx-chat-main-footer"
                    style={
                      settings && {
                        backgroundColor: settings.color.headerBackgroundColor,
                      }
                    }
                  >
                    <div className="gx-flex-row gx-align-items-center">
                      <div className="gx-col">
                        <div
                          className="gx-form-group gx-restart"
                          onClick={handleReset}
                        >
                          <RedoOutlined /> Restart conversation
                        </div>
                      </div>
                    </div>
                  </div>
                
               
              </div>
            
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
    )
  );
};

export default ChatScreen;
