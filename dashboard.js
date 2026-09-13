let students =
    JSON.parse(localStorage.getItem("students")) || [];

let editStudentId = null;


// SHOW FORM
function showAddStudent() {

    editStudentId = null;

    document.getElementById("formTitle").textContent =
        "Add New Student";

    document.getElementById("submitBtn").textContent =
        "Add Student";

    document.getElementById("studentForm").style.display =
        "block";

    document.getElementById("studentForm").scrollIntoView({
        behavior: "smooth"
    });
}


// HIDE FORM
function hideAddStudent() {

    document.getElementById("studentForm").style.display =
        "none";

    document.querySelector("#studentForm form").reset();

    editStudentId = null;

    document.getElementById("formTitle").textContent =
        "Add New Student";

    document.getElementById("submitBtn").textContent =
        "Add Student";
}


// ADD / UPDATE STUDENT
function addStudent(event) {

    event.preventDefault();

    const studentData = {

        name:
            document.getElementById("studentName").value.trim(),

        email:
            document.getElementById("studentEmail").value.trim(),

        course:
            document.getElementById("studentCourse").value,

        marks:
            document.getElementById("studentMarks").value,

        attendance:
            document.getElementById("studentAttendance").value
    };


    const duplicateEmail =
        students.find(function(student) {

            return (
                student.email.toLowerCase() ===
                studentData.email.toLowerCase()
                &&
                student.id !== editStudentId
            );

        });


    if (duplicateEmail) {

        alert("This email is already registered!");

        return;
    }


    if (
        Number(studentData.marks) < 0 ||
        Number(studentData.marks) > 100
    ) {

        alert("Marks must be between 0 and 100!");

        return;
    }


    if (
        Number(studentData.attendance) < 0 ||
        Number(studentData.attendance) > 100
    ) {

        alert("Attendance must be between 0 and 100!");

        return;
    }


    if (editStudentId !== null) {

        const index =
            students.findIndex(function(student) {

                return student.id === editStudentId;

            });


        if (index !== -1) {

            students[index] = {

                id: editStudentId,
                name: studentData.name,
                email: studentData.email,
                course: studentData.course,
                marks: studentData.marks,
                attendance: studentData.attendance
            };

        }


        alert("Student updated successfully!");
    }

    else {

        const student = {

            id: Date.now(),
            name: studentData.name,
            email: studentData.email,
            course: studentData.course,
            marks: studentData.marks,
            attendance: studentData.attendance
        };


        students.push(student);

        alert("Student added successfully!");
    }


    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    document.querySelector("#studentForm form").reset();

    document.getElementById("studentForm").style.display =
        "none";

    editStudentId = null;

    document.getElementById("formTitle").textContent =
        "Add New Student";

    document.getElementById("submitBtn").textContent =
        "Add Student";


    displayStudents();
}


// EDIT STUDENT
function editStudent(id) {

    const student =
        students.find(function(student) {

            return student.id === id;

        });


    if (!student) {

        alert("Student not found!");

        return;
    }


    editStudentId = id;


    document.getElementById("studentName").value =
        student.name;

    document.getElementById("studentEmail").value =
        student.email;

    document.getElementById("studentCourse").value =
        student.course;

    document.getElementById("studentMarks").value =
        student.marks;

    document.getElementById("studentAttendance").value =
        student.attendance;


    document.getElementById("formTitle").textContent =
        "Update Student";

    document.getElementById("submitBtn").textContent =
        "Update Student";

    document.getElementById("studentForm").style.display =
        "block";


    document.getElementById("studentForm").scrollIntoView({
        behavior: "smooth"
    });
}


// DELETE STUDENT
function deleteStudent(id) {

    if (
        !confirm(
            "Are you sure you want to delete this student?"
        )
    ) {

        return;
    }


    students =
        students.filter(function(student) {

            return student.id !== id;

        });


    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    displayStudents();

    alert("Student deleted successfully!");
}


// VIEW STUDENT
function viewStudent(id) {

    const student =
        students.find(function(student) {

            return student.id === id;

        });


    if (!student) {

        return;
    }


    document.getElementById("profileId").textContent =
        student.id;

    document.getElementById("profileName").textContent =
        student.name;

    document.getElementById("profileEmail").textContent =
        student.email;

    document.getElementById("profileCourse").textContent =
        student.course;

    document.getElementById("profileMarks").textContent =
        student.marks + "%";

    document.getElementById("profileAttendance").textContent =
        student.attendance + "%";


    document.getElementById("profileModal").style.display =
        "flex";
}


// CLOSE PROFILE
function closeProfile() {

    document.getElementById("profileModal").style.display =
        "none";
}


