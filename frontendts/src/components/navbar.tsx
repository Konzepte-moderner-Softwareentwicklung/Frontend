
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Link } from "@radix-ui/react-navigation-menu"

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
      {/* Left: Logo + Brand */}
      <div className="flex items-center space-x-4">
        {/* Logo (replace with <Image> if needed) */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">
          L
        </div>
        <span className="text-xl font-semibold">MyCargonaut</span>
      </div>

      {/* Right: Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="space-x-6">
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className="text-white hover:text-gray-300 transition-colors">
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/drives">
              <NavigationMenuLink className="text-white hover:text-gray-300 transition-colors">
                Drives
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/profile">
              <NavigationMenuLink className="text-white hover:text-gray-300 transition-colors">
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
