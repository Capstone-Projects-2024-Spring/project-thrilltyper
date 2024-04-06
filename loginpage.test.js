const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("Thrill Typer Login Page Load", () => {
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "templates/login.html"), "utf8");
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should have a title "Thrill Typer"', () => {
    expect(document.title).toBe("Thrill Typer");
  });

  it("should have a username input", () => {
    expect(document.querySelector("#username")).not.toBeNull();
  });

  it("should have a password input", () => {
    expect(document.querySelector("#password")).not.toBeNull();
  });

  it("should have a login button", () => {
    const loginButton = document.querySelector(".logIn");
    expect(loginButton).not.toBeNull();
    expect(loginButton.textContent).toBe("Login");
  });

  // Add more checks as needed
});
