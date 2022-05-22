package main

import (
	"fmt"
	// "os"

	"github.com/go-vgo/robotgo"
)

func main() {
	// arg_list := make([]string, 0)
	// for key, val := range os.Args {
	// 	if key != 0 {
	// 		arg_list = append(arg_list, val)
	// 	}
	// }

	for {
		ok := robotgo.AddEvents("c", "command")
		if ok {
			fmt.Println("pass")
		}
	}
}
