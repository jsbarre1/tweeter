import React, { useState } from "react";

export default function AuthenticationFields({
  handleRegisterOrLogin,
  setAlias,
  setPassword,
}: {
  handleRegisterOrLogin: (event: React.KeyboardEvent<HTMLElement>) => void;
  setAlias: (value: string) => void;
  setPassword: (value: string) => void;
}) {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
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
          aria-label="password"
          onKeyDown={handleRegisterOrLogin}
          onChange={(event) => setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
}
