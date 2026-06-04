const Note = require("../models/note.model");

// 1. POST /api/notes — Create a single note in the database
const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const note = await Note.create({
      title,
      content,
      category,
      isPinned
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 2. POST /api/notes/bulk — Create multiple notes
const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null
      });
    }

    const createdNotes = await Note.insertMany(notes);

    res.status(201).json({
      success: true,
      message: `${createdNotes.length} notes created successfully`,
      data: createdNotes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 3. GET /api/notes — Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 4. GET /api/notes/:id — Get note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 5. PUT /api/notes/:id — Full replace a note
const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const replacement = {
      title,
      content,
      category: category || "personal",
      isPinned: isPinned !== undefined ? isPinned : false
    };

    const note = await Note.findOneAndReplace(
      { _id: id },
      replacement,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 6. PATCH /api/notes/:id — Partial update a note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data: null
      });
    }

    const note = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 7. DELETE /api/notes/:id — Delete single note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 8. DELETE /api/notes/bulk — Delete multiple notes
const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null
      });
    }

    const result = await Note.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 9. GET /api/notes/search — Search by title only
const searchNotesByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title query parameter is required",
        data: null
      });
    }

    const notes = await Note.find({
      title: { $regex: title, $options: "i" }
    });

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 10. GET /api/notes/search/content — Search by content only
const searchNotesByContent = async (req, res) => {
  try {
    const { content } = req.query;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content query parameter is required",
        data: null
      });
    }

    const notes = await Note.find({
      content: { $regex: content, $options: "i" }
    });

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 11. GET /api/notes/search/all — Search by both title OR content
const searchNotesAll = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
        data: null
      });
    }

    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 12. GET /api/notes/filter-sort — Filter + Sort combined
const filterSortNotes = async (req, res) => {
  try {
    const { category, sortBy, sortOrder } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const notes = await Note.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 13. GET /api/notes/filter-paginate — Filter + Pagination
const filterPaginateNotes = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find(filter).skip(skip).limit(limitNum);
    const total = await Note.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 14. GET /api/notes/sort-paginate — Sort + Pagination
const sortPaginateNotes = async (req, res) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find().sort(sort).skip(skip).limit(limitNum);
    const total = await Note.countDocuments();

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 15. GET /api/notes/search-filter — Search + Filter
const searchFilterNotes = async (req, res) => {
  try {
    const { query, category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ];
    }

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 16. GET /api/notes/search-sort-paginate — Search + Sort + Pagination
const searchSortPaginateNotes = async (req, res) => {
  try {
    const { query, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ];
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find(filter).sort(sort).skip(skip).limit(limitNum);
    const total = await Note.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 17. GET /api/notes/filter-sort-paginate — Filter + Sort + Pagination
const filterSortPaginateNotes = async (req, res) => {
  try {
    const { category, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find(filter).sort(sort).skip(skip).limit(limitNum);
    const total = await Note.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// 18. GET /api/notes/query — Master Query Endpoint
// Everything combined: Search, Filter, Sort, Paginate
const masterQueryNotes = async (req, res) => {
  try {
    const { query, category, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    let filter = {};

    // 1. Filtering
    if (category) {
      filter.category = category;
    }

    // 2. Searching
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } }
      ];
    }

    // 3. Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // 4. Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const notes = await Note.find(filter).sort(sort).skip(skip).limit(limitNum);
    const total = await Note.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

module.exports = {
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  searchNotesByTitle,
  searchNotesByContent,
  searchNotesAll,
  filterSortNotes,
  filterPaginateNotes,
  sortPaginateNotes,
  searchFilterNotes,
  searchSortPaginateNotes,
  filterSortPaginateNotes,
  masterQueryNotes
};
