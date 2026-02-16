class RefreshTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if hasattr(request, 'refresh_token') and request.refresh_token:
            response.set_cookie(
                key='refresh_token',
                value=request.refresh_token,
                httponly=True,
                samesite='Lax', # Or 'Strict' depending on requirements
                secure=False, # Set to True in production (requires HTTPS)
                max_age=7 * 24 * 60 * 60 # 7 days
            )
            
        return response
