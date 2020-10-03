import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList";

import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  // const [day, setDay] = useState("Monday");
  // const [days, setDays] = useState([]);
  // const [appointments, setAppointments] = useState({});

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });


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


  const appointments = getAppointmentsForDay(state, state.day);
  
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    const dailyInterview = getInterviewersForDay(state, state.day);
    
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        // {...appointment}
        interviewers={dailyInterview}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  const setDay = day => setState({ ...state, day });
    
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
  
  // const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  // const appointmentsList = dailyAppointments.map((appointment) => { 
  //   const interview = getInterview(state, appointment.interview)
  //   return (<Appointment key={appointment.id} {...appointment} />)});


  return (
    <main className="layout">
      <section className="sidebar">
        <img 
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day= {state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { schedule }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
