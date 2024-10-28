import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

export const useGetFreelancerProfileData = ()=>{

  const {userRole , setProfileData} = useContext(AuthContext);

  const getFreelancerProfileData = async()=>{
      const res = await axiosInstance.get("/freelancer/profile");
      if(res.data)
      {
        // console.log("Freelancer_Data:", res.data);
        setProfileData(res.data);
      }
      return res.data;
    }

  return useQuery({
      queryKey:["freelancer-profile"],
      queryFn:getFreelancerProfileData,
      staleTime:Infinity,
      gcTime:Infinity,
    })

}