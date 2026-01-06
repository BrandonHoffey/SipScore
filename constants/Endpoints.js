export const DOMAIN = "https://9db926663f58.ngrok-free.app";
export const API_NEW_USER = DOMAIN + "/api/users";
export const API_USER_SIGNIN = DOMAIN + "/api/login";
export const API_VIEW_ALL = DOMAIN + "/api/view-all";
export const API_CURRENT_ACCOUNT = DOMAIN + "/api/current-account";
export const API_USER_NEW_WHISKEY = DOMAIN + "/api/user-whiskey";
export const API_USER_WHISKEY_LIST = DOMAIN + "/api/user-whiskey-list";
export const API_DELETE_WHISKEY = DOMAIN + "/api/delete-whiskey/:whiskeyId";
export const API_USER_LOGOUT = DOMAIN + "/api/logout";

// Friend-related endpoints
export const API_SEARCH_USERS = DOMAIN + "/api/search-users";
export const API_SEND_FRIEND_REQUEST = DOMAIN + "/api/send-friend-request";
export const API_FRIEND_REQUESTS = DOMAIN + "/api/friend-requests";
export const API_ACCEPT_FRIEND_REQUEST = DOMAIN + "/api/accept-friend-request";
export const API_DENY_FRIEND_REQUEST = DOMAIN + "/api/deny-friend-request";
export const API_FRIENDS_LIST = DOMAIN + "/api/friends-list";
export const API_FRIEND_WHISKEYS = DOMAIN + "/api/friend-whiskeys/:friendId";
export const API_REMOVE_FRIEND = DOMAIN + "/api/remove-friend";

// Settings-related endpoints
export const API_UPDATE_USERNAME = DOMAIN + "/api/update-username";
export const API_UPDATE_PASSWORD = DOMAIN + "/api/update-password";
export const API_UPDATE_PROFILE_PICTURE =
  DOMAIN + "/api/update-profile-picture";
