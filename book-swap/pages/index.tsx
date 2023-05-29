import { useRouter } from 'next/router';
import Lottie from 'react-lottie';
import animationData from '../public/animation.json';

const WelcomePage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: "48px", fontWeight:"400" }}>Welcome to </h1>
      <p style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: "52px", fontWeight:"700", lineHeight:"0px" }}>BookSwap</p>
      
      <div style={{ textAlign: 'center' }}>
        <Lottie options={lottieOptions} height={350} width={400} />
      </div>

      <div style={{ textAlign: 'center', fontFamily: 'Lato', fontSize:"18px" }}>
        <p>Interested in finding your next book?</p>
        <div>
          <button onClick={handleLogin}>Log in</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
