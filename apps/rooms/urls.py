from rest_framework.routers import DefaultRouter
from .views import AllocationViewSet, BedViewSet, RoomViewSet

router = DefaultRouter()
router.register("rooms", RoomViewSet)
router.register("beds", BedViewSet)
router.register("allocations", AllocationViewSet)
urlpatterns = router.urls
