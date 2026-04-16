
ALLOWED_HOSTS = ["*"]
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    "channels",
    "app",  # your app with consumer
]
DATABASES={}
ROOT_URLCONF="app.urls"
ASGI_APPLICATION = "app.asgi.django_asgi_app"