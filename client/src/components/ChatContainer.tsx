import { useEffect, useRef, Fragment } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatMessageDate } from "../lib/utils";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    listenToMessages,
    terminateListeningToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    listenToMessages();
    return () => terminateListeningToMessages();
  }, [
    selectedUser._id,
    getMessages,
    listenToMessages,
    terminateListeningToMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to determine if we need to show a date separator
  const shouldShowDateSeparator = (currentMsg: any, prevMsg: any) => {
    if (!prevMsg) return true; // Always show date for first message

    const currentDate = formatMessageDate(currentMsg.createdAt);
    const prevDate = formatMessageDate(prevMsg.createdAt);

    return currentDate !== prevDate;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  } else {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showDateSeparator = shouldShowDateSeparator(
              message,
              prevMessage
            );
            return (
              <Fragment key={message._id}>
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <div className="bg-base-200 px-4 py-1 rounded-full text-xs text-base-content/70">
                      {formatMessageDate(message.createdAt)}
                    </div>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  key={message._id}
                  className={`chat ${
                    message.senderId === authUser._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                  ref={messageEndRef}
                >
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || "default_profile.png"
                            : selectedUser.profilePic || "default_profile.png"
                        }
                        alt="profile picture"
                      />
                    </div>
                  </div>

                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>

                  <div
                    className={`chat-bubble flex flex-col ${
                      message.senderId === authUser._id
                        ? "bg-primary"
                        : "bg-neutral"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Image"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && (
                      <p
                        className={`${
                          message.senderId === authUser._id
                            ? "text-black"
                            : "bg-neutral"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>

        <MessageInput />
      </div>
    );
  }
};

export default ChatContainer;
