# OnePlate Cloud
## 📝 Introduction
This is a frontend and backend application designed to manage image storage for the OnePlate app on a self-hosted server.
It allows users to conveniently upload and manage images through a secure, GUI-based web interface.

## 📌 Details
### 🔧 Purpose
The primary goal of this project is to provide an easy and intuitive way to manage images stored on a personal server. Instead of relying on terminal-based file management, this app offers a web-based interface for improved usability.

### 💻 Tech Stack
- Frontend: React with Vite
- Backend: Express.js
- Image Processing: sharp library
- Security: API key authentication & server-level basic auth

### 📁 Frontend
The frontend is a web interface that helps users manage stored images without using command-line tools. It's particularly useful for environments where non-technical users may need access to the image storage system or when visual confirmation is necessary.

![image](https://github.com/user-attachments/assets/ad6e92cd-f123-439b-9b92-b66d000187b4)

### 🛠 Backend
The backend uses Express.js to handle API requests. To conserve limited server disk space, images are compressed and resized using the sharp library during the upload process.

To prevent unauthorized uploads, the backend requires an API key for image upload requests. This adds a layer of security to the system beyond the basic auth used for web access.

### 🔐 Security
The management site itself is protected by server-level Basic Authentication, meaning users must enter a password before they can even reach the GUI.
Additionally, uploading images through the API requires a valid API key, helping prevent misuse and unauthorized access.

![image](https://github.com/user-attachments/assets/1782b786-e334-438e-befb-4bbfd1d51e56)
