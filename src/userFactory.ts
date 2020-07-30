import { UserService, SecretService } from "@meeco/sdk";
import {
  environment,
  log,
  STATE,
  hideElement,
  showElement,
} from "./appService";
import * as _ from "./constants";
import * as itemFactory from "./itemFactory";

export async function getUsername() {
  try {
    const username = await new UserService(environment, log).generateUsername();
    getSecret(username);
  } catch (error) {
    console.log(error);
  }
}

async function getSecret(username: string) {
  try {
    const secret = await new SecretService().generateSecret(username);
    createUser(secret);
  } catch (error) {
    console.log(error);
  }
}

async function createUser(secret: string) {
  const passphrase = _.$get("passphrase");
  try {
    const user = await new UserService(environment, log).create(
      passphrase,
      secret
    );
    STATE.user = user;
    showSecret();
  } catch (error) {
    console.log(error);
  }
}

function showSecret() {
  _.$("secret-block").textContent = STATE.user.secret;
  hideElement(_.signup);
  showElement(_.welcome);
}

export async function fetchUserData() {
  hideElement(_.login);
  try {
    const user = await new UserService(environment, log).get(
      _.BOB_PASSWORD,
      _.BOB_SECRET
    );
    STATE.user = user;
    console.log(user);
    showElement(_.dashboard);
    hideElement(_.header);
    await itemFactory.getAllItems();
  } catch (error) {
    console.log(error);
  }
}
