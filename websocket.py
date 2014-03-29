import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import json

class WSHandler(tornado.websocket.WebSocketHandler):
        def open(self):
                print 'new connection'
		self.name = None
		self.opponent = None
		self.pendingOpponent = None
		
        def on_message(self, message):
                msg = json.loads(message)
                if msg['type'] == 'set_name':
                        self.name = msg['name']
                        outmsg = {}
                        outmsg['type'] = 'set_name_response'
                        if handler.add_client(self) == False:
                            outmsg['data'] = 'Existing'
                            self.name = None
                        else:
                            outmsg['data'] = 'OK'
                        self.write_message(json.dumps(outmsg))
                elif msg['type'] == 'get_players':
                        names = handler.get_clients(self.name)
			outmsg = {}
                        outmsg['type'] = 'players_response'
                        outmsg['players'] = names
                        self.write_message(json.dumps(outmsg))
                elif msg['type'] == 'connect_player':
                        opp = handler.find_client(msg['player'])
                        if opp != None:
                                outmsg = {}
                                outmsg['type'] = 'connect_player_request'
                                outmsg['player'] = self.name
                                opp.write_message(json.dumps(outmsg))
                                self.pendingOpponent = msg['player']
				opp.pendingOpponent = self.name
                elif msg['type'] == 'connect_player_response':
                        opp = handler.find_client(self.pendingOpponent)
                        if opp != None:
                                opp.write_message(message)
                                if msg['answer'] == 'yes':
                                        opp.pendingOpponent = None
					self.penndingOpponent = None
                                        opp.opponent = self.name
                                        self.opponent = opp.name
                                else:
                                        opp.pendingOpponent = None
                                        opp.opponent = None
                                        self.opponent = None
                elif msg['type'] == 'game_data':
                        opp = handler.find_client(self.opponent)
                        if opp != None:
                                opp.write_message(message)
		elif msg['type'] == 'game_over':
			self.opponent = None;

        def on_close(self):
                if self.name != None:
                        handler.remove_client(self)
                print 'connection closed'

class ClientHandler():
        def __init__(self):
                self.clients = []

        def add_client(self, client):
                found = False
                for existing in self.clients:
                    if existing.name == client.name:
                        found = True

                if found == False:
                    self.clients.append(client)
		    outmsg = {}
		    outmsg['type'] = 'new_player'
		    outmsg['player'] = client.name
		    for existing in self.clients:
			if existing.name != client.name:
			    existing.write_message(json.dumps(outmsg))
                    return True
                return False

        def find_client(self, name):
                for client in self.clients:
                        if client.name == name:
                                return client
                return None

        def get_clients(self, asker):
                names = []
                for client in self.clients:
                        if client.name != asker and client.opponent == None:
                                names.append(client.name)
                return names

        def remove_client(self, client):
                if client.opponent != None:
                        opp = self.find_client(client.opponent)
                        if opp != None:
				opp.opponent = None
                self.clients.remove(client)
		outmsg = {}
		outmsg['type'] = 'player_left'
		outmsg['player'] = client.name
		for existing in self.clients:
		    existing.write_message(json.dumps(outmsg))

application = tornado.web.Application([(r'/ws', WSHandler),])

handler = ClientHandler()

if __name__=="__main__":
	http_server = tornado.httpserver.HTTPServer(application)
	http_server.listen(8080)
	tornado.ioloop.IOLoop.instance().start()
