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
    
    // replace ? setHistory(prev => [...prev.slice(0, -1), newmode]) : setHistory(prev => [...prev, newmode])
    // if (replace) {

    //   history[history.length - 1] = newmode
    //   setMode(newmode);
    //   // history.pop();
    //   return;
    // }

    // // update the mode state with the new value

    // // When transition is called, we need to add the new mode to our historyy
    // // history.push(newmode)
    // setHistory(prev => ([...prev, newmode]));

    // setMode(newmode)

    const back = () => {
      if (history.length < 2) return;
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
    };

    return { mode: history[history.length - 1], transition, back };
};
  
  // When back is called, we should set the mode to the previous item in our history array
  // const back = () => {

  //   // Constraint on our back function/should not allow the user to go back past initial mode
  //   // This means that our history array will always need to have a length that is great than 1
  //   if (history.length > 1) {
  //     // setMode(mode)
  //     // history.pop();

  //     setHistory(history);

  //     setMode(history[history.length - 2]);
  //   } 
  // }
  

  // // return an object with a mode property
  // return { mode, transition, back }
