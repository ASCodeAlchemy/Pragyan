import jwt from 'jsonwebtoken';

const generateCollaboratorAccessAndRefreshTokens = async (collaborator) => {
    const accessToken = jwt.sign(
        { id: collaborator._id },
        process.env.COLLAB_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.COLLAB_ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { id: collaborator._id },
        process.env.COLLAB_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.COLLAB_REFRESH_TOKEN_EXPIRY }
    );

    collaborator.refreshToken = refreshToken;
    await collaborator.save();

    return { accessToken, refreshToken };
};

export { generateCollaboratorAccessAndRefreshTokens };
