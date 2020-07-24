import config from "../config";

export const VAULT_URL = config.vault_url;
export const KEYSTORE_URL = config.keystore_url;
export const SUB_KEY = config.sub_key;
export const BOB_SECRET = config.bob_secret;
export const BOB_PASSWORD = config.bob_password;

export const $ = (id) => document.getElementById(id);
export const loading = $("loading");
export const login = $("login");
export const signup = $("signup");
export const welcome = $("welcome");
export const button = $("generate");
export const dashboard = $("dashboard");
export const itemList = $("item-list");
export const itemForm = $("itemForm");
export const itemSpace = $("form-space");
export const cardList = document.querySelector(".card-list");
export const itemShow = $("item-show");
