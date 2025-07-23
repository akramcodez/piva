import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const Signup = () => {
  return (
    <SignUp
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#2dd4bf',
        },
      }}
    />
  );
};

export default Signup;
