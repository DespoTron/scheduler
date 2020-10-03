import { useState, useEffect } from 'react'
import axios from 'axios'


export default function useApplicationData() {
  const setDay = day => setState({ ...state, day });
  
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

  
  
  const bookInterview = (id, interview) => {
    // console.log(id, interview);
    const foundDay = state.days.find((day) => day.appointments.includes(id));

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

    const days = state.days.map((day, index) => {
      if (day.name === foundDay.name && state.appointments[id].interview === null) {
        return { ...day, spots: day.spots - 1 };
      } else {
        return day;
      }
    });

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        return setState({ ...state, appointments, days });
      });
  };
    
  const cancelInterview = (id) => {

    const foundDay = state.days.find((day) => day.appointments.includes(id));

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const days = state.days.map((day) => {
      if (day.name === foundDay.name) {
        return { ...day, spots: day.spots + 1 };
      } else {
        return day;
      }
    });

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        return setState({ ...state, appointments, days });
      });
  }

  return { state, setDay, bookInterview, cancelInterview};

};