import React from "react";
import { render, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import MessageComponent from "./MessageComponent";

describe("Message component", () => {
  it("renders correctly", () => {
    const conversation = {
      type: "sent",
      text: "message sent",
      component: "text",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const tree = renderer
      .create(<MessageComponent conversation={conversation} data={data} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders Message component without crashing", () => {
    const conversation = {
      type: "sent",
      text: "message sent",
      component: "text",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    render(<MessageComponent conversation={conversation} data={data} />);
  });
  it("Text Message rendered successfully", () => {
    const conversation = {
      type: "sent",
      text: "message sent",
      component: "text",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    const message = component.getByText("message sent", {
      selector: "div",
    });

    expect(message).toBeDefined();
  });
  it("Button Option rendered successfully", () => {
    const conversation = {
      type: "sent",
      text: "Button",
      component: "button",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    const message = component.getByText("Button", {
      selector: "div",
    });

    expect(message).toBeDefined();
  });
  it("Input Option rendered successfully", () => {
    const conversation = {
      type: "sent",
      text: "Email",
      component: "input",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    const message = component.getByText("Email");

    expect(message).toBeDefined();
  });
  it("should be able to type in input field", () => {
    const conversation = {
      type: "sent",
      text: "Email",
      component: "input",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const { getByTestId } = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    fireEvent.change(getByTestId("input"), {
      target: { value: "test@email.com" },
    });
    expect(getByTestId("input").value).toBe("test@email.com");
  });
  it("Validate the entered email id successful", () => {
    const conversation = {
      type: "sent",
      text: "Email",
      key: "email",
      component: "input",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    fireEvent.change(component.getByTestId("input"), {
      target: { value: "test@email.com" },
    });
    fireEvent.click(component.getByTestId("send"));
    expect(component.getByTestId("save"));
  });
  it("Validate the entered email id failure", () => {
    const conversation = {
      type: "sent",
      text: "Email",
      key: "email",
      component: "input",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    fireEvent.change(component.getByTestId("input"), {
      target: { value: "test@email" },
    });
    fireEvent.click(component.getByTestId("send"));
    const errorMessage = component.getByText("Enter a valid email", {
      selector: "span",
    });

    expect(errorMessage).toBeDefined();
    expect(component.getByTestId("send"));
  });
  it("Validate the entered phone Number successful", () => {
    const conversation = {
      type: "sent",
      text: "Phone",
      key: "phone",
      component: "input",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    fireEvent.change(component.getByTestId("input"), {
      target: { value: "1472583690" },
    });
    fireEvent.click(component.getByTestId("send"));
    expect(component.getByTestId("save"));
  });
  it("Validate the entered phone number failure", () => {
    const conversation = {
      type: "sent",
      text: "Phone",
      key: "phone",
      component: "input",
      sentAt: new Date(),
    };
    const data = {
      handleOptionClick: jest.fn(() => {
        return;
      }),
      handleInputSubmit: jest.fn(() => {
        return;
      }),
    };
    const component = render(
      <MessageComponent conversation={conversation} data={data} />
    );
    fireEvent.change(component.getByTestId("input"), {
      target: { value: "123" },
    });
    fireEvent.click(component.getByTestId("send"));
    const errorMessage = component.getByText("Enter a valid phone number", {
      selector: "span",
    });

    expect(errorMessage).toBeDefined();
    expect(component.getByTestId("send"));
  });
});
