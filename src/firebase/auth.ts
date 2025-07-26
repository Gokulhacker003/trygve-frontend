import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User
} from "firebase/auth";
import app from "./firebaseConfig"; // Make sure this import points to your Firebase config file

// Initialize Firebase Auth
export const auth = getAuth(app);

// Add types to window object for global access to recaptcha and confirmation result
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: ConfirmationResult | undefined;
  }
}

// Phone Authentication

/**
 * Sets up the reCAPTCHA verifier for phone authentication
 * @param elementId - The ID of the DOM element where reCAPTCHA will be rendered
 * @returns The RecaptchaVerifier instance or null if setup fails
 */
export const setupRecaptcha = (elementId: string): RecaptchaVerifier | null => {
  // Clean up any existing verifier first
  cleanupRecaptcha();
  
  // Ensure the element exists
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return null;
  }
  
  try {
    // Create a new reCAPTCHA verifier and store it on the window object
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved");
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired");
        // Optionally refresh the page or show a message when reCAPTCHA expires
      }
    });
    
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Error setting up reCAPTCHA:", error);
    return null;
  }
};

/**
 * Cleans up the reCAPTCHA verifier
 */
export const cleanupRecaptcha = (): void => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = undefined;
  }
};

/**
 * Sends an OTP to the specified phone number
 * @param phoneNumber - The phone number to send the OTP to (must include country code, e.g., +91)
 * @param verifier - The RecaptchaVerifier instance
 * @returns A Promise resolving to the ConfirmationResult
 */
export const sendOtp = async (phoneNumber: string, verifier: RecaptchaVerifier | null): Promise<ConfirmationResult> => {
  if (!verifier) {
    throw new Error("reCAPTCHA verifier not initialized");
  }
  
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    // Store the confirmation result on the window object for global access
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/**
 * Verifies an OTP sent to a phone number
 * @param confirmationResult - The ConfirmationResult from sendOtp
 * @param otp - The OTP entered by the user
 * @returns A Promise resolving to the authenticated User
 */
export const verifyOtp = async (confirmationResult: ConfirmationResult, otp: string): Promise<User> => {
  try {
    const result = await confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Email/Password Authentication

/**
 * Signs up a new user with email and password
 * @param email - The user's email
 * @param password - The user's password
 * @returns A Promise resolving to the authenticated User
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

/**
 * Signs in an existing user with email and password
 * @param email - The user's email
 * @param password - The user's password
 * @returns A Promise resolving to the authenticated User
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Observes changes to the user's sign-in state
 * @param callback - A function called when the user's sign-in state changes
 * @returns An unsubscribe function
 */
export const onAuthStateChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Gets the current authenticated user, if any
 * @returns The current user or null if not signed in
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * A convenience method that combines phone authentication steps
 * @param phoneNumber - The phone number to authenticate (must include country code)
 * @param recaptchaContainerId - The ID of the DOM element for reCAPTCHA
 * @returns A Promise resolving to the ConfirmationResult
 */
export const initiatePhoneAuth = async (phoneNumber: string, recaptchaContainerId: string): Promise<ConfirmationResult> => {
  const verifier = setupRecaptcha(recaptchaContainerId);
  return await sendOtp(phoneNumber, verifier);
};