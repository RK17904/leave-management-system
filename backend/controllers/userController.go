package controllers

import (
	"backend/config" //database connection
	"backend/models" //user struct
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /api/users
func GetAllUsers(c *gin.Context) {
	var users []models.User

	//config db to talk neon
	if err := config.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// DELETE /api/users/:id
func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.User{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// PUT /api/users/:id
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	//find user
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	//grab data from frontend
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//save updates
	config.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully", "data": user})
}
