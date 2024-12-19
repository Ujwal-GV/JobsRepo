import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useGetProviderProfileData = ()=>{

  const navigate = useNavigate();

  const {userRole , setProfileData} = useContext(AuthContext);

  const getProviderProfileData = async()=>{
      const res = await axiosInstance.get("/provider/profile");
      if(res.data)
      {
        // console.log("Provider_Data:", res.data);
        setProfileData(res.data);
      }
      if(res.data.isBlocked)
      {
        toast.error("Your Account is blocked.Please contact support team");
        localStorage.removeItem('authToken')
        sessionStorage.removeItem('location');
        navigate("/login");
      }
      return res.data;
    }

  return useQuery({
      queryKey:["provider-profile"],
      queryFn:getProviderProfileData,
      staleTime:Infinity,
      gcTime:Infinity,
    })

}