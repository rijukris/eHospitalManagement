eHospitalManagement
==============
A Portal for patients and doctors. Patient can create their profile and book appointments with select Doctor specialists.

The project consists of

- The Client side that gathers Doctor’s profile and patient information and
appointments using Bootstrap elements and Forms, and sends JSON data to the
Server via Get, Post, Put and Delete REST API methods using JQuery AJAX.
- The Server side processes the JSON data using Node.js express module,
transforms the JSON to HTML via EJS template engine and responds to the client
asynchronously as JSON.
- The Data side stores doctor’s profile, patient information, appointment history in
MariaDB database using mysql NPM module.
Doctors can add their profiles and view their appointments.

**Client supports the following features**
 - Patients must first sign-in and create profile
 - Doctors must first sign-in  and create profile
 - Patients can book appointments with select Doctors
 - Doctors can view appointments
 - Display Appointment history
