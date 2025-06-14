
import Navbar from "./components/navbar"
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./pages/Router"

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
