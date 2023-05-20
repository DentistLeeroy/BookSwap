import React, { useEffect, useState } from "react";
import { auth} from "./firebase";
import { User, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
  signOut(auth)
    .then(() => {
      console.log("sign out successful");
    })
    .catch((error) => console.log(error));
}, []);


  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {authUser ? (
        <>
          <p>{`Signed In as ${authUser.email}`}</p>
          <button onClick={userSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Signed out</p>
      )}
    </div>
  );
};

export default AuthDetails;
