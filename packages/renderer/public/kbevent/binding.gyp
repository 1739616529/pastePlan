{
"targets": [
    {
      "target_name": "kbhook",
      "sources": [ "kbhook.cc" ],
      "conditions:": [
         ["OS=='win'",{
           "libraries": ["-lnode.lib"]
         }]
      ]
    },
  ]
}