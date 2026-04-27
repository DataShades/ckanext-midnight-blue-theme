/// <reference path="../../../../../../../ckanext-theming/types.d.ts" />
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
((ckan) => {
    var _Modal_modal, _Notification_toast, _Tooltip_tooltip, _Popover_popover;
    const util = {
        applyAttrs(el, attrs) {
            Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
        },
        applyProps(el, props) {
            Object.entries(props).forEach(([key, value]) => (el[key] = value));
        },
        applyListeners(el, listeners) {
            Object.entries(listeners).forEach(([key, value]) => {
                if (typeof value == "function") {
                    el.addEventListener(key, value);
                }
                else {
                    el.addEventListener(key, value.listener, value.options);
                }
            });
        },
    };
    class Modal {
        constructor(el) {
            this.el = el;
            _Modal_modal.set(this, void 0);
            __classPrivateFieldSet(this, _Modal_modal, bootstrap.Modal.getOrCreateInstance(el), "f");
        }
        destroy() {
            __classPrivateFieldGet(this, _Modal_modal, "f").dispose();
        }
        show() {
            __classPrivateFieldGet(this, _Modal_modal, "f").show();
        }
        close() {
            __classPrivateFieldGet(this, _Modal_modal, "f").hide();
        }
    }
    _Modal_modal = new WeakMap();
    class Notification {
        constructor(el) {
            this.el = el;
            _Notification_toast.set(this, void 0);
            __classPrivateFieldSet(this, _Notification_toast, bootstrap.Toast.getOrCreateInstance(el), "f");
        }
        close() {
            __classPrivateFieldGet(this, _Notification_toast, "f").hide();
        }
        show() {
            __classPrivateFieldGet(this, _Notification_toast, "f").show();
        }
        destroy() {
            __classPrivateFieldGet(this, _Notification_toast, "f").dispose();
        }
    }
    _Notification_toast = new WeakMap();
    class Tooltip {
        constructor(el) {
            this.el = el;
            _Tooltip_tooltip.set(this, void 0);
            __classPrivateFieldSet(this, _Tooltip_tooltip, bootstrap.Tooltip.getOrCreateInstance(el), "f");
        }
        close() {
            __classPrivateFieldGet(this, _Tooltip_tooltip, "f").hide();
        }
        show() {
            __classPrivateFieldGet(this, _Tooltip_tooltip, "f").show();
        }
        destroy() {
            __classPrivateFieldGet(this, _Tooltip_tooltip, "f").dispose();
        }
    }
    _Tooltip_tooltip = new WeakMap();
    class Popover {
        constructor(el) {
            this.el = el;
            _Popover_popover.set(this, void 0);
            __classPrivateFieldSet(this, _Popover_popover, bootstrap.Popover.getOrCreateInstance(el), "f");
        }
        close() {
            __classPrivateFieldGet(this, _Popover_popover, "f").hide();
        }
        show() {
            __classPrivateFieldGet(this, _Popover_popover, "f").show();
        }
        destroy() {
            __classPrivateFieldGet(this, _Popover_popover, "f").dispose();
        }
    }
    _Popover_popover = new WeakMap();
    const ui = {
        button(content, params = {}) {
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
            const modal = document.body.lastElementChild;
            if (title) {
                modal
                    .querySelector(".modal-header")
                    ?.insertAdjacentHTML("beforeend", `<h5 class="modal-title">${title}</h5>`);
            }
            if (params.dismissible) {
                modal
                    .querySelector(".modal-header")
                    ?.insertAdjacentHTML("beforeend", `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`);
            }
            modal.querySelector(".modal-body")?.append(content);
            if (params.dismissLabel) {
                actions.unshift(ui.button(params.dismissLabel, {
                    props: { onclick: () => result.close() },
                    style: "secondary",
                }));
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
            return new Modal(el);
        },
        notification(content, title, props = {}) {
            const containerId = "notification-container";
            const container = document.getElementById(containerId);
            if (!container) {
                throw `Notification container(${containerId}) is not defined`;
            }
            const el = container.appendChild(document.createElement("div"));
            el.classList.add("toast");
            util.applyAttrs(el, props.timeout
                ? { "data-bs-delay": String(props.timeout) }
                : { "data-bs-autohide": "false" });
            if (props.style) {
                el.classList.add(`text-bg-${props.style}`);
            }
            if (title) {
                const header = el.appendChild(document.createElement("div"));
                header.classList.add("toast-header");
                header.append(title);
                if (props.dismissible) {
                    header.insertAdjacentHTML("beforeend", `<button type="button" class="ms-auto btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`);
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
                typeof content === "string" ? content : content.textContent;
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
