package controllers

import (
	"net/http"

	"backend/config"
	"backend/models"

	"github.com/gin-gonic/gin"
)

// CreateLeave handles
// POST requests to add new leave
func CreateLeave(c *gin.Context) {
	var input models.Leave

	//grab the JSON from the request body
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//save to PostgreSQL
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save leave request"})
		return
	}

	//send success response
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

// GetLeaves handles
// GET requests to fetch all leaves
func GetLeaves(c *gin.Context) {
	var leaves []models.Leave

	//find records in leaves table
	config.DB.Find(&leaves)

	//send as JSON response
	c.JSON(http.StatusOK, gin.H{"data": leaves})
}
