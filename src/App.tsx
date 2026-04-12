import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login"
import { AuthProvider } from "./context/AuthContext"
import Perfil from "./pages/Perfil/perfil"
import Quiz from "./pages/Quiz/quiz"
import QuizForm from "./pages/QuizForm/quizForm"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"

function App() {
  return (

    <>
      <AuthProvider>
        <ToastContainer />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
            <Navbar />

            <main className="grow pt-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/*" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quizform" element={<QuizForm />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
