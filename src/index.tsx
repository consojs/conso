import App from "express";
import * as React from "react";
import * as Server from "react-dom/server";

const app = new App();

// response
app.use((ctx) => {
  const Greet = () => <h1>Hello, world!</h1>;
  ctx.body = Server.renderToString(<Greet />);
});

app.listen(3000);
