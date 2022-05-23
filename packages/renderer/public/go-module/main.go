package main

import (
	"context"
	"fmt"

	"golang.design/x/clipboard"
)

func main() {
	go text()
	image()
}

func text() {
	val := clipboard.Watch(context.Background(), clipboard.FmtText)
	for val := range val {
		print(val)
		fmt.Println("text")
	}
}
func image() {
	val := clipboard.Watch(context.Background(), clipboard.FmtImage)
	for val := range val {
		print(val)
		fmt.Println("image")
	}
}
