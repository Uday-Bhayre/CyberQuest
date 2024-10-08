const cloudinary = require('cloudinary')

const cloudinaryConnect = () =>{
    try{
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.API_KEY,
            api_secret : process.env.API_SECRET,
        });
        console.log('Cloudinary connected');
    }catch(e){
        console.log('Error in connecting to cloudinary');
    }
}

module.exports = cloudinaryConnect;