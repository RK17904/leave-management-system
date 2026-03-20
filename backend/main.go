package main

import (
	"fmt"
	"net/http"
	"os"

	"backend/config" //cofig folder

	"backend/models" //models folder

	"backend/routes" //routes imports

	"github.com/gin-contrib/cors" //CORS library
	"github.com/gin-gonic/gin"
)

func main() {
	//test
	fmt.Println("Testing env URL:", os.Getenv("DATABASE_URL"))
	//conect to the database
	config.ConnectDatabase()

	// auto migrate the leave model
	//automatically creates/ updates the leaves model, user
	config.DB.AutoMigrate(&models.User{}, &models.Leave{})

	//initalize gin router
	router := gin.Default()

	//custom CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, //allow react frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	//connect custom routes
	routes.SetupRoutes(router)

	// simple test route
	// GET /api/health  to run function
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "Leave management API is running",
		})
	})

	//start the server
	router.Run(":8080")
}
