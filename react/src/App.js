import React from 'react';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import Dashboard from './components/Dashboard';
import Example from './components/example'
import './App.css';

function App() {
  return (
    <div className="App">
        <Dashboard />
        <DndProvider backend={Backend}>
            <Example />
        </DndProvider>
    </div>
  );
}

export default App;
