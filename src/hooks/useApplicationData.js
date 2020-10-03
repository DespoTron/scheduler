import { useState, useEffect } from 'react'
import axios from 'axios'


export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/days'), 
      axios.get('http://localhost:8080/api/appointments'),
      axios.get('http://localhost:8080/api/interviewers')
    ])
    .then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  const setDay = day => setState({ ...state, day });

  const bookInterview = (id, interview) => {
    console.log(id, interview);

    // We want to create a new appointment object starting with the values copied from the existing appointment
    // We replace the current value of the interview key with the new value.
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    // We use the update pattern to replace the existing record with the matching id
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    // Update the bookInterview function to call setState with your new state object.
    
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        return setState({...state, appointments});
      })

  };
    
  const cancelInterview = (id) => {
  
    const appointment = {
      ...state.appointments[id],
      // interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => {
      return setState({...state, appointments})
    })
  }


  return { state, setDay, bookInterview, cancelInterview};

};