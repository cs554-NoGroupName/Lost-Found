import itemRoutes from "./items";

export const constructorMethod = (app) => {
  app.use("/items", itemRoutes);

  app.use("*", (req, res) => {
    res.status(404).send("Page not found");
  });
};