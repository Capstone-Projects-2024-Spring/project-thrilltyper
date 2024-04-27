function ChatRoom({ userSession = null }) {
    // const decalration and initialization
    const [messages, setMessages] = React.useState([]);
    const [userName, setUserName] = React.useState('');
    const [userInput, setUserInput] = React.useState('');
    // const for multiframes and status check
    const [socket, setSocket] = React.useState(null);
    const [disconnecting, setDisconnecting] = React.useState(false);

    // One-time setup
    React.useEffect(() => {
        const newSocket = io.connect('http://' + window.location.hostname + ':' + window.location.port, { transports: ['websocket'] });
        setSocket(newSocket);

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = 'guest';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        if (userSession === null) {
            setUserName(randomString)
        } else{
            setUserName(userSession.userinfo.given_name)
        }

        newSocket.on('connect', () => {
            console.log("connected")
            newSocket.emit('event', { user_name: userSession ? userSession.userinfo.given_name : randomString, message: "has joined the lobby" });
        });

        newSocket.on('global chat', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            // Prevent navigation until socket is disconnected
            setDisconnecting(true);
            newSocket.disconnect(() => {
                setDisconnecting(false);
            });
        };
    }, []);

    if (userName == "") {
        return <div>Is Loading...</div>;
    }

    // Prevent form action and send message
    const handleSubmit = (e) => {
        e.preventDefault();
        if (userName && userInput && socket) {
            socket.emit('event', { user_name: userName, message: userInput });
            setUserInput('');
        } else {
            console.error("Socket is not available");
        }
    };

    // Prevent form submission while disconnecting and not input
    const canSubmit = !disconnecting && userInput;

    return (
        <div id="chat" className="sideComponent">
            <h2 id="chatTitle">Chat</h2>
            <div id="message">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.user_name}</b> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <h4>{userName}</h4>
                <input
                    type="text"
                    placeholder="Write a message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <input type="submit" disabled={!canSubmit} />
            </form>
        </div>
    );
}
