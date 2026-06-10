<?php

$conn = new mysqli("localhost", "root", "", "complaints_db");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Form data
$fullname    = $_POST['fullname'] ?? '';
$nin         = $_POST['nin'] ?? '';
$phone       = $_POST['phone'] ?? '';
$email       = $_POST['email'] ?? '';
$commune     = $_POST['commune'] ?? '';
$address     = $_POST['address'] ?? '';
$category    = $_POST['category'] ?? '';
$priority    = $_POST['priority'] ?? '';
$subject     = $_POST['subject'] ?? '';
$description = $_POST['description'] ?? '';

// Create uploads folder if it doesn't exist
if (!is_dir("uploads")) {
    mkdir("uploads", 0777, true);
}

// Store all uploaded file names
$fileNames = [];

if (isset($_FILES['files'])) {

    foreach ($_FILES['files']['tmp_name'] as $key => $tmp_name) {

        if ($_FILES['files']['error'][$key] == 0) {

            $fileName = time() . "_" . basename($_FILES['files']['name'][$key]);

            if (
                move_uploaded_file(
                    $tmp_name,
                    "uploads/" . $fileName
                )
            ) {
                $fileNames[] = $fileName;
            }
        }
    }
}

// Convert array to text
$allFiles = implode(',', $fileNames);

// Insert complaint
$sql = "INSERT INTO complaints (
    fullname,
    nin,
    phone,
    email,
    commune,
    address,
    category,
    priority,
    subject,
    description,
    file_name
) VALUES (
    '$fullname',
    '$nin',
    '$phone',
    '$email',
    '$commune',
    '$address',
    '$category',
    '$priority',
    '$subject',
    '$description',
    '$allFiles'
)";

if ($conn->query($sql) === TRUE) {
    echo "Success";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();

?>