import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

} from "@/components/ui/navigation-menu"
import { Link } from "@radix-ui/react-navigation-menu"
import Logo from "@/assets/SVG/semi_androidMyCargonaut.svg"
import { useState } from "react"
import { Button } from "./ui/button"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState<boolean>(()=>
  Boolean(sessionStorage.getItem("token"))
  );
  
  const fakeLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("UserID");
    setLoggedIn(false);
  };

  return (
    <nav className="w-full bg-neutral-200 text-black px-6 py-3 flex items-center justify-between">
      {/* Left: Logo + Brand */}
      <div className="flex items-center space-x-4">
        {/* Logo (replace with <Image> if needed) */}
        <img src={Logo} className="h-10 w-10"/>
        <span className="text-xl font-semibold">MyCargonaut</span>
      </div>

      {/* Right: Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="space-x-6">
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className="text-black hover: transition-colors" asChild>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/drives" className="text-black hover:transition-colors">
                Drives
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/chat" className="text-black hover:transition-colors">
                Chats
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/profile" className="text-black hover:transition-colors">
                Profile
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {loggedIn?(
            <>
            <Button
              onClick={fakeLogout}
              className="bg-red-400 text-white
              transition-colors duration-300
            hover:bg-red-600"
            >
              Logout
            </Button>
            </>):(
            <>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/login" className="text-black hover:transition-colors">
                Login
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/register" className="text-black hover:transition-colors">
                Sign up
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          </>)}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
