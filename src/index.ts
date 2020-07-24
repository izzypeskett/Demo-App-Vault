import {
  AuthData,
  configureFetch,
  EncryptionKey,
  Environment,
  ItemService,
  SecretService,
  UserService,
  TemplatesService,
} from "@meeco/sdk";

import {
  VAULT_URL,
  KEYSTORE_URL,
  SUB_KEY,
  BOB_PASSWORD,
  BOB_SECRET,
  $,
  loading,
  login,
  signup,
  welcome,
  button,
  dashboard,
  itemList,
  itemForm,
  itemSpace,
  cardList,
  itemShow,
} from "./constants";
import "./styles.scss";

let environment: Environment;

environment = new Environment({
  vault: {
    url: VAULT_URL,
    subscription_key: SUB_KEY,
  },
  keystore: {
    url: KEYSTORE_URL,
    subscription_key: SUB_KEY,
    provider_api_key: "",
  },
});

const STATE: {
  user?: AuthData;
  items?: any;
} = {
  user: {
    data_encryption_key: EncryptionKey.fromSerialized(
      "8n4gBhblWtYRLk3rTH1rRGXtKHikTVtJbyTowVtpy1s="
    ),
    key_encryption_key: EncryptionKey.fromSerialized(
      "_jGrW02X_dNw4cSvZZq7XF5ICC1_mHm_f3LIdqtaGno="
    ),
    keystore_access_token:
      "dERNLspexZsg3dspiEXqrSc1Z1QRuiVUlZB6AfU2gA4=.i7J8jYqPwaiwJM67ew_kWiQryVBsK271JmnbqjBg6h4=",
    passphrase_derived_key: EncryptionKey.fromSerialized(
      "qvufd1GAJmiBEKE2FTSksbLbMTBYwh3kucmd78onqoo="
    ),
    secret: "1.bBq6Qp.6ztGfS-hKUdWN-PhnCqi-Fpd4k2-1UMXJz-dWGpGV-yZSzTQ-N",
    vault_access_token: "bwmDcZsQFBx1S2w4f9wv",
  },
};

const secretService = new SecretService();
const $get = (id: string) => ($(id) as HTMLInputElement)?.value;

configureFetch(window.fetch);

$("createAccount").addEventListener("click", createAccount);
$("generate").addEventListener("click", getUsername);
$("getAccount").addEventListener("click", fetchUserData);
$("addItem").addEventListener("click", showItemForm);
$("createCard").addEventListener("click", createItem);

function createAccount() {
  login.style.display = "none";
  signup.style.display = "inline-block";
}

async function getUsername() {
  button.classList.add("loading");
  try {
    const username = await new UserService(environment, log).generateUsername();
    getSecret(username);
  } catch (error) {
    console.log(error);
  }
}

async function getSecret(username: string) {
  try {
    const secret = await secretService.generateSecret(username);
    createUser(secret);
  } catch (error) {
    console.log(error);
  }
}

async function createUser(secret: string) {
  const passphrase = $get("passphrase");
  try {
    const user = await new UserService(environment, log).create(
      passphrase,
      secret
    );
    STATE.user = user;
    await successMessage();
  } catch (error) {
    console.log(error);
  }
}

async function successMessage() {
  signup.style.display = "none";
  showSecret();
}

async function showSecret() {
  $("secret-block").textContent = STATE.user.secret;
  welcome.style.display = "inline-block";
}

async function fetchUserData() {
  login.style.display = "none";
  try {
    const user = await new UserService(environment, log).get(
      BOB_PASSWORD,
      BOB_SECRET
    );
    STATE.user = user;
    dashboard.style.display = "inline-block";
    await getItems();
  } catch (error) {
    console.log(error);
  }
}

function showItemForm() {
  itemList.style.display = "none";
  itemShow.style.display = "none";
  itemForm.style.display = "inline-block";
  itemSpace.innerHTML = `
  <h4>Item Details</h4>
    <input type="text" name="input-label" id="item-title" placeholder="Item Name"/><br/>
    <input type="text" name="slot-1-label" id="slot-1-label" placeholder="Label">
    <input type="text" name="slot-1-value" id="slot-1-value" placeholder="Value"/><br/>
    <input type="text" id="slot-2-label" name="slot-2-label" placeholder="Label">
    <input type="text" name="slot-2-value" id="slot-2-value" placeholder="Value"/><br />
    `;
}

async function createItem() {
  const itemLabel = $get("item-title");
  const label1 = $get("slot-1-label");
  const label2 = $get("slot-2-label");
  const value1 = $get("slot-1-value");
  const value2 = $get("slot-2-value");
  const config = {
    template_name: "custom",
    item: {
      label: itemLabel,
    },
    slots: [
      {
        name: label1,
        value: value1,
      },
      {
        name: label2,
        value: value2,
      },
    ],
  };
  console.log(config);
  try {
    const item = await new ItemService(environment, log).create(
      STATE.user.vault_access_token,
      STATE.user.data_encryption_key,
      config
    );
    await getItems();
  } catch (error) {
    console.log(error.body);
    console.log(error);
  }
}

async function getItems() {
  loading.innerHTML = `
    <h4> Hey Twin,</h4>
    <p class="large">Welcome back!<br/>Let's add or share some more items</p>
  `;
  dashboard.style.justifyContent = "flex-start";
  itemForm.style.display = "none";
  itemList.style.display = "inline-block";
  try {
    const items = await new ItemService(environment, log).list(
      STATE.user.vault_access_token
    );
    STATE.items = items.items;
    displayItems(items.items);
  } catch (error) {
    console.log(error);
  }
}

async function getItem(id: any) {
  const item = await new ItemService(environment, log).get(
    id,
    STATE.user.vault_access_token,
    STATE.user.data_encryption_key
  );
  displayItem(item);
}

function displayItems(items: any) {
  cardList.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("id", `${item.label}`);
    card.innerHTML = `
      <div class="content">
        <div class="icon"><i class="fas fa-wifi"></i></div>
        <p class="card-label">${item.label}</p>
      </div>`;
    cardList.appendChild(card);
    $(item.label).addEventListener("click", function () {
      showItemDetail(item.label);
    });
  });
}

async function displayItem(item) {
  console.log(item);
  itemList.style.display = "none";
  $("item-label").innerHTML = item.item.label;
  item.slots.forEach((slot) => {
    if (slot.creator === "user") {
      itemShow.innerHTML += `
      <p class="label">${slot.label}</p>
      <p class="text-value">${slot.value}</p><br/>`;
    }
    if (slot.label === "tags") {
      $("tag").innerHTML = slot.value;
    }
  });
}

function showItemDetail(label: string) {
  console.log("clicked on card");
  STATE.items.forEach((item) => {
    if (item.label === label) {
      getItem(item.id);
    }
  });
}

function log(message: string) {
  console.log(message);
  const newContent = message;
  loading.innerHTML = newContent;
}
