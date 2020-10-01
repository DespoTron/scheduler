import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList";

import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";


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

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/days'), 
      axios.get('http://localhost:8080/api/appointments'),
      axios.get('http://localhost:8080/api/interviewers')
    ])
    .then((all) => {
      const [GET_DAYS, GET_APPOINTMENTS, GET_INTERVIEWERS] = all;
      setState(prev => ({...prev, days: GET_DAYS.data, appointments: all[1].data, interviewers: GET_INTERVIEWERS.data}));
      console.log(GET_INTERVIEWERS.data);
    });
  }, []);
  
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentsList = dailyAppointments.map((appointment) => { 
    const interview = getInterview(state, appointment.interview)
    return (<Appointment key={appointment.id} {...appointment} />)});

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
        { appointmentsList }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
