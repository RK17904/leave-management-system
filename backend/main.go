package main

import (
	"fmt"
	"net/http"
	"os"

	//cofig folder
	"backend/config"

	"github.com/gin-gonic/gin"
)

func main() {
	//test
	fmt.Println("Testing env URL:", os.Getenv("DATABASE_URL"))
	//conect to the database
	config.ConnectDatabase()

	//initalize gin router
	router := gin.Default()

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
