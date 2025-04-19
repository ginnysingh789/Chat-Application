
import { Routes ,Route} from 'react-router-dom'
import './App.css'
import { HomePage } from './Components/HomePage'
import { CreateRoom } from './Components/CreateRoom'
import { JoinRoom } from './Components/JoinRoom'
export const App=()=> {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}></Route>
     <Route path="/Create" element={<CreateRoom />} /> 
     <Route path="/Join" element={<JoinRoom />} /> 
    </Routes>
  )
}


