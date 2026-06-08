# Minimal Express + MongoDB Authentication & Authorization API

This is a minimal backend API built with **Express.js** and **Mongoose (MongoDB)** designed to demonstrate secure user authentication, role-based access control (RBAC), and server hardening. This project maps strictly to the core security and auth principles covered across lectures.

---

## 📚 Lecture Alignment Matrix

The following table maps each core file and middleware to the specific lecture topic it demonstrates:


| File / Middleware | Topic Demonstrated | Lecture Reference |
| :--- | :--- | :--- |
| `src/models/User.js` & `passwordService.js` | Password Hashing with Argon2id | **Lecture 23 (Auth 1)** |
| `src/controllers/auth.controller.js` | JWT Issuance & Safe JSON Responses | **Lecture 23 (Auth 1)** |
| `src/middlewares/auth.js` | Session Management & Token Verification | **Lecture 24 (Auth 2)** |
| `src/middlewares/role.js` | Role-Based Access Control (RBAC) | **Lecture 24 (Auth 2)** |
| `src/utils/cookiesService.js` | HttpOnly, Secure, & SameSite Cookie Rules | **Lecture 24 (Auth 2)** |
| `src/middlewares/limiter.js` | Brute-Force Mitigation (Rate Limiting) | **Lecture 24 (Auth 2)** |
| `src/middlewares/xss.js` & `app.js` | Cross-Site Scripting (XSS) Sanitization | **Lecture 25 (Auth 3)** |
| `src/validation/` & `middlewares/validate.js` | Input Structural Integrity Chains | **Lecture 25 (Auth 3)** |

---

## 📊 Role Authorization Test Matrix

The API strictly implements a zero-trust model where endpoints behave contextually according to the authenticated user's role:


| HTTP Method & Endpoint | Allowed Roles | Expected Status | Outcome / Behavior |
| :--- | :--- | :---: | :--- |
| `GET /api/v1/me/welcome` | **User**, **Admin** | `200 OK` | Success (Greets authenticated user) |
| `GET /api/v1/me/account-summary` | **User**, **Admin** | `200 OK` | Success (Returns dummy account data object) |
| `GET /api/v1/admin/overview` | **Admin Only** | `403 Forbidden` | Denied for standard `user` accounts |
| `GET /api/v1/admin/users` | **Admin Only** | `403 Forbidden` | Denied for standard `user` accounts |
| `DELETE /api/v1/admin/users/:id` | **Admin Only** | `403 Forbidden` | Denied for standard `user` accounts |

---

## 🛠️ Environment Configuration (`.env`)

Create an environment configuration file named `.env` in the absolute root directory of your project structure. Populate it with the following baseline operational credentials:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/auth_practice_db
JWT_SECRET=your_super_complex_and_long_jwt_secret_key_here
JWT_EXPIRES_IN=30m
NODE_ENV=development
```

---

## 🏁 How to Test Authentication & All 5 Protected Routes in Postman / Thunder Client

Follow this operational lifecycle sequence to test every functional criteria step-by-step:

### 1. User Registration (`POST /api/v1/auth/signup`)
*   **Action:** Create a standard User account and an Administrator account.
*   **Payload (JSON Body):**
    ```json
    {
      "name": "Ali Alali",
      "email": "ali@example.com",
      "password": "StrongPassword123!",
      "role": "user" 
    }
    ```
    *(Repeat the request with `"role": "admin"` using a different email to test administrative paths).*
*   **Verification:** Confirm the server yields a `201 Created` code. The response payload securely extracts and prints the safe user profile entity while completely omitting the hashed password schema fields.

### 2. User Authentication & Cookie Issuance (`POST /api/v1/auth/login`)
*   **Action:** Fire a login request with your registered account credentials.
*   **Verification:** The system evaluates parameters against database indexes using `argon2.verify`. Upon match confirmation, a signed token is packaged.
*   **Important Cookie Check:** Navigate to the **Cookies** response tab in Postman or Thunder Client. Verify that an `accessToken` cookie is successfully cached by your API client with `httpOnly` attributes activated.

### 3. Testing the Two User-Level Paths (`/me/*`)
With your login session active (meaning the client is holding the session cookie), fire the following requests:
*   **`GET /api/v1/me/welcome`:** Returns a `200 OK` and reads the contextual username dynamically from database records.
*   **`GET /api/v1/me/account-summary`:** Returns a `200 OK` alongside a mock accounting financial details summary payload.
*   *Both endpoints return a `200 OK` regardless of whether you are authenticated as a `user` or an `admin`.*

### 4. Testing the Boundary Restrictions on Admin Paths (`/admin/*`)
*   **Testing with a Standard User Session:** Ensure you are logged in under a `"user"` role. Attempt accessing `GET /api/v1/admin/overview`. The custom role middleware catches the privilege mismatch and drops the connection, returning an explicit **`403 Forbidden`** response code.
*   **Testing with an Admin Session:** Authenticate via login using your `"admin"` credentials to refresh the cookie token. Re-request `GET /api/v1/admin/overview`. The route will now pass validation checks, successfully returning a **`200 OK`** response alongside administrative metrics.
*   **`GET /api/v1/admin/users`:** Returns a collection count and dataset array securely stripped of password hashes.
*   **`DELETE /api/v1/admin/users/:id`:** Passes the parameter string through Mongoose ID structural checkers. If an administrator passes their own personal user ID, the validation layer blocks execution with a `400 Bad Request` to safely prevent self-deletion.

### 5. Terminating Sessions (`POST /api/v1/auth/logout`)
*   **Action:** Trigger the logout endpoint.
*   **Verification:** The API instantly issues a command destroying the `accessToken` reference. Attempting to re-query any of the 5 protected layers immediately yields a **`401 Unauthorized`** response code, confirming session closure.
