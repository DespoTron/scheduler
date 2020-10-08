import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {},      
}

const reducer = (state, action) => {
  switch(action.type) {
    case SET_DAY:
      return {...state, day: action.day }

    case SET_APPLICATION_DATA: {
      const {days, appointments, interviewers} = action
      return {...state, days, appointments, interviewers}
    }
    case SET_INTERVIEW: {
      const { id, interview } = action
      // console.log("ARE YOU NULL", interview)
      const appointment = {
        ...state.appointments[id],
        interview: interview ? { ...interview } : null, // IN HONOUR OF MANALI
        // interview: interview && {...interview}
      };
      
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };   

      const getSpotsForDay = (day) => {
        const initialLength = day.appointments.length;
        const spotCounter = (count, id) =>  
        { const appointmentid = appointments[id]
          return Boolean(appointmentid.interview) ? count + 1 : count }



        const reduceAppointments = day.appointments.reduce(spotCounter, 0);
        return initialLength - reduceAppointments;  
      }

      const days = state.days.map((day) => {
        const appointments = day.appointments.includes(id) ? {...day, spots: getSpotsForDay(day) } : day
        return appointments;
      });

      return {...state, appointments, days}
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {


  const [state, dispatch] = useReducer(reducer, initialState)

  const setDay = day => dispatch({ type: SET_DAY, day})

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'), 
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      dispatch({ 
        type: SET_APPLICATION_DATA, 
        days: all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data,
      })
    });
  }, []);

  
  
  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
        // return setState({ ...state, appointments, days });
      });
  };
    
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, interview: null, id})
      });
  }

  return { state, setDay, bookInterview, cancelInterview};

};