import { useAuthStore } from "../store/useAuthStore";
import { User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const NavigationBar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 shadow-sm fixed w-full top-0 z-40 border-b border-base-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="transition-transform group-hover:scale-110 duration-300">
              <Logo size={3.5} />
            </div>

            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Thischord
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/settings"
              className="px-4 py-2 rounded-full text-base-content hover:bg-base-200 transition-colors duration-200 flex items-center gap-2"
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>

            {/*Only display profile option if the user is logged in*/}
            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-full text-base-content hover:bg-base-200 transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="size-4" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full bg-error bg-opacity-10 text-error hover:bg-opacity-20 transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
