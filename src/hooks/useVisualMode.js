import { useState } from 'react';

// Create and export a useVisualmode function
// take in an initial mode
export default function useVisualMode(initialmode) {
  
  //set the mode state with the initial mode provided
  const [mode, setMode] = useState(initialmode);

  // A transition function that will take a new mode
  const transition = (newmode) => {
    setMode(newmode);
  }

  const back = () => {

  }

  // return an object with a mode property
  return { mode, transition, back }
}