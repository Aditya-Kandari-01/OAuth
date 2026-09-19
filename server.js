import app from "./src/app.js";
import connectDb from "./src/config/database.js";

connectDb()

app.listen(10000,()=>{
    console.log("Server is running on port 10000")
})
