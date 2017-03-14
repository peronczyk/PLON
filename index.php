<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>PLON script examples</title>

	<link rel="stylesheet" type="text/css" href="dist/styles/layout.css">
	<link rel="stylesheet" type="text/css" href="dist/styles/theme-basic.css">

	<style>
		.l-Wrapper { max-width: 500px; }
	</style>
</head>

<body>
	<div class="l-Wrapper">
		<h1><strong>PLON</strong> script examples</strong></h1>
		<p><a href="https://github.com/peronczyk/plon">github.com/peronczyk/PLON</a></p>
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

						echo('</td><td class="u-Text--center">');

						if (file_exists('examples/' . $dir . '/README.md')) echo('yes');

						echo('</td></tr>');
					}
				?>
			</tbody>
		</table>
	</div>
</body>

</html>