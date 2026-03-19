package models

import (
	"time"

	"gorm.io/gorm"
)

//database table schema

type Leave struct {
	gorm.Model //automatically adds ID, CreatedAt, UpdatedAt, DeletedAt cols

	EmployeeName string    `json:"employee_name" gorm:"not null"` //required
	LeaveType    string    `json:"leave_type" gorm:"not null"`    // stick, annual, casual
	StartDate    time.Time `json:"start_date" gorm:"not null"`
	EndDate      time.Time `json:"end_date" gorm:"not null"`
	Reason       string    `json:"reason"`
	Status       string    `json:"status" gorm:"default:'Pending'"` //pending, approved, rejected

}
