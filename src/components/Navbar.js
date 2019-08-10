// src/components/NavBar.js

import React from "react";
import { useAuth0 } from "../react-auth0-wrapper";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button className="btn btn-outline-success my-2 my-sm-0"
          onClick={() =>
            loginWithRedirect({})
          }
        >
          Log in
        </button>
      )}

      {isAuthenticated && <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default NavBar;