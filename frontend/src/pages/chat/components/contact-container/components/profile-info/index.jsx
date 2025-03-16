import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "../../../../../../store";
import { HOST ,  LOGOUT_ROUTE } from "../../../../../../utils/constants";
import {IoPowerSharp} from "react-icons/io5"
import {apiClient} from "../../../../../../lib/api-client"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";

import { useNavigate } from 'react-router-dom';
import { getColor } from "../../../../../../lib/utils";

const ProfileInfo = () => {
  const { userInfo , setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const logOut = async ()=>
  {
      try {
        const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true})
        if(response.status===200)
        {
          navigate('/auth')
          setUserInfo(null)
        }
      } catch (error) {
        console.error(error);
        
      }
  }
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="relative w-14 h-14 rounded-full  flex items-center justify-center overflow-hidden">
          <Avatar className="w-full h-full rounded-full">
            {userInfo.images ? (
              <AvatarImage
                src={`${HOST}/${userInfo.images}`}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div
                className={`w-full  h-full flex items-center justify-center text-lg font-bold rounded-full ${getColor(userInfo.color)} `}
                
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0).toUpperCase()
                  : userInfo.email.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 className=" text-purple-500 text-xl font-medium" 
                onClick={()=>navigate('/profile')}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp className=" text-red-500 text-xl font-medium" 
                 onClick={(logOut)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>LogOut</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
