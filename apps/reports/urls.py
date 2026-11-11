from rest_framework.routers import DefaultRouter
from .views import DashboardSnapshotViewSet

router = DefaultRouter()
router.register("snapshots", DashboardSnapshotViewSet)
urlpatterns = router.urls
