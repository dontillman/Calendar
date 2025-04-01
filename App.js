import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';

// Windborne Date Picker Component demo

function App() {
    return (
        <div className="App">
          <CalWidget value={new Date()}
                     onChange={date => alert(date)} />
        </div>
    );
}

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// (The JavaScript Date object is pretty arcane, so...)
// A new Date offset by this number of days.
const dateOffset = (date, offset) =>
      new Date(new Date(date).setDate(date.getDate() + offset));

// Return an array weeks of days for a month.
const monthOfWeeksOfDates = date => {
    const thisMonth = date.getMonth();
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth());

    // Return a week of dates starting on this Sunday
    const dateWeek = date => 
          dayNames.map((x, i) => dateOffset(date, i));

    const result = [];
    let sun = dateOffset(firstOfMonth, -firstOfMonth.getDay());
    do {
        result.push(dateWeek(sun));
        sun = dateOffset(sun, 7);
    } while (sun.getMonth() == thisMonth);
    return result;
};

// Calendar Widget
// props are value, onChange
const CalWidget = params => {
    const {value, onChange} = params;
    const [date, setDate] = useState(value);
    const inputRef = useRef();

    // Updates the text input field.
    useEffect(() => {
        inputRef.current.value = date.toLocaleDateString();
    });

    // Handle the mouse clicks
    const handlePrevMonth = () =>
          setDate(new Date(date.getFullYear(), date.getMonth() - 1));

    const handleNextMonth = () =>
          setDate(new Date(date.getFullYear(), date.getMonth() + 1));

    const handleDateClick = d => 
          setDate(d);

    // The text input field validates, and set if good.
    const handleText = e => {
        const d = new Date(e.target.value);
        if ('Invalid Date' == d) {
            inputRef.current.className = 'cal-text-err';
        } else {
            inputRef.current.className = 'cal-text';
            setDate(d);
        }
    };
    
    const handleSelect = () =>
          onChange(date);
    
    // A day cell in the calendar table
    // Dims outside the current month, clickable in the current month.
    const tableDay = (day, key) => {
        const enabled = day.getMonth() == date.getMonth();
        return <td className={enabled ? 'cal-day-en' : 'cal-day'}
                   key={key}
                   onClick={e => enabled && handleDateClick(day)}>
                 {day.getDate()}
               </td>;
    };

    // Return the rows of the calendar table.
    const tableWeeks = monthOfWeeksOfDates(date).map((week, i) =>
        <tr key={i}>
          {week.map((day, j) => tableDay(day, j))}
        </tr>);
    
    return <div className="cal-widget">
             <input type='text'
                    ref={inputRef}
                    defaultValue={date.toLocaleDateString()}
                    onChange={handleText}/>
             <div className="cal-header">
               <button onClick={handlePrevMonth}>&larr;</button>
               {date.toLocaleDateString('default', {month: 'long', year: 'numeric'})}
               <button onClick={handleNextMonth}>&rarr;</button>
             </div>

             <div className="cal-body">
               <table>
                 <thead>
                   <tr>
                     {dayNames.map((d, i)  => <th key={i}>{d}</th>)}
                   </tr>
                 </thead>
                 <tbody>
                   {tableWeeks}
                 </tbody>
               </table>
             </div>
             <button onClick={handleSelect}>Select</button>
           </div>;
};

export default App;
