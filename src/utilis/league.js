const setLeague = (tripPoints) => {
    if (tripPoints >= 3000) return { current: 'Gold_I', next: null, min: 3000, max: 3000 };
    if (tripPoints >= 2500) return { current: 'Gold_II', next: 'Gold_I', min: 2500, max: 3000 };
    if (tripPoints >= 1700) return { current: 'Gold_III', next: 'Gold_II', min: 1700, max: 2500 };
    if (tripPoints >= 1500) return { current: 'Silver_I', next: 'Gold_III', min: 1500, max: 1700 };
    if (tripPoints >= 1000) return { current: 'Silver_II', next: 'Silver_I', min: 1000, max: 1500 };
    if (tripPoints >= 500) return { current: 'Silver_III', next: 'Silver_II', min: 500, max: 1000 };
    if (tripPoints >= 250) return { current: 'Bronze_I', next: 'Silver_III', min: 250, max: 500 };
    if (tripPoints >= 100) return { current: 'Bronze_II', next: 'Bronze_I', min: 100, max: 250 };
    return { current: 'Bronze_III', next: 'Bronze_II', min: 0, max: 100 };
};

export { setLeague };
