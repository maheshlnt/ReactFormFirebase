import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error, setError]=useState(null)

  // async function fetchMoviesHandler(){ 
  const fetchMoviesHandler=useCallback(async ()=>{ 
  setIsLoading(true);
  setError(null)
  try{
    // const response= await fetch('https://swapi.py4e.com/api/films')
    const response= await fetch('https://react-http-d071a-default-rtdb.firebaseio.com/movies.json');
  
   const data  = await response.json();  //to show exact syntax error 
  if(!response.ok){
    throw new Error('Something went wrong')  //to show defined error message
  }
const loadedMovies=[];
for(const key in data){
loadedMovies.push({
  id:key,
  title:data[key].title,
  openText:data[key].openingText,
  releaseDate:data[key].releaseDate
});
}
  //const data  = await response.json(); 
    // const transformedMovies=data.results.map(movieData=>{
      const transformedMovies=loadedMovies.map(movieData=>{
      return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date,
      }
    })
    setMovies(transformedMovies)
    // setIsLoading(false); moved to bottom
  }catch (error){
   setError(error.message);
  } 
  setIsLoading(false);
 },[]);
 
 useEffect(()=>{
  fetchMoviesHandler();
  console.log("ads")
},[fetchMoviesHandler]);

async function addMovieHandler(movie) {
  console.log(movie);
  const response = await fetch('https://react-http-d071a-default-rtdb.firebaseio.com/movies.json',{
    method:'POST',
    body:JSON.stringify(movie),
    headers:{
      'Content-Type':'application/json'
    }
  });
  const data = await response.json();
  console.log(data)

}
let content = <p>Found no movies.</p>
if(movies.length>0){
  content=<MoviesList movies={movies} />
}
if(error){
  content=<p>{error}</p>
}
if(isLoading){
  content=<p>Loading...</p>
}
return (
  <React.Fragment>
     <section>
      
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
    <section>
      <button onClick={fetchMoviesHandler}>Fetch Movies</button>
    </section>
    <section>
      {content}
      {/* {{!isLoading && movies.length>0 && <MoviesList movies={movies} />}
      {!isLoading && movies.length===0 && !error && <p>No movies found</p>}
      {!isLoading && error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>}} */}
    </section>
  </React.Fragment>
);
}

export default App;
