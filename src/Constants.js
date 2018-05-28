//This file contains all relevant constant variables used in the app

export const ROUTER_PATH = {
  INDEXES: '/',
  SETTINGS: '/settings'
};

export const AUTHENTICATION = {
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  DISCOVERY_DOCS: 'https://firestore.googleapis.com/$discovery/rest?version=v1beta1',
  SCOPES: ["https://www.googleapis.com/auth/datastore", "https://www.googleapis.com/auth/cloud-platform"]
};