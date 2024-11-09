import { auth } from "@clerk/nextjs"

const allowedIds = ["user_2oAHuJMU4Mbb1R3fqF5csYafJMU"];

export const getIsAdmin = async () => {
    const { userId } = await auth();

    if (!userId)
    {
        return false;
    }

    return allowedIds.indexOf(userId) !== -1;
}