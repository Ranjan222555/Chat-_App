import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/UseChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { UseAuthStore } from "../store/UseAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    message,
    selectedUser,
    isMessagesLoading,
    getMessage,
    MessageBetweenUsers,
    NomessageBetweenUser,
  } = useChatStore();
  const { authUser } = UseAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessage(selectedUser._id);

    MessageBetweenUsers();

    return () => NomessageBetweenUser();
  }, [selectedUser._id, getMessage, MessageBetweenUsers, NomessageBetweenUser]);

  useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className=" flex-1 overflow-auto space-y-4 p-4">
        {message.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start" // type mistake senderId to sender._id
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar-image.jpg"
                      : selectedUser.profilePic || "/avatar-image.jpg"
                  }
                  alt="Profile Pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attatchment"
                  className=" rounded-md mb-2 sm:max-w-[200px]"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
