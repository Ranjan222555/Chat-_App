import React from "react";
import { UseAuthStore } from "../store/UseAuthStore";
import { Link } from "react-router-dom";
import { LogOut, MessagesSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = UseAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg ">
      <div className=" container mx-auto p-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-50 transition-all "
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center ">
                <MessagesSquare className=" w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold"> Chat App</h1>
            </Link>
          </div>

          <div className=" flex items-center gap-2">
            <Link
              to={"/setting"}
              className={`btn btn-sm gap-2 transition-colors`} // i remove {``} this
            >
              <Settings className="size-4" />
              <span className=" hidden sm:inline">Setting</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className={`btn btn-sm gap-2`} // i remove {``} this
                >
                  <User className="size-5" />
                  <span className=" hidden sm:inline">Profile</span>
                </Link>

                <button
                  className=" flex gap-2 items-center ml-5 "
                  onClick={logout}
                >
                  <LogOut className="size-5 cursor-pointer" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
