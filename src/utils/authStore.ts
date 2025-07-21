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

