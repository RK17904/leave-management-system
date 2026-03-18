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
	StartDate    time.Time `jason:"start_date" gorm:"not null"`
	EndDate      time.Time `jason:"end_date" gorm:"not null"`
	Reason       string    `jason:"reason"`
	Status       string    `jason:"status" gorm:"default:'pending'"` //pending, approved, rejected

}
