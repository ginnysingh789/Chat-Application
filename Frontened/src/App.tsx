
import { Routes ,Route} from 'react-router-dom'
import './App.css'
import { HomePage } from './Components/HomePage'
import { ChatRoom } from './Components/ChatRoom'
import { JoinRoom } from './Components/JoinRoom'
export const App=()=> {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}></Route>
      <Route path="/room/:roomId" element={<ChatRoom />} />
     <Route path="/Join" element={<JoinRoom />} /> 
    </Routes>
  )
}


