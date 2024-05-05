const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')
let db = null
app.use(express.json())
const initializeDbAndSever = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDbAndSever()

app.get('/movies/', async (request, response) => {
  const getBooksArray = ` SELECT * FROM movie ORDER BY movie_id `
  const getResponse = await db.all(getBooksArray)
  response.send(getResponse)
})

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovie = `INSERT INTO 
  movie (director_id,movie_name,lead_actor)
  VALUES(
    ${directorId},
    '${movieName}',
    '${leadActor}'

  );`
  await db.run(addMovie)
  response.send('Movie Successfully added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getBookQuery = ` SELECT * FROM movie WHERE movie_id = ${movieId};`
  const Movie = await db.get(getBookQuery)
  response.send(Movie)
})

app.put('/movies/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovie = `UPDATE  
  movie (director_id,movie_name,lead_actor)
  SET
    director_id=${directorId},
    movie_name='${movieName}',
    actor_name='${leadActor}'
  WHERE 
  book_id = ${bookId}
  ;`
  await db.run(addMovie)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getBookQuery = ` SELECT * FROM movie WHERE movie_id = ${movieId};`
  const Movie = await db.get(getBookQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getBooksArray = ` SELECT * FROM director `
  const getResponse = await db.all(getBooksArray)
  response.send(getResponse)
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getBookQuery = ` SELECT * FROM director WHERE director_id = ${directorId} ;`
  const Movie = await db.all(getBookQuery)
  response.send(Movie)
})
module.exports = app
