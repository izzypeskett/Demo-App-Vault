import config from "../config";

export const VAULT_URL = config.vault_url;
export const KEYSTORE_URL = config.keystore_url;
export const SUB_KEY = config.sub_key;
export const BOB_SECRET = config.bob_secret;
export const BOB_PASSWORD = config.bob_password;

export const $ = (id) => document.getElementById(id);
export const $get = (id: string) => ($(id) as HTMLInputElement)?.value;
export const loading = $("loading");
export const login = $("login");
export const signup = $("signup");
export const welcome = $("welcome");
export const dashboard = $("dashboard");
export const itemList = $("item-list");
export const itemFormContainer = $("item-form-container");
export const itemSpace = $("form-space");
export const itemTemplate = $("item-templates");
export const cardList = document.querySelector(".card-list");
export const sidebar = $("sidebar");
export const itemShow = $("item-show");
export const header = $("header");
export const active = document.querySelector(".active");
