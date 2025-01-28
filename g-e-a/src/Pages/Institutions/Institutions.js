import React, { useContext } from 'react'
import { AuthContext } from "../../Context/context";


function Institutions() {

  const { UserType } = useContext(AuthContext);

  return (
    <>
      { UserType === "u" && (
        <div>Institutions for users</div>
      )}

      {UserType === "a" && (
        <div>Institutions for Admins</div>
      )}

    </>
  )
}

export default Institutions