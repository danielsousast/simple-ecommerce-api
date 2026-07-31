import { body, param, query } from "express-validator";

const validateGetMyOrders = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("quantityMustBeWholeNumber")),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage((_, { req }) => req.t("quantityMustBeWholeNumber")),
];

const validateCreateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage((_, { req }) => req.t("orderItemsRequired")),
  body("items.*.product")
    .isMongoId()
    .withMessage((_, { req }) => req.t("orderItemValidation")),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("quantityMustBeAtLeast1")),
  body("shippingAddress.address")
    .isString()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired")),
  body("shippingAddress.city")
    .isString()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired")),
  body("shippingAddress.state")
    .isString()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired")),
  body("shippingAddress.postalCode")
    .isString()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired")),
  body("shippingAddress.phone")
    .isString()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("shippingDetailsRequired")),
];

const validateOrderId = [
  param("id")
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidOrderId")),
];

export { validateCreateOrder, validateGetMyOrders, validateOrderId };
