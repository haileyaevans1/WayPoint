export type TrustedContact = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  note: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  city: string;
  privacyLabel: string;
  memberSince: string;
  nextMilestone: string;
};

export type UserSettings = {
  autoShareLocation: boolean;
  pushNotifications: boolean;
  routeDeviationAlerts: boolean;
  missedCheckInAlerts: boolean;
  weeklyDigest: boolean;
  locationVisibility: "private" | "trusted contacts" | "during journey";
  defaultJourneyMode: "solo" | "group";
};

export type StatsSnapshot = {
  milesThisWeek: number;
  weeklyGoalMiles: number;
  safeJourneys: number;
  hoursOutside: number;
  currentStreakDays: number;
  completionRate: number;
  checkInRate: number;
  favoriteRouteTitle: string;
  lastJourneyLabel: string;
  nextGoalLabel: string;
};
