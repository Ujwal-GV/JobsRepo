import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useGetProfileData = ()=>{
    const {userRole , setProfileData} = useContext(AuthContext)

      const navigate = useNavigate();
    
    const getProfileData = async()=>{
        const res = await axiosInstance.get("/user/profile");
        if(res.data)
        {
          setProfileData(res.data)
          
        }
        if(res.data.isBlocked)
          {
            toast.error("Your Account is blocked.Please contact support team");
            localStorage.removeItem('authToken')
            sessionStorage.removeItem('location');
            navigate("/user/login");
          }
          return res.data;
        return res.data
      }

    return useQuery({
        queryKey:["profile"],
        queryFn:getProfileData,
        staleTime:Infinity,
        gcTime:Infinity,
      })

}