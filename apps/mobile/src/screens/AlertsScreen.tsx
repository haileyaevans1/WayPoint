import { UnavailableScreen } from "./UnavailableScreen";

type AlertsScreenProps = {
  onAlertPress: () => void;
  onViewJourney: () => void;
};

export function AlertsScreen({
  onAlertPress: _onAlertPress,
  onViewJourney,
}: AlertsScreenProps) {
  return (
    <UnavailableScreen
      title="Alerts are coming back soon"
      message="Your alerts hub is still being rebuilt, but the rest of the app navigation is live again."
      actionLabel="View Journey"
      onActionPress={onViewJourney}
    />
  );
}
