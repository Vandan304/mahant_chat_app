import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { IoSend } from "react-icons/io5";
import { useAppStore } from "../../../../../../store";
// import { useSocket } from "../../../../../../context/SocketContext";
// import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
import { apiClient } from "../../../../../../lib/api-client";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const emojiRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact" && message.trim()) {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
      setMessage("");
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        setUploadProgress(0);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${userInfo?.token}` },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
            setFileUploadProgress(progress);
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          setUploadProgress(0);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error(error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 relative">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={() => setEmojiPickerOpen(true)}
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>
        {emojiPickerOpen && (
          <div
            ref={emojiRef}
            className="absolute bottom-12 right-0 bg-gray-800 p-2 rounded-md"
          >
            <EmojiPicker theme="dark" open={emojiPickerOpen} autoFocusSearch={false} onEmojiClick={handleAddEmoji} />
          </div>
        )}
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center p-5 focus:border-none focus:outline-none hover:bg-[#741bda] focus:bg-[#741bda] focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
      {uploadProgress > 0 && (
        <div className="absolute bottom-4 w-[80%] bg-gray-600 rounded-md overflow-hidden">
          <div
            className="bg-blue-500 h-2 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default MessageBar;
