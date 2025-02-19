import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useGetFreelancerProfileData = ()=>{

  const {userRole , setProfileData} = useContext(AuthContext);

    const navigate = useNavigate();

  const getFreelancerProfileData = async()=>{
      const res = await axiosInstance.get("/freelancer/profile");
      if(res.data)
      {
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
      queryKey:["freelancer-profile"],
      queryFn:getFreelancerProfileData,
      staleTime:Infinity,
      gcTime:Infinity,
    })

}