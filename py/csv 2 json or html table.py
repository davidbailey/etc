import pandas
import json

df = pandas.read_csv('file.csv', encoding='utf-8-sig')

headers = map(lambda x: x, df.columns)
output = {'headers': headers}
output.update({'values': json.loads(df.to_json(orient='records'))})
#print json.dumps(output)


### /\ JSON
### \/ HTML

print "<html>"
print """
<style>
table, th , td  {
  border: 1px solid grey;
  border-collapse: collapse;
  padding: 5px;
}
table tr:nth-child(odd) {
  background-color: #f1f1f1;
}
table tr:nth-child(even) {
  background-color: #ffffff;
}
</style>
"""

print "<table><tr>"
for x in headers:
  print "<td>", x, "</td>"
 
print "</tr>"
for (i, x) in df.iterrows():
  print "<tr>"
  for y in x:
    print "<td>", y, "</td>"
  print "</tr>"

print "</table></html>"
