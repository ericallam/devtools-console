http = require 'http'
filed = require 'filed'

server = http.createServer (req, resp) ->
  switch req.url
    when "/"
      req.pipe(filed('./inspector/console.html')).pipe(resp)
    else
      req.pipe(filed("./inspector#{req.url}")).pipe(resp)

server.listen 8080, () ->
  console.log "Server started on 8080"