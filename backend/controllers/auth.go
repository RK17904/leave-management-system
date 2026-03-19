package controllers

import (
	"net/http"
	"os"
	"time"

	"backend/config"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// key to sign to JWT
var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// register
func Register(c *gin.Context) {
	var input models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//hash password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash Password"})
		return
	}

	//replace the pain text with secure password
	input.Password = string(hashedPassword)

	//save user to the databse
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Email alredy exists or failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered Sussessfully!"})

}

// login
func Login(c *gin.Context) {
	//grabbing email, password from frontend
	var input struct {
		Email    string `jason:"email"`
		Password string `jason:"passord"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//find the user by email
	var user models.User
	if err := config.DB.Where("email =?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	//generates JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role,

		"exp": jwt.NewNumericDate(time.Now().Add(time.Hour * 24)), //expires in 24 hours
	})

	//sign the token with secret key
	secret := jwtSecret
	if len(secret) == 0 {
		secret = []byte("super_secret_fallback_key")
	}

	tokenString, err := token.SignedString(secret)
	if err != nil {
		//error msg
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT Error: " + err.Error()})
		return
	}

	//send the token and user details back to react
	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
