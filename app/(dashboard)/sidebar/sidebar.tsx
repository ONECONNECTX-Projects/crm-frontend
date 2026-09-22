"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
import {
  HiDocument,
  HiOutlineLightBulb,
  HiOutlineTicket,
} from "react-icons/hi";
import { GoTasklist } from "react-icons/go";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { LuCodesandbox } from "react-icons/lu";
import { CgMediaLive } from "react-icons/cg";
import { getLoggedInUser } from "@/app/utils/apiClient";

type MenuItem = {
  name: string;
  path?: string;
  icon?: any;
  children?: { name: string; path: string }[];
  superAdminOnly?: boolean;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: IoDesktopOutline, path: "/dashboard" },
  { name: "Leads", icon: MdLeaderboard, path: "/leads" },
  { name: "Contact", icon: RiContactsLine, path: "/contact" },
  { name: "Company", icon: FaRegBuilding, path: "/company" },
  { name: "Products", icon: AiOutlineProduct, path: "/product" },
  // {
  //   name: "Sales",
  //   icon: FiShoppingCart,
  //   children: [
  //     // { name: "Invoices", path: "/sales/invoice" },
  //     { name: "Quotes", path: "/sales/qoutes" },
  //   ],
  // },
  { name: "Opportunity", icon: HiOutlineLightBulb, path: "/opportunity" },
  // { name: "Tasks", icon: GoTasklist, path: "/tasks" },
  {
    name: "Projects",
    icon: LiaProjectDiagramSolid,
    children: [
      { name: "Projects", path: "/projects/project" },
      { name: "Team", path: "/projects/team" },
    ],
  },
  // {
  //   name: "Account",
  //   icon: RiAccountBox2Line,
  //   children: [
  //     { name: "Account", path: "/accounts/account" },
  //     { name: "Transaction", path: "/accounts/transaction" },
  //   ],
  // },
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
  {
    name: "Documents",
    icon: HiDocument,
    path: "/document",
    superAdminOnly: true,
  },
  { name: "Settings", icon: FiSettings, children: [] },
];

