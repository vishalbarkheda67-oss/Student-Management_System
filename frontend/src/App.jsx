import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortType, setSortType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    marks: "",
    attendance: "",
  });

  // GET STUDENTS FROM MYSQL
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ADMIN LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Invalid email or password");
        return;
      }

      alert("Login successful!");

      setIsLoggedIn(true);
      setLoginPassword("");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      alert("Backend connection failed!");
    }
  };

  // FORM INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          course: formData.course,
          marks: Number(formData.marks),
          attendance: Number(formData.attendance),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add student");

        return;
      }

      alert("Student added successfully!");

      setFormData({
        name: "",
        email: "",
        course: "",
        marks: "",
        attendance: "",
      });

      setShowForm(false);

      fetchStudents();
    } catch (error) {
      console.log(error);

      alert("Backend connection failed!");
    }
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setEditStudent({
      id: student.id,
      name: student.name,
      email: student.email,
      course: student.course,
      marks: student.marks,
      attendance: student.attendance,
    });
  };

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  // UPDATE EDITED STUDENT
  const handleUpdateStudent = async () => {
    if (!editStudent.name || !editStudent.email || !editStudent.course) {
      alert("Please fill all student details!");
      return;
    }

    if (
      Number(editStudent.marks) < 0 ||
      Number(editStudent.marks) > 100 ||
      Number(editStudent.attendance) < 0 ||
      Number(editStudent.attendance) > 100
    ) {
      alert("Marks and Attendance must be between 0 and 100!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/" + editStudent.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editStudent.name,
            email: editStudent.email,
            course: editStudent.course,
            marks: Number(editStudent.marks),
            attendance: Number(editStudent.attendance),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update student");
        return;
      }

      alert("Student updated successfully!");

      setEditStudent(null);

      await fetchStudents();
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      alert("Backend connection failed!");
    }
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/students/" + id, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete student");
        return;
      }

      alert("Student deleted successfully!");

      await fetchStudents();
    } catch (error) {
      console.log("DELETE ERROR:", error);
      alert("Backend connection failed!");
    }
  };

  // EXPORT STUDENTS TO CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert("No students available to export!");
      return;
    }

    const headers = ["ID", "Name", "Email", "Course", "Marks", "Attendance"];

    const rows = students.map((student) => [
      student.id,
      student.name,
      student.email,
      student.course,
      student.marks,
      student.attendance,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Students exported successfully!");
  };

  // PRINT STUDENTS
  const handlePrintStudents = () => {
    window.print();
  };

  // SEARCH STUDENT
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.course.toLowerCase().includes(searchText)
    );
  });

  // LOGOUT
  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      setIsLoggedIn(false);
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  // FILTER + SEARCH
  let displayedStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText) ||
      student.course.toLowerCase().includes(searchText);

    const matchesCourse =
      courseFilter === "" || student.course === courseFilter;

    return matchesSearch && matchesCourse;
  });

  // SORT
  if (sortType === "marksHigh") {
    displayedStudents.sort((a, b) => Number(b.marks) - Number(a.marks));
  } else if (sortType === "marksLow") {
    displayedStudents.sort((a, b) => Number(a.marks) - Number(b.marks));
  } else if (sortType === "attendanceHigh") {
    displayedStudents.sort(
      (a, b) => Number(b.attendance) - Number(a.attendance),
    );
  } else if (sortType === "attendanceLow") {
    displayedStudents.sort(
      (a, b) => Number(a.attendance) - Number(b.attendance),
    );
  }

  // STATISTICS
  const totalStudents = students.length;

  const totalCourses = new Set(students.map((student) => student.course)).size;

  const averageMarks =
    students.length === 0
      ? 0
      : (
          students.reduce(
            (total, student) => total + Number(student.marks),
            0,
          ) / students.length
        ).toFixed(1);

  const averageAttendance =
    students.length === 0
      ? 0
      : (
          students.reduce(
            (total, student) => total + Number(student.attendance),
            0,
          ) / students.length
        ).toFixed(1);

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>🔐 Admin Login</h1>

          <p>Student Management System</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Admin Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
          <button
            type="button"
            onClick={() => {
              const email = prompt("Enter Admin Email:");

              if (!email) return;

              const newPassword = prompt("Enter New Password:");

              if (!newPassword) return;

              const confirmPassword = prompt("Confirm New Password:");

              if (!confirmPassword) return;

              if (newPassword !== confirmPassword) {
                alert("Passwords do not match!");
                return;
              }

              fetch("http://localhost:5000/api/reset-password", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  newPassword: newPassword,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.error) {
                    alert(data.error);
                    return;
                  }

                  alert("Password reset successfully!");
                })
                .catch((error) => {
                  console.log("RESET PASSWORD ERROR:", error);
                  alert("Backend connection failed!");
                });
            }}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">Student Management System</div>

        <div className="nav-links">
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* DASHBOARD */}

      <section className="section">
        <h1>Admin Dashboard</h1>

        <p>Welcome to the Student Management System</p>

        {/* STATISTICS */}

        <div className="feature-container">
          <div className="feature-card">
            <h3>👨‍🎓 Total Students</h3>

            <h2>{totalStudents}</h2>
          </div>

          <div className="feature-card">
            <h3>📚 Total Courses</h3>

            <h2>{totalCourses}</h2>
          </div>

          <div className="feature-card">
            <h3>📊 Average Marks</h3>

            <h2>{averageMarks}%</h2>
          </div>

          <div className="feature-card">
            <h3>📅 Attendance</h3>

            <h2>{averageAttendance}%</h2>
          </div>
        </div>

        {/* STUDENT MANAGEMENT */}

        <div className="student-management">
          <h2>Student Management</h2>

          <div className="dashboard-actions">
            <button className="primary-btn" onClick={() => setShowForm(true)}>
              ➕ Add Student
            </button>

            <button type="button" onClick={handleExportCSV}>
              📄 Export CSV
            </button>

            <button type="button" onClick={handlePrintStudents}>
              🖨️ Print Students
            </button>
          </div>
        </div>
        {/* ADD STUDENT FORM */}
        {showForm && (
          <div className="modal">
            <div className="modal-box">
              <h2>Add New Student</h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Student Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Student Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Artificial Intelligence">
                    Artificial Intelligence
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>

                <input
                  type="number"
                  name="marks"
                  placeholder="Marks"
                  min="0"
                  max="100"
                  value={formData.marks}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="attendance"
                  placeholder="Attendance %"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={handleChange}
                  required
                />

                <div className="form-buttons">
                  <button type="submit" className="primary-btn">
                    Add Student
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SEARCH / FILTER / SORT */}

        <div className="management-controls">
          <input
            type="text"
            placeholder="🔍 Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">📚 All Courses</option>

            <option value="Computer Science">Computer Science</option>

            <option value="Information Technology">
              Information Technology
            </option>

            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>

            <option value="Electronics">Electronics</option>

            <option value="Mechanical">Mechanical</option>

            <option value="Civil">Civil</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="">↕️ Sort Students</option>

            <option value="marksHigh">Marks: High to Low</option>

            <option value="marksLow">Marks: Low to High</option>

            <option value="attendanceHigh">Attendance: High to Low</option>

            <option value="attendanceLow">Attendance: Low to High</option>
          </select>
        </div>

        {/* STUDENT TABLE */}

        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Course</th>

                <th>Marks</th>

                <th>Attendance</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-students">
                    🔍 No students found
                  </td>
                </tr>
              ) : (
                displayedStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.course}</td>

                    <td>{student.marks}%</td>

                    <td>{student.attendance}%</td>

                    <td>
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleView(student)}
                      >
                        View
                      </button>

                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PROFILE MODAL */}

      {selectedStudent && (
        <div className="modal" onClick={() => setSelectedStudent(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>👤 Student Profile</h2>

            <div className="profile-row">
              <strong>🆔 Student ID:</strong> {selectedStudent.id}
            </div>

            <div className="profile-row">
              <strong>👤 Name:</strong> {selectedStudent.name}
            </div>

            <div className="profile-row">
              <strong>📧 Email:</strong> {selectedStudent.email}
            </div>

            <div className="profile-row">
              <strong>🎓 Course:</strong> {selectedStudent.course}
            </div>

            <div className="profile-row">
              <strong>📊 Marks:</strong> {selectedStudent.marks}%
            </div>

            <div className="profile-row">
              <strong>📅 Attendance:</strong> {selectedStudent.attendance}%
            </div>

            <button
              className="close-modal"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* FOOTER */}

      <footer>
        <p>© 2026 Student Management System</p>
      </footer>

      {/* EDIT STUDENT MODAL */}
      {editStudent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "400px",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ color: "#222", marginBottom: "20px" }}>
              Edit Student
            </h2>

            <input
              type="text"
              placeholder="Student Name"
              value={editStudent.name}
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  name: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Student Email"
              value={editStudent.email}
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  email: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Course"
              value={editStudent.course}
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  course: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Marks"
              value={editStudent.marks}
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  marks: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Attendance"
              value={editStudent.attendance}
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  attendance: e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button type="button" onClick={() => setEditStudent(null)}>
                Cancel
              </button>

              <button type="button" onClick={handleUpdateStudent}>
                Update Student
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
