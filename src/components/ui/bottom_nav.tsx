// const SETTINGS_TABS = [
//   { label: "Execution Rules", icon: SlidersHorizontal },
//   { label: "Local Storage", icon: HardDrive },
//   { label: "Runtime", icon: Cpu },
//   { label: "Privacy", icon: ShieldCheck },
// ] as const;

export default function Nav() {
  return (
    <div className="w-full h-fit text-[13px] text-gray-900 p-2 poppins flex items-center justify-between border-b border-gray-200">
      <div className="flex gap-5 items-center">
        <div className="hover:no-underline p-1.5 underline cursor-pointer transition-all duration-300">
          Execution Rules
        </div>{" "}
        |{" "}
        <div className="hover:no-underline p-1.5 underline cursor-pointer transition-all duration-300">
          Runtime
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <div className="hover:no-underline p-1.5 underline cursor-pointer transition-all duration-300">
          Local Storage
        </div>{" "}
        |{" "}
        <div className="hover:no-underline p-1.5 underline cursor-pointer transition-all duration-300">
          Privacy Policy
        </div>
      </div>
    </div>
  );
}
