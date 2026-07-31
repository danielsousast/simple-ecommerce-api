import { body, param } from "express-validator";

const validateUserName = [
  body("name")
    .isString()
    .withMessage((_, { req }) => req.t("userNameRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("userNameCannotBeEmpty")),
];

const validateUserId = [
  param("id")
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidUserIdFormat")),
];

export { validateUserId, validateUserName };
