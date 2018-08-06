//This file contains all relevant constant variables used in the app

export const ROUTER_PATH = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  INDEXES: '/indexes/:id',
  DASHBOARD_TO_INDEX: 'indexes',
  SETTINGS: '/settings',
  DATABASES: '/'
};

export const AUTHENTICATION = {
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  DISCOVERY_DOCS: 'https://firestore.googleapis.com/$discovery/rest?version=v1beta1',
  SCOPES: ["https://www.googleapis.com/auth/datastore", "https://www.googleapis.com/auth/cloud-platform"]
};

export const FIREBASE_AUTH_ERROR_ENUM = {
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_EMAIL: 'auth/invalid-email',
  WEAK_PASSWORD: 'auth/weak-password',
  ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL: 'auth/account-exists-with-different-credential',
  CREDENTIAL_ALREADY_IN_USE: 'auth/credential-already-in-use',
  WRONG_PASSWORD: 'auth/wrong-password',
  USER_NOT_FOUND: 'auth/user-not-found',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed'
};

export const FIREBASE_AUTH_ERROR_ENUM_DETAILED = {
  NETWORK_REQUEST_FAILED: {
    ERROR_CODE: 'auth/network-request-failed',
    ERROR_HEADER: 'Network Request Failed',
    ERROR_MESSAGE: 'A network error (such as timeout, interrupted connection or unreachable host) has occurred. ' +
      '\n\nPlease try again later.'
    //TODO: How to do newline in Javascript?
  }
};

export const FIREBASE_PATH = {
  LINKED_ACCOUNTS_BASE: 'linked_accounts',
  FIRESTORE_ACCOUNT: 'firestore_account',
  FIRESTORE_PROJECT: 'firestore_project'
};