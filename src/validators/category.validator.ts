import { body, param } from "express-validator";

const validateCategoryName = [
  body("name")
    .isString()
    .withMessage((_, { req }) => req.t("categoryRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("categoryRequired"))
    .bail()
    .isLength({ min: 3 })
    .withMessage((_, { req }) => req.t("categoryNameValidation")),
];

const validateCategoryId = [
  param("id")
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidCategoryId")),
];

export { validateCategoryId, validateCategoryName };
