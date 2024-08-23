"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqController_1 = require("../controllers/faqController");
const router = (0, express_1.Router)();
router.post("/", faqController_1.createFAQ);
router.get("/:subcategoryId", faqController_1.getFAQs);
router.delete("/:id", faqController_1.deleteFAQ);
router.put("/:id", faqController_1.updateFAQ); // Маршрут для обновления FAQ
router.get("/", faqController_1.searchFAQs); // Маршрут для поиска FAQ
exports.default = router;
