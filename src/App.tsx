import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import User from './Class/User';
import Login from './Components/Login';
import { MyProvider } from './Context/MainContext';
import RenderPage from './Components/RenderPage';
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import PrivateRoute from './PrivateRoute';
import Gtpp from './Modules/GTPP/Gtpp';
import { WebSocketProvider } from './Context/WsContext';
import Clpp from './Modules/CLPP/Clpp';
import RenderedModules from './Components/RenderedModules';
import { EppWsProvider } from './Modules/GTPP/Context/GtppWsContext';

function App() {
  return (
    <HashRouter>
      <Routes>

        <Route path="/" element={
          <MyProvider>
            <RenderPage>
              <Login />
            </RenderPage>
          </MyProvider>
        } />

        <Route path="/home" element={
          <MyProvider>
            <PrivateRoute>
              <RenderedModules>
                <Home />
              </RenderedModules>
            </PrivateRoute>
          </MyProvider>
        } />
        <Route path="/home/GTPP" element={
          <MyProvider>
            <PrivateRoute>
              <RenderedModules>
                <EppWsProvider>
                  <Gtpp />
                </EppWsProvider>
              </RenderedModules>
            </PrivateRoute>
          </MyProvider>
        } />


      </Routes>
    </HashRouter>
  );
}

export default App;
