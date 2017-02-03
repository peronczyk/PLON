<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<title>Streamline script examples</title>

	<link rel="stylesheet" type="text/css" href="dist/styles/layout.css">
	<link rel="stylesheet" type="text/css" href="dist/styles/theme-basic.css">
</head>

<body>
	<div class="l-Wrapper">
		<div class="l-Inner">
			<h1><strong>Streamline</strong> script examples</strong></h1>

			<table class="u-Lines_horizontal">
				<thead>
					<tr>
						<th>Script name</th>
						<th class="u-Text_center">Readme</th>
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
	</div>
</body>

</html>