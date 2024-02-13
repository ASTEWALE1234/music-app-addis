import express from 'express';
import Song from '../models/Song.js';
import { createError } from '../utils/error.js';
import { createMusic, deleteMusic, getAllMusic, getAllTotals, getMusic, searchByText, updateMusic } from '../controller/music.js';
const app=express();
const router = express.Router();

router.post('/',createMusic);
router.get('/totals',getAllTotals);
router.get('/search',searchByText);
//Get all songs
router.get('/',getAllMusic);
router.get('/:id',getMusic);

//update a song
router.patch('/:id',updateMusic);

//delete a song

router.delete('/:id',deleteMusic);


export default router;