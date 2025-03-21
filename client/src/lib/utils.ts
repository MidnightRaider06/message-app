export function formatMessageTime(dateTime: string) {
    return new Date(dateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}