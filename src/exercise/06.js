// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary} from "react-error-boundary"

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({status: pokemonName ? "pending" : "idle", pokemon: null, error: null})
  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: "pending", pokemon: null, error: null})
    fetchPokemon(pokemonName).then(
        pokemon => {
          setState({status: "resolved", pokemon: pokemon, error: null})
        },
        error => {
          setState({status: "rejected", pokemon: null, error: error})
        }
    )
  }, [pokemonName])

  if(status === "idle") {
    return "Submit a pokemon"
  } else if (status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === "rejected") {
    throw error
  } else if (status === "resolved") {
    return <PokemonDataView pokemon={pokemon} />
  }
  throw new Error("This Should Never Happen!")
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
  <div role="alert">
    There was an error: 
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary} > Try Again </button>
  </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName("")
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
