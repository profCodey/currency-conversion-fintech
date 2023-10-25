export const USER_CATEGORIES = {
  ADMIN: "admin",
  AGENT: "agent",
  API_CLIENT: "api_client",
  AGENT_USER: "agent_user",
};

export const CLIENT_TYPES: {
  INDIVIDUAL: string;
  CORPORATE: string;
} = {
  INDIVIDUAL: "individual",
  CORPORATE: "corporate",
}

interface Client {
  label: string;
  value: string;
  key: string;
}

export const CLIENT_TYPES_DATA: Array<Client> = [
  {
    label: CLIENT_TYPES.INDIVIDUAL[0].toUpperCase() + CLIENT_TYPES.INDIVIDUAL.slice(1),
    value: CLIENT_TYPES.INDIVIDUAL.toLowerCase(),
    key: CLIENT_TYPES.INDIVIDUAL,
  },
  {
    label: CLIENT_TYPES.CORPORATE[0].toUpperCase() + CLIENT_TYPES.CORPORATE.slice(1),
    value: CLIENT_TYPES.CORPORATE.toLowerCase(),
    key: CLIENT_TYPES.CORPORATE,
  }
]


export const APP_TOKENS = {
  ACCESS_TOKEN: "pycl_access_token",
  REFRESH_TOKEN: "pycl_refresh_token",
  CATEGORY: "pycl_category",
  USERID: "pycl_user_id",
};

export const TAWKTO_KEYS = {
  PROPERTY_ID: "63c61ee847425128790e04b6",
  WIDGET_ID: "1hcnbd2e3"
}

export const SUPPORTED_FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'application/pdf', '.pdf', '.doc', '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
