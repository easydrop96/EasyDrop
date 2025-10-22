# TODO for Authentication Integration

- [x] Update Django register view in posts/views.py to save first_name and last_name from vorname and nachname.
- [x] Add API views for login and register in posts/views.py using DRF, returning JSON responses.
- [x] Update posts/urls.py to include API paths for /api/login/ and /api/register/.
- [x] Add Login and Register buttons to navbar-right in app.html.
- [x] Create login.component.ts, login.component.html, login.component.css, login.component.spec.ts.
- [x] Create register.component.ts, register.component.html, register.component.css, register.component.spec.ts.
- [x] Update app.routes.ts to add routes for /login and /register.
- [x] Create auth.service.ts with login and register methods calling Django APIs.
- [x] Implement login form with username and password fields.
- [x] Implement register form with vorname, nachname, username, email, password, password2, and client-side validation (8 chars, uppercase, number, special char).
- [x] Handle authentication state (store token in localStorage, redirect on success).
- [ ] Test by running Django server and Angular dev server, verify navigation and form submissions.
