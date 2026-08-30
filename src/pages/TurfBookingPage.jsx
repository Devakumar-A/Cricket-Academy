import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import "./TurfBookingPage.css";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const STATUS_PRIORITY = {
  available: 0,
  blocked: 1,
  requested: 2,
  confirmed: 3,
};

function timeToMinutes(time) {
  if (!time) return 0;

  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

function formatHour(hour) {
  const h = hour % 24;
  const displayHour = h % 12 || 12;
  const period = h < 12 ? "AM" : "PM";

  return `${displayHour}:00 ${period}`;
}

function formatTimeFromMinutes(totalMinutes) {
  const normalized = totalMinutes % (24 * 60);
  const hour = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const displayHour = hour % 12 || 12;
  const period = hour < 12 ? "AM" : "PM";

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getStatusForHour(hour, availability) {
  const hourStart = hour * 60;
  const hourEnd = hourStart + 60;

  let result = "available";

  availability.forEach((item) => {
    const start = timeToMinutes(item.start_time);
    let end = timeToMinutes(item.end_time);

    // Allow an end time of 00:00 to represent midnight.
    if (end === 0 && start > 0) {
      end = 24 * 60;
    }

    if (start < hourEnd && end > hourStart) {
      const status = item.availability_status;

      if (
        STATUS_PRIORITY[status] !== undefined &&
        STATUS_PRIORITY[status] > STATUS_PRIORITY[result]
      ) {
        result = status;
      }
    }
  });

  return result;
}


export default function TurfBookingPage({ onBack, user }) {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [availability, setAvailability] = useState([]);

  const [selectedHour, setSelectedHour] = useState(null);
  const [duration, setDuration] = useState(1);

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [channel, setChannel] = useState(null);

  /*
   * Load turfs once.
   */
  useEffect(() => {
    loadTurfs();

    const today = new Date();
    const localDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    setSelectedDate(localDate);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  /*
   * Load availability whenever turf/date changes.
   */
  useEffect(() => {
    if (!selectedTurf || !selectedDate) return;

    loadAvailability();
    subscribeRealtime();
  }, [selectedTurf, selectedDate]);

  async function loadTurfs() {
    const { data, error } = await supabase
      .from("turfs")
      .select("id, name")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("TURF ERROR:", error);
      setMessage("Unable to load turfs.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    setTurfs(data || []);

    if (data?.length > 0) {
      setSelectedTurf(data[0].id);
    }

    setLoading(false);
  }

  async function loadAvailability(showLoader = true) {
    if (!selectedTurf || !selectedDate) return;

    if (showLoader) {
      setAvailabilityLoading(true);
    }

    const { data, error } = await supabase
      .from("turf_availability")
      .select(
        "reference_id,turf_id,booking_date,start_time,end_time,availability_status,source"
      )
      .eq("turf_id", selectedTurf)
      .eq("booking_date", selectedDate)
      .order("start_time");

    if (error) {
      console.error("AVAILABILITY ERROR:", error);
      setMessage("Unable to load availability.");
      setMessageType("error");
      setAvailabilityLoading(false);
      return;
    }

    console.log("TURF AVAILABILITY:", data);

    setAvailability(data || []);
    setAvailabilityLoading(false);

    /*
     * If the currently selected start time has become unavailable,
     * remove the selection.
     */
    if (selectedHour !== null) {
      const status = getStatusForHour(selectedHour, data || []);

      if (status !== "available") {
        setSelectedHour(null);
      }
    }
  }

  function subscribeRealtime() {
    if (channel) {
      supabase.removeChannel(channel);
    }

    const newChannel = supabase
      .channel(`turf-availability-${selectedTurf}-${selectedDate}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          /*
           * IMPORTANT:
           * No Loading screen here.
           * Silently refresh the availability.
           */
          loadAvailability(false);
        }
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blocked_slots",
        },
        () => {
          /*
           * Silent realtime refresh.
           */
          loadAvailability(false);
        }
      )

      .subscribe((status) => {
        console.log("Realtime:", status);
      });

    setChannel(newChannel);
  }

  /*
   * Current selected start time.
   */
  const startMinutes =
    selectedHour === null ? null : selectedHour * 60;

  /*
   * Automatically calculate end time.
   */
  const endMinutes =
    startMinutes === null
      ? null
      : startMinutes + duration * 60;

  const startTimeText =
    startMinutes === null
      ? "--"
      : formatTimeFromMinutes(startMinutes);

  const endTimeText =
    endMinutes === null
      ? "--"
      : formatTimeFromMinutes(endMinutes);

  /*
   * Check whether the complete requested duration is available.
   */
  const bookingAvailable = useMemo(() => {
    if (selectedHour === null || duration === 0) {
      return false;
    }

    const start = selectedHour * 60;
    const end = start + duration * 60;

    /*
     * Prevent crossing midnight for now.
     * This keeps booking_date and end_time consistent.
     */
    if (end > 24 * 60) {
      return false;
    }

    for (let minute = start; minute < end; minute += 60) {
      const hour = Math.floor(minute / 60);

      if (getStatusForHour(hour, availability) !== "available") {
        return false;
      }
    }

    return true;
  }, [selectedHour, duration, availability]);

  /*
   * Check whether a start hour can support a duration.
   */
  function canStartAt(hour) {
    if (getStatusForHour(hour, availability) !== "available") {
      return false;
    }

    /*
     * Start time must have enough room until midnight.
     */
    if (hour * 60 + duration * 60 > 24 * 60) {
      return false;
    }

    for (
      let minute = hour * 60;
      minute < hour * 60 + duration * 60;
      minute += 60
    ) {
      const currentHour = Math.floor(minute / 60);

      if (
        getStatusForHour(currentHour, availability) !== "available"
      ) {
        return false;
      }
    }

    return true;
  }

  function handleHourClick(hour) {
    if (!canStartAt(hour)) {
      return;
    }

    setSelectedHour(hour);
    setMessage("");
  }

  function handleDurationChange(value) {
    const newDuration = Number(value);

    setDuration(newDuration);

    /*
     * If the new duration makes the current selection invalid,
     * automatically remove the selection.
     */
    if (selectedHour !== null) {
      if (!canStartAtWithDuration(selectedHour, newDuration)) {
        setSelectedHour(null);
      }
    }
  }

  function canStartAtWithDuration(hour, selectedDuration) {
    if (selectedDuration === 0) {
      return false;
    }

    if (
      hour * 60 + selectedDuration * 60 >
      24 * 60
    ) {
      return false;
    }

    for (
      let minute = hour * 60;
      minute < hour * 60 + selectedDuration * 60;
      minute += 60
    ) {
      const currentHour = Math.floor(minute / 60);

      if (
        getStatusForHour(currentHour, availability) !==
        "available"
      ) {
        return false;
      }
    }

    return true;
  }

  async function requestBooking() {
    if (!bookingAvailable) {
      setMessage(
        "Please select an available start time and duration."
      );
      setMessageType("error");
      return;
    }

    if (!user) {
      setMessage("Please login first.");
      setMessageType("error");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      setMessageType("error");
      return;
    }

    const selectedTurfObject = turfs.find(
      (turf) => turf.id === selectedTurf
    );

    const startTime =
      `${String(Math.floor(startMinutes / 60)).padStart(
        2,
        "0"
      )}:00:00`;

    const calculatedEndMinutes = startMinutes + duration * 60;

    const endTime =
      `${String(Math.floor(calculatedEndMinutes / 60)).padStart(
        2,
        "0"
      )}:00:00`;

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      turf_id: selectedTurf,
      name,
      phone: phone.trim(),
      email: user.email,
      booking_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      duration,
      status: "requested",
      payment_status: "pending",
    });

    if (error) {
      console.error("BOOKING ERROR:", error);

      /*
       * Do not show the raw database error to customers.
       */
      if (
        error.code === "23P01" ||
        error.message?.includes("no_overlapping_bookings")
      ) {
        setMessage(
          "This time was just booked. Please choose another slot."
        );
      } else {
        setMessage(error.message || "Booking request failed.");
      }

      setMessageType("error");

      /*
       * Refresh silently so the UI immediately reflects
       * the latest availability.
       */
      loadAvailability(false);
      return;
    }

    setMessage(
      `Booking request sent for ${selectedTurfObject?.name || "turf"} • ${startTimeText} – ${endTimeText}`
    );
    setMessageType("success");

    setSelectedHour(null);
    setDuration(1);

    /*
     * Realtime will update this automatically,
     * but refresh silently as well.
     */
    loadAvailability(false);
  }

  if (loading) {
    return (
      <div className="turf-page">
        <div className="turf-loading">
          Loading turfs...
        </div>
      </div>
    );
  }

  return (
    <div className="turf-page">
      <div className="turf-container">

        {/* Header */}
        <div className="booking-header">
          <div>
            <button
              className="back-button"
              onClick={onBack}
            >
              ← Back
            </button>

            <h1>Book a Turf</h1>

            <p>
              Choose your turf, date and available starting time.
            </p>
          </div>

          <div className="live-badge">
            <span></span>
            Live
          </div>
        </div>

        {/* Selection */}
        <section className="booking-card">

          <div className="field-grid">

            <div className="field">
              <label>Turf</label>

              <select
                value={selectedTurf}
                onChange={(e) => {
                  setSelectedTurf(e.target.value);
                  setSelectedHour(null);
                }}
              >
                {turfs.map((turf) => (
                  <option
                    key={turf.id}
                    value={turf.id}
                  >
                    {turf.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Date</label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedHour(null);
                }}
              />
            </div>

          </div>

          <div className="availability-heading">
            <div>
              <h2>Choose a starting time</h2>
              <p>
                Green slots are available for booking.
              </p>
            </div>

            {availabilityLoading && (
              <span className="small-refresh">
                Updating...
              </span>
            )}
          </div>

          {/* Legend */}
          <div className="legend">

            <span>
              <i className="legend-dot available-dot"></i>
              Available
            </span>

            <span>
              <i className="legend-dot requested-dot"></i>
              Requested
            </span>

            <span>
              <i className="legend-dot confirmed-dot"></i>
              Confirmed
            </span>

            <span>
              <i className="legend-dot blocked-dot"></i>
              Blocked
            </span>

          </div>

          {/* 24 Hour Grid */}
          <div className="time-grid">

            {HOURS.map((hour) => {
              const status = getStatusForHour(
                hour,
                availability
              );

              const selectable =
                status === "available" &&
                canStartAt(hour);

              const selected =
                selectedHour === hour;

              return (
                <button
                  key={hour}
                  type="button"
                  disabled={!selectable}
                  onClick={() =>
                    handleHourClick(hour)
                  }
                  className={`time-card ${status} ${
                    selected ? "selected" : ""
                  }`}
                >
                  <div className="time-card-top">
                    <strong>
                      {formatHour(hour)}
                    </strong>

                    {selected && (
                      <span className="check">
                        ✓
                      </span>
                    )}
                  </div>

                  <span className="time-status">
                    {status === "available" &&
                      "Available"}

                    {status === "requested" &&
                      "Requested"}

                    {status === "confirmed" &&
                      "Confirmed"}

                    {status === "blocked" &&
                      "Blocked"}
                  </span>
                </button>
              );
            })}

          </div>

        </section>

        {/* Booking Configuration */}
        <section className="booking-card">

          <div className="section-title">
            <div>
              <h2>Booking details</h2>
              <p>
                Set your playing duration.
              </p>
            </div>
          </div>

          {/* Start / End */}
          <div className="time-summary">

            <div className="time-box">
              <span>START TIME</span>
              <strong>
                {startTimeText}
              </strong>
            </div>

            <div className="arrow">
              →
            </div>

            <div className="time-box">
              <span>END TIME</span>
              <strong>
                {endTimeText}
              </strong>
            </div>

          </div>

          {/* Duration */}
          <div className="duration-section">

            <div className="duration-header">
              <div>
                <label>Duration</label>
                <p>Maximum 3 hours</p>
              </div>

              <strong>
                {duration}{" "}
                {duration === 1
                  ? "hour"
                  : "hours"}
              </strong>
            </div>

            <input
              className="duration-slider"
              type="range"
              min="0"
              max="3"
              step="1"
              value={duration}
              onChange={(e) =>
                handleDurationChange(
                  e.target.value
                )
              }
            />

            <div className="duration-labels">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3 hrs</span>
            </div>

          </div>

          {/* Phone */}
          <div className="field phone-field">
            <label>Phone number</label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />
          </div>

          {/* Selection status */}
          {selectedHour !== null && (
            <div
              className={`selection-info ${
                bookingAvailable
                  ? "selection-good"
                  : "selection-bad"
              }`}
            >
              <div className="selection-icon">
                {bookingAvailable
                  ? "✓"
                  : "!"}
              </div>

              <div>
                <strong>
                  {bookingAvailable
                    ? "Time available"
                    : "Time unavailable"}
                </strong>

                <p>
                  {bookingAvailable
                    ? `${startTimeText} – ${endTimeText}`
                    : "Choose another start time or reduce the duration."}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`booking-message ${messageType}`}
            >
              {message}
            </div>
          )}

          {/* Request */}
          <button
            className="request-button"
            disabled={!bookingAvailable}
            onClick={requestBooking}
          >
            {bookingAvailable
              ? "Request Booking"
              : "Select an Available Time"}
          </button>

          <p className="request-note">
            Your booking will be sent as a request.
            The owner will verify payment and confirm
            the slot.
          </p>

        </section>

      </div>
    </div>
  );
}