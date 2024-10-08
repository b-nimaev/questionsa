"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subcategoryController_1 = require("../controllers/subcategoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/:categoryId/subcategories", authMiddleware_1.authMiddleware, subcategoryController_1.getSubcategories);
router.get("/:categoryId/subcategory", authMiddleware_1.authMiddleware, subcategoryController_1.getSubcategory);
router.post("/:categoryId/subcategories", authMiddleware_1.authMiddleware, subcategoryController_1.createSubcategory);
router.delete("/:categoryId/subcategories/:subcategoryId", authMiddleware_1.authMiddleware, subcategoryController_1.deleteSubcategory);
exports.default = router;
