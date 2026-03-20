package models

import (
	"time"

	"gorm.io/gorm"
)

//database table schema

type Leave struct {
	gorm.Model //automatically adds ID, CreatedAt, UpdatedAt, DeletedAt cols

	EmployeeName string    `json:"employeeName" gorm:"not null"` // required
	LeaveType    string    `json:"leaveType" gorm:"not null"`    // sick, annual, casual
	StartDate    time.Time `json:"startDate" gorm:"not null"`
	EndDate      time.Time `json:"endDate" gorm:"not null"`
	Reason       string    `json:"reason"`
	Status       string    `json:"status" gorm:"default:'Pending'"` // pending, approved, rejected
}
