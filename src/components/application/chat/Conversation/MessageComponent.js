import React, { useState } from "react";
import PropTypes from "prop-types";
import parse from "html-react-parser";
import { Button, Input } from "antd";
import { timeAgo } from "../../../../helpers/date-helper";
const Search = Input.Search;

const MessageComponent = ({ data,conversation }) => {
  const { handleOptionClick,handleInputSubmit} = data
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState("");
  const onOptionClick = (conversation, e) => {
    e.preventDefault();
    handleOptionClick(conversation);
  };
  const handleInput = (value) => {
    conversation.value = value;
    if (validateInput(conversation)) {
      handleInputSubmit(conversation);
      setError('')
      setReadOnly(true);
    }
  };
 
  const validateInput = (conversation) => {
    let regexp = "";
    switch (conversation.key) {
      case "email":
        regexp =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if (regexp.test(String(conversation.value).toLowerCase())) {
          return true;
        }
        setError("Enter a valid email");
        return false;
      case "phone":
        regexp = /^\d{10}$/;
        if (regexp.test(conversation.value)) {
          return true;
        }
        setError("Enter a valid phone number");
        return false;
      default:
        return true;
    }
  };
  
  // based on the component type message component is choosen
  switch (conversation.component) {
    case "button":
      return (
        <div className={`gx-bubble-block ${conversation.id}`} name={conversation.id}>
          <Button
            className="chat-message-button"
            ghost
            onClick={(e) => onOptionClick(conversation, e)}
          >
            {conversation.text}
          </Button>
        </div>
      );
    case "input":
      return (
        <div className="gx-bubble-block">
          <div className="gx-bubble">
            <div className="gx-input-label">{conversation.text}</div>
            <div
              className="gx-flex-row gx-align-items-center"
              style={{ maxHeight: 51 }}
            >
              <div className="gx-col">
                <div className="gx-form-group">
                  <Search
                    placeholder={conversation.placeHolder || ""}
                    enterButton={readOnly ? "Saved" : "Send"}
                    size="large"
                    readOnly={readOnly}
                    onSearch={(value) => handleInput(value)}
                    data-testid="input"
                  />
                </div>
               
              </div>
            </div>
            <span className="error" data-testid="error">{error}</span>
            <div className="gx-time gx-text-muted gx-text-right gx-mt-2">
              {timeAgo(conversation.sentAt)}
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="gx-bubble-block">
          <div className="gx-bubble">
            <div className="gx-message">{parse(conversation.text)}</div>
            <div className="gx-time gx-text-muted gx-text-right gx-mt-2">
            {timeAgo(conversation.sentAt)}
            </div>
          </div>
        </div>
      );
  }
};

MessageComponent.propTypes = {
  data:PropTypes.object
};

export default MessageComponent;
