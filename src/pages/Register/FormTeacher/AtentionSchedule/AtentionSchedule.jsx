import "./styles-atention-schedule.css";
import { useCallback, useMemo } from "react";

/**
 * AtentionSchedule component
 * @param {Object} props - Component props
 * @param {Object} props.valuesTeacher - Teacher data values
 * @param {number} props.count - Count
 * @param {function} props.setValuesTeacher - Function to set teacher data values
 * @returns {JSX.Element} AtentionSchedule component
 */
export default function AtentionSchedule({
  valuesTeacher,
  count,
  setValuesTeacher,
}) {
  const { day, start, end } = valuesTeacher.attention_schedule[count];

  const DAYS = useMemo(
    () => ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    []
  );

  /**
   * Handles day change
   * @param {Object} e - Event object
   */
  const handleDayChange = useCallback(
    (e) => {
      const newDay = e.target.value;
      const updatedSchedule = [...valuesTeacher.attention_schedule];
      updatedSchedule[count].day = newDay;
      setValuesTeacher({
        ...valuesTeacher,
        attention_schedule: updatedSchedule,
      });
    },
    [valuesTeacher, count, setValuesTeacher]
  );

  /**
   * Handles start time change
   * @param {Object} e - Event object
   */
  const handleStartChange = useCallback(
    (e) => {
      const newStart = e.target.value;
      const updatedSchedule = [...valuesTeacher.attention_schedule];
      updatedSchedule[count].start = newStart;
      setValuesTeacher({
        ...valuesTeacher,
        attention_schedule: updatedSchedule,
      });
    },
    [valuesTeacher, count, setValuesTeacher]
  );

  /**
   * Handles end time change
   * @param {Object} e - Event object
   */
  const handleEndChange = useCallback(
    (e) => {
      const newEnd = e.target.value;
      const updatedSchedule = [...valuesTeacher.attention_schedule];
      updatedSchedule[count].end = newEnd;
      setValuesTeacher({
        ...valuesTeacher,
        attention_schedule: updatedSchedule,
      });
    },
    [valuesTeacher, count, setValuesTeacher]
  );

  return (
    <div className="atention-schedule-container">
      <select
        className="form-select"
        onChange={handleDayChange}
        value={day || ""}
      >
        <option disabled value="">
          Día
        </option>
        {DAYS.map((dayOption, index) => (
          <option key={index} value={dayOption}>
            {dayOption}
          </option>
        ))}
      </select>
      <input
        type="time"
        className="form-input-time"
        onChange={handleStartChange}
        value={start || ""}
        max={end || ""}
      />
      <input
        type="time"
        className="form-input-time"
        onChange={handleEndChange}
        value={end || ""}
        min={start || ""}
      />
    </div>
  );
}
