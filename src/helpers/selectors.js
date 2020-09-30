import Appointment from "components/Appointment";

export function getAppointmentsForDay(state, day) {
  const filteredDays = state.days.filter(day => day.name === day);
  return filteredDays;
};