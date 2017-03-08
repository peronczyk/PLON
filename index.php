<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Streamline script examples</title>

	<link rel="stylesheet" type="text/css" href="dist/styles/layout.css">
	<link rel="stylesheet" type="text/css" href="dist/styles/theme-basic.css">

	<style>
		.l-Wrapper { max-width: 500px; }
	</style>
</head>

<body>
	<div class="l-Wrapper">
		<h1><strong>Streamline</strong> script examples</strong></h1>
		<p><a href="https://github.com/peronczyk/Streamline">github.com/peronczyk/Streamline</a></p>
		<hr>
		<p>List of available jQuery plugins:</p>

		<table>
			<thead>
				<tr>
					<th>Script name</th>
					<th class="u-Text--center">Readme</th>
				</tr>
			</thead>
			<tbody>
				<?php
					$examples = scandir('examples/');
					foreach($examples as $dir) {
						if ($dir == '.' || $dir == '..') continue;

						echo('<tr><td>');

						if (file_exists('examples/' . $dir . '/index.html')) echo('<a href="examples/' . $dir . '">' . $dir . '</a>');
						else echo($dir);

						echo('</td><td class="u-Text_center">');

						if (file_exists('examples/' . $dir . '/README.md')) echo('yes');

						echo('</td></tr>');
					}
				?>
			</tbody>
		</table>
	</div>
</body>

</html>