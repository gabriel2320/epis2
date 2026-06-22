from epis2_api.schemas.common import APIModel


class HealthCheck(APIModel):
    status: str
    service: str
    environment: str
