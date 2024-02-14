import Song from "../models/Song.js";
import { MongoClient } from 'mongodb';
export const createMusic =async (req,res,next)=>{

 try{
        const song = new Song(req.body);
        await song.save();
        res.status(201).send(song);

    }catch(err){
        next(err);
    }
}


export const updateMusic =async (req,res,next)=>{

    try{

        const song = await Song.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        res.send(song);
        console.log("updated successfully");
    }catch(err){
           next(err);
       }
   }
   export const deleteMusic =async (req,res,next)=>{

    try{
        const song = await Song.findByIdAndDelete(req.params.id);
        res.send(song);

    }catch(err){
           next(err);
       }
   }
   export const getMusic =async (req,res,next)=>{

    try{
        const song = await Song.findById(req.params.id);
        res.status(200).send(song);

    }catch(err){
           next(err);
       }
   }
   export const getAllMusic =async (req,res,next)=>{

    try{
        const search_text = req.query.search_text || "";
        console.log(search_text);
        const page_index = parseInt(req.query.page_index) | 0
        const page_size = parseInt(req.query.page_size) | 5
          
        let find_query = {}
          find_query = {
            $or : [

              {title: { $regex: search_text, $options: "i" }},
              {artist: { $regex: search_text, $options: "i" }},
              {album: { $regex: search_text, $options: "i" }},
              {genre: { $regex: search_text, $options: "i" }},
            ]
          }
        

        console.log(find_query);

        const songs=  await Song.find(find_query)
          .skip((page_index) * page_size)
          .limit(page_size);
          const total = await Song.countDocuments(find_query);
        res.json({songs, total});

    }catch(err){
      console.log(err);
           next(err);
       }
   }
   export const getAllTotals= async (req, res,next) => {
    try {
      /*
      You are also expected to generate overall statistics:
      
     
     
      # songs in each album … and so on.
      */ 
     //Total # of songs, artists, albums, genres
      const totalSongs = await Song.countDocuments();
      const totalArtists = await Song.distinct('artist').length;
      const totalAlbums = await Song.distinct('album').length;
      const totalGenres = await Song.distinct('genre').length;
      // # of songs in every genre
      const genreCounts = await Song.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } }
      ]);
  // # of songs & albums each artist has
      const artistCounts = await Song.aggregate([
        { $group: { _id: '$artist', count: { $sum: 1 } } }
      ]);
  
      const songInAlbum = await Song.aggregate([
        { $group: { _id: '$album', count: { $sum: 1 } } }
      ]);
      const albumCount =await Song.aggregate([
        // Group by artist and collect distinct albums and songs for each artist
        {
          $group: {
            _id: "$artist",
            albums: { $addToSet: "$album" },
            songs: { $addToSet: "$title" }
          }
        },
        // Project to add the count of distinct albums and songs
        {
          $project: {
            artist: "$_id",
            numOfAlbums: { $size: "$albums" },
            numOfSongs: { $size: "$songs" }
          }
        },
        // Optionally, sort the result by artist name
        {
          $sort: { artist: 1 }
        }
      ]);
      res.json({ totalSongs, totalArtists, totalAlbums, totalGenres, genreCounts, artistCounts,albumCount,songInAlbum });
    } catch (error) {
      next(error);
    }
  };
  export const searchByText = async (req, res, next) => {
    const searchText = req.query.text;
  
    try {
      const client = new MongoClient(process.env.MONGO_DB_URI);
      client.connect();
      const database = client.db('music_library');
      const collection = database.collection('songs');
      if (typeof searchText === 'string') {
        console.log("searched text is",searchText);
        const searchResults = await collection.find({ $text: { $search: searchText } }).toArray();
        res.json({ songs: searchResults });
      } else {
        res.status(400).json({ message: 'Invalid search text' });
      }
    } catch (error) {
      next(error);
    }
  };
  
  