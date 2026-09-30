import React, { useEffect, useState } from "react";

function DriverDashboard({ api, onError, showMessage, connectSocket, socketStatus, sendSocketLocation }) {
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [ride, setRide] = useState(null);
  const [rideId, setRideId] = useState("");
  const [driverId, setDriverId] = useState("");

  const loadDrivers = async () => {
    try {
      const response = await api.get("/drivers");
      setDrivers(response.data);
      if (response.data.length > 0) setDriverId(response.data[0]._id);
      showMessage("Driver profile loaded");
    } catch (error) { onError(error); }
  };

  const updateLocation = async () => {
    if (!driverId) return showMessage("Driver profile not loaded");
    try {
      const response = await api.put(`/drivers/${driverId}/location`, { latitude: 19.055, longitude: 73.075 });
      setDrivers((current) => current.map((driver) => driver._id === driverId ? response.data.driver : driver));
      showMessage("Driver location updated");
    } catch (error) { onError(error); }
  };

  const uploadDocument = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("document", file);
      const response = await api.post("/drivers/documents", formData);
      showMessage(response.data.message);
      await loadDrivers();
      event.target.value = "";
    } catch (error) { onError(error); }
  };

  const searchPendingRides = async () => {
    try {
      const response = await api.get("/rides/search?status=pending");
      setRides(response.data);
      showMessage("Pending rides loaded");
    } catch (error) { onError(error); }
  };

  const acceptRide = async (id = rideId) => {
    if (!id) return showMessage("Enter a ride ID first");
    try {
      const response = await api.put(`/rides/${id}/accept`);
      setRide(response.data.ride);
      setRideId(id);
      showMessage("Ride accepted");
      await searchPendingRides();
    } catch (error) { onError(error); }
  };

  const completeRide = async () => {
    if (!rideId) return showMessage("Enter a ride ID first");
    if (!ride || ride._id !== rideId) {
      try {
        const response = await api.get(`/rides/${rideId}`);
        setRide(response.data);
        if (response.data.status !== "accepted") {
          return showMessage(`Ride cannot be completed. Current status: ${response.data.status}`);
        }
      } catch (error) { return onError(error); }
    } else if (ride.status !== "accepted") {
      return showMessage(`Ride cannot be completed. Current status: ${ride.status}`);
    }

    try {
      const response = await api.put(`/rides/${rideId}/complete`);
      setRide(response.data.ride);
      showMessage("Ride completed successfully");
      await loadDrivers();
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

  useEffect(() => {
    loadDrivers();
  }, []);

  return (
    <>
      <section className="card">
        <div className="section-title"><div><h2>Driver</h2><p className="muted">Your driver profile and documents.</p></div></div>
        <button onClick={loadDrivers}>Refresh Profile</button>
        {drivers.map((driver) => (
          <div className="result" key={driver._id}>
            <strong>{driver.vehicle}</strong>
            <span>{driver.vehicleNumber} • License: {driver.licenseNumber}</span>
            <span>Availability: {driver.isAvailable ? "Available" : "On ride"}</span>
            <span>Document: {driver.documents?.fileName || "Not uploaded"}</span>
          </div>
        ))}
        <div className="button-row">
          <button onClick={updateLocation}>Update Location</button>
          <label className="file-button">Upload Document<input type="file" onChange={uploadDocument} /></label>
        </div>
      </section>

      <section className="card">
        <h2>Ride Requests</h2>
        <button onClick={searchPendingRides}>Load Pending Rides</button>
        <div className="driver-list">
          {rides.map((item) => (
            <div className="list-item" key={item._id}>
              <strong>{item.pickup?.address} → {item.destination?.address}</strong>
              <span>₹{item.fare} • {item.distance} km</span>
              <button className="small" onClick={() => acceptRide(item._id)}>Accept</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Current Ride</h2>
        <div className="inline-form">
          <input placeholder="Ride ID" value={rideId} onChange={(e) => setRideId(e.target.value)} />
          <button onClick={getRide}>Get Ride</button>
        </div>
        {ride && <div className="result"><strong>Status: {ride.status}</strong><span>{ride.pickup?.address} → {ride.destination?.address}</span><span>Fare: ₹{ride.fare}</span></div>}
        <div className="button-row">
          {ride?.status === "accepted" && <button onClick={completeRide}>Complete Ride</button>}
          {ride?.status === "pending" && <button onClick={() => acceptRide()}>Accept Ride</button>}
        </div>
      </section>

      <section className="card">
        <div className="section-title"><div><h2>Live Location</h2><p className="muted">Send the driver's current location through Socket.io.</p></div><span className={socketStatus === "Connected" ? "badge active" : "badge"}>Socket: {socketStatus}</span></div>
        <div className="button-row">
          <button onClick={connectSocket}>Connect Socket.io</button>
          <button onClick={() => sendSocketLocation(driverId)}>Send Location</button>
        </div>
      </section>
    </>
  );
}

export default DriverDashboard;
