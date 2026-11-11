from rest_framework.routers import DefaultRouter
from .views import HostelViewSet

router = DefaultRouter()
router.register("", HostelViewSet)
urlpatterns = router.urls
