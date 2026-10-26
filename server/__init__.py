from ayon_server.addons import BaseServerAddon

from typing import Any

class AddonFullTemplate(BaseServerAddon):
    settings_model = None
    addon_type = "server"
    frontend_modules = {
        "comments": [
            "CommentsModalApp",
            # contributions to slots (frontend/src/manifest.ts)
            "manifest",
        ],
    }
