// src/components/layout/Shell.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Aside, { type NavItem } from "../ui/side_nav";
import Nav from "../ui/bottom_nav";
import Overview_Aside from "../ui/overview_aside";

export default function Shell() {
  const [active, setActive] = useState<NavItem>("Dashboard");

  return (
    <div className="w-full h-screen overflow-x-auto overflow-y-hidden bg-white">
      <div className="flex h-full min-w-300 relative">
        {/* Aside — fixed width, never shrinks */}
        <div className="shrink-0">
          <Aside active={active} setActive={setActive} />
        </div>

        {/* Main layer — fills remaining space, never shrinks below content needs */}
        <div className="flex-1 min-w-0 bg-white h-full min-[1400px]:border-x min-[1400px]:border-gray-200 relative">
          <Outlet />
          <div className="w-full absolute z-1000 bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
            <Nav />
          </div>
        </div>

        {/* Current section Side Bar — fixed width, never shrinks */}
        <div className="shrink-0">
          <Overview_Aside />
        </div>
      </div>
    </div>
  );
}
