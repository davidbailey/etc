require 'sinatra'
require 'poseidon'

peopleConsumer = Poseidon::PartitionConsumer.new("peopleConsumer", "localhost", 9092, "people", 0, :earliest_offset)

get '/api/getPeople' do
  messages = peopleConsumer.fetch
  previousPeople = messages.pop until messages.empty?
  previousPeople.value
end
