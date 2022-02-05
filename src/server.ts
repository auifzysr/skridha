import app from './app';

(async () => {
  app.listen(app.get("port"), () => {
    console.log(
      "  App is running at http://localhost:%d in %s mode.",
      app.get("port"),
      app.get("env")
    );
    console.log("  Press ctrl-c to stop.\n");
  });
})();

//export default server;