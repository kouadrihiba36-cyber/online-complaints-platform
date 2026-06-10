<?php

$conn = new mysqli("localhost","root","","complaints_db");

$result = $conn->query("SELECT * FROM complaints");

echo "<h2>Complaints</h2>";

while($row = $result->fetch_assoc()){

    echo "<hr>";

    echo "<b>Name:</b> " . htmlspecialchars($row['fullname']) . "<br>";

    echo "<b>Subject:</b> " . htmlspecialchars($row['subject']) . "<br>";

    echo "<b>Description:</b> " . htmlspecialchars($row['description']) . "<br>";

    if(!empty($row['file_name'])){

        echo "<b>Attachments:</b><br>";

        $files = explode(',', $row['file_name']);

        foreach($files as $file){

            $file = trim($file);

            if(!empty($file)){

                echo "<a href='uploads/$file' target='_blank'>$file</a><br>";

            }
        }
    }
}

$conn->close();

?>