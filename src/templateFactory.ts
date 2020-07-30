import { vaultAPIFactory } from "@meeco/sdk";
import { environment, STATE, hideElement, showElement } from "./appService";
import * as itemFactory from "./itemFactory";
import * as _ from "./constants";

// // Get all templates

// Calling API to retrieve all templates
export async function getTemplates() {
  try {
    const service = vaultAPIFactory(environment)(STATE.user.vault_access_token)
      .ItemTemplateApi;
    const templates = await service.itemTemplatesGet(
      "esafe",
      "esafe_templates"
    );
    STATE.templates = templates;
    showTemplates();
  } catch (error) {
    console.log(error);
  }
}

// Displaying all templates on the page
function showTemplates() {
  hideElement(_.itemShow);
  hideElement(_.itemFormContainer);
  showElement(_.active);
  showElement(_.itemTemplate);
  const container = _.$("template");
  const list = document.createElement("ul");
  list.innerHTML = "";
  STATE.templates.item_templates.forEach((item: any) => {
    list.innerHTML += `<li id="${item.label}">${item.label}</li></a>`;
  });
  container.appendChild(list);
  const listItems = list.getElementsByTagName("li");
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].onclick = () => {
      getTemplate(listItems[i].id);
    };
  }
}

// // Get a single template

function getTemplate(label) {
  STATE.templates.item_templates.forEach(async (template) => {
    if (template.label === label) {
      const service = vaultAPIFactory(environment)(
        STATE.user.vault_access_token
      ).ItemTemplateApi;
      const iTemplate = await service.itemTemplatesIdGet(template.id);
      STATE.template = iTemplate;
      itemFactory.showItemForm();
    }
  });
}
