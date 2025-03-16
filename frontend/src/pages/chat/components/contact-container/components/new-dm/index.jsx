import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa6";
import { Avatar } from "@radix-ui/react-avatar";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { HOST, SEARCH_CONTACTS_ROUTE } from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
 import { apiClient } from "@/lib/api-client";
import { ScrollArea } from "../../../../../../components/ui/scroll-area";
import { useAppStore } from "../../../../../../store";
const NewDM = () => {
  const {setSelectedChatType,setSelectedChatData} = useAppStore()
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error({ error });
    }
  };
  const selectNewContact = (contact) =>
  {
      setOpenNewContactModel(false)
      setSelectedChatType("contact")
      setSelectedChatData(contact)
      setSearchedContacts([])
  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 text-opacity-90 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length>0 &&(
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={()=>selectNewContact(contact)}
                >
                  <div className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                    <Avatar className="w-full h-full rounded-full">
                      {contact.images ? (
                        <img
                          src={`${HOST}/${contact.images}`}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-lg font-bold rounded-full ${getColor(contact.color)}`}
                          
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0).toUpperCase()
                            : contact.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">
                        {contact.email}
                      </span>
                    
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>)}
          {searchedContacts.length === 0 && (
            <div className="flex-1 md:bg-[#181920] md:flex flex-col justify-center md:mt-0 mt-5 items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions} // Using imported animation ✅
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> contacts.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
    </>
  );
};

export default NewDM;
