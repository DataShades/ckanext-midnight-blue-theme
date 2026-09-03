from __future__ import annotations

from typing_extensions import override

import ckan.plugins as p
import ckan.plugins.toolkit as tk

from ckanext.theming.interfaces import ITheme
from ckanext.theming.lib import Theme
from ckanext.theming.plugin import ThemingMixin

from ckanext.midnight_blue_theme.themes.mbp.theme import make_theme

from . import helpers


@tk.blanket.helpers(helpers.get_helpers)
class MidnightBlueThemePlugin(ThemingMixin, ITheme, p.SingletonPlugin):
    @override
    def register_themes(self) -> list[Theme]:
        return super().register_themes() + [make_theme()]
