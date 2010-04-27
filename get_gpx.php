<?php

if (is_null($_GET["gpx_url"]) || ($_GET["gpx_url"] == ""))
	die("GPX file URL is empty!");

$file = fopen($_GET["gpx_url"], "r");
if (!$file) {
	echo "<p>Unable to open remote file.\n";
	exit;
}

while (!feof($file)) {
	$buf = fgets($file, 1024);
	print($buf);
}
fclose($file);
?>

