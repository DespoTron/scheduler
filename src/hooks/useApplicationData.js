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
      
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };
      
      
      // console.log("APPOINTMENT SPREAD", appointment)
      
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };   
      
      // console.log("APOINTSSSSS SPREAD", appointments)
      
      const foundDay = state.days.find((day) => day.appointments.includes(id));
      // 
      const days = state.days.map((day) => {
        // console.log("STATE APPOINTMENTS ID INTEVIEW", state.appointments[id].interview)
        if (day.name === foundDay.name && state.appointments[id].interview === null ) {
          // console.log("DAY NAME", day.name)
          // console.log("FOUND NAME", foundDay.name)
          // console.log("STATE APPOINTSMENTS" , state.appointments)
          // console.log("ID", state.appointments[id])
          // console.log("INTERVIEW", state.appointments[id].interview)
          // console.log("DAY LIST", {...day})
          return { ...day, spots: interview ? day.spots - 1 : day.spots + 1};
        } else {
          return day;
        }
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
  // const setDay = day => setState({ ...state, day });
  
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {},
  // })

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
      // setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  
  
  const bookInterview = (id, interview) => {
    // console.log(id, interview);
    // const foundDay = state.days.find((day) => day.appointments.includes(id));

    // // We want to create a new appointment object starting with the values copied from the existing appointment
    // // We replace the current value of the interview key with the new value.
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview },
    // };
    // // We use the update pattern to replace the existing record with the matching id
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment,
    // };

    // const days = state.days.map((day, index) => {
    //   if (day.name === foundDay.name && state.appointments[id].interview === null) {
    //     return { ...day, spots: day.spots - 1 };
    //   } else {
    //     return day;
    //   }
    // });

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
        // return setState({ ...state, appointments, days });
      });
  };
    
  const cancelInterview = (id) => {

    // const foundDay = state.days.find((day) => day.appointments.includes(id));

    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment,
    // };

    // const days = state.days.map((day) => {
    //   if (day.name === foundDay.name) {
    //     return { ...day, spots: day.spots + 1 };
    //   } else {
    //     return day;
    //   }
    // });

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, interview: null, id})
        // return setState({ ...state, appointments, days });
      });
  }

  return { state, setDay, bookInterview, cancelInterview};

};