"use client";

import { useRouter, usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../assets/dloklz_logo.png";

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  title: string;
  menuItems: MenuItem[];
}

export default function Sidebar({ title, menuItems }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState<string>("");

  // Automatically select first menu item on dashboard entry
  useEffect(() => {
    if (!pathname || pathname.endsWith("/dashboard")) {
      const defaultPath = menuItems[0]?.path;
      setActivePath(defaultPath);
      router.replace(defaultPath);
    } else {
      setActivePath(pathname);
    }
  }, [pathname, menuItems, router]);

  const handleClick = (path: string) => {
    setActivePath(path);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/");
  };

  return (
    <aside className="fixed md:relative w-64 h-screen flex flex-col justify-between bg-gray-100 shadow-inner shadow-gray-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-300 text-center shadow-sm">
        <Image
          src={logo}
          alt="App Logo"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-xl font-bold text-[#9dc446] tracking-wider">{title}</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 mx-2">
        <ul className="flex flex-col gap-2 px-2">
          {menuItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <li
                key={item.name}
                onClick={() => handleClick(item.path)}
                className={`
                  flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer
                  transition-all duration-300
                  ${isActive
                    ? "bg-gradient-to-r from-indigo-200 to-indigo-100 text-indigo-700 font-semibold shadow-inner shadow-indigo-200"
                    : "text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                  }
                `}
              >
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span className="text-base">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-gray-300">
        <button
          onClick={handleLogout}
          className="
            flex items-center justify-center gap-2 w-full py-2 rounded-xl
            bg-red-400 hover:bg-red-500 text-white font-medium
            transition-colors duration-300 shadow-md
          "
        >
          <FiLogOut className="text-lg" /> Logout
        </button>
      </div>
    </aside>
  );
}
