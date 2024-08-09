import { Suspense, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import { publicRoutes, protectedRoutes } from './routes/MyRoutes'
import { ProSidebarProvider } from 'react-pro-sidebar';
import SidebarLayout from './layouts/sidebarLayout';
function App() {

  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", height: "100vh", flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
          Loading...
        </div>
      }
    >
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              <ProSidebarProvider>
                <SidebarLayout />
              </ProSidebarProvider>
            }>
            {protectedRoutes.map((item, idx) => (
              <Route
                path={item?.path}
                element={item?.component}
                key={idx}
              />
            ))}

          </Route>
          {publicRoutes.map((item, idx) => (
            <Route
              path={item?.path}
              element={item?.component}
              key={idx}
            />
          ))}
        </Routes>
      </Router>
    </Suspense>

  )
}

export default App
