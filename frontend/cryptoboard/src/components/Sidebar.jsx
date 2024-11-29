import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Collapsible from "@radix-ui/react-collapsible";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "/icons/dashboard.svg",
      icon_active : "/active_icons/dashboard.svg", 
      to: "/dashboard",
    },
    {
      label: "Markets",
      icon: "/icons/market.svg",
      icon_active : "/active_icons/market.svg", 
      to: "/markets",
    },
    {
      label: "News",
      icon: "/icons/news.svg",
      icon_active : "/active_icons/news.svg", 
      to: "/news",
    },
    {
      label: "Profile",
      icon: "/icons/profile.svg",
      icon_active : "/active_icons/profile.svg", 
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "/icons/settings.svg",
      icon_active :"/active_icons/settings.svg", 
      to: "/settings",
    },
  ];

  return (
    <Collapsible.Root
      open={!isCollapsed}
      onOpenChange={() => setIsCollapsed((prev) => !prev)}
      className="flex relative min-h-screen"
    >
      {/* Sidebar */}
      <Collapsible.Content
        className={`min-h-full custom-bg text-white transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center mb-8">
            {/* Logo */}
            <img
              src="Logo.png" // Update with your logo path
              alt="Logo"
              className="w-20 h-8 mr-2"
            />
            {!isCollapsed && <h2 className="text-xl font-bold"><span className="custom-logo-color">Blue</span> Trades</h2>}
          </div>

          {/* Navigation */}
          <nav>
  <ul className="space-y-2">
    {menuItems.map((item, index) => (
      <li key={index}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `flex items-center w-full p-2 rounded ${
              isActive ? "text-blue-500 active-link-bg-color" : "text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={isActive ? item.icon_active : item.icon}  // Conditionally set the icon
                alt={`${item.label} icon`}
                className="w-6 h-6 mr-3"
              />
              {!isCollapsed && <span>{item.label}</span>}
            </>
          )}
        </NavLink>
      </li>
    ))}
  </ul>
</nav>



          {/* Footer (optional) */}
          <div className="mt-auto">
            {!isCollapsed && (
              <p className="text-sm text-gray-500">Software Architecture</p>
            )}
          </div>
        </div>
      </Collapsible.Content>

      {/* Toggle Button */}
      <Collapsible.Trigger asChild>
        <button
          className={`absolute top-4 ${
            isCollapsed ? "left-16" : "left-64"
          } h-10 w-10 text-white flex items-center justify-center rounded-full transition-all duration-300`}
          aria-label="Toggle Sidebar"
        >
          <img
            src="/icons/sidebar.svg"
            alt="Toggle Icon"
            className="h-6 w-6"
          />
        </button>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
};

export default Sidebar;
