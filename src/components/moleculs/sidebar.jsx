import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo.jpg"; // Pastikan path logo benar
import { useState, useEffect } from "react";
import { BsGift, BsQrCodeScan, BsSignYield } from "react-icons/bs";
import {
  MdDashboard,
  MdPeopleOutline,
  MdWorkOutline,
  MdFolderOpen,
  MdKeyboardArrowDown,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { CgGames } from "react-icons/cg";

const NavItem = ({ to, icon: Icon, label, isActive, isSubItem = false }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors duration-200 ease-in-out
        ${isSubItem ? "text-sm" : "text-md"}
        ${
          isActive
            ? "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300 font-semibold"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
        }`}
    >
      {Icon && (
        <Icon
          size={isSubItem ? 18 : 20}
          className={`${
            isActive
              ? "text-green-600 dark:text-green-400"
              : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
          }`}
        />
      )}
      <span className="truncate">{label}</span>
    </Link>
  </li>
);

const NavDropdown = ({ label, icon: Icon, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  return (
    <li className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg gap-3 transition-colors duration-200 ease-in-out text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white focus:outline-none"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon size={20} className="text-gray-400 dark:text-gray-500" />
          )}
          <span className="text-md font-medium truncate">{label}</span>
        </div>
        <MdKeyboardArrowDown
          size={24}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <ul className="pt-1 pl-6 flex flex-col gap-0.5">{children}</ul>
      )}
    </li>
  );
};

function Sidebar({ variant = "default" }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isLgScreen = () =>
    typeof window !== "undefined" && window.innerWidth >= 1024;

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-expanded");
      return saved === "true" ? true : saved === "false" ? false : isLgScreen();
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", isSidebarOpen.toString());
    if (isSidebarOpen) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
    const handleResize = () => {
      if (!isLgScreen() && isSidebarOpen) {
      } else if (
        isLgScreen() &&
        localStorage.getItem("sidebar-expanded") === null
      ) {
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const navItems = [
    {
      groupLabel: "Event Management",
      items: [
        {
          label: "Lucky Draw Event",
          icon: BsSignYield,
          paths: ["/luckyDip", "/luckyDraw", "/grandPrize"],
          children: [
            { label: "Lcky Dip", path: "/luckyDip" },
            { label: "Lucky Draw", path: "/luckyDraw" },
            { label: "Grand Prize", path: "/grandPrize" },
          ],
        },
        {
          label: "Prize",
          icon: BsGift,
          path: "/prize",
        },
      ],
    },
    {
      groupLabel: "Manajemen Data",
      items: [
        {
          label: "Karyawan",
          icon: MdPeopleOutline,
          path: "/karyawan",
        },
        {
          label: "Keluarga Karyawan",
          icon: MdWorkOutline,
          path: "/keluargaKaryawan",
        },
      ],
    },
    {
      groupLabel: "Event",
      items: [
        {
          label: "Scanning",
          icon: BsQrCodeScan,
          path: "/scanMobile",
        },
        {
          label: "Register Event",
          icon: MdFolderOpen,
          path: "/registerEvent",
        },
        {
          label: "Lucky Event",
          icon: CgGames,
          path: "/luckyEvent",
        },
      ],
    },
  ];

  return (
    <aside className="relative print:hidden">
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-gray-700 rounded-md shadow-md text-gray-600 dark:text-gray-300"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>
      {isSidebarOpen && !isLgScreen() && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <div
        id="sidebar"
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 p-4 transition-all duration-300 ease-in-out transform
        ${isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:shadow-none 
        ${
          variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : "lg:rounded-r-2xl shadow-sm"
        }`}
      >
        <div className="flex justify-between items-center mb-6 pr-3 sm:px-2">
          <Link to="/" className="block">
            <img src={logo} alt="Logo" className="h-24 -mb-3 w-auto" />
          </Link>
        </div>

        <nav className="space-y-2 flex-grow flex flex-col">
          {navItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.groupLabel && (
                <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-4 mb-2 mt-4">
                  {section.groupLabel}
                </h3>
              )}
              <ul className="space-y-0.5">
                {(section.items || [section]).map((item, itemIndex) => {
                  if (item.children) {
                    const isGroupActive =
                      item.paths?.some((p) => currentPath.startsWith(p)) ||
                      item.children.some((child) =>
                        currentPath.startsWith(child.path)
                      );
                    return (
                      <NavDropdown
                        key={item.label || itemIndex}
                        label={item.label}
                        icon={item.icon}
                        initialOpen={isGroupActive}
                      >
                        {item.children.map((child) => (
                          <NavItem
                            key={child.path}
                            to={child.path}
                            label={child.label}
                            isActive={currentPath.startsWith(child.path)}
                            isSubItem={true}
                          />
                        ))}
                      </NavDropdown>
                    );
                  }
                  return (
                    <NavItem
                      key={item.path || itemIndex}
                      to={item.path}
                      icon={item.icon}
                      label={item.label}
                      isActive={currentPath.startsWith(item.path)}
                    />
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {/* Anda bisa menambahkan footer sidebar di sini jika perlu */}
      </div>
    </aside>
  );
}

export default Sidebar;
