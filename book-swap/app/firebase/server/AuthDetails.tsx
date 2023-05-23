import React, { useEffect, useState } from "react";
import { auth} from "./firebase";
import { User, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/router';


const AuthDetails = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userID, setUserID] = useState<string | null>(null); // State variable to store the user ID
  const router = useRouter(); // Access the router object from next/router


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setUserID(user.uid); // Set the user ID when the user is authenticated
      } else {
        setAuthUser(null);
        setUserID(null); // Clear the user ID when the user is not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Sign out successful');
        router.push('/'); // Redirect to '/' after signing out
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