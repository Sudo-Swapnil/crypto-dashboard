import React from "react";
// import * as NavigationMenu from "@radix-ui/react-navigation-menu";

const Navbar = () => {
  return (
    <header className="custom-bg text-white">
      <div className="container ml-auto mr-0 px-4 py-3 flex justify-end items-center space-x-3">
        {/* Bell Icon */}
        <button aria-label="Notifications" className="rounded-full hover:bg-gray-800">
            <img
        src="/icons/bell.svg" 
        alt="Toggle Icon"
        className="h-8 w-8"
        />
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 bg-black rounded-full px-4 py-2">
          {/* Circular Image */}
          <img
            src="avatar.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />

          {/* Username and Email */}
          <div>
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-gray-400">john.doe@example.com</p>
          </div>

          {/* Dropdown Icon */}
          <button aria-label="Profile Options" className="p-2">
          <img
      src="/icons/three-dots.svg" 
      alt="Toggle Icon"
      className="h-6 w-6"
    />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

