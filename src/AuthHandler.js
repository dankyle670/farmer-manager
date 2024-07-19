import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import netlifyIdentity from 'netlify-identity-widget';

const AuthHandler = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    netlifyIdentity.init({
      container: '#netlify-modal',
      locale: 'en',
    });

    netlifyIdentity.on('login', (user) => {
      setIsLoggedIn(true);
      netlifyIdentity.close();
      navigate('/home');
    });

    netlifyIdentity.on('logout', () => {
      setIsLoggedIn(false);
      navigate('/');
    });

    // Cleanup listeners on component unmount
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, [navigate, setIsLoggedIn]);

  return null;
};

export default AuthHandler;
