# Book Review API

A simple Node.js and Express-based REST API for managing books, authors, and reviews.

---

## Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **API Style**: RESTful

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or in the cloud)

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YogindraChaudhari/Book-Review-Api.git
cd book-review-api
```

2. **Install Dependencies**

```bash
npm install
```

3. **Start the server**

```bash
npm start
```

---

## Api Request (Postman)

### 1. `POST` `/signup` - Register a new user

```
http://localhost:3000/signup
```

Go to > Body > Raw

Add Below `JSON` data

```json
{
  "username": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "12345678"
}
```

Click on "Send"

---

### 2. `POST` `/login` - Authenticate and return a token

```
http://localhost:3000/login
```

Go to > Body > Raw

Add Below `JSON` data

```json
{
  "email": "johndoe@gmail.com",
  "password": "12345678"
}
```

Click on "Send"

---

### 3. `POST` `/books` - Add a new book (Authenticated users only)

```
http://localhost:3000/books/
```

Step 1 : Go to > Auth > Auth Type: Bearer Token > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Step 2 : Go to > Body > Raw

Add Below `JSON` data

```json
{
  "title": "Book001",
  "author": "Author01",
  "genre": "Technology",
  "description": "Book about science and technology",
  "publishedYear": "2025",
  "createdBy": "your_user_id"
}
```

Click on "Send"

---

### 4. `GET` `/books` - Get all books (with pagination and optional fi lters by author and genre)

```
http://localhost:3000/books/
```

Go to > Auth > Auth Type : "Bearer Token" > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Click on "Send"

---

### 5. `GET` `/books/:id` - Get book details by ID, including:

- **Average rating**,
- **Reviews (with pagination)**

```
http://localhost:3000/books/<:id>
```

Note : Inside "< : id>", enter book id which is generated when performed the `"POST /books"` method.

Go to > Auth > Auth Type: Bearer Token > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Click on "Send"

---

### 6. `POST` `/books/:id/reviews` - Submit a review (Authenticated users only, one review per user per book)

```
http://localhost:3000/books/<:id>/reviews
```

Note : Inside "< : id>", enter book id which is generated when performed the `"POST /books"`method.

Step 1: Step 2 : Go to > Body > Raw

Add Below `JSON` data

```json
{
  "bookId": "<:id>",
  "userId": "your_user_id",
  "rating": 4,
  "comment": "Book01 is really good"
}
```

Note : "your_user_id" will be generated when performed step of `"POST /login"` OR `"POST /signup"`

Step 2: Go to > Auth > Auth Type: Bearer Token > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Click on "Send"

---

### 7. `PUT` `/reviews/:id` - Update your own review

```
http://localhost:3000/reviews/<:review_id>
```

Note : Inside "< : review_id>", enter review id which is generated when performed the `"POST /books/:id/reviews"` method.

Step 1: Step 2 : Go to > Body > Raw

Add Below JSON data

```json
{
  "bookId": "<:id>",
  "userId": "your_user_id",
  "rating": 5,
  "comment": "Updated Rating And Review for Book001"
}
```

Note : "your_user_id" will be generated when performed step of `"POST /login"` OR `"POST /signup"`

Step 2: Go to > Auth > Auth Type: Bearer Token > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Click on "Send"

---

### 8. `DELETE` `/reviews/:id` - Delete your own review

```
http://localhost:3000/reviews/<:review_id>
```

Note : Inside "< : review_id>", enter review id which is generated when performed the `"POST /books/:id/reviews"` OR `"PUT /reviews/:id"` method.

Go to > Auth > Auth Type: Bearer Token > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Click on "Send"

---

### 9. `GET` `/search` - Search books by title or author (partial and case-insensitive)

```
http://localhost:3000/books/search?q=Book001
```

OR

```
http://localhost:3000/books/search?q=auth
```

OR

```
http://localhost:3000/books/search?q=Book001&page=1&limit=5
```

Go to > Auth > Auth Type: Bearer Token > Copy Token From Login Route's Success Message And Paste Inside "Token" Value.

Click on "Send"

---

---

## Database Schema

**Below is the Schema used to create the models of MongoDB**

### User

```json
{
  "_id": "ObjectId",
  "username": "String (required, unique)",
  "email": "String (required, unique)",
  "password": "String (required, hashed)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### Book

```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "author": "String (required)",
  "genre": "String",
  "description": "String",
  "publishedYear": "Number",
  "createdBy": "ObjectId (ref: User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### Review

```json
{
  "_id": "ObjectId",
  "bookId": "ObjectId (ref: Book)",
  "userId": "ObjectId (ref: User)",
  "rating": "Number (1-5)",
  "comment": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Design Decisions

1. **MongoDB as Database**:

   - Chose MongoDB for its flexibility with book and review data
   - Schemas can be easily extended with additional fields in the future

2. **JWT Authentication**:

   - Token-based authentication for stateless API requests
   - JWT carries user ID to identify review ownership

3. **Pagination**:

   - Implemented on book listings and reviews to handle large datasets
   - Default page size of 10 with customizable limit

4. **One Review Per User Per Book**:

   - Database constraint ensures users can only submit one review per book
   - Existing reviews are updated if user submits another for the same book

5. **Search Functionality**:

   - Implemented using MongoDB's text indexes for efficient searching
   - Case-insensitive and partial matching for better user experience

6. **Input Validation**:
   - All inputs are validated before processing
   - Proper error messages are returned for invalid requests

---
