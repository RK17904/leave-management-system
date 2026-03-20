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

// UpdateLeaveStatus
// handles PUT requests (approve, reject leave)
func UpdateLeaveStatus(c *gin.Context) {
	//grab the id from URL (/api/leaves/1/status)
	leaveID := c.Param("id")

	//catch the incoming status update
	var input struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//validate the status string
	if input.Status != "Approved" && input.Status != "Rejected" && input.Status != "Pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be Approved, Rejected, or Pending"})
		return
	}

	//find the exact leave request fron db
	var leave models.Leave
	if err := config.DB.First(&leave, leaveID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Leave request not found"})
		return
	}

	//update the status and save to db
	leave.Status = input.Status
	config.DB.Save(&leave)

	//send the updated record to frontend
	c.JSON(http.StatusOK, gin.H{"data": leave})
}
