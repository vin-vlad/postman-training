# Express.js Training API

This is a training project to learn different types of API requests using Express.js, MongoDB, JWT authentication, and file uploads.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/express-training-api.git
   cd express-training-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. create ```.env``` file with content
```
DB_USERNAME=
DB_PASSWORD=
```


4. Run the server:
   ```sh
   npm start
   or
   node app.js
   ```

## API Endpoints

### Basic Requests

#### Get all items
```http
GET /items
```
_Response:_
```json
[
  { "_id": "123", "name": "Item 1" },
  { "_id": "456", "name": "Item 2" }
]
```

#### Add a new item
```http
POST /items
Content-Type: application/json
```
_Request Body:_
```json
{
  "name": "New Item"
}
```
_Response:_
```json
{
  "_id": "789",
  "name": "New Item"
}
```

#### Delete an item
```http
DELETE /items/:id
```
_Response:_
```json
{
  "message": "Item deleted"
}
```

### Authentication Requests

#### Login
```http
POST /login
Content-Type: application/json
```
_Request Body:_
```json
{
  "username": "testuser",
  "password": "testpassword"
}
```
_Response:_
```json
{
  "token": "your_jwt_token"
}
```

### Protected Routes

#### Access protected content
```http
GET /protected
Authorization: Bearer your_jwt_token
```
_Response:_
```json
{
  "message": "Protected content",
  "user": "testuser"
}
```

### File Upload NOT YET IMPLEMENTED

#### Upload a file
```http
POST /upload
Content-Type: multipart/form-data
```
_Request:_ Upload a file under the field `file`
_Response:_
```json
{
  "message": "File uploaded",
  "filename": "uploaded_file_name"
}
```

## Dependencies
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- Multer (for file uploads)

## Available Commands
- Install dependencies: `npm install`
- Start the server: `npm start`
- Run in development mode (if nodemon is installed): `npm run dev`

## License
This project is for training purposes. Feel free to use and modify it.

