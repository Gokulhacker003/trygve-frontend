// This interface defines the structure for a user object.
interface AuthUser {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

/**
 * Saves the current user's session object to local storage.
 * Merges new data with any existing session data.
 * @param user - The partial user object to save to the current session.
 */
export const saveUserSession = (user: Partial<AuthUser>) => {
  const existingSession = getUserSession() || {};
  const newSession = { ...existingSession, ...user };
  localStorage.setItem('auth_session', JSON.stringify(newSession));
};

/**
 * Retrieves the current user's session object from local storage.
 * @returns The user object or null if not found.
 */
export const getUserSession = (): AuthUser | null => {
  const session = localStorage.getItem('auth_session');
  return session ? JSON.parse(session) : null;
};

/**
 * Clears the current user's session from local storage (logs them out).
 */
export const clearUserSession = () => {
  localStorage.removeItem('auth_session');
};

/**
 * Checks if there is a fully authenticated user session.
 * @returns True if the user is authenticated, false otherwise.
 */


/**
 * Retrieves the list of all registered users from local storage.
 * @returns An array of AuthUser objects.
 */
export const getAllUsers = (): AuthUser[] => {
  const users = localStorage.getItem('auth_users_list');
  return users ? JSON.parse(users) : [];
};

/**
 * Checks if a user already exists in the list of all users.
 * @param emailOrPhone - The email or phone number to check.
 * @returns True if a user with that email or phone exists, false otherwise.
 */
export const userExists = (emailOrPhone: string): boolean => {
  const allUsers = getAllUsers();
  return allUsers.some(user => 
    user.email === emailOrPhone || user.phone === emailOrPhone
  );
};

/**
 * Adds a new user to the persisted list of all users.
 * @param newUser - The complete user object to register.
 */
export const registerUser = (newUser: AuthUser) => {
  if (userExists(newUser.email) || userExists(newUser.phone)) {
    console.warn("Attempted to register a user that already exists.");
    return;
  }
  
  const allUsers = getAllUsers();
  allUsers.push(newUser);
  localStorage.setItem('auth_users_list', JSON.stringify(allUsers));
  
  console.log(`User ${newUser.fullName} registered successfully.`);
};

/**
 * Finds a user by email or phone number
 * @param emailOrPhone - The email or phone to search for
 * @returns The matching user or null if not found
 */
export const findUserByEmailOrPhone = (emailOrPhone: string): AuthUser | null => {
  const allUsers = getAllUsers();
  return allUsers.find(user => 
    user.email === emailOrPhone || user.phone === emailOrPhone
  ) || null;
};

/**
 * Check if user exists by email or phone
 * @param identifier Email or phone to check
 * @returns {boolean} True if user exists, false otherwise
 */
export const checkUserExists = (identifier: string): boolean => {
  // Get users from localStorage
  const users = getAllUsers();
  
  // Clean up the identifier (remove spaces, make lowercase for email)
  const cleanIdentifier = identifier.trim();
  
  // Check for matches (case insensitive for emails)
  return users.some(user => 
    user.email === cleanIdentifier || 
    user.phone === cleanIdentifier
  );
};

/**
 * Validate signup data and return any errors
 * @param userData User data to validate
 * @returns Object with error messages or null if valid
 */
export const validateSignupData = (userData: {
  email: string;
  phone: string;
  fullName?: string;
}) => {
  const errors: Record<string, string> = {};
  
  // Check required fields
  if (!userData.email) errors.email = "Email is required";
  if (!userData.phone) errors.phone = "Phone number is required";
  
  // Email format validation
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = "Please enter a valid email address";
  }
  
  // Phone format validation (assuming 10 digit)
  if (userData.phone && !/^\d{10}$/.test(userData.phone)) {
    errors.phone = "Please enter a valid 10-digit phone number";
  }
  
  // Check if user already exists
  if (userData.email && checkUserExists(userData.email)) {
    errors.email = "This email is already registered";
  }
  
  if (userData.phone && checkUserExists(userData.phone)) {
    errors.phone = "This phone number is already registered";
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

