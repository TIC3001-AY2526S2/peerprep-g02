from .services.matchingService import MatchingService

matching_service = MatchingService()

async def app():
    await matching_service.start()