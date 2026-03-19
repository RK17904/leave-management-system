package models

import (
	"gorm.io/gorm"
)

// user databse fot admins and employees
type User struct {
	gorm.Model

	Name     string `json:"name" gorm:"not null"`
	Email    string `json:"email" gorm:"unique;not null"`
	Password string `json:"-" gorm:"not null"`               // "-" hides password from json response
	Role     string `jason:"role" gorm:"default:'employee'"` //admin or emloyee

}
