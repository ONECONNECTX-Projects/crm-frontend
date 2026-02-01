"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { FaRegBuilding } from "react-icons/fa";
import {
  FiShoppingCart,
  FiChevronDown,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";
import { IoDesktopOutline, IoTicketOutline } from "react-icons/io5";
import {
  MdGroups3,
  MdLeaderboard,
  MdManageAccounts,
  MdOutlineAppSettingsAlt,
  MdOutlineLeaderboard,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { RiAccountBox2Line, RiContactsLine } from "react-icons/ri";
import { IoIosArrowDropleft } from "react-icons/io";
import { TiContacts } from "react-icons/ti";
import { BsBuildingGear, BsTicketDetailed } from "react-icons/bs";
import { BiTask } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";
import { HiOutlineLightBulb, HiOutlineTicket } from "react-icons/hi";
import { GoTasklist } from "react-icons/go";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { LuCodesandbox } from "react-icons/lu";
import { CgMediaLive } from "react-icons/cg";

type MenuItem = {
  name: string;
  path?: string;
  icon?: any;
  children?: { name: string; path: string }[];
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: IoDesktopOutline, path: "/dashboard" },
  { name: "Leads", icon: MdLeaderboard, path: "/leads" },
  { name: "Contact", icon: RiContactsLine, path: "/contact" },
  { name: "Company", icon: FaRegBuilding, path: "/company" },
  { name: "Products", icon: AiOutlineProduct, path: "/product" },
  {
    name: "Sales",
    icon: FiShoppingCart,
    children: [
      { name: "Invoices", path: "/sales/invoice" },
      { name: "Quotes", path: "/sales/qoutes" },
    ],
  },
  { name: "Opportunity", icon: HiOutlineLightBulb, path: "/opportunity" },
  { name: "Tasks", icon: GoTasklist, path: "/tasks" },
  {
    name: "Projects",
    icon: LiaProjectDiagramSolid,
    children: [
      { name: "Projects", path: "/projects/project" },
      { name: "Team", path: "/projects/team" },
    ],
  },
  {
    name: "Account",
    icon: RiAccountBox2Line,
    children: [
      { name: "Account", path: "/accounts/account" },
      { name: "Transaction", path: "/accounts/transaction" },
    ],
  },
  { name: "Media", icon: CgMediaLive, path: "/media" },
  {
    name: "Other",
    icon: LuCodesandbox,
    children: [
      { name: "Note", path: "/other/note" },
      { name: "Attachment", path: "/other/attachment" },
      { name: "Email", path: "/other/email" },
    ],
  },
  { name: "Tickets", icon: HiOutlineTicket, path: "/tickets" },

  { name: "Settings", icon: FiSettings, children: [] },
];

const settingsMenu: MenuItem[] = [
  {
    name: "Company Settings",
    icon: FiShoppingCart,
    path: "/settings/company-settings",
  },
  {
    name: "App Settings",
    icon: MdOutlineAppSettingsAlt,
    path: "/settings/app-settings",
  },
  {
    name: "Employee Manage",
    icon: MdManageAccounts,
    path: "/settings/employee-manage",
    children: [
      { name: "Staff", path: "/settings/employee-manage/staff" },
      { name: "Shifts", path: "/settings/employee-manage/shifts" },
      { name: "Designations", path: "/settings/employee-manage/designations" },
      { name: "Departments", path: "/settings/employee-manage/departments" },
      {
        name: "Employment Status",
        path: "/settings/employee-manage/employment-status",
      },

      {
        name: "Roles & Permissions",
        path: "/settings/employee-manage/roles",
      },
      { name: "Annoucement", path: "/settings/employee-manage/announcement" },
      { name: "Awards", path: "/settings/employee-manage/awards" },
    ],
  },
  {
    name: "Contact Setup",
    icon: TiContacts,
    children: [
      {
        name: "Contact Source",
        path: "/settings/contact-setup/contact-source",
      },
      { name: "Contact Stage", path: "/settings/contact-setup/contact-stage" },
    ],
  },
  {
    name: "Company Setup",
    icon: BsBuildingGear,
    children: [
      { name: "Company Type", path: "/settings/company-setup/company-type" },
      { name: "Industry", path: "/settings/company-setup/industry" },
    ],
  },

  {
    name: "Opportunity Setup",
    icon: BsTicketDetailed,
    children: [
      {
        name: "Opportunity Source",
        path: "/settings/opportunity-setup/opportunity-source",
      },
      {
        name: "Opportunity Stage",
        path: "/settings/opportunity-setup/opportunity-stage",
      },
      {
        name: "Opportunity Type",
        path: "/settings/opportunity-setup/opportunity-type",
      },
    ],
  },
  {
    name: "Task Setup",
    icon: BiTask,
    children: [
      { name: "Task Status", path: "/settings/task-setup/task-status" },
      { name: "Task Type", path: "/settings/task-setup/task-type" },
    ],
  },
  {
    name: "Ticket Setup",
    icon: HiOutlineTicket,
    children: [
      { name: "Ticket Status", path: "/settings/ticket-setup/ticket-status" },
      {
        name: "Ticket Category",
        path: "/settings/ticket-setup/ticket-category",
      },
    ],
  },
  {
    name: "Lead Setup",
    icon: MdOutlineLeaderboard,
    children: [
      { name: "Lead Source", path: "/settings/lead-setup/lead-source" },
      { name: "Lead Status", path: "/settings/lead-setup/lead-status" },
    ],
  },
  {
    name: "Product Setup",
    icon: AiOutlineProduct,
    children: [
      {
        name: "Product Category",
        path: "/settings/product-category-setup",
      },
      {
        name: "Product Status",
        path: "/settings/product-status",
      },
    ],
  },
  {
    name: "Quote Stage Setup",
    icon: MdOutlineReceiptLong,
    path: "/settings/quote-stage-setup",
  },

  { name: "Priority", icon: MdGroups3, path: "/settings/priority" },
];

interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const goBack = () => {
    setShowSettingsPanel(false);
  };

  return (
    <div
      className={`relative bg-white border-r shadow transition-all h-full overflow-y-auto ${
        collapsed ? "w-30" : "w-64"
      }`}
    >
      {/* STATIC HEADER */}
      <div
        className={`border-b font-bold sticky top-0 bg-white z-20 transition-all duration-300
          ${collapsed ? "text-center text-xl px-0" : "text-2xl px-6"}
        `}
      >
        <div className="flex items-center ">
          <img
            src="/favicon.svg"
            alt="QFC Logo"
            className={`${collapsed ? "w-10 h-10" : "w-20 h-20"}`}
          />
          {/* {!collapsed && <span className="text-black">Quest</span>} */}
        </div>
      </div>

      {/* SCROLLABLE AREA */}
      <div className="h-[calc(100vh-90px)] overflow-y-auto px-2 pb-10">
        {/* MAIN SIDEBAR */}
        {!showSettingsPanel && (
          <nav className="mt-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-brand-50 text-gray-700 cursor-pointer"
                  onClick={() => {
                    if (item.name === "Settings") {
                      setShowSettingsPanel(true);
                      return;
                    }
                    if (item.children) toggleMenu(item.name);
                  }}
                >
                  {!item.children ? (
                    item.path ? (
                      <Link
                        href={item.path}
                        className="flex items-center gap-3 w-full"
                        onClick={onNavigate}
                      >
                        <item.icon className="text-xl" />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <item.icon className="text-xl" />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                    )
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className="text-xl" />
                        {!collapsed && <span>{item.name}</span>}
                      </div>

                      {!collapsed &&
                        (openMenu === item.name ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        ))}
                    </>
                  )}
                </div>

                {item.children && openMenu === item.name && !collapsed && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.name} href={child.path} onClick={onNavigate}>
                        <div
                          className={`px-3 py-1.5 rounded-md cursor-pointer text-sm ${
                            pathname === child.path
                              ? "text-brand-500 font-semibold"
                              : "text-gray-500 hover:text-brand-500"
                          }`}
                        >
                          {child.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* SETTINGS PANEL */}
        {showSettingsPanel && (
          <div className="mt-4">
            {/* BACK BUTTON - FULL WIDTH */}
            <div
              className="w-full border-b border-gray-300 pb-2 mb-4 flex items-center gap-2 cursor-pointer"
              onClick={goBack}
            >
              <IoIosArrowDropleft size={24} className="text-gray-600" />
              <span className="text-gray-600 hover:text-black">
                Back to menu
              </span>
            </div>

            <div className="space-y-1">
              {settingsMenu.map((item) => (
                <div key={item.name}>
                  {/* Parent Item */}
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-brand-50 text-gray-700 cursor-pointer"
                    onClick={() => item.children && toggleMenu(item.name)}
                  >
                    {item.children ? (
                      <>
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon className="text-lg" />}
                          {!collapsed && <span>{item.name}</span>}
                        </div>

                        {!collapsed &&
                          (openMenu === item.name ? (
                            <FiChevronDown />
                          ) : (
                            <FiChevronRight />
                          ))}
                      </>
                    ) : (
                      <Link
                        href={item.path ?? "#"}
                        className="flex items-center gap-3 w-full"
                        onClick={onNavigate}
                      >
                        {item.icon && <item.icon className="text-lg" />}
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    )}
                  </div>

                  {/* Children */}
                  {item.children && openMenu === item.name && !collapsed && (
                    <div className="ml-10 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.name} href={child.path} onClick={onNavigate}>
                          <div
                            className={`px-3 py-1.5 rounded-md cursor-pointer text-sm ${
                              pathname === child.path
                                ? "text-brand-500 font-semibold"
                                : "text-gray-500 hover:text-brand-500"
                            }`}
                          >
                            {child.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
