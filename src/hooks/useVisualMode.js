import { useState } from 'react';

// Create and export a useVisualmode function
// take in an initial mode
export default function useVisualMode(initialmode) {
  
  //set the mode state with the initial mode provided
  const [mode, setMode] = useState(initialmode);

  // helps us keep track of the history of the modes
  // We can store this history as a stateful array called history
  const [history, setHistory] = useState([initialmode]);

  // A transition function that will take a new mode
  const transition = (newmode, replace = false) => {
    setMode(newmode);
    if (replace) {
      setHistory(prev => [...prev.slice(0, -1), newmode])
    } else {
      setHistory(prev => [...prev, newmode])
    }
  };

    const back = () => {
      if (history.length < 2) return;
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
    };

    return { mode: history[history.length - 1], transition, back };
};

