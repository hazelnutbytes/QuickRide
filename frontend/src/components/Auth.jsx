import React, { useState } from "react";

function Auth({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "rider",
    vehicle: "Toyota Etios",
    vehicleNumber: "MH12AB1234",
    licenseNumber: "DL123456789"
  });

  return (
    <section className="card auth-card">
      <div className="tabs">
        <button className={mode === "login" ? "tab active-tab" : "tab"} onClick={() => setMode("login")}>Login</button>
        <button className={mode === "register" ? "tab active-tab" : "tab"} onClick={() => setMode("register")}>Register</button>
      </div>

      {mode === "login" ? (
        <form onSubmit={(e) => { e.preventDefault(); onLogin(loginData); }} className="form">
          <h2>Login</h2>
          <label>Email</label>
          <input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); onRegister(registerData); }} className="form">
          <h2>Create Account</h2>
          <label>Name</label>
          <input value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
          <label>Email</label>
          <input type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
          <label>Phone</label>
          <input value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} />
          <label>Role</label>
          <select value={registerData.role} onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}>
            <option value="rider">Rider</option>
            <option value="driver">Driver</option>
          </select>
          {registerData.role === "driver" && (
            <>
              <label>Vehicle</label>
              <input value={registerData.vehicle} onChange={(e) => setRegisterData({ ...registerData, vehicle: e.target.value })} required />
              <label>Vehicle Number</label>
              <input value={registerData.vehicleNumber} onChange={(e) => setRegisterData({ ...registerData, vehicleNumber: e.target.value })} required />
              <label>License Number</label>
              <input value={registerData.licenseNumber} onChange={(e) => setRegisterData({ ...registerData, licenseNumber: e.target.value })} required />
            </>
          )}
          <button type="submit">Register</button>
        </form>
      )}
    </section>
  );
}

export default Auth;
