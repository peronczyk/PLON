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

		<table class="t-Hoverable">
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

						$script_local_address = 'docs/Scripts/' . $dir . '.md';

						if (file_exists($script_local_address)) echo('<a href="https://github.com/peronczyk/PLON/tree/master/' . $script_local_address . '" target="_blank">view</a>');

						echo('</td></tr>');
					}
				?>
			</tbody>
		</table>
	</div>
</body>

</html>