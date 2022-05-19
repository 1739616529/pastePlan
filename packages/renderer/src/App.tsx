import { Route, HashRouter, Routes } from "react-router-dom"
import Home from "./page/Home/Home"
import Setting from "./page/Setting/Setting"
const App = () => {

  return (
    <HashRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </HashRouter>
  )
}
// window.onkeydown = function (e) {
//   console.log(e)
// }
export default App
