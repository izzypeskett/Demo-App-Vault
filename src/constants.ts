import config from "../config";

export const VAULT_URL = config.vault_url;
export const KEYSTORE_URL = config.keystore_url;
export const SUB_KEY = config.sub_key;
export const BOB_SECRET = config.bob_secret;
export const BOB_PASSWORD = config.bob_password;

export const $ = (id) => document.getElementById(id);
export const $get = (id: string) => ($(id) as HTMLInputElement)?.value;
export const active = document.querySelector(".active");
export const cardList = document.querySelector(".card-list");
export const dashboard = $("dashboard");
export const form = $("item-form");
export const header = $("header");
export const itemFormContainer = $("item-form-container");
export const itemList = $("item-list");
export const itemShow = $("item-show");
export const itemSpace = $("form-space");
export const itemTemplate = $("item-templates");
export const loading = $("loading");
export const login = $("login");
export const navbar = $("navbar");
export const sidebar = $("sidebar");
export const signup = $("signup");
export const welcome = $("welcome");
