from rest_framework.routers import DefaultRouter
from .views import FeeViewSet, PaymentViewSet

router = DefaultRouter()
router.register("fees", FeeViewSet)
router.register("payments", PaymentViewSet)
urlpatterns = router.urls
