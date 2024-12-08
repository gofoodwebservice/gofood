const express = require("express");
const router = express.Router();
const FoodItems = require("../../model/FoodItems");

router.delete("/deleteitem", async (req, res) => {
  const { id } = req.body;

  try {
    await FoodItems.deleteOne({
      _id: id,
    }).then(() => {
      res.json({ success: true });
    });
  } catch (error) {
    // res.send("Server Error", error.message)
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
