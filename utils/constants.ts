export const USER_CATEGORIES = {
  API_CLIENT: "api_client",
  ADMIN: "admin",
  AGENT: "agent",
  AGENT_USER: "agent_user",
};

export const APP_TOKENS = {
  ACCESS_TOKEN: "pycl_access_token",
  REFRESH_TOKEN: "pycl_refresh_token",
  CATEGORY: "pycl_category",
  USERID : "pycl_user_id",
};

export const IDENTITY_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://mabillagroupappslb-1683373620.eu-west-1.elb.amazonaws.com:8000/api"
    : "http://mabillagroupappslb-1683373620.eu-west-1.elb.amazonaws.com:8000/api";

    
export const APICLIENT_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://mabillagroupappslb-1683373620.eu-west-1.elb.amazonaws.com:8080/"
    : "http://mabillagroupappslb-1683373620.eu-west-1.elb.amazonaws.com:8080/";

export const TAWKTO_KEYS = {
  PROPERTY_ID : "63c61ee847425128790e04b6",
  WIDGET_ID : "1hcnbd2e3"
}