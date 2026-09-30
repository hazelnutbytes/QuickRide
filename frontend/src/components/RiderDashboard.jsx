import React, { useState } from "react";

function RiderDashboard({ api, onError, showMessage, connectSocket, socketStatus, liveLocation }) {
  const [distance, setDistance] = useState(35);
  const [fare, setFare] = useState(null);
  const [ride, setRide] = useState(null);
  const [rideId, setRideId] = useState("");
  const [rideData, setRideData] = useState({ pickup: "Kharghar", destination: "Andheri", distance: 35 });

  const estimateFare = async () => {
    try {
      const response = await api.get(`/fares/estimate?distance=${distance}`);
      setFare(response.data.fare);
      showMessage("Fare estimated");
    } catch (error) { onError(error); }
  };

  const createRide = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/rides", {
        pickup: { address: rideData.pickup, latitude: 19.0473, longitude: 73.0699 },
        destination: { address: rideData.destination, latitude: 19.1197, longitude: 72.8468 },
        distance: Number(rideData.distance)
      });
      setRide(response.data.ride);
      setRideId(response.data.ride._id);
      showMessage("Ride booked successfully");
    } catch (error) { onError(error); }
  };

  const getRide = async () => {
    if (!rideId) return showMessage("Enter a ride ID first");
    try {
      const response = await api.get(`/rides/${rideId}`);
      setRide(response.data);
      showMessage("Ride loaded");
    } catch (error) { onError(error); }
  };

  return (
    <>
      <section className="card">
        <h2>Rider</h2>
        <div className="two-columns">
          <div>
            <h3>Fare Estimate</h3>
            <label>Distance (km)</label>
            <input type="number" min="1" value={distance} onChange={(e) => setDistance(e.target.value)} />
            <button onClick={estimateFare}>Estimate Fare</button>
            {fare && <div className="result"><strong>₹{fare.totalFare}</strong><span>Base ₹{fare.baseFare} + ₹{fare.farePerKm}/km</span></div>}
          </div>

          <form onSubmit={createRide}>
            <h3>Book Ride</h3>
            <label>Pickup</label>
            <input value={rideData.pickup} onChange={(e) => setRideData({ ...rideData, pickup: e.target.value })} required />
            <label>Destination</label>
            <input value={rideData.destination} onChange={(e) => setRideData({ ...rideData, destination: e.target.value })} required />
            <label>Distance (km)</label>
            <input type="number" min="1" value={rideData.distance} onChange={(e) => setRideData({ ...rideData, distance: e.target.value })} required />
            <button type="submit">Book Ride</button>
          </form>
        </div>
      </section>

      <section className="card">
        <h2>My Ride</h2>
        <div className="inline-form">
          <input placeholder="Ride ID" value={rideId} onChange={(e) => setRideId(e.target.value)} />
          <button onClick={getRide}>Get Ride</button>
        </div>
        {ride && <div className="result"><strong>{ride.status}</strong><span>{ride.pickup?.address} → {ride.destination?.address}</span><span>Fare: ₹{ride.fare}</span></div>}
      </section>

      <section className="card">
        <div className="section-title">
          <div><h2>Live Driver Location</h2><p className="muted">Socket.io location updates.</p></div>
          <span className={socketStatus === "Connected" ? "badge active" : "badge"}>Socket: {socketStatus}</span>
        </div>
        <button onClick={connectSocket}>Connect Socket.io</button>
        {liveLocation && <div className="result"><strong>Driver location received</strong><span>Latitude: {liveLocation.latitude}</span><span>Longitude: {liveLocation.longitude}</span></div>}
      </section>
    </>
  );
}

export default RiderDashboard;
