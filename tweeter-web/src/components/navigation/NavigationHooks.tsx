import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { NavigationPresenter, NavigationView } from "../../presenter/NavigationPresenter";
import { useRef } from "react";

export const useUserNavigation = () => {
    const { displayedUser, authToken } = useUserInfo()
    const { setDisplayedUser } = useUserInfoActions()
    const navigate = useNavigate();
    const { displayErrorMessage } = useMessageActions()

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    const view: NavigationView = {
        setDisplayedUser,
        navigateToPath:(path:string)=> navigate(path),
        displayErrorMessage
    }
        const presenterRef = useRef<NavigationPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = new NavigationPresenter(view);
    }

    const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
        event.preventDefault();
        const alias = extractAlias(event.target.toString());
        await presenterRef.current!.navigateToUser(authToken!, displayedUser!, alias, featurePath)
    };

    return {
        navigateToUser
    };
};