import { useRef, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { BiLogOutCircle } from "react-icons/bi";

const ProfileHeader = () => {
  const { logout, authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      updateProfile(base64Image);
    };
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="avatar avatar-online">
          <div className="w-10 rounded-full relative group">
            <img
              src={selectedImg || authUser?.profilePic || "/defaultAvatar.webp"}
              alt="profile"
              className="w-full h-full object-cover"
            />

            {/* Hover overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <span className="text-white text-[10px] font-semibold">
                Change
              </span>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex flex-col min-w-0 max-w-32">
          <h3 className="text-sm font-semibold text-white leading-tight truncate">
            {authUser?.fullName}
          </h3>
          <p className="text-xs text-emerald-400 truncate">Online</p>
        </div>
      </div>

      {/* logout button */}
      <div className="tooltip tooltip-bottom" data-tip="Logout">
        <button
          onClick={logout}
          className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200"
        >
          <BiLogOutCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
