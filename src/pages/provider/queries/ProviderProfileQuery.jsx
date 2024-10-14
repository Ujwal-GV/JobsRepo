import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export const useGetProviderProfileData = ()=>{

  const {userRole , setProfileData} = useContext(AuthContext);

  const getProviderProfileData = async()=>{
      const res = await axiosInstance.get("/provider/profile");
      if(res.data)
      {
        // console.log("Provider_Data:", res.data);
        setProfileData(res.data);
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