/// <reference path="../src/types.ts"/>
import * as React from "react";
import * as ReactDOM from "react-dom";
import Framage from "../";

describe("it", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Framage src="" view={{ width: 1, height: 1 }} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