const settingsMenu: MenuItem[] = [
  // {
  //   name: "Company Settings",
  //   icon: FiShoppingCart,
  //   path: "/settings/company-settings",
  // },
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
      // { name: "Annoucement", path: "/settings/employee-manage/announcement" },
      // { name: "Awards", path: "/settings/employee-manage/awards" },
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
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(
    pathname.startsWith("/settings"),
  );

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    setIsSuperAdmin(loggedInUser?.name === "Super Admin");
  }, []);

  const filteredMenuItems = menuItems.filter(
    (item) => !item.superAdminOnly || isSuperAdmin,
  );

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // Collapsed rail has no room for a submenu, so a parent click jumps to its first child.
  const openParent = (item: MenuItem) => {
    if (collapsed && item.children?.length) {
      router.push(item.children[0].path);
      onNavigate?.();
      return;
    }
    toggleMenu(item.name);
  };

  const goBack = () => {
    setShowSettingsPanel(false);
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  // A parent row lights up when the open submenu or the current route is one of its children.
  const hasActiveChild = (item: MenuItem) =>
    !!item.children?.some((child) => pathname.startsWith(child.path));

  return (
    <div
      className={`sidebar-shell relative flex h-full flex-col text-slate-600 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* STATIC HEADER */}
      {/*
       * The logo is a 663x283 wordmark (2.34:1). Cap BOTH axes and let
       * object-contain pick the binding one — a width-only cap overflows the
       * 56px bar, which has to stay 56px to line up with the page header.
       */}
      <div
        className={`flex h-14 shrink-0 items-center justify-center overflow-hidden border-b border-white/60 ${
          collapsed ? "px-2" : "px-4"
        }`}
      >
        <img
          src="/logo-sidebar-light.svg"
          alt="Quest CRM"
          className={`h-auto w-auto object-contain ${
            collapsed ? "max-h-8 max-w-12" : "max-h-10 max-w-40"
          }`}
        />
      </div>

      {/* SCROLLABLE AREA */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-6">
        {/* MAIN SIDEBAR */}
        {!showSettingsPanel && (
          <nav className="mt-4 space-y-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-xs font-medium text-slate-400">
                Menu
              </p>
            )}
            {filteredMenuItems.map((item) => {
              const active =
                item.name === "Settings"
                  ? pathname.startsWith("/settings")
                  : isActive(item.path) || hasActiveChild(item);

              return (
                <div key={item.name}>
                  <div
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                      active
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                        : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                    } ${collapsed ? "justify-center" : ""}`}
                    onClick={() => {
                      if (item.name === "Settings") {
                        setShowSettingsPanel(true);
                        return;
                      }
                      if (item.children) openParent(item);
                    }}
                  >
                    {!item.children ? (
                      item.path ? (
                        <Link
                          href={item.path}
                          className={`flex w-full items-center gap-3 ${
                            collapsed ? "justify-center" : ""
                          }`}
                          onClick={onNavigate}
                        >
                          <item.icon className="size-5 shrink-0" />
                          {!collapsed && (
                            <span className="truncate">{item.name}</span>
                          )}
                        </Link>
                      ) : (
                        <div
                          className={`flex items-center gap-3 ${
                            collapsed ? "justify-center" : ""
                          }`}
                        >
                          <item.icon className="size-5 shrink-0" />
                          {!collapsed && (
                            <span className="truncate">{item.name}</span>
                          )}
                        </div>
                      )
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon className="size-5 shrink-0" />
                          {!collapsed && (
                            <span className="truncate">{item.name}</span>
                          )}
                        </div>

                        {!collapsed &&
                          (openMenu === item.name ? (
                            <FiChevronDown className="shrink-0" />
                          ) : (
                            <FiChevronRight className="shrink-0" />
                          ))}
                      </>
                    )}
                  </div>

                  {item.children && openMenu === item.name && !collapsed && (
                    <div className="mt-1 ml-5 space-y-0.5 border-l border-brand-100 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.path}
                          onClick={onNavigate}
                        >
                          <div
                            className={`cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors ${
                              pathname === child.path
                                ? "bg-brand-50 font-semibold text-brand-700"
                                : "text-slate-500 hover:bg-brand-50/70 hover:text-brand-700"
                            }`}
                          >
                            {child.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* SETTINGS PANEL */}
        {showSettingsPanel && (
          <div className="mt-4">
            {/* BACK BUTTON - FULL WIDTH */}
            <div
              className="mb-4 flex w-full cursor-pointer items-center justify-center border-b border-brand-100 pb-3 text-slate-500 transition-colors hover:text-brand-700"
              onClick={goBack}
              title="Back to menu"
            >
              <IoIosArrowDropleft size={22} className="shrink-0" />
            </div>

            <div className="space-y-1">
              {!collapsed && (
                <p className="px-3 pb-1 text-xs font-medium text-slate-400">
                  Settings
                </p>
              )}
              {settingsMenu.map((item) => {
                const active = isActive(item.path) || hasActiveChild(item);

                return (
                <div key={item.name}>
                  {/* Parent Item */}
                  <div
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                      active
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                        : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                    } ${collapsed ? "justify-center" : ""}`}
                    onClick={() => item.children && openParent(item)}
                  >
                    {item.children ? (
                      <>
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon className="size-5 shrink-0" />}
                          {!collapsed && (
                            <span className="truncate">{item.name}</span>
                          )}
                        </div>

                        {!collapsed &&
                          (openMenu === item.name ? (
                            <FiChevronDown className="shrink-0" />
                          ) : (
                            <FiChevronRight className="shrink-0" />
                          ))}
                      </>
                    ) : (
                      <Link
                        href={item.path ?? "#"}
                        className={`flex w-full items-center gap-3 ${
                          collapsed ? "justify-center" : ""
                        }`}
                        onClick={onNavigate}
                      >
                        {item.icon && <item.icon className="size-5 shrink-0" />}
                        {!collapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    )}
                  </div>

                  {/* Children */}
                  {item.children && openMenu === item.name && !collapsed && (
                    <div className="mt-1 ml-5 space-y-0.5 border-l border-brand-100 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.path}
                          onClick={onNavigate}
                        >
                          <div
                            className={`cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors ${
                              pathname === child.path
                                ? "bg-brand-50 font-semibold text-brand-700"
                                : "text-slate-500 hover:bg-brand-50/70 hover:text-brand-700"
                            }`}
                          >
                            {child.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
