import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const Signin = () => {
  return (
    <SignIn
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#2dd4bf',
        },
      }}
    />
  );
};

export default Signin;
