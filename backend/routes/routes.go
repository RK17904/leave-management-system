package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

// SetupRoutes
// connect URL to controller functions
func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.POST("/leaves", controllers.CreateLeave)
		api.GET("/leaves", controllers.GetLeaves)
	}

}
