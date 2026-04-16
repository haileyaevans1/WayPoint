import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';

const pageColors = {
  lightGreen: '#B2EF91',
  tangerine: '#FA9372',
  charcoal: '#2C3E50',
  papaya: '#FDEBD0',
  coolSteel: '#77A0A9',
  white: '#FFFFFF',
};

type SettingsScreenProps = {
  onOpenAlerts?: () => void;
  hasAlertIndicator?: boolean;
};

export default function SettingsScreen({
  onOpenAlerts,
  hasAlertIndicator = false,
}: SettingsScreenProps) {
  // Local state for our toggle switches
  const [autoShare, setAutoShare] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageHeaderRow}>
        <Text style={styles.pageHeader}>Settings</Text>
        <TouchableOpacity style={styles.alertButton} onPress={onOpenAlerts}>
          <Feather name="bell" size={18} color={pageColors.white} />
          {hasAlertIndicator ? <View style={styles.alertDot} /> : null}
        </TouchableOpacity>
      </View>

      {/* --- SAFETY PREFERENCES WIDGET --- */}
      <View style={styles.bubbleCard}>
        <View style={styles.cardHeader}>
          <Feather name="shield" size={24} color={pageColors.tangerine} />
          <Text style={styles.cardTitle}>Safety Alerts</Text>
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingText}>Auto-Share Location</Text>
            <Text style={styles.settingSubtext}>When starting a new journey</Text>
          </View>
          <Switch 
            value={autoShare} 
            onValueChange={setAutoShare}
            trackColor={{ false: pageColors.coolSteel, true: pageColors.lightGreen }}
          />
        </View>
      </View>

      {/* --- TRUSTED CONTACTS WIDGET --- */}
      <View style={styles.bubbleCard}>
        <View style={styles.cardHeader}>
          <Feather name="users" size={24} color={pageColors.coolSteel} />
          <Text style={styles.cardTitle}>Trusted Contacts</Text>
        </View>

        {/* Mock Contact 1 */}
        <View style={styles.contactRow}>
          <View style={styles.contactInfo}>
            <View style={styles.contactAvatar}>
              <Text style={styles.avatarInitial}>J</Text>
            </View>
            <Text style={styles.settingText}>Jane Doe</Text>
          </View>
          <TouchableOpacity>
            <Feather name="edit-2" size={18} color={pageColors.charcoal} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={20} color={pageColors.charcoal} />
          <Text style={styles.addButtonText}>Add New Contact</Text>
        </TouchableOpacity>
      </View>

      {/* --- NOTIFICATIONS WIDGET --- */}
      <View style={styles.bubbleCard}>
        <View style={styles.cardHeader}>
          <Feather name="bell" size={24} color={pageColors.tangerine} />
          <Text style={styles.cardTitle}>Notifications</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch 
            value={pushNotifs} 
            onValueChange={setPushNotifs}
            trackColor={{ false: pageColors.coolSteel, true: pageColors.lightGreen }}
          />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: pageColors.papaya },
  scrollContent: { padding: 20, paddingTop: 28, gap: 16 },
  pageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 8,
  },
  pageHeader: { fontSize: 32, fontWeight: 'bold', color: pageColors.charcoal, flex: 1 },
  alertButton: {
    minWidth: 60,
    minHeight: 46,
    paddingHorizontal: 8,
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DE8558',
    borderWidth: 1,
    borderColor: '#CA7449',
    position: 'relative',
    shadowColor: '#CA7449',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 4,
  },
  alertDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: pageColors.lightGreen,
  },
  bubbleCard: {
    backgroundColor: pageColors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: pageColors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: pageColors.charcoal },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingText: { fontSize: 16, color: pageColors.charcoal, fontWeight: '500' },
  settingSubtext: { fontSize: 12, color: pageColors.coolSteel, marginTop: 4 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  contactInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  contactAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: pageColors.lightGreen, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: pageColors.charcoal, fontWeight: 'bold', fontSize: 16 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, paddingVertical: 12, backgroundColor: pageColors.papaya, borderRadius: 16 },
  addButtonText: { color: pageColors.charcoal, fontWeight: 'bold', fontSize: 16 },
});
