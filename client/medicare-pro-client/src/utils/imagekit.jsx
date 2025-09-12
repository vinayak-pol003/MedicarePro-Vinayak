// src/utils/ImageKit.jsx (or .js if you don't use JSX in utils)
import ImageKit from "imagekit-javascript";

// Replace these with your actual dashboard details!
const imagekit = new ImageKit({
  publicKey: "public_/LMHRfQH4IwSargVU+PyHsvO3iE=",    // ImageKit dashboard PUBLIC key
  urlEndpoint: "https://ik.imagekit.io/go9hgurl3",     // Your ImageKit dashboard URL endpoint
  authenticationEndpoint: "http://localhost:5000/api/imagekit-auth" // Your backend endpoint (must respond with token, signature, expire)
});

export default imagekit;
