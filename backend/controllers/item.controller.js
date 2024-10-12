const { Item } = require("../models/godown.model");
const { Location } = require("../models/godown.model");

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      name,
      quantity,
      category,
      status,
      sub_godown_id,
      price,
      brand,
      attributes,
      image_url,
    } = req.body;

    // Validate required fields
    if (!name || !quantity || !category || !sub_godown_id || !price || !brand) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify that the sub_godown exists and is indeed a sub-godown
    const subGodown = await Location.findOne({
      _id: sub_godown_id,
      is_godown: false,
    });
    if (!subGodown) {
      return res
        .status(400)
        .json({ message: "Invalid sub_godown_id: sub-godown not found" });
    }

    const item = new Item({
      name,
      quantity,
      category,
      status,
      sub_godown_id,
      price,
      brand,
      attributes,
      image_url,
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // If sub_godown_id is being updated, verify the new sub-godown
    if (
      req.body.sub_godown_id &&
      req.body.sub_godown_id !== item.sub_godown_id.toString()
    ) {
      const subGodown = await Location.findOne({
        _id: req.body.sub_godown_id,
        is_godown: false,
      });
      if (!subGodown) {
        return res
          .status(400)
          .json({ message: "Invalid sub_godown_id: sub-godown not found" });
      }
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