// DISPLAY STUDENTS
function displayStudents(studentList = students) {

    const tableBody =
        document.getElementById("studentTableBody");


    tableBody.innerHTML = "";


    if (studentList.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                    padding:30px;
                    text-align:center;
                    color:#666;
                    "
                >

                    🔍 No students found

                    <br><br>

                    Add a student or try a different search.

                </td>

            </tr>

        `;

    }

    else {

        studentList.forEach(function(student, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.email}
                </td>

                <td>
                    ${student.course}
                </td>

                <td>
                    ${student.marks}%
                </td>

                <td>
                    ${student.attendance}%
                </td>

                <td>

                    <button
                        class="action-btn view-btn"
                        onclick="viewStudent(${student.id})"
                    >
                        View
                    </button>

                    <button
                        class="action-btn edit-btn"
                        onclick="editStudent(${student.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent(${student.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });

    }


    updateStatistics();
}


// UPDATE STATISTICS
function updateStatistics() {

    document.getElementById("totalStudents").textContent =
        students.length;


    const courseSet =
        new Set(
            students.map(function(student) {

                return student.course;

            })
        );


    document.getElementById("totalCourses").textContent =
        courseSet.size;


    let totalMarks = 0;

    let totalAttendance = 0;


    students.forEach(function(student) {

        totalMarks += Number(student.marks);

        totalAttendance += Number(student.attendance);

    });


    const averageMarks =
        students.length === 0
            ? 0
            : totalMarks / students.length;


    const averageAttendance =
        students.length === 0
            ? 0
            : totalAttendance / students.length;


    document.getElementById("averageMarks").textContent =
        averageMarks.toFixed(1) + "%";


    document.getElementById("averageAttendance").textContent =
        averageAttendance.toFixed(1) + "%";
}


// SEARCH
function searchStudent() {

    const search =
        document
            .getElementById("searchStudent")
            .value
            .toLowerCase()
            .trim();


    const filteredStudents =
        students.filter(function(student) {

            return (
                student.name.toLowerCase().includes(search)
                ||
                student.email.toLowerCase().includes(search)
                ||
                student.course.toLowerCase().includes(search)
            );

        });


    displayStudents(filteredStudents);
}


// COURSE FILTER
function filterByCourse() {

    const selectedCourse =
        document.getElementById("courseFilter").value;


    if (selectedCourse === "") {

        displayStudents();

        return;
    }


    const filteredStudents =
        students.filter(function(student) {

            return student.course === selectedCourse;

        });


    displayStudents(filteredStudents);
}


// SORT
function sortStudents() {

    const value =
        document.getElementById("sortStudents").value;


    let sortedStudents =
        [...students];


    if (value === "marksHigh") {

        sortedStudents.sort(function(a, b) {

            return Number(b.marks) -
                   Number(a.marks);

        });

    }

    else if (value === "marksLow") {

        sortedStudents.sort(function(a, b) {

            return Number(a.marks) -
                   Number(b.marks);

        });

    }

    else if (value === "attendanceHigh") {

        sortedStudents.sort(function(a, b) {

            return Number(b.attendance) -
                   Number(a.attendance);

        });

    }

    else if (value === "attendanceLow") {

        sortedStudents.sort(function(a, b) {

            return Number(a.attendance) -
                   Number(b.attendance);

        });

    }


    displayStudents(sortedStudents);
}


// EXPORT CSV
function exportCSV() {

    if (students.length === 0) {

        alert("No students available to export!");

        return;
    }


    let csv =
        "ID,Name,Email,Course,Marks,Attendance\n";


    students.forEach(function(student) {

        csv +=
            '"' + student.id + '",' +
            '"' + student.name + '",' +
            '"' + student.email + '",' +
            '"' + student.course + '",' +
            '"' + student.marks + '",' +
            '"' + student.attendance + '"\n';

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = "students.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);


    alert(
        "Student data exported successfully!"
    );
}


// PRINT STUDENTS
function printStudents() {

    if (students.length === 0) {

        alert(
            "No students available to print!"
        );

        return;
    }


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the student list."
        );

        return;
    }


    let html = `

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <title>Student List</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                }

                h1 {
                    text-align: center;
                }

                p {
                    text-align: center;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 25px;
                }

                th,
                td {
                    border: 1px solid #333;
                    padding: 10px;
                    text-align: center;
                }

                th {
                    background: #f2f2f2;
                }

            </style>

        </head>

        <body>

            <h1>
                Student Management System
            </h1>

            <p>
                Student List
            </p>

            <table>

                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Marks</th>
                    <th>Attendance</th>
                </tr>

    `;


    students.forEach(function(student, index) {

        html += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.email}
                </td>

                <td>
                    ${student.course}
                </td>

                <td>
                    ${student.marks}%
                </td>

                <td>
                    ${student.attendance}%
                </td>

            </tr>

        `;

    });


    html += `

            </table>

        </body>

        </html>

    `;


    printWindow.document.write(html);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();
}


// LOGOUT
function logout() {

    if (
        confirm(
            "Are you sure you want to logout?"
        )
    ) {

        window.location.href =
            "index.html";

    }
}


// CLOSE PROFILE BY CLICKING OUTSIDE
window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "profileModal"
            );


        if (event.target === modal) {

            closeProfile();

        }

    }
);


// LOAD DATA
displayStudents();