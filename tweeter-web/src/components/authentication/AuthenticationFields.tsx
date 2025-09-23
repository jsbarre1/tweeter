import React, { useState } from "react";

export default function AuthenticationFields({
  handleRegisterOrLogin,
  setAlias,
  setPassword
}: {
  handleRegisterOrLogin: (
    event: React.KeyboardEvent<HTMLElement>,
  ) => void;
  setAlias: React.Dispatch<React.SetStateAction<string>>
  setPassword: React.Dispatch<React.SetStateAction<string>>
}) {

  return (
    <>
      <div>
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={handleRegisterOrLogin}
          onChange={(event) => setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={handleRegisterOrLogin}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
}
