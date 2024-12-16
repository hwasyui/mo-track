import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div style={styles.container}>
      <div style={styles.signupContainer}>
        <SignUp />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("/path-to-your-image.jpg")', // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  signupContainer: {
    background: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background for the form
    borderRadius: '10px',
    padding: '20px' // Optional: box shadow for better visibility
  },
};
