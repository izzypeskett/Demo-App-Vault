import { AuthData, Environment } from "@meeco/sdk";
import * as _ from "./constants";

export function hideElement(element: any) {
  element.style.display = "none";
}

export function showElement(element: any) {
  element.style.display = "inline-block";
}

export function log(message: string) {
  console.log(message);
  const newContent = message;
  _.loading.innerHTML = newContent;
}

export let environment: Environment;

environment = new Environment({
  vault: {
    url: _.VAULT_URL,
    subscription_key: _.SUB_KEY,
  },
  keystore: {
    url: _.KEYSTORE_URL,
    subscription_key: _.SUB_KEY,
    provider_api_key: "",
  },
});

export const STATE: {
  user?: AuthData;
  templates?: any;
  items?: any;
  template?: any;
} = {};
