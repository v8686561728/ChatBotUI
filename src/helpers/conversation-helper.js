export const generateConveration = (preMessage, currentMessage) => {
  let conversation = [];
  preMessage && preMessage.forEach((message) => {
    message.text &&
      conversation.push({
        type: message.provider === "bot" ? "recieved" : "sent",
        text: message.text,
        component: "text",
        sentAt: new Date(),
        img:message.img
      });
  });
  currentMessage && currentMessage.forEach((message) => {
    switch (message.type) {
      case "input":
        message.input.map((field) => {
          conversation.push({
            type:  message.provider === "bot" ? "recieved" : "sent",
            text: field.name,
            placeHolder: `Enter ${field.name}`,
            key: field.key,
            component: "input",
            sentAt: new Date(),
          });
        });
        break;
      case "text":
        conversation.push({
          type: message.provider ? message.provider === "bot" ? "recieved" : "sent":"recieved",
          text: message.text,
          component: "text",
          sentAt: new Date(),
        });
        break;
    }
    if (message.buttons) {
      message.buttons.states.forEach((state) => {
        conversation.push({
          type:  message.provider === "bot" ? "recieved" : "sent",
          text: state.text,
          component: "button",
          sentAt: new Date(),
          optionCode: message.buttons.key,
          id: "button-function-class",
        });
      });
    }
  });
  return conversation;
};
