import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

} from "@/components/ui/navigation-menu"

import Logo from "@/assets/SVG/semi_androidMyCargonaut.svg"
import {useEffect, useState} from "react"
import { Button } from "./ui/button"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState<boolean>(()=>
  Boolean(sessionStorage.getItem("token"))
  );
    const [pendingReviews, setPendingReviews] = useState<number>(0)
    useEffect(() => {
        if (loggedIn) {
            // Hier kannst du deine API anrufen, um offene Bewertungen zu laden
            // Beispiel: setPendingReviews(Anzahl der offenen Bewertungen)

            // Dummy-Wert für Demo:
            const offeneBewertungen = 3;
            setPendingReviews(offeneBewertungen);
        }
    }, [loggedIn]);
  
  const fakeLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("UserID");
    setLoggedIn(false);
    setPendingReviews(0)
  };

  return (
    <nav className="w-full bg-neutral-200 text-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img src={Logo} className="h-10 w-10"/>
        <p className="text-xl font-semibold">MyCargonaut</p>
      </div>

      {/* Right: Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="space-x-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="/" className="text-black hover:transition-colors">
                Home
              </a>
            </NavigationMenuLink>
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
                  {loggedIn && pendingReviews > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs font-bold">
                          {pendingReviews}
                      </div>
                  )}
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
