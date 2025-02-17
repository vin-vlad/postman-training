# Express.js Training API

This is a training project to learn different types of API requests using Express.js, MongoDB, JWT authentication, file uploads, and Swagger documentation.

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
   ```

## API Documentation

Swagger documentation is available at:

```
GET /docs
```

Visit `http://localhost:3000/docs` to view and test API endpoints interactively.

## API Endpoints

### Basic Requests

#### Get all items

```http
GET /items
```

*Response:*

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

*Request Body:*

```json
{
  "name": "New Item"
}
```

*Response:*

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

*Response:*

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

*Request Body:*

```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

*Response:*

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

*Response:*

```json
{
  "message": "Protected content",
  "user": "testuser"
}
```

### Query Parameters

#### Search items by name

```http
GET /search?name=Item
```

*Response:*

```json
[
  { "_id": "123", "name": "Item 1" },
  { "_id": "456", "name": "Item 2" }
]
```

### File Upload

#### Upload a file

```http
POST /upload
Content-Type: multipart/form-data
```

*Request:* Upload a file under the field `file` *Response:*

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
- Swagger UI for API documentation

## Available Commands

- Install dependencies: `npm install`
- Start the server: `npm start`
- Run in development mode (if nodemon is installed): `npm run dev`

## License

This project is for training purposes. Feel free to use and modify it.

