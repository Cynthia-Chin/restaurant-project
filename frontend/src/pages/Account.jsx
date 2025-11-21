import React from "react";
import '../styles/Account.css';

function Account() {
  return (
    <div className="account-page">
      <div className="account-container">
        <h1>Welcome</h1>
        <p>Please log in to manage your account.</p>
        <form>
          <label htmlFor="email">Email (required)</label>
          <input type="email" id="email" name="email" required />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default Account;
