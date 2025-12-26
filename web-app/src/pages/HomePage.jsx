import { useAuth } from '../context/AuthContext'
import AdminHome from './AdminHome'
import UserHome from './UserHome'

const HomePage = () => {
  const { isAdmin } = useAuth()

  // Check admin status once without logging every render
  return isAdmin() ? <AdminHome /> : <UserHome />
}

export default HomePage
