import { FollowService } from "../model.service/FollowService";

export class FolloweePresenter {
    private service: FollowService;
    private view: FolloweeView;
    public constructor(view: FolloweeView) {
        this.service = new FollowService();
        this.view = view
    }

}

export interface FolloweeView {

}