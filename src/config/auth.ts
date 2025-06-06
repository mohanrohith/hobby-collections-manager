import { getAuth, GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();

export { auth, googleProvider, emailProvider };
