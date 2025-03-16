import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { Avatar } from "@radix-ui/react-avatar";
import { HOST } from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="relative w-14 h-14 rounded-full  flex items-center justify-center overflow-hidden">
            <Avatar className="w-full h-full rounded-full">
              {selectedChatData.images ? (
                <img
                  src={`${HOST}/${selectedChatData.images}`}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-lg font-bold rounded-full ${getColor(selectedChatData.color)} `}
                  
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.charAt(0).toUpperCase()
                    : selectedChatData.email.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === "contact" &&
              selectedChatData.firstName ? `${selectedChatData.firstName} ${ selectedChatData.lastName}`:selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
