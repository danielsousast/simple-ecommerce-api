import { body, param, query } from "express-validator";

const validateGetProducts = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be text")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Search cannot be empty")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Search must not exceed 100 characters"),
  query("category")
    .optional()
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidCategoryId")),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("quantityMustBeWholeNumber")),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage((_, { req }) => req.t("quantityMustBeWholeNumber")),
];

const validateCreateProduct = [
  body("name")
    .isString()
    .withMessage((_, { req }) => req.t("productNameRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("productNameRequired"))
    .bail()
    .isLength({ min: 2 })
    .withMessage((_, { req }) => req.t("productNameMinLength"))
    .bail()
    .isLength({ max: 100 })
    .withMessage((_, { req }) => req.t("productNameMaxLength")),
  body("description")
    .isString()
    .withMessage((_, { req }) => req.t("descriptionIsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("descriptionIsRequired"))
    .bail()
    .isLength({ min: 5 })
    .withMessage((_, { req }) => req.t("descriptionMinLength"))
    .bail()
    .isLength({ max: 1000 })
    .withMessage((_, { req }) => req.t("descriptionMaxLength")),
  body("price")
    .exists({ values: "undefined" })
    .withMessage((_, { req }) => req.t("priceIsRequired"))
    .bail()
    .isFloat({ min: 0 })
    .withMessage((_, { req }) => req.t("priceCannotBeNegative")),
  body("category")
    .notEmpty()
    .withMessage((_, { req }) => req.t("categoryIsRequired"))
    .bail()
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidCategoryId")),
/*   body("images")
    .isArray({ min: 1 })
    .withMessage((_, { req }) => req.t("atLeastOneImageRequired")), */
  body("images.*")
    .isString()
    .withMessage((_, { req }) => req.t("atLeastOneImageRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("atLeastOneImageRequired")),
  body("stock")
    .exists({ values: "undefined" })
    .withMessage((_, { req }) => req.t("stockCountIsRequired"))
    .bail()
    .isInt({ min: 0, max: 99999 })
    .withMessage((_, { req }) => req.t("stockCountCannotBeNegative")),
];

const validateUpdateProduct = [
  body("name")
    .optional()
    .isString()
    .withMessage((_, { req }) => req.t("productNameRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("productNameRequired"))
    .bail()
    .isLength({ min: 2 })
    .withMessage((_, { req }) => req.t("productNameMinLength"))
    .bail()
    .isLength({ max: 100 })
    .withMessage((_, { req }) => req.t("productNameMaxLength")),
  body("description")
    .optional()
    .isString()
    .withMessage((_, { req }) => req.t("descriptionIsRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("descriptionIsRequired"))
    .bail()
    .isLength({ min: 5 })
    .withMessage((_, { req }) => req.t("descriptionMinLength"))
    .bail()
    .isLength({ max: 1000 })
    .withMessage((_, { req }) => req.t("descriptionMaxLength")),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage((_, { req }) => req.t("priceCannotBeNegative")),
  body("category")
    .optional()
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidCategoryId")),
  body("images")
    .optional()
    .isArray({ min: 1 })
    .withMessage((_, { req }) => req.t("atLeastOneImageRequired")),
  body("images.*")
    .optional()
    .isString()
    .withMessage((_, { req }) => req.t("atLeastOneImageRequired"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => req.t("atLeastOneImageRequired")),
  body("stock")
    .optional()
    .isInt({ min: 0, max: 99999 })
    .withMessage((_, { req }) => req.t("stockCountCannotBeNegative")),
];

const validateProductId = [
  param("id")
    .isMongoId()
    .withMessage((_, { req }) => req.t("invalidProductId")),
];

export {
  validateCreateProduct,
  validateGetProducts,
  validateProductId,
  validateUpdateProduct,
};
