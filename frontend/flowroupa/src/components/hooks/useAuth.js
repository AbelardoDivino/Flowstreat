import useAuthStore from '../store/authStore';
import * as authService from '../services/authService';

export default function useAuth() {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();

  async function loginWithEmail(data) {
    const res = await authService.login(data);
    login(res.user);
    return res;
  }

  async function register(data) {
    const res = await authService.register(data);
    login(res.user);
    return res;
  }

  async function loginWithGoogle(idToken) {
    const res = await authService.loginWithGoogle(idToken);
    login(res.user);
    return res;
  }

  async function doLogout() {
    await authService.logout();
    logout();
  }

  async function restore() {
    try {
      const { user } = await authService.getMe();
      setUser(user);
    } catch {
      // 401 quando deslogado é normal, não loga erro
      setUser(null);
    }
  }

  return { user, isAuthenticated, login: loginWithEmail, register, loginWithGoogle, logout: doLogout, restore, setUser };
}
