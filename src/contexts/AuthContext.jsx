import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("user");
  const [profileData,setProfileData] = useState(null)

  return (
    <AuthContext.Provider value={{ userRole, setUserRole  , profileData,setProfileData}}>
      {children}
    </AuthContext.Provider>
  );
};
