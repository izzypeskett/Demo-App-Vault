import { ItemService, vaultAPIFactory, ItemSlot } from "@meeco/sdk";
import * as _ from "./constants";

import {
  hideElement,
  showElement,
  STATE,
  environment,
  log,
} from "./appService";

// //create Item

// First we need to display the form to create an item
export const showItemForm = () => {
  hideElement(_.itemTemplate);
  hideElement(_.itemShow);
  showElement(_.itemFormContainer);
  _.form.innerHTML = `
  <h4>${STATE.template.item_template.label}</h4>
  <label for="item-label">Item name</label>
  <input name="item-label" id="item-label-value" type="text" />
  <hr>`;

  STATE.template.slots.forEach((slot: ItemSlot) => {
    _.form.innerHTML += `
    <label for="${slot.label}">${slot.label}</label>
    <input id="${slot.name}" name="${slot.label}" type="text"/>`;
  });
};

// Creating the item
export async function createItem() {
  let config = {
    template_name: STATE.template.item_template.name,
    item: {
      label: _.$get("item-label-value"),
    },
    slots: [],
  };
  STATE.template.slots.forEach((slot: ItemSlot) => {
    config.slots.push({
      name: slot.name,
      value: _.$get(slot.name),
    });
  });
  try {
    const item = await new ItemService(environment, log).create(
      STATE.user.vault_access_token,
      STATE.user.data_encryption_key,
      config
    );
    await getAllItems();
  } catch (error) {
    console.log(error);
  }
}

// // Get all items

// Call the API to retrieve the items
export async function getAllItems() {
  hideElement(_.loading);
  showElement(_.navbar);
  _.sidebar.style.justifyContent = "flex-start";
  hideElement(_.itemFormContainer);
  try {
    const items = await new ItemService(environment, log).list(
      STATE.user.vault_access_token
    );
    STATE.items = items.items;
    displayAllItems();
  } catch (error) {
    console.log(error);
  }
}

// Display the items on the page
export function displayAllItems() {
  showElement(_.itemList);
  hideElement(_.itemShow);
  hideElement(_.itemFormContainer);
  _.cardList.innerHTML = "";
  STATE.items.forEach((item) => {
    console.log(item.item_template_label);
    let itemIcon;
    switch (item.item_template_label) {
      case "Password":
        itemIcon = "vault";
        break;
      case "Medical":
        itemIcon = "notes";
        break;
      case "Membership or subscription":
        itemIcon = "id";
        break;
      case "Custom":
        itemIcon = "template";
        break;
      default:
        itemIcon = "item";
    }
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("id", `${item.label}`);
    card.innerHTML = `
      <div class="content">
        <div class="icon"><i>${itemIcon}</i></div>
        <p class="card-label">${item.label}</p>
      </div>`;
    _.cardList.appendChild(card);
    _.$(item.label).addEventListener("click", function () {
      showItemDetail(item.label);
    });
  });
}

// Adding a click function to each item card
export function showItemDetail(label: string) {
  STATE.items.forEach((item) => {
    if (item.label === label) {
      getItem(item.id);
    }
  });
}

// // Get a single item

// Calling the API to retrieve single API
export async function getItem(id: string) {
  const item = await new ItemService(environment, log).get(
    id,
    STATE.user.vault_access_token,
    STATE.user.data_encryption_key
  );
  displayItem(item);
}

// Display that single item
function displayItem(item: any) {
  showElement(_.active);
  hideElement(_.itemFormContainer);
  hideElement(_.itemTemplate);
  showElement(_.itemShow);

  _.$("item-heading").innerHTML = item.item.label;

  _.$("item-detail").innerHTML = "";
  item.slots.forEach((slot) => {
    if (slot.value !== "") {
      slot.label === "Tags"
        ? (_.$(
            "tag-container"
          ).innerHTML = `<span class="tag">${slot.value}</span>`)
        : (_.$("item-detail").innerHTML += `
      <p class="label">${slot.label}</p>
      <p class="text-value">${slot.value}</p><br/>`);
    }
  });
  _.$("delete").addEventListener("click", () => {
    deleteItem(item.item);
  });
}

// // Delete an item
async function deleteItem(item) {
  const service = vaultAPIFactory(environment)(STATE.user.vault_access_token)
    .ItemApi;
  try {
    const res = await service.itemsIdDelete(item.id);
  } catch (error) {
    console.log(error);
  }
}
