<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Streamline script examples</title>

	<link rel="stylesheet" type="text/css" href="dist/styles/layout.css">
	<link rel="stylesheet" type="text/css" href="dist/styles/theme-basic.css">
</head>

<body>
	<div class="wrapper">
		<div class="inner">
			<h1><strong>Streamline</strong> script examples</strong></h1>

			<table class="u_lines_horizontal">
				<thead>
					<tr>
						<th>Script name</th>
						<th class="align-center">Readme</th>
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

							echo('</td><td class="align-center">');

							if (file_exists('examples/' . $dir . '/README.md')) echo('yes');

							echo('</td></tr>');
						}
					?>
				</tbody>
			</table>
		</div>
	</div>
</body>

</html>