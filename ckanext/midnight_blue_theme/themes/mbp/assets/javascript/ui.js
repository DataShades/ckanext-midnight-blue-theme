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
    var _Modal_modal, _a, _Notification_toast, _Notification_createToastContainer, _Notification_createProgressBar, _Tooltip_tooltip, _Popover_popover;
    function applyAttrs(el, attrs) {
        Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    }
    function applyProps(el, props) {
        Object.entries(props).forEach(([key, value]) => (el[key] = value));
    }
    function applyListeners(el, listeners) {
        Object.entries(listeners).forEach(([key, value]) => {
            if (typeof value == "function") {
                el.addEventListener(key, value);
            }
            else {
                el.addEventListener(key, value.listener, value.options);
            }
        });
    }
    function contentAsText(content, allowHtml = false) {
        return typeof content === "string"
            ? content
            : content instanceof HTMLElement && allowHtml
                ? content.innerHTML
                : content.textContent || "";
    }
    class Modal {
        constructor(el) {
            this.el = el;
            _Modal_modal.set(this, void 0);
            // @ts-ignore
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
        static create(content, params = {}) {
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
            if (params.title) {
                modal
                    .querySelector(".modal-header")
                    ?.insertAdjacentHTML("beforeend", `<h5 class="modal-title">${params.title}</h5>`);
            }
            if (params.dismissible) {
                modal
                    .querySelector(".modal-header")
                    ?.insertAdjacentHTML("beforeend", `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`);
            }
            modal.querySelector(".modal-body")?.append(content);
            const actions = params.actions || [];
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
        }
        static byId(id) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Modal(el);
        }
    }
    _Modal_modal = new WeakMap();
    class Notification {
        constructor(el) {
            this.el = el;
            _Notification_toast.set(this, void 0);
            // @ts-ignore
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
        static create(content, options = {}) {
            const styleName = options.style || "default";
            const opts = {
                title: "",
                icon: "",
                subtitle: "",
                delay: options.dismissible ? 3000 : 0,
                position: "bottom-right",
                showProgress: true,
                stacking: true,
                ...options,
            };
            const style = _a.styles[styleName] || _a.styles.default;
            const containerEl = __classPrivateFieldGet(_a, _a, "m", _Notification_createToastContainer).call(_a, opts.position, styleName);
            const toastEl = document.createElement("div");
            const toastID = `toast-${++_a.count}`;
            toastEl.setAttribute("id", toastID);
            toastEl.setAttribute("role", "alert");
            toastEl.setAttribute("aria-live", "assertive");
            toastEl.setAttribute("aria-atomic", "true");
            toastEl.classList.add("toast", "align-items-center");
            style.border && toastEl.classList.add(style.border);
            toastEl.innerHTML = `
              <div class="toast-header ${style.main}">
                ${opts.icon}
                <strong class="me-auto">${opts.title}</strong>
                <small>${opts.subtitle}</small>
                <button type="button" class="btn-close ${style.btnClose}" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div class="toast-body position-relative">${contentAsText(content)}</div>
            `;
            if (!opts.stacking) {
                containerEl
                    .querySelectorAll(".toast")
                    .forEach((el) => el.remove());
            }
            containerEl.appendChild(toastEl);
            toastEl.dataset.bsDelay = String(opts.delay);
            toastEl.dataset.bsAutohide = String(opts.delay > 0);
            if (opts.delay && opts.showProgress) {
                const progressEl = __classPrivateFieldGet(_a, _a, "f", _Notification_createProgressBar).call(_a, opts, style);
                // reset progress bar to 100% on mouse enter
                toastEl.addEventListener("mouseenter", function () {
                    progressEl.style.animation = "none";
                    progressEl.style.width = "100%";
                });
                // restart progress bar animation on mouse leave
                toastEl.addEventListener("mouseleave", function () {
                    progressEl.style.animation = `reverseProgress ${opts.delay / 1000}s linear forwards`;
                });
                toastEl.querySelector(".toast-body")?.appendChild(progressEl);
            }
            return new _a(toastEl);
        }
        static byId(id) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new _a(el);
        }
    }
    _a = Notification, _Notification_toast = new WeakMap(), _Notification_createToastContainer = function _Notification_createToastContainer(position, style) {
        const containerID = `${this.containerClass}-${position}`;
        const container = document.getElementById(containerID);
        if (container)
            return container;
        const wrapper = document.createElement("div");
        const positionClasses = this.positions[position] || this.positions["bottom-right"];
        wrapper.classList.add("position-relative");
        wrapper.setAttribute("role", style === "danger" ? "alert" : "status");
        wrapper.setAttribute("aria-live", style === "danger" ? "assertive" : "polite");
        wrapper.setAttribute("aria-atomic", "true");
        wrapper.innerHTML = `<div id="${containerID}" class="toast-container position-fixed pb-1 ${positionClasses}"></div>`;
        document.body.appendChild(wrapper);
        return document.getElementById(containerID);
    };
    Notification.styles = {
        secondary: {
            btnClose: "btn-close-white",
            main: "text-white bg-secondary",
            border: "border-secondary",
            progress: "bg-secondary",
        },
        light: {
            btnClose: "",
            main: "text-dark bg-light border-bottom border-dark",
            border: "border-dark",
            progress: "bg-dark",
        },
        white: {
            btnClose: "",
            main: "text-dark bg-white border-bottom border-dark",
            border: "border-dark",
            progress: "bg-dark",
        },
        dark: {
            btnClose: "btn-close-white",
            main: "text-white bg-dark",
            border: "border-dark",
            progress: "bg-dark",
        },
        info: {
            btnClose: "btn-close-white",
            main: "text-white bg-info",
            border: "border-info",
            progress: "bg-info",
        },
        primary: {
            btnClose: "btn-close-white",
            main: "text-white bg-primary",
            border: "border-primary",
            progress: "bg-primary",
        },
        success: {
            btnClose: "btn-close-white",
            main: "text-white bg-success",
            border: "border-success",
            progress: "bg-success",
        },
        warning: {
            btnClose: "btn-close-white",
            main: "text-white bg-warning",
            border: "border-warning",
            progress: "bg-warning",
        },
        danger: {
            btnClose: "btn-close-white",
            main: "text-white bg-danger",
            border: "border-danger",
            progress: "bg-danger",
        },
        default: {
            btnClose: "",
            main: "",
            border: "",
            progress: "bg-primary",
        },
    };
    Notification.positions = {
        "top-left": "top-0 start-0 ms-1 mt-1",
        "top-center": "top-0 start-50 translate-middle-x mt-1",
        "top-right": "top-0 end-0 me-1 mt-1",
        "middle-left": "top-50 start-0 translate-middle-y ms-1",
        "middle-center": "top-50 start-50 translate-middle p-3",
        "middle-right": "top-50 end-0 translate-middle-y me-1",
        "bottom-left": "bottom-0 start-0 ms-1 mb-1",
        "bottom-center": "bottom-0 start-50 translate-middle-x mb-1",
        "bottom-right": "bottom-0 end-0 me-1 mb-1",
    };
    Notification.containerClass = "toast-container";
    Notification.count = 0;
    _Notification_createProgressBar = { value: function (opts, style) {
            const progressEl = document.createElement("div");
            progressEl.classList.add("progress-bar-timer", "position-absolute", "bottom-0", "start-0");
            progressEl.classList.add(style.progress);
            progressEl.style.height = "3px";
            progressEl.style.borderBottomLeftRadius = "0.25rem";
            progressEl.style.animation = `reverseProgress ${opts.delay / 1000}s linear forwards`;
            return progressEl;
        } };
    class Tooltip {
        constructor(el) {
            this.el = el;
            _Tooltip_tooltip.set(this, void 0);
            // @ts-ignore
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
        static create(content, props = { target: document.body }) {
            if (typeof content !== "string") {
                throw "Only string tooltips are supported";
            }
            props.target.dataset.bsTitle = content;
            if (props.position) {
                props.target.dataset.bsPlacement = props.position;
            }
            return new Tooltip(props.target);
        }
        static byId(id) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Tooltip(el);
        }
    }
    _Tooltip_tooltip = new WeakMap();
    class Popover {
        constructor(el) {
            this.el = el;
            _Popover_popover.set(this, void 0);
            // @ts-ignore
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
        static create(content, props = { target: document.body }) {
            props.target.dataset.bsContent =
                typeof content === "string" ? content : content.textContent;
            props.target.dataset.bsHtml = "true";
            if (props.title) {
                props.target.dataset.bsTitle = props.title;
            }
            if (props.trigger) {
                props.target.dataset.bsTrigger = props.trigger;
            }
            return new Popover(props.target);
        }
        static byId(id) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Popover(el);
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
                applyAttrs(btn, params.attrs);
            }
            if (params.props) {
                applyProps(btn, params.props);
            }
            if (params.on) {
                applyListeners(btn, params.on);
            }
            [];
            return btn;
        },
        modal: Modal.create,
        getModal: Modal.byId,
        notification: Notification.create,
        getNotification: Notification.byId,
        tooltip: Tooltip.create,
        getTooltip: Tooltip.byId,
        popover: Popover.create,
        getPopover: Popover.byId,
    };
    ckan.sandbox.setup((sb) => {
        sb.ui = sb.ui || {};
        Object.assign(sb.ui, ui);
    });
})(window.ckan);
