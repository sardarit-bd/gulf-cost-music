export const formatCityName = (city) => {
    if (!city) return "";

    return city
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export const formatStateName = (state) => {
    if (!state) return "";
    
    const stateMap = {
        LA: "Louisiana",
        MS: "Mississippi",
        AL: "Alabama",
        FL: "Florida",
        louisiana: "Louisiana",
        mississippi: "Mississippi",
        alabama: "Alabama",
        florida: "Florida"
    };
    
    return stateMap[state] || state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
};

export const formatLocation = (city, state) => {
    if (!city && !state) return "";
    if (!city) return formatStateName(state);
    if (!state) return formatCityName(city);
    
    return `${formatCityName(city)}, ${formatStateName(state)}`;
};