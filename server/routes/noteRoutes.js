const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getNotes, createNote, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');

// GET all notes for authenticated user
router.get('/', authMiddleware, getNotes);

// POST new note
router.post('/', authMiddleware, createNote);

// GET a single note by id
router.get('/:id', authMiddleware, getNoteById);

// PUT update an existing note by id
router.put('/:id', authMiddleware, updateNote);

// DELETE delete an existing note by id
router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;
