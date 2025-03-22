export function formatMessageTime(dateTime: string) {
    return new Date(dateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

export function formatMessageDate(dateTime: string) {
    return new Date(dateTime).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}