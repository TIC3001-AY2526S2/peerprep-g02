let socket = null;

export function connectSubmitSocket({
    user_id,
    room_id,
    onPeerSubmitted,
    onPeerDisconnected,
    onBothSubmitted,
    onError,
}) {
    if (socket) return socket;

    const wsUrl = `ws://localhost:8007/ws/submit/${room_id}/${user_id}/`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
    };

    socket.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        console.log("PARSED:", data);

        if (data.status === "peer_submitted") {
            onPeerSubmitted?.(data);
        }

        if (data.status === "both_submitted") {
            onBothSubmitted?.(data);
        }

        if (data.status === "peer_disconnected") {
            onPeerDisconnected?.(data);
        }
    };

    socket.onerror = () => {
        onError?.();
    };

    socket.onclose = () => {
        socket = null;
    };

    return socket;
}

export function closeSubmitSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

export function submitCode() {
    if (!socket) return;

    socket.send(JSON.stringify({
        action: "submit"
    }));
}