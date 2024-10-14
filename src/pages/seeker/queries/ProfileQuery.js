import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export const useGetProfileData = ()=>{

    const {userRole , setProfileData} = useContext(AuthContext)

    const getProfileData = async()=>{
        const res = await axiosInstance.get("/user/profile");
        if(res.data)
        {
          setProfileData(res.data)
          console.log("User_Data:", res.data);
          
        }
        return res.data
      }

    return useQuery({
        queryKey:["profile"],
        queryFn:getProfileData,
        staleTime:Infinity,
        gcTime:Infinity,
      })

}