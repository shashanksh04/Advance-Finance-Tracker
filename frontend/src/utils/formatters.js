
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(value);
};

export const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

export const formatTimestamp = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date);
};

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
        return 'Good morning';
    } else if (hour < 18) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
};
