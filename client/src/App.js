import './App.css';
import {Route, Routes} from 'react-router-dom';
import Header from './Header';
import Post from './Post';
import Layout from './Layout';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Post/>}/>
        <Route path='/login' element={<div>login</div>}/>
        <Route path='register' element={<div>register</div>}/>
      </Route>
    </Routes>
    
  );
}

export default App;
