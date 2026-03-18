package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// db global databse connection
var DB *gorm.DB

func ConnectDatabase() {
	//load env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Could not load .env file")
	}

	//connection string
	dsn := os.Getenv("DATABASE_URL")

	//coonect postgre using GROM
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		// fails, log the error and crash
		log.Fatal("Failed to connect database: ", err)
	}

	//assign connection to global DB
	DB = database
	log.Println("Successfully connected to Neon Databse")
}
