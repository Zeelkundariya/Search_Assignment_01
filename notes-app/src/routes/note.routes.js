const express = require("express");
const router = express.Router();
const { createNote, createBulkNotes, getAllNotes, getNoteById, replaceNote, updateNote, deleteNote, deleteBulkNotes, searchNotesByTitle, searchNotesByContent, searchNotesAll } = require("../controllers/note.controller");

// CRUD bulk
router.post("/bulk", createBulkNotes);
router.delete("/bulk", deleteBulkNotes);

// Search routes (must be before /:id)
router.get("/search/all", searchNotesAll);
router.get("/search/content", searchNotesByContent);
router.get("/search", searchNotesByTitle);

// CRUD single-item routes LAST
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
