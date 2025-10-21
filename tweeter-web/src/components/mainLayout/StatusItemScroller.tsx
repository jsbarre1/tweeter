import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import ItemScroller from "./ItemScroller";
import { StatusService } from "../../model.service/StatusService";

interface Props {
  featureUrl: string;
  presenterFactory: (observer: PagedItemView<Status>) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  return (
    <ItemScroller<Status, StatusService>
      presenterFactory={props.presenterFactory}
      renderItems={(items) => <StatusItem items={items} featurePath={props.featureUrl} />}
    />
  );
};

export default StatusItemScroller;
