import { configureFetch } from "@meeco/sdk";

import * as _ from "./constants";

import * as userFactory from "./userFactory";

import * as itemFactory from "./itemFactory";

import * as templateFactory from "./templateFactory";

import { hideElement, showElement } from "./appService";

import "./styles.scss";

configureFetch(window.fetch);

_.$("createAccount").addEventListener("click", () => {
  hideElement(_.login);
  showElement(_.signup);
});
_.$("generate").addEventListener("click", userFactory.getUsername);
_.$("getAccount").addEventListener("click", userFactory.fetchUserData);
_.$("addItem").addEventListener("click", templateFactory.getTemplates);
_.$("createCard").addEventListener("click", itemFactory.createItem);
