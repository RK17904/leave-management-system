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
		//register, logins
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)

		//leaves
		api.POST("/leaves", controllers.CreateLeave)
		api.GET("/leaves", controllers.GetLeaves)

		//PUT id parameter in URL
		api.PUT("/leaves/:id/status", controllers.UpdateLeaveStatus)

		//update users from admin dashboard
		router.GET("/api/users", controllers.GetAllUsers)
		router.PUT("/api/users/:id", controllers.UpdateUser)
		router.DELETE("/api/users/:id", controllers.DeleteUser)
	}

}
