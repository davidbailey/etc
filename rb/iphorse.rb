require 'socket'
server = 'iphorse.com'
socket = TCPSocket.open(server, 80)
socket.send "GET /json.php HTTP/1.1\n", 0
socket.send "Host: iphorse.com\n\n", 0
while a = socket.gets
  puts a
end

require 'net/http'
require 'json'
uri = URI('https://iphorse.com/json.php')
res = Net::HTTP.get_response(uri)
iphorse = JSON.load(res.body)
