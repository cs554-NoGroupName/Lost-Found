import express from "express";
const router = express.Router();

router.route("/").get(async (req, res) => {
  // Get all items
});

router.route("/:itemId").get(async (req, res) => {
  // Get Item by itemId
});

export default router;