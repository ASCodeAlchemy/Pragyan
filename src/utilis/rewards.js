import { AddReward } from "../models/addRewards.models.js";

const getRewardsByLeague = async (league) => {
    try {
        const rewards = await AddReward.find({ league });
        return rewards;
    } catch (error) {
        console.error('Error fetching rewards by league:', error);
        return [];
    }
};

export { getRewardsByLeague }
