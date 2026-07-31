import i18next from "i18next";
import Backend from "i18next-fs-backend";
import express from "express";
import * as Middleware from "i18next-http-middleware";

const setupI18n = (app: express.Express) => {
  i18next
    .use(Backend)
    .use(Middleware.LanguageDetector)
    .init({
      backend: {
        loadPath: "./src/locales/{{lng}}.json",
      },
      fallbackLng: "en",
      preload: ["en", "pt", "es"],
      initAsync: false,
    });

  app.use(Middleware.handle(i18next));
};


export default setupI18n;
