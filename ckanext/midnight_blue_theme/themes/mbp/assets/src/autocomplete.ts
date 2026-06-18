/// <reference path="../../../../../../../ckanext-theming/types.d.ts" />

export class Autocomplete implements IAutocomplete {
  constructor(public el: HTMLElement, public instance: any) {}

  select(value: string, label?: string) {
    const $el = (window as any).jQuery(this.el);
    const isMultiple = this.instance.options.tags || $el.prop("multiple");
    
    if (isMultiple) {
      let values = $el.val() || [];
      if (!Array.isArray(values)) {
        values = [values];
      }
      if (!values.includes(value)) {
        if ($el.find(`option[value="${value}"]`).length === 0) {
          const option = new Option(label || value, value, true, true);
          $el.append(option);
        }
        values.push(value);
        $el.val(values).trigger("change");
      }
    } else {
      if ($el.find(`option[value="${value}"]`).length === 0) {
        const option = new Option(label || value, value, true, true);
        $el.append(option);
      }
      $el.val(value).trigger("change");
    }
  }

  unselect(value: string) {
    const $el = (window as any).jQuery(this.el);
    const isMultiple = this.instance.options.tags || $el.prop("multiple");

    if (isMultiple) {
      let values = $el.val() || [];
      if (!Array.isArray(values)) {
        values = [values];
      }
      const index = values.indexOf(value);
      if (index !== -1) {
        values.splice(index, 1);
        $el.val(values).trigger("change");
      }
    } else {
      if ($el.val() === value) {
        $el.val(null).trigger("change");
      }
    }
  }

  onchange(callback: (values: string[]) => void) {
    const $el = (window as any).jQuery(this.el);
    $el.on("change", () => {
      let val = $el.val();
      if (val === null || val === undefined) {
        callback([]);
      } else if (Array.isArray(val)) {
        callback(val);
      } else {
        callback([val]);
      }
    });
  }

  destroy() {
    const $el = (window as any).jQuery(this.el);
    if ($el.data("select2")) {
      $el.select2("destroy");
    }
    if (typeof this.instance.teardown === "function") {
      this.instance.teardown();
    }
    // Remove from ckan.module.instances
    const instances = (window as any).ckan.module.instances["autocomplete"] || [];
    const idx = instances.indexOf(this.instance);
    if (idx !== -1) {
      instances.splice(idx, 1);
    }
  }

  static create(
    element: HTMLElement | string,
    params: Theming.IAutocompleteParams = {},
  ): Autocomplete {
    const el = typeof element === "string"
      ? (document.getElementById(element) || document.querySelector(element)) as HTMLElement
      : element;

    if (!el) {
      throw new Error("Autocomplete element not found");
    }

    const existing = Autocomplete.byId(el);
    if (existing) {
      return existing;
    }

    el.setAttribute("data-module", "autocomplete");
    if (params.source) el.setAttribute("data-module-source", params.source);
    if (params.allowMultiple !== undefined) el.setAttribute("data-module-tags", String(params.allowMultiple));
    if (params.allowNew !== undefined) el.setAttribute("data-module-createtags", String(params.allowNew));
    if (params.idKey) el.setAttribute("data-module-key", params.idKey);
    if (params.labelKey) el.setAttribute("data-module-label", params.labelKey);
    if (params.separator) el.setAttribute("data-module-tokensep", params.separator);
    if (params.minChars !== undefined) el.setAttribute("data-module-minimum-input-length", String(params.minChars));
    if (params.debounce !== undefined) el.setAttribute("data-module-interval", String(params.debounce));

    // Programmatically initialize CKAN module
    (window as any).ckan.module.initializeElement(el);

    const newInstance = Autocomplete.byId(el);
    if (!newInstance) {
      throw new Error("Failed to initialize autocomplete module");
    }
    return newInstance;
  }

  static byId(id_or_el: string | HTMLElement): Autocomplete | null {
    const el = typeof id_or_el === "string"
      ? (document.getElementById(id_or_el) || document.querySelector(id_or_el)) as HTMLElement
      : id_or_el;

    if (!el) {
      return null;
    }

    const instances = (window as any).ckan.module.instances["autocomplete"] || [];
    const instance = instances.find((inst: any) => inst.el[0] === el);
    if (instance) {
      return new Autocomplete(el, instance);
    }
    return null;
  }
}
