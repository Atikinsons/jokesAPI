let http = require("http")
let path = require("path")
let fs = require("fs")

let dataPath = path.join(__dirname, "data")

let server = http.createServer((req,res)=>{
    switch(req.url){
        case "/jokes":
            if(req.method =='GET') getJokes(req,res)
            if(req.method == "POST") addJoke(req,res)
            break
        default:
            notFound(req, res)
    }
})

server.listen(3000, ()=> console.log("server started on port 3000. http://localhost:3000"))

function notFound(req,res){
    res.statusCode = 404
    res.end()
}

function getJokes(req, res){
    let jokesFiles = fs.readdirSync(dataPath)
    let jokes = []
    for(let i = 0; i < jokesFiles.length; i++){
        let pathToFile = path.join(dataPath, jokesFiles[i])
        let binary = fs.readFileSync(pathToFile)
        let text =  Buffer.from(binary).toString()
        let obj = JSON.parse(text)
        obj.id = 1
        jokes.push(obj)
    }
    res.writeHead(200,{"content-type": "application/json"})
    res.end(JSON.stringify(jokes))
}

function addJoke(req, res){
    data = ""
    req.on("data", chunk => data += chunk)
    req.on("end", ()=>{
        data = JSON.parse(data)
        data.likes = 0
        data.dislikes = 0
        let dir = fs.readdirSync(dataPath)
        let fileName = dir.length + ".json"
        fs.writeFileSync(
            path.join(dataPath, fileName),
            JSON.stringify(data))
        console.log(data)
        res.end()
    })
}