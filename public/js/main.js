$(document).on('click', '#home', function() {
	$.ajax({
		url: "/home",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#about', function() {
	$.ajax({
		url: "/about",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#adminlogin', function() {
	$.ajax({
		url: "/adminlogin",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#patientlogin', function() {
	$.ajax({
		url: "/patientlogin",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#patientsignup', function() {
	$.ajax({
		url: "/patientsignup",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#doctorlogin', function() {
	$.ajax({
		url: "/doctorlogin",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#doctorsignup', function() {
	$.ajax({
		url: "/doctorsignup",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#contact', function() {
	$.ajax({
		url: "/contact",
		success: function(rsp) {
			$('#main').html(rsp);
		}
	});
});

$(document).on('click', '#doctorloginform_submit', function() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function (response) {
        if (request.readyState === 4)
        {
            if (request.status === 200)
			{
				var rsp = JSON.parse(request.responseText);
				if (rsp.status == "OK")
					$('#main').html(rsp.form);
				else
					alert(rsp.message);
			}
        }
    }

	var form = formToJSON('doctorloginform');

    request.open("POST", "/doctorloginform", true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(form));
	return false;
});

$(document).on('click', '#doctorsignupform_submit', function() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function (response) {
        if (request.readyState === 4)
        {
            if (request.status === 200)
			{
				var rsp = JSON.parse(request.responseText);
				if (rsp.status == "OK")
					$('#doctorsignupform_submit').prop('disabled', true);

				alert(rsp.message);
			}
        }
    }

	var form = formToJSON('doctorsignupform');

    request.open("POST", "/doctorsignupform", true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(form));
	return false;
});

$(document).on('click', '#patientloginform_submit', function() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function (response) {
        if (request.readyState === 4)
        {
            if (request.status === 200)
			{
				var rsp = JSON.parse(request.responseText);
				if (rsp.status == "OK")
					$('#main').html(rsp.form);
				else
					alert(rsp.message);
			}
        }
    }

	var form = formToJSON('patientloginform');

    request.open("POST", "/patientloginform", true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(form));
	return false;
});

$(document).on('click', '#patientsignupform_submit', function() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function (response) {
        if (request.readyState === 4)
        {
            if (request.status === 200)
			{
				var rsp = JSON.parse(request.responseText);
				if (rsp.status == "OK")
				{
					$('#patientsignupform_submit').prop('disabled', true);
					console.log("disabled");
				}

				alert(rsp.message);
			}
        }
    }

	var form = formToJSON('patientsignupform');

    request.open("POST", "/patientsignupform", true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(form));
	return false;
});

$(document).on('click', '#patient_book_appointment', function() {
	var patient = JSON.parse($(this).attr("data-patient"));
	$.ajax({
		url: "/appointmentform?email=" + patient.email,
		success: function(rsp) {
			$('#patientmain').html(rsp.form);
			$("#patient").val(patient.first_name + " " + patient.last_name);
			$("#patient_email").val(patient.email);

			rsp.doctor_list.forEach(function(d) {
				var opt = d.first_name + " " + d.last_name + " (" + d.specialization + ")";
				$('#doctor_list').append(new Option(opt, d.email));
			});
		}
	});
});

$(document).on('click', '#appointmentform_submit', function() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function (response) {
        if (request.readyState === 4)
        {
            if (request.status === 200)
			{
				var rsp = JSON.parse(request.responseText);
				if (rsp.status == "OK")
					$('#appointmentform_submit').prop('disabled', true);
				alert(rsp.message);
			}
        }
    }

	var form = formToJSON('appointmentform');

    request.open("POST", "/appointmentform", true);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(form));
	return false;
});

$(document).on('click', '#patient_appointment_history', function() {
	var patient_email = $(this).attr("data-patient_email");
	console.log("patient_appointment_history", patient_email);
	$.ajax({
		url: "/patient_appointment_history?patient_email=" + patient_email,
		success: function(rsp) {
			$('#patientmain').html(rsp.html);
			var table = $('#patientappointmenthistory_table').DataTable({
				order: [],
				lengthMenu: [ [5, 10, -1], [5, 10, "All"] ],
			});
		}
	});
});

$(document).on('click', '#doctor_appointments', function() {
	var doctor_email = $(this).attr("data-doctor_email");
	console.log("doctor_appointments", doctor_email);
	$.ajax({
		url: "/doctor_appointments?doctor_email=" + doctor_email,
		success: function(rsp) {
			$('#doctormain').html(rsp.html);
			var table = $('#doctor_appointments_table').DataTable({
				order: [],
				lengthMenu: [ [5, 10, -1], [5, 10, "All"] ],
			});
		},
		error: function(err) {
			console.error(err);
		}
	});
});

$(document).on('click', '#doctor_profile', function() {
	var doctor_email = $(this).attr("data-doctor_email");
	console.log("doctor_profile", doctor_email);
	$.ajax({
		url: "/doctor_profile?doctor_email=" + doctor_email,
		success: function(rsp) {
			$('#doctormain').html(rsp.html);
			var table = $('#doctor_profile_table').DataTable({
				order: [],
				lengthMenu: [ [5, 10, -1], [5, 10, "All"] ],
				scrollY: '100vh',
				scrollCollapse: true,
				scroller: true,
				searching: false,
				paging:   false,
				ordering: false,
				info:     false,
			});
		},
		error: function(err) {
			console.error(err);
		}
	});
});

$(document).on('click', '#patient_profile', function() {
	var patient_email = $(this).attr("data-patient_email");
	console.log("patient_profile", patient_email);
	$.ajax({
		url: "/patient_profile?patient_email=" + patient_email,
		success: function(rsp) {
			$('#patientmain').html(rsp.html);
			var table = $('#patient_profile_table').DataTable({
				order: [],
				lengthMenu: [ [5, 10, -1], [5, 10, "All"] ],
				scrollY: '100vh',
				scrollCollapse: true,
				scroller: true,
				searching: false,
				paging:   false,
				ordering: false,
				info:     false,
			});
		},
		error: function(err) {
			console.error(err);
		}
	});
});

$(document).on('click', '#logout', function() {
	console.log("logout");
	$("#home").trigger('click');
});

function formToJSON(formid)
{
 	var form = $("#" + formid).serializeArray();
	var json = {};
	for (var i = 0; i < form.length; i++)
	{
		if (form[i].value != null)
			json[form[i].name] = form[i].value.trim();
		else
			json[form[i].name] = form[i].value;
	}

	return json;
}

$("#home").trigger('click');
