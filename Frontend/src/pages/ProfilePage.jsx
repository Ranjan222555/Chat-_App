import React, { useState } from "react";
import { UseAuthStore } from "../store/UseAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { updateProfile, isUpdatingProfile, authUser } = UseAuthStore();
  const [selectImage, setselectImage] = useState(null);

  const handleImageUplod = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    console.log(reader, "reader of profilePage ");

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setselectImage(base64Image);
      (async () => {
        await updateProfile({ profilePic: base64Image }); // i add async function in it
      })();
    };
  };

  return (
    <div className=" h-auto pt-20 ">
      <div className="max-w-2xl mx-auto  p-4 py-8">
        <div className="bg-base-300 rounded-xl  p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2"> Your Profile Information</p>
          </div>
          {/* Avatar uplod section  */}

          <div className=" flex flex-col items-center gap-4">
            <div className="relative ">
              <img
                src={selectImage || authUser?.profilePic || "/avatar-image.jpg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 cursor-pointer"
              />
              <label
                htmlFor="avatar-uplod"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200  ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-uplod"
                  className=" hidden"
                  accept="image/*"
                  onChange={handleImageUplod}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className=" text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading ..."
                : "Click Camera to Chage Profile Pic"}
            </p>
          </div>

          {/* name and email  section  */}

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account information section  */}

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
