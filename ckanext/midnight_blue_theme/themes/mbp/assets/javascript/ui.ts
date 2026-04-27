/// <reference path="../../../../../../../ckanext-theming/types.d.ts" />

((ckan) => {
  const util = {
    applyAttrs(el: HTMLElement, attrs: { [key: string]: string }) {
      Object.entries(attrs).forEach(([key, value]) =>
        el.setAttribute(key, value),
      );
    },

    applyProps(el: HTMLElement, props: { [key: string]: any }) {
      Object.entries(props).forEach(
        ([key, value]) => ((el as any)[key] = value),
      );
    },

    applyListeners(
      el: HTMLElement,
      listeners: { [key: string]: Theming.Listener | Theming.ComplexListener },
    ) {
      Object.entries(listeners).forEach(([key, value]) => {
        if (typeof value == "function") {
          el.addEventListener(key, value);
        } else {
          el.addEventListener(key, value.listener, value.options);
        }
      });
    },
  };

  class Modal implements IModal<HTMLElement> {
    #modal!: bootstrap.Modal;
    constructor(public el: HTMLElement) {
      // @ts-ignore
      this.#modal = bootstrap.Modal.getOrCreateInstance(el);
    }

    destroy() {
      this.#modal.dispose();
    }

    show() {
      this.#modal.show();
    }

    close() {
      this.#modal.hide();
    }
  }

  class Notification implements INotification {
    #toast: bootstrap.Toast;
    constructor(public el: HTMLElement) {
      // @ts-ignore
      this.#toast = bootstrap.Toast.getOrCreateInstance(el);
    }
    close() {
      this.#toast.hide();
    }
    show() {
      this.#toast.show();
    }
    destroy() {
      this.#toast.dispose();
    }
  }

  class Tooltip implements ITooltip {
    #tooltip: bootstrap.Tooltip;
    constructor(public el: HTMLElement) {
      // @ts-ignore
      this.#tooltip = bootstrap.Tooltip.getOrCreateInstance(el);
    }
    close() {
      this.#tooltip.hide();
    }
    show() {
      this.#tooltip.show();
    }
    destroy() {
      this.#tooltip.dispose();
    }
  }

  class Popover implements IPopover {
    #popover: bootstrap.Popover;
    constructor(public el: HTMLElement) {
      // @ts-ignore
      this.#popover = bootstrap.Popover.getOrCreateInstance(el);
    }
    close() {
      this.#popover.hide();
    }
    show() {
      this.#popover.show();
    }
    destroy() {
      this.#popover.dispose();
    }
  }

  const ui: IUi = {
    button(content: any, params = {}) {
      const btn = document.createElement("button");
      btn.append(content);

      btn.classList.add("btn", `btn-${params.style ?? "primary"}`);

      if (params.type) {
        btn.type = params.type;
      }

      if (params.attrs) {
        util.applyAttrs(btn, params.attrs);
      }
      if (params.props) {
        util.applyProps(btn, params.props);
      }
      if (params.on) {
        util.applyListeners(btn, params.on);
      }
      [];
      return btn;
    },

    modal(content, title, actions = [], params = {}) {
      const html = `
        <div class="modal fade" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header"></div>
              <div class="modal-body"></div>
              <div class="modal-footer"></div>
            </div>
          </div>
        </div>`;

      document.body.insertAdjacentHTML("beforeend", html);
      const modal = document.body.lastElementChild! as HTMLElement;

      if (title) {
        modal
          .querySelector(".modal-header")
          ?.insertAdjacentHTML(
            "beforeend",
            `<h5 class="modal-title">${title}</h5>`,
          );
      }

      if (params.dismissible) {
        modal
          .querySelector(".modal-header")
          ?.insertAdjacentHTML(
            "beforeend",
            `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`,
          );
      }

      modal.querySelector(".modal-body")?.append(content);

      if (params.dismissLabel) {
        actions.unshift(
          ui.button(params.dismissLabel, {
            props: { onclick: () => result.close() },
            style: "secondary",
          }),
        );
      }

      if (actions.length) {
        modal.querySelector(".modal-footer")?.append(...actions);
      }

      const result = new Modal(modal);

      return result;
    },

    getModal(id) {
      const el = document.getElementById(id);
      if (!el) {
        return null;
      }
      return new Modal(<HTMLElement>el);
    },

    notification(content, title, props = {}) {
      const containerId = "notification-container";
      const container = document.getElementById(containerId);
      if (!container) {
        throw `Notification container(${containerId}) is not defined`;
      }

      const el = container.appendChild(document.createElement("div"));
      el.classList.add("toast");
      util.applyAttrs(
        el,
        props.timeout
          ? { "data-bs-delay": String(props.timeout) }
          : { "data-bs-autohide": "false" },
      );
      if (props.style) {
        el.classList.add(`text-bg-${props.style}`);
      }

      if (title) {
        const header = el.appendChild(document.createElement("div"));
        header.classList.add("toast-header");
        header.append(title);
        if (props.dismissible) {
          header.insertAdjacentHTML(
            "beforeend",
            `<button type="button" class="ms-auto btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`,
          );
        }
      }

      const body = el.appendChild(document.createElement("div"));
      body.classList.add("toast-body");
      body.append(content);

      const result = new Notification(el);
      return result;
    },

    getNotification(id) {
      const el = document.getElementById(id);
      if (!el) {
        return null;
      }
      return new Notification(el);
    },

    tooltip(content, target, props = {}) {
      if (typeof content !== "string") {
        throw "Only string tooltips are supported";
      }
      target.dataset.bsTitle = content;
      target.dataset.placement = props.position || "bottom";
      return new Tooltip(target);
    },

    getTooltip(id) {
      const el = document.getElementById(id);
      if (!el) {
        return null;
      }
      return new Tooltip(el);
    },

    popover(content, target, title, props = {}) {
      target.dataset.bsContent =
        typeof content === "string" ? content : content.textContent!;
      target.dataset.bsHtml = "true";
      if (title) {
        target.dataset.bsTitle = title;
      }
      if (props.trigger) {
        target.dataset.bsTrigger = props.trigger;
      }

      return new Popover(target);
    },

    getPopover(id) {
      const el = document.getElementById(id);
      if (!el) {
        return null;
      }
      return new Popover(el);
    },
  };

  ckan.sandbox.setup((sb) => {
    sb.ui = sb.ui || {};
    sb.ui.util = sb.ui.util || {};
    Object.assign(sb.ui, ui);
    Object.assign(sb.ui.util, util);
  });
})(window.ckan);
