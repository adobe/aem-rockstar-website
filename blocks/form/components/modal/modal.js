import { subscribe } from '../../rules/index.js';
import { decorateIcons } from '../../../../scripts/aem.js';

export class Modal {
  constructor() {
    this.dialog = null;
    this.formModel = null;
  }

  createDialog(panel) {
    const dialog = document.createElement('dialog');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('modal-content');
    dialogContent.append(...panel.childNodes);
    dialog.append(dialogContent);
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.type = 'button';
    closeButton.innerHTML = '<span class="icon icon-close"></span>';
    dialog.append(closeButton);
    decorateIcons(closeButton);
    dialog.addEventListener('click', (event) => {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (event.clientX < dialogDimensions.left || event.clientX > dialogDimensions.right
          || event.clientY < dialogDimensions.top || event.clientY > dialogDimensions.bottom) {
        dialog.close();
      }
    });
    dialog.querySelector('.close-button').addEventListener('click', () => {
      dialog.close();
      if (this.formModel) {
        this.formModel.getElement(panel?.id).visible = false;
      }
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });
    return dialog;
  }

  showModal() {
    this.dialog.showModal();
    setTimeout(() => {
      this.dialog.querySelector('.modal-content').scrollTop = 0;
    }, 0);
  }

  setFormModel(model) {
    this.formModel = model;
  }

  wrapDialog(panel) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('modal');
    wrapper.appendChild(this.dialog);
    panel.replaceChildren(wrapper);
  }

  decorate(panel) {
    this.dialog = this.createDialog(panel);
    this.wrapDialog(panel);
  }
}

export default async function decorate(panel) {
  const modal = new Modal();
  modal.decorate(panel);
  subscribe(panel, async (fieldDiv, formModel) => {
    modal.setFormModel(formModel);
    if (formModel.getElement(fieldDiv.id).visible === true) {
      modal.showModal();
    }
  });
  return panel;
}
