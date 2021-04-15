const Card = require("../models/card");
const List = require("../models/list");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
var async = require("async");

// @desc        Create new card
// @route       POST /api/v1/cards
// @access      Private
exports.createCard = asyncHandler(async (req, res, next) => {
  const card = await Card.create({
    ...req.body,
    createdBy: req.user._id,
  });

  let list = await List.findById(req.body.listId);

  let cards = [...list.cards.map((c) => c._id)];
  if (!cards.includes(card._id)) {
    cards.push(card._id);
  }

  list.cards = cards;
  list.save();

  res.status(200).json({
    success: true,
    data: card,
  });
});

// @desc        Get Card
// @route       GET /api/v1/cards/:id
// @access      Private
exports.getCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.id)
    .populate({
      path: "listId",
      select: "title",
    })
    .populate({
      path: "members",
      select: "name photo",
    });

  res.status(200).json({
    success: true,
    data: card,
  });
});

// @desc        Update Card
// @route       PUT /api/v1/cards/:id
// @access      Private
exports.updateCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .populate({
      path: "listId",
      select: "title",
    })
    .populate({
      path: "members",
      select: "name photo",
    });

  res.status(200).json({
    success: true,
    data: card,
  });
});

// @desc        Delete Card
// @route       DELETE /api/v1/cards/:id
// @access      Private
exports.deleteCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findByIdAndDelete(req.params.id);

  const list = await List.findById(card.listId);
  let cards = list.cards.filter((c) => c.toString() !== req.params.id);
  list.cards = cards;
  list.save();

  res.status(200).json({
    success: true,
    data: null,
  });
});

// @desc        Reorder Cards
// @route       PUT /api/v1/cards/reorder
// @access      Private
exports.reorderCards = asyncHandler(async (req, res, next) => {
  const { cards, lists } = req.body;

  var iterator = 0;
  function updateCards() {
    if (cards.length > 0) {
      if (iterator < cards.length) {
        let card = cards[iterator];

        Card.findOneAndUpdate({ _id: card._id }, card, {
          new: true,
          runValidators: true,
        })
          .then((res) => {
            console.log(res);
            iterator += 1;
            updateCards();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        updateLists();
      }
    }
  }

  var iterator2 = 0;
  function updateLists() {
    if (lists.length > 0) {
      if (iterator2 < lists.length) {
        let list = lists[iterator2];

        List.findOneAndUpdate({ _id: list._id }, list, {
          new: true,
          runValidators: true,
        })
          .then((res) => {
            console.log(res);
            iterator2 += 1;
            updateLists();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(200).json({
          success: true,
          data: null,
        });
      }
    }
  }

  //  res.status(200).json({
  //    success: true,
  //    data: null,
  //  });

  updateCards();
});
