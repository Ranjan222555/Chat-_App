import { X } from "lucide-react";
import { useChatStore } from "../store/UseChatStore";
import { UseAuthStore } from "../store/UseAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelecteduser } = useChatStore();
  const { onlineUser } = UseAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar-image.jpg"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUser.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          className=" cursor-pointer"
          onClick={() => setSelecteduser(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
