function ChatRoom() {
    const [messages, setMessages] = React.useState([]);
    const [userName, setUserName] = React.useState('');
    const [userInput, setUserInput] = React.useState('');
    const [socket, setSocket] = React.useState(null);
    const [disconnecting, setDisconnecting] = React.useState(false);

    React.useEffect(() => {
        const newSocket = io.connect('http://' + window.location.hostname + ':' + window.location.port, { transports: ['websocket'] });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('my event', { data: 'User Connected' });
        });

        newSocket.on('my response', (msg) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userName && userInput && socket) {
            socket.emit('my event', { user_name: userName, message: userInput });
            setUserInput('');
        } else {
            console.error("Socket is not available");
        }
    };

    // Prevent form submission while disconnecting
    const canSubmit = !disconnecting && userName && userInput;

    return (
        <div>
            <div id="message">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <b style={{ color: '#000' }}>{msg.user_name}</b> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Messages"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <input type="submit" disabled={!canSubmit} />
            </form>
        </div>
    );
}
