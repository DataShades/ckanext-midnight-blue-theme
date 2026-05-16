[![Tests](https://github.com/datashades/ckanext-midnight-blue-theme/workflows/Tests/badge.svg?branch=main)](https://github.com/datashades/ckanext-midnight-blue-theme/actions)

# ckanext-midnight-blue-theme

Portable version of CKAN's midnight blue theme that uses
[ckanext-theming](https://github.com/DataShades/ckanext-theming).


## Requirements

Compatibility with core CKAN versions:

| CKAN version     | Compatible? |
|------------------|-------------|
| 2.11 and earlier | no          |
| 2.12             | yes         |


## Installation

To install ckanext-midnight-blue-theme:

1. Install the extension

    ```sh
    git clone https://github.com/DataShades/ckanext-midnight-blue-theme.git
    cd ckanext-midnight-blue-theme
    pip install -e .
    ```

1. Add `theming` and `midnight_blue_theme` to the `ckan.plugins` setting in
   your CKAN config file.

1. Use `midnight-blue-portable` as a value ckanext-theming's `ckan.ui.theme`:

    ```ini
    ckan.ui.theme = midnight-blue-portable
    ```

Note, this extension requires ckanext-theming, but does not pins it to specific
version. Consider adding `ckanext-theming==X.Y.Z` to requirements of your
project.

## Details

The theme implementation is close to the midnight blue theme from CKAN
core. Tha main difference is that this theme follows
[ckanext-theming](https://github.com/DataShades/ckanext-theming) workflow. It
provides and uses UI macros instead of inline HTML for standard components.

Bellow is the list of things that this plugin does differently comparint to the
midnight-blue from CKAN core:

* primary block does not use CSS float. Instead if relies on Bootstrap5 `col`
  class.
* `page.html` uses layouts suggested in [this
  PR](https://github.com/ckan/ckan/pull/9330). Try adding `{% block page_layout
  %}no-sidebar{% endblock %}` to any page to hide sidebar, or use `sidebar-end`
  value of the layout block to move sidebar to the other side of the page.
* field errors reported using Bootstrap5 native styles for errors. Main
  differences: there is no red background for error text, instead, the text
  itself uses red color; fields with errors have red outline.
* the whole block `header_account_notlogged` is not rendered if user is logged
  in. In the original theme, block is rendered without content.


## License

[AGPL](https://www.gnu.org/licenses/agpl-3.0.en.html)
