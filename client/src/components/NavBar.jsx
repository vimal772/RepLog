
import { NavLink, useNavigate } from "react-router";
import {
  Dumbbell,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", route: "/", icon: LayoutDashboard },
  { name: "Profile", route: "/profile", icon: User },
  {
    name: "Workouts",
    route: "/workouts",
    icon: Dumbbell,
  }
];

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full bg-black border-b border-neutral-800 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Dumbbell className="w-5 h-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              RepLog
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.route}
                  end={item.route === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-800 px-6 py-2">
        <div className="flex items-center justify-around">

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.route}
                end={item.route === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1 text-xs transition-colors ${isActive
                    ? "text-emerald-500 font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 py-1 text-xs text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>

        </div>
      </div>
    </>
  );
}
