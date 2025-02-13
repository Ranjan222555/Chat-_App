import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/UseChatStore";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { Users } from "lucide-react";
import { UseAuthStore } from "../store/UseAuthStore";

const Sidebar = () => {
  const { getUser, users, selectedUser, setSelecteduser, isUserLoading } =
    useChatStore();

  const { onlineUser } = UseAuthStore();
  const [showOnlineUsers, setshowOnlineUsers] = useState(false);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // console.log(users);

  const filtredUsers = showOnlineUsers
    ? users.filter((user) => onlineUser.includes(user._id))
    : users;

  // i change this

  if (isUserLoading) return <SidebarSkeleton />;
  // console.log(filtredUsers);

  return (
    <aside className=" h-full w-fit  lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className=" border-b  border-base-300 w-full p-4 ">
        <div className="flex items-center   gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contact Me</span>
        </div>

        {/* todo online filter */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer gap-2 flex items-center">
            <input
              type="checkbox"
              checked={showOnlineUsers}
              onChange={(e) => setshowOnlineUsers(e.target.checked)}
              className=" checkbox checkbox-sm"
            />
            <span className="text-sm">Show Online Only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUser.length - 1} online)
          </span>
        </div>
      </div>
      <div className=" overflow-y-auto w-full py-3">
        {filtredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelecteduser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors cursor-pointer
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar-image.jpg"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUser.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUser.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filtredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No Online Users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
