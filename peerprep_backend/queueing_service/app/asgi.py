import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import path
from .consumers.consumer import MatchingConsumer

# Standard Django ASGI application for HTTP
django_asgi_app = get_asgi_application()

websocket_urlpatterns = [
    path("ws/matching/", MatchingConsumer.as_asgi()),
]

# Protocol router for HTTP + WebSockets
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})