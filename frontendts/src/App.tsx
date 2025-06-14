
import Navbar from "./components/navbar"
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/components/Router.tsx"

function App() {
  return (
    <>
    <Navbar/>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  )
}

export default App
