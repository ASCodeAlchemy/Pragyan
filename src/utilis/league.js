const setLeague = (tripPoints) => {
    if (tripPoints >= 3000) return 'Gold_I';
    if (tripPoints >= 2500) return 'Gold_II';
    if (tripPoints >= 1700) return 'Gold_III';
    if (tripPoints >= 1500) return 'Silver_I';
    if (tripPoints >= 1000) return 'Silver_II';
    if (tripPoints >= 500) return 'Silver_III';
    if (tripPoints >= 250) return 'Bronze_I';
    if (tripPoints >= 100) return 'Bronze_II';
    return 'Bronze_III';
};

export { setLeague }
