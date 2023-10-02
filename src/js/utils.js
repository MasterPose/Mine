const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
export function getFormattedDate(date, hideYear = false) {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    if (hideYear) {
        return `${day} ${month}.`;
    }

    return `${day} ${month}. ${year}.`;
}
export function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }

    const date =
        typeof dateParam === "object" ? dateParam : new Date(dateParam);

    const today = new Date();
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const isThisYear = today.getFullYear() === date.getFullYear();

    if (seconds < 5) {
        return "now";
    } else if (seconds < 60) {
        return `${seconds}secs`;
    } else if (minutes < 60) {
        return `${minutes}min`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else if (isThisYear) {
        return getFormattedDate(date, true); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
}

export function truncateString(str, n, append = "...") {
    if (str.length > n) {
        return str.substring(0, n) + append;
    } else {
        return str;
    }
}

export function copyText(content) {
    navigator.clipboard.writeText(content);
    cordova.plugins.clipboard.copy(content, () => {
        toast("Note copied!");
    });
}