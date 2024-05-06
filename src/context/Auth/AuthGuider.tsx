import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { getWithExpiry } from 'src/utils/utils';
import AuthContext, { AuthContextType } from './AuthContext';

interface WithAuthProps {
}

const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const isLoginPage = router.pathname === '/auth/login';
    const isRegisterPage = router.pathname === '/auth/register';

    const authContext = useContext<AuthContextType>(AuthContext);

    const token = getWithExpiry('token');

    const { accountId, accountData, tokenLogin } = authContext;

    useEffect(() => {
      if ((!accountId || !token) && !isLoginPage && !isRegisterPage) {
        router.push('/auth/login');
      } else if (accountId && token && !accountData) {
        (async () => tokenLogin(accountId, token))();
      }
    }, [accountId, token, isLoginPage, isRegisterPage, router, tokenLogin, accountData]);

    useEffect(() => {
      if (isLoginPage && accountId && token && accountData) {
        router.push('/');
      }
    }, [isLoginPage, router, token, accountId, accountData]);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
