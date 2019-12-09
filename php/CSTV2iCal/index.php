<?php //fix support for arizona timezone
$teams = array(
'New Mexico' => 'nm',
'Pepperdine' => 'pepp',
'UCSB' => 'ucsb',
'USC' => 'usc'
);
$sports = array(
'Baseball' => 'm-basebl',
'Softball' => 'w-softbl'
);
$timezones = array('PT','MT','CT','ET');
ini_set( "display_errors", 0);
if ($_GET['team']) {
$team = htmlspecialchars($_GET['team']); 
$sport = htmlspecialchars($_GET['sport']);
$timezone = htmlspecialchars($_GET['timezone']);
$shortteam = $teams[$team];
$shortsport = $sports[$sport];
$page2get = "http://www.cstv.com/printable/schools/" . $shortteam . "/sports/" . $shortsport . "/sched/" . $shortteam . "-" . $shortsport . "-sched.html?frame=bottom";
$offset = array(sprintf("%+d",-$timezone),sprintf("%+d",1-$timezone),sprintf("%+d",2-$timezone),sprintf("%+d",3-$timezone));
echo "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//davidabailey.com//cstv2ical//EN\nTZID:$timezone\n";
echo "X-WR-CALNAME:$team $sport\n"; 
$ch = curl_init($page2get);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$html = curl_exec($ch);
if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == 200) {
$dom = new domDocument;
$dom->loadHTML($html);
$dom->preserveWhiteSpace = false; 
$tables = $dom->getElementsByTagName('table');
$rows = $tables->item(1)->getElementsByTagName('tr'); 
foreach ($rows as $row) {
 $cols = $row->getElementsByTagName('td'); 
 $date = $cols->item(0)->nodeValue;
 if (!strtotime($date)) {$date = $lastdate;} else {$lastdate = $date;}
 $opponent = $cols->item(1)->nodeValue; 
 $location = $cols->item(2)->nodeValue; 
 $time = $cols->item(3)->nodeValue; 
 $time = str_replace($timezones,$offset,$time);
 if (strtotime($date . " " . $time)) {
  $datetime = strtotime($date . " " . $time);
 } else {
  $datetime = strtotime($date);
  $time = '';
 }
 if ($date != 'Date' && $location) {
  echo "BEGIN:VEVENT\n";
  if ($time) {echo "DTSTART:" . date("Ymd\THis\Z",$datetime) . "\n";}
  else {echo "DTSTART;VALUE=DATE:" . date("Ymd",$datetime) . "\n";}
  echo "SUMMARY:$team $opponent\nLOCATION:$location\n";
  echo "END:VEVENT\n";
 }
} 
echo "END:VCALENDAR\n";
}
else {header("Location: index.php"); die();}
}
else {
$start = <<<START
 <html><head><title>CSTV2iCal</title><link rel="stylesheet" type="text/css" href="style.php"></head><body><h1>CSTV 2 iCal</h1><div id="content"><div id="right">
<br><form action="/cstv2ical/" method="get">
START;
echo $start;
$timezoneoptions = array(-8,-7,-6,-5);
echo "School: <select name=\"team\">";
foreach ($teams as $team => $shortteam) {
 echo "<option value=\"$team\">$team</option>";
}
echo "</select><br>Sport: <select name=\"sport\">";
foreach ($sports as $sport => $shortsport) {
 echo "<option value=\"$sport\">$sport</option>";
}
echo "</select><br>Timezone: <select name=\"timezone\">";
$i = 0;
foreach ($timezones as $zone) {
 echo "<option value=\"$timezoneoptions[$i]\">$zone</option>";
 $i++;
}
echo "</select>";
$end = <<<END
 <br><input type="submit" value="Generate iCal"></form>
 </div><div id="left"><h2>I love college sports. I also rely on my computer's calendar software. CSTV2iCal grabs the latest information from the college of your choice and formats it in a way Outlook, iCal, Google Calendar etc. can understand. Never miss another game! This page is still beta. Besure to double check all game times. Please email me with questions, comments or requests for more schools or sports. My contact info is at the top of <a href="http://davidabailey.com/">http://davidabailey.com</a> Thanks for checking out CSTV2iCal and Enjoy! Last, the source code is available at <a href="https://github.com/davidbailey/CSTV2iCal">https://github.com/davidbailey/CSTV2iCal</a></h2>
 </div><div style="clear: both"></div></div></body></html>
END;
echo $end;
}
?>