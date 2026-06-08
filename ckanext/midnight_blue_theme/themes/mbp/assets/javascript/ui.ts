/// <reference path="../../../../../../../ckanext-theming/types.d.ts" />

((ckan) => {
    function applyAttrs(el: HTMLElement, attrs: { [key: string]: string }) {
        Object.entries(attrs).forEach(([key, value]) =>
            el.setAttribute(key, value),
        );
    }
    function applyProps(el: HTMLElement, props: { [key: string]: any }) {
        Object.entries(props).forEach(
            ([key, value]) => ((el as any)[key] = value),
        );
    }

    function applyListeners(
        el: HTMLElement,
        listeners: {
            [key: string]: Theming.Listener | Theming.ComplexListener;
        },
    ) {
        Object.entries(listeners).forEach(([key, value]) => {
            if (typeof value == "function") {
                el.addEventListener(key, value);
            } else {
                el.addEventListener(key, value.listener, value.options);
            }
        });
    }

    function contentAsText(
        content: Theming.Content,
        allowHtml = false,
    ): string {
        return typeof content === "string"
            ? content
            : content instanceof HTMLElement && allowHtml
              ? content.innerHTML
              : content.textContent || "";
    }

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

        static create(
            content: Theming.Content,
            params: Theming.IModalParams = {},
        ) {
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

            if (params.title) {
                modal
                    .querySelector(".modal-header")
                    ?.insertAdjacentHTML(
                        "beforeend",
                        `<h5 class="modal-title">${params.title}</h5>`,
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

            const actions = params.actions || [];
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
        }

        static byId(id: string): Modal | null {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Modal(<HTMLElement>el);
        }
    }

    class Notification implements INotification {
        static styles: Record<
            string,
            {
                btnClose: string;
                main: string;
                border: string;
                progress: string;
            }
        > = {
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

        static positions: Record<string, string> = {
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
        static containerClass: string = "toast-container";

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

        static #createToastContainer(position: string, style: string) {
            const containerID = `${this.containerClass}-${position}`;
            const container = document.getElementById(containerID);

            if (container) return container;

            const wrapper = document.createElement("div");
            const positionClasses =
                this.positions[position] || this.positions["bottom-right"];

            wrapper.classList.add("position-relative");
            wrapper.setAttribute(
                "role",
                style === "danger" ? "alert" : "status",
            );
            wrapper.setAttribute(
                "aria-live",
                style === "danger" ? "assertive" : "polite",
            );
            wrapper.setAttribute("aria-atomic", "true");

            wrapper.innerHTML = `<div id="${containerID}" class="toast-container position-fixed pb-1 ${positionClasses}"></div>`;
            document.body.appendChild(wrapper);
            return document.getElementById(containerID)!;
        }

        static count: number = 0;

        static create(
            content: Theming.Content,
            options: Theming.INotificationParams = {},
        ) {
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

            const style =
                Notification.styles[styleName] || Notification.styles.default!;
            const containerEl = Notification.#createToastContainer(
                opts.position,
                styleName,
            );

            const toastEl = document.createElement("div");
            const toastID = `toast-${++Notification.count}`;

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
                const progressEl = Notification.#createProgressBar(opts, style);

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

            return new Notification(toastEl);
        }

        static #createProgressBar = function (opts, style) {
            const progressEl = document.createElement("div");

            progressEl.classList.add(
                "progress-bar-timer",
                "position-absolute",
                "bottom-0",
                "start-0",
            );
            progressEl.classList.add(style.progress);

            progressEl.style.height = "3px";
            progressEl.style.borderBottomLeftRadius = "0.25rem";
            progressEl.style.animation = `reverseProgress ${opts.delay / 1000}s linear forwards`;

            return progressEl;
        };

        static byId(id: string) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Notification(el);
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

        static create(
            content: Theming.Content,
            props: Theming.ITooltipParams = { target: document.body },
        ): Tooltip {
            if (typeof content !== "string") {
                throw "Only string tooltips are supported";
            }
            props.target.dataset.bsTitle = content;
            if (props.position) {
                props.target.dataset.bsPlacement = props.position;
            }
            return new Tooltip(props.target);
        }
        static byId(id: string) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Tooltip(el);
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

        static create(
            content: Theming.Content,
            props: Theming.IPopoverParams = { target: document.body },
        ): Popover {
            props.target.dataset.bsContent =
                typeof content === "string" ? content : content.textContent!;
            props.target.dataset.bsHtml = "true";
            if (props.title) {
                props.target.dataset.bsTitle = props.title;
            }
            if (props.trigger) {
                props.target.dataset.bsTrigger = props.trigger;
            }

            return new Popover(props.target);
        }
        static byId(id: string) {
            const el = document.getElementById(id);
            if (!el) {
                return null;
            }
            return new Popover(el);
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
