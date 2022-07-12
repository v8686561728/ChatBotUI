import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MessageComponent from "./MessageComponent";

describe("Message component", () => {
  it("renders Message component without crashing", () => {
    const conversation = {
      type: "sent",
      text: "message sent",
      component: "text",
      sentAt: new Date(),
    };

    render(<MessageComponent conversation={conversation} />);
  });
  it("Text Message rendered successfully", () => {
    const conversation = {
      type: "sent",
      text: "message sent",
      component: "text",
      sentAt: new Date(),
    };
    const component = render(<MessageComponent conversation={conversation} />);
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
    const component = render(<MessageComponent conversation={conversation} />);
    const message = component.getByText("Button", {
      selector: "span",
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
    const component = render(<MessageComponent conversation={conversation} />);
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
      const { getByTestId } = render(<MessageComponent conversation={conversation} />);
    fireEvent.change(getByTestId("input"), { target: { value: "test@email.com" } });
    expect(getByTestId("input").value).toBe("test@email.com");
  })
  it("Validate the entered email id successful", () => {
    const conversation = {
        type: "sent",
        text: "Email",
        key:'email',
        component: "input",
        sentAt: new Date(),
        handleInputSubmit: jest.fn(()=>{return})
      };
      const component = render(<MessageComponent conversation={conversation} />);
    fireEvent.change(component.getByTestId("input"), { target: { value: "test@email.com" } });
    fireEvent.click(component.getByText("Send"))
    expect(component.getByText("Saved"))
  })
  it("Validate the entered email id failure", () => {
    const conversation = {
        type: "sent",
        text: "Email",
        key:'email',
        component: "input",
        sentAt: new Date(),
        handleInputSubmit: jest.fn(()=>{return})
      };
      const component = render(<MessageComponent conversation={conversation} />);
    fireEvent.change(component.getByTestId("input"), { target: { value: "test@email" } });
    fireEvent.click(component.getByText("Send"))
    const errorMessage = component.getByText("Enter a valid email", {
        selector: "span",
      });
  
    expect(errorMessage).toBeDefined();
    expect(component.getByText("Send"))
  })
  it("Validate the entered phone Number successful", () => {
    const conversation = {
        type: "sent",
        text: "Phone",
        key:'phone',
        component: "input",
        sentAt: new Date(),
        handleInputSubmit: jest.fn(()=>{return})
      };
      const component = render(<MessageComponent conversation={conversation} />);
    fireEvent.change(component.getByTestId("input"), { target: { value: "1472583690" } });
    fireEvent.click(component.getByText("Send"))
    expect(component.getByText("Saved"))
  })
  it("Validate the entered phone number failure", () => {
    const conversation = {
        type: "sent",
        text: "Phone",
        key:'phone',
        component: "input",
        sentAt: new Date(),
        handleInputSubmit: jest.fn(()=>{return})
      };
      const component = render(<MessageComponent conversation={conversation} />);
    fireEvent.change(component.getByTestId("input"), { target: { value: "123" } });
    fireEvent.click(component.getByText("Send"))
    const errorMessage = component.getByText("Enter a valid phone number", {
        selector: "span",
      });
  
    expect(errorMessage).toBeDefined();
    expect(component.getByText("Send"))
  })
});
