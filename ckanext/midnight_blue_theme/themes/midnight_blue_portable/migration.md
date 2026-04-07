* copy {templates,public}-midnight-blue into midnight-blue-portable theme
* split public into assets and public(optional, simplifies theme registration)
* register midnight-blue-portable theme
* MILESTIONE. Application starts, but UI is broken. Also CLI reports that webasset cannot be found.
* aggregate all webassets into single file(javascript, css, vendor). now all assets have name `theming/midnight-blue-portable/*`.
  * `main` CSS asset renamed to css-main. `main` JS asset remains unchanged
  * make sure you replace `vendor/` and `base/` prefixes under `preload` with the new `theming/midnight-blue-portable/` prefix
* replace `asset theme` in base.html with `theming/midnight-blue-portable/css-main` (conditionally with `-rtl` sufix)
* MILESTIONE. CKAN UI is restored and looks normal.
* add templates/macros/ui.html and ui/ subfolder. Comment all macros inside ui.html and enable them one by one
* enable subtitle_item macro and update `block subtitle` everywhere.
* rewrite footer. I got container/grid/row/column, list/list_item, icon, link, form_*, select_*, footer* components here.
* rewrite header. Here you'll get few *nav_wrapper and *nav_item components, as well as header/account.
* use `ckan theme component check` to identify missing components and implement them.
