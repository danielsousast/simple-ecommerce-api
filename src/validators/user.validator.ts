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

const validateUserDetails = [
  ...validateUserName,
  body("email")
    .isString()
    .withMessage((_, { req }) => req.t("enterValidEmail"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("enterValidEmail"))
    .bail()
    .isEmail()
    .withMessage((_, { req }) => req.t("enterValidEmail"))
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage((_, { req }) => req.t("passwordMinLength"))
    .bail()
    .isLength({ min: 6 })
    .withMessage((_, { req }) => req.t("passwordMinLength")),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage((_, { req }) => req.t("roleMustBeAdminOrUser")),
  body("city")
    .isString()
    .withMessage((_, { req }) => req.t("cityRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("cityRequired")),
  body("state")
    .isString()
    .withMessage((_, { req }) => req.t("stateRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("stateRequired")),
  body("postalCode")
    .isString()
    .withMessage((_, { req }) => req.t("postalCodeRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("postalCodeRequired")),
  body("address")
    .isString()
    .withMessage((_, { req }) => req.t("addressLine1Required"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("addressLine1Required")),
  body("phone")
    .isString()
    .withMessage((_, { req }) => req.t("phoneNumberRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("phoneNumberRequired")),
];

const validateLoginDetails = [
  body("email")
    .isString()
    .withMessage((_, { req }) => req.t("enterValidEmail"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("enterValidEmail"))
    .bail()
    .isEmail()
    .withMessage((_, { req }) => req.t("enterValidEmail"))
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage((_, { req }) => req.t("passwordMinLength"))
    .bail()
    .isLength({ min: 6 })
    .withMessage((_, { req }) => req.t("passwordMinLength")),
];

const validateUserId = [
  param("id")
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidUserIdFormat")),
];

export { validateLoginDetails, validateUserDetails, validateUserId, validateUserName };
