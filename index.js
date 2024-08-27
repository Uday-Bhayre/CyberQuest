// const express = require('express');
// const app = express();
// const userRoutes  = require('./Routes/userRoutes');
// const profileRoutes = require('./Routes/profileRoutes');
// const contentRoutes = require('./Routes/contentRoutes');

// const database = require("./Config/Database");
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const cloudinaryConnect = require('./Config/Cloudinary');
// const fileUpload = require('express-fileupload') 

// require("dotenv").config();
// const PORT = process.env.PORT || 4000;

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());

// app.use(
//     fileUpload(
//         {
//             useTempFiles : true,
//             tempFileDir:"/temp",
//         }
//     )
// );
// cloudinaryConnect();
// database.dbConnect();

// // routes mount
// app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/content", contentRoutes);

// // default route
// app.get("/", (req, res) => {
//     res.send('<h2>Welcome,</h2> <p>Start your journey with <b>CyberQuest</b></p>');
// });

// app.listen(PORT, ()=>{
//     console.log(`Server running on PORT ${PORT}`);
// });



const express = require('express');
const app = express();
const userRoutes  = require('./Routes/userRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const contentRoutes = require('./Routes/contentRoutes');

const database = require("./Config/Database");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinaryConnect = require('./Config/Cloudinary');
const fileUpload = require('express-fileupload');

require("dotenv").config();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
    origin:'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp",
    })
);
cloudinaryConnect();
database.dbConnect();

// routes mount
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/content", contentRoutes);

// default route
app.get("/", (req, res) => {
    res.send('<h2>Welcome,</h2> <p>Start your journey with <b>CyberQuest</b></p>');
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
