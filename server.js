var fs = require("fs");
var path = require("path");
var bodyParser = require('body-parser');
var express = require("express");
var mysql = require('mysql');
var ejs = require("ejs");
var app = express();

app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', ejs.renderFile);

var pool = mysql.createPool({
	connectionLimit: 100,
	host: "localhost",
	user: "root",
	password: "rijukris",
	database: "ehospital",
});

app.get("/", function(req, res) {
	return res.render('index.html');
});

app.get("/home", function(req, res) {
	console.log(req.url);
	return res.render('home.html');
});

app.get("/about", function(req, res) {
	console.log(req.url);
	return res.render('about.html');
});

app.get("/adminlogin", function(req, res) {
	console.log(req.url);
	return res.render('adminlogin.html');
});

app.get("/patientlogin", function(req, res) {
	console.log(req.url);
	return res.render('patientlogin.html');
});

app.get("/doctorlogin", function(req, res) {
	console.log(req.url);
	return res.render('doctorlogin.html');
});

app.get("/patientsignup", function(req, res) {
	console.log(req.url);
	return res.render('patientsignup.html');
});

app.get("/doctorsignup", function(req, res) {
	console.log(req.url);
	return res.render('doctorsignup.html');
});

app.get("/appointmentform", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "SELECT * from DOCTOR";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": err2.message });
				else
				{
					if (rows != null && rows.length > 0)
					{
						fs.readFile("views/appointment.html", "utf-8", function(err3, form) {
							if (err)
								return res.json({ "status": "ERROR", "message": err3.message });
							else
							{
								return res.json({ "status": "OK", "form": form, doctor_list: rows });
							}
						});
					}
					else
						return res.json({ "status": "ERROR", "message": "No Doctor is available" });
				}
			});
		}
	});
});

app.get("/patient_appointment_history", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(e, con) {
		if (e)
			return res.json({ "status": "ERROR", "message": e.message });
		else
		{
			var queryStr = "SELECT d.first_name, d.last_name, d.specialization, a.appointment_date from appointment a left outer join doctor d on a.doctor_email=d.email where a.patient_email='" + req.query.patient_email + "'";
			console.log(queryStr);
			con.query(queryStr, function(err, rows, fields) {
				con.release();
				if (err)
				{
					return res.json({ "status": "ERROR", "message": err.message });
				}
				else
				{
					fs.readFile("views/patient_appointment_history.html", "utf-8", function(err2, form) {
						if (err2)
							return res.json({ "status": "ERROR", "message": err2.message });

						if (rows != null && rows.length > 0)
						{
							var applist = [];

							rows.forEach(function(r) {
								var app = {};
								app.doctor_name = r.first_name + " " + r.last_name;
								app.specialization = r.specialization;
								app.appointment_date = r.appointment_date;
								applist.push(app);
							});

							var html = ejs.render(form, { data: applist });
							return res.json({ "status": "OK", html: html });
						}
						else
						{
							var html = ejs.render(form, { data: [] });
							return res.json({ "status": "OK", html: html });
						}
					});
				}
			});
		}
	});
});

app.get("/doctor_appointments", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(e, con) {
		if (e)
			return res.json({ "status": "ERROR", "message": e.message });
		else
		{
			var queryStr = "SELECT p.first_name, p.last_name, p.dob, p.country, a.appointment_date from appointment a left outer join patient p on a.patient_email=p.email where a.doctor_email='" + req.query.doctor_email + "'";

			console.log(queryStr);
			con.query(queryStr, function(err, rows, fields) {
				con.release();
				if (err)
				{
					return res.json({ "status": "ERROR", "message": err.message });
				}
				else
				{
					fs.readFile("views/doctor_appointments.html", "utf-8", function(err2, form) {
						if (err2)
							return res.json({ "status": "ERROR", "message": err2.message });

						if (rows != null && rows.length > 0)
						{
							var applist = [];

							rows.forEach(function(r) {
								var app = {};
								app.patient_name = r.first_name + " " + r.last_name;
								app.dob = r.dob;
								app.country = r.country;
								app.appointment_date = r.appointment_date;
								applist.push(app);
							});

							var html = ejs.render(form, { data: applist });
							return res.json({ "status": "OK", html: html });
						}
						else
						{
							var html = ejs.render(form, { data: [] });
							return res.json({ "status": "OK", html: html });
						}
					});
				}
			});
		}
	});
});

