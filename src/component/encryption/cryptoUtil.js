import CryptoJS from "crypto-js";

// Your secret key (use VITE_ env for security if needed)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "my-very-secure-key";

// Encrypt to base64 AES string
export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// Decrypt back to plain text
export const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};
