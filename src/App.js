import React from 'react';
import './App.css';
import GroceryList from './components/GroceryList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Grocery List</h1>
      </header>
      <main>
        <GroceryList />
      </main>
    </div>
  );
}

export default App;
