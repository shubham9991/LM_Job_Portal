# API Documentation

All endpoints are prefixed with `/api`. Authentication uses Bearer JWT tokens returned by the login endpoint.

## Authentication

| Method | Endpoint | Description |
|---|---|---|
|POST|`/auth/login`|Authenticate a user and return a JWT token|
|POST|`/auth/register/student`|Admin creates a student user|
|POST|`/auth/register/school`|Admin creates a school user|
|POST|`/auth/complete-onboarding`|Complete profile creation with optional image upload|
|POST|`/auth/logout`|Invalidate current user session|

### Example `POST /auth/login`
Request
```json
{ "email": "user@example.com", "password": "Password123!" }
```
Response
```json
{ "success": true, "token": "<jwt>", "data": { "user": {"id": "uuid", "role": "student"} } }
```

## Student Routes

| Method | Endpoint | Description |
|---|---|---|
|GET|`/student/dashboard`|Return metrics and recent notifications|
|GET|`/student/jobs`|List available jobs|
|POST|`/student/jobs/:id/apply`|Apply to a job with resume and details|
|GET|`/student/calendar`|View upcoming interviews|
|GET|`/student/profile`|Get student's profile|
|PATCH|`/student/profile`|Update profile and upload image|

## School Routes

| Method | Endpoint | Description |
|---|---|---|
|GET|`/school/dashboard-metrics`|Metrics for school's dashboard|
|POST|`/school/jobs`|Create a new job|
|GET|`/school/jobs`|List jobs posted by the school|
|GET|`/school/jobs/:id`|Get details of a job including pending review count|
|PATCH|`/school/jobs/:id/status`|Open or close a job|
|GET|`/school/jobs/:id/applicants`|Get applicants for a job|
|GET|`/school/applicants/:id`|Get full applicant details|
|PATCH|`/school/applications/:id/status`|Update an application status|
|POST|`/school/applications/:id/schedule`|Schedule an interview|
|GET|`/school/profile`|Get school profile info|

## Admin Routes

| Method | Endpoint | Description |
|---|---|---|
|GET|`/admin/dashboard`|Overall system metrics|
|GET|`/admin/users`|List all users|
|POST|`/admin/users/bulk-create`|Bulk create students or schools via Excel|
|PATCH|`/admin/users/:id/password`|Reset a user password|
|DELETE|`/admin/users/:id`|Delete a user and related data|
|POST|`/admin/skills`|Create a core skill|
|GET|`/admin/skills`|List core skills|
|DELETE|`/admin/skills/:id`|Delete a core skill|
|POST|`/admin/skills/:coreSkillId/bulk-marks-upload`|Upload marks for many students|
|POST|`/admin/skills/:userId/marks`|Upload marks for one student|
|POST|`/admin/categories`|Create a category|
|GET|`/admin/categories`|List categories|
|DELETE|`/admin/categories/:id`|Delete a category|
|PATCH|`/admin/settings/subskill-limit`|Set maximum mark per sub-skill|
|GET|`/admin/email-templates/:key`|Get an email template|
|PUT|`/admin/email-templates/:key`|Update an email template|

## Upload Routes

| Method | Endpoint | Description |
|---|---|---|
|POST|`/upload/profile-image`|Upload and optimize profile image|
|POST|`/upload/resume`|Upload resume file|
|POST|`/upload/certificate`|Upload and optimize certificate image|

Responses follow the format:
```json
{ "success": true, "message": "...", "data": { ... } }
```

## Detailed Endpoint Usage

Below are example requests and responses for each endpoint.

### POST `/auth/register/student`
**How to use:** Admin provides a name and email to create a student. The student receives a welcome email with temporary credentials.
Request
```json
{ "name": "John Doe", "email": "john@example.com" }
```
Expected response
```json
{ "success": true, "message": "Student profile created, registration email sent.", "data": { "user_id": "uuid" } }
```

### POST `/auth/register/school`
**How to use:** Similar to student registration but for schools.
Request
```json
{ "name": "ABC School", "email": "school@example.com" }
```
Response
```json
{ "success": true, "message": "School profile created, registration email sent.", "data": { "user_id": "uuid" } }
```

### PATCH `/admin/users/:id/password`
Change any user's password.
Request
```json
{ "newPassword": "NewPass123!" }
```
Response
```json
{ "success": true, "message": "Password updated." }
```

### DELETE `/admin/users/:id`
Remove a user and all related data.
Response
```json
{ "success": true, "message": "User 'email@example.com' and all associated data deleted successfully." }
```

### DELETE `/admin/skills/:id`
Delete a core skill and unlink it from categories.
Response
```json
{ "success": true, "message": "Core skill deleted successfully." }
```

### DELETE `/admin/categories/:id`
Delete a job category. Jobs using this category will have it cleared.
Response
```json
{ "success": true, "message": "Category deleted successfully." }
```

### PATCH `/admin/settings/subskill-limit`
Update the maximum mark allowed per sub skill.
Request
```json
{ "limit": 25 }
```
Response
```json
{ "success": true, "message": "Sub-skill mark limit updated.", "data": { "limit": 25 } }
```

### GET `/admin/email-templates/:key`
Retrieve an email template such as `welcome_student`.
Response
```json
{ "success": true, "data": { "subject": "...", "body": "..." } }
```

### PUT `/admin/email-templates/:key`
Update an email template's subject and body.
Request
```json
{ "subject": "Welcome", "body": "<p>Hello {{name}}</p>" }
```
Response
```json
{ "success": true, "message": "Email template updated." }
```

### POST `/upload/profile-image`
Upload a profile image. The server optimizes the file before saving.
Response
```json
{ "success": true, "message": "Profile image uploaded successfully.", "data": { "filePath": "/uploads/profiles/file.jpg" } }
```

