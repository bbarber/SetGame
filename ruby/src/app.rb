require 'rubygems'
require 'sinatra'


get '/' do
	erb :site
end

get '/api/Game/GetDailySeed/:today' do |today|
	# Seed the random with today's date
	r = Random.new(today.to_i)
	r.rand(10 ** 40).to_s
end


get '/api/Game/GetAllGames' do
    # Some fake data for testing
	'[{"Id":1,"UserName":"_Branden","Score":102.412,"DatePlayed":"2013-01-21T00:36:21.397","Seed":null},
    {"Id":6,"UserName":"_Branden","Score":153.18,"DatePlayed":"2013-01-21T19:11:03.627","Seed":null},
    {"Id":7,"UserName":"UnguSC73","Score":28.636,"DatePlayed":"2013-01-21T19:11:05.637","Seed":null},
    {"Id":8,"UserName":"anne","Score":70.38,"DatePlayed":"2013-01-21T19:15:08.187","Seed":null},
    {"Id":9,"UserName":"Cody Leach","Score":84.203,"DatePlayed":"2013-01-21T19:15:53.38","Seed":null},
    {"Id":10,"UserName":"UnguSC73","Score":48.553,"DatePlayed":"2013-01-22T19:38:53.657","Seed":null},
    {"Id":11,"UserName":"anne","Score":107.798,"DatePlayed":"2013-01-22T19:41:15.823","Seed":null}]'
end
