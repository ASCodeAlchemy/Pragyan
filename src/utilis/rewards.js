const rewards = {
    'Bronze_III': [
        { rewardName: '5% Off Next Trip', rewardDescription: 'Get 5% off on your next trip', rewardValue: 5 }
    ],
    'Bronze_II': [
        { rewardName: '10% Off Next Trip', rewardDescription: 'Get 10% off on your next trip', rewardValue: 10 }
    ],
    'Bronze_I': [
        { rewardName: 'Cashback On Wallets', rewardDescription: "Get ₹10 cashback on your transport wallet for every 15 check-ins! More rides, more savings!", rewardValue: 15 }
    ],
    'Silver_III': [
        { rewardName: 'Free Trip', rewardDescription: 'Get one free trip', rewardValue: 100 }
    ],
    'Silver_II': [
        { rewardName: '25% Off Next Trip', rewardDescription: 'Get 25% off on your next trip', rewardValue: 25 }
    ],
    'Silver_I': [
        { rewardName: '50% Off Next Trip', rewardDescription: 'Get 50% off on your next trip', rewardValue: 50 }
    ],
    'Gold_III': [
        { rewardName: 'VIP Pass', rewardDescription: 'Get VIP access for next trip', rewardValue: 100 }
    ],
    'Gold_II': [
        { rewardName: '2 Free Trips', rewardDescription: 'Get 2 free trips', rewardValue: 200 }
    ],
    'Gold_I': [
        { rewardName: 'Eco-Warrior Recognition', rewardDescription:  "Help the planet! For every 50 rides, we’ll plant a tree in your name. Join the movement!", rewardValue: 500 }
    ]
};

const getRewardsByLeague = (league) => {
    return rewards[league] || [];
};

export { getRewardsByLeague }