app.get("/doctor_profile", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "SELECT * from DOCTOR where email='" + req.query.doctor_email + "'";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": err2.message });
				else
				{
					if (rows != null && rows.length > 0)
					{
						fs.readFile("views/doctor_profile.html", "utf-8", function(err3, form) {
							if (err)
								return res.json({ "status": "ERROR", "message": err3.message });
							else
							{
								var html = ejs.render(form, { doctor: rows[0] });
								return res.json({ "status": "OK", "html": html });
							}
						});
					}
					else
						return res.json({ "status": "ERROR", "message": "Doctor profile is not available" });
				}
			});
		}
	});
});

app.get("/patient_profile", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "SELECT * from PATIENT where email='" + req.query.patient_email + "'";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": err2.message });
				else
				{
					if (rows != null && rows.length > 0)
					{
						fs.readFile("views/patient_profile.html", "utf-8", function(err3, form) {
							if (err)
								return res.json({ "status": "ERROR", "message": err3.message });
							else
							{
								var html = ejs.render(form, { patient: rows[0] });
								return res.json({ "status": "OK", "html": html });
							}
						});
					}
					else
						return res.json({ "status": "ERROR", "message": "Patient profile is not available" });
				}
			});
		}
	});
});


app.post("/doctorloginform", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
		var queryStr = "SELECT * from DOCTOR where email='" + req.body.email + "' AND password='" + req.body.password + "'";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": err2.message });
				else
				{
					if (rows != null && rows.length == 1)
					{
						fs.readFile("views/doctorhome.html", "utf-8", function(err3, form) {
							if (err)
								return res.json({ "status": "ERROR", "message": err3.message });
							else
							{
								var html = ejs.render(form, { data: rows[0] });
								return res.json({ "status": "OK", "form": html });
							}
						});
					}
					else
						return res.json({ "status": "ERROR", "message": "Invalid username or password" });
				}
			});
		}
	});
});

app.post("/doctorsignupform", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "INSERT into DOCTOR values ('" + req.body.email + "', '" + req.body.first_name + "', '" + req.body.last_name + "', '" + req.body.dob + "', '" + req.body.gender + "', '" + req.body.specialization + "', '" + req.body.mobile + "', '" + req.body.password + "')";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": "Database insert failed with " + err2.message });
				else
					return res.json({ "status": "OK", "message": "Database updated" });
			});
		}
	});
});

app.post("/patientloginform", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "SELECT * from PATIENT where email='" + req.body.email + "' AND password='" + req.body.password + "'";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": err2.message });
				else
				{
					if (rows != null && rows.length == 1)
					{
						fs.readFile("views/patienthome.html", "utf-8", function(err3, form) {
							if (err)
								return res.json({ "status": "ERROR", "message": err3.message });
							else
							{
								var html = ejs.render(form, { data: rows[0] });
								return res.json({ "status": "OK", "form": html });
							}
						});
					}
					else
						return res.json({ "status": "ERROR", "message": "Invalid username or password" });
				}
			});
		}
	});
});

app.post("/patientsignupform", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "INSERT into PATIENT values ('" + req.body.email + "', '" + req.body.first_name + "', '" + req.body.last_name + "', '" + req.body.dob + "', '" + req.body.gender + "', '" + req.body.country + "', '" + req.body.mobile + "', '" + req.body.password + "')";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": "Database insert failed with " + err2.message });
				else
					return res.json({ "status": "OK", "message": "Database updated" });
			});
		}
	});
});

app.post("/appointmentform", function(req, res) {
	console.log(req.url);
	pool.getConnection(function(err, con) {
		if (err)
			return res.json({ "status": "ERROR", "message": err.message });
		else
		{
			var queryStr = "INSERT into APPOINTMENT values ('" + req.body.doctor_list + "', '" + req.body.patient_email + "', '" + req.body.appointment_date + "')";
			console.log(queryStr);
			con.query(queryStr, function(err2, rows, fields) {
				con.release();
				if (err2)
					return res.json({ "status": "ERROR", "message": "Database insert failed with " + err2.message });
				else
					return res.json({ "status": "OK", "message": "Appointment Confirmed for " + req.body.appointment_date });
			});
		}
	});
});

app.get("/contact", function(req, res) {
	console.log(req.url);
	return res.render('contact.html');
});

app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
