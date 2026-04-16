import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Expo's built-in icon library!

// Your new experimental palette!
const pageColors = {
  lightGreen: '#B2EF91',
  tangerine: '#FA9372',
  charcoal: '#2C3E50',
  papaya: '#FDEBD0',
  coolSteel: '#77A0A9',
  white: '#FFFFFF',
};

type ProfileScreenProps = {
  onOpenAlerts?: () => void;
  hasAlertIndicator?: boolean;
};

export default function ProfileScreen({
  onOpenAlerts,
  hasAlertIndicator = false,
}: ProfileScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.pageTopRow}>
        <View style={styles.pageTopSpacer} />
        <TouchableOpacity style={styles.alertButton} onPress={onOpenAlerts}>
          <Feather name="bell" size={18} color={pageColors.white} />
          {hasAlertIndicator ? <View style={styles.alertDot} /> : null}
        </TouchableOpacity>
      </View>
      
      {/* --- HEADER WIDGET (Now with Edit features!) --- */}
      <View style={[styles.bubbleCard, styles.headerCard]}>
        
        {/* Edit Profile Button (Top Right) */}
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit-2" size={20} color={pageColors.charcoal} />
        </TouchableOpacity>

        {/* Avatar with Camera Overlay */}
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.cameraBadge}>
            <Feather name="camera" size={14} color={pageColors.white} />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>Melissa W.</Text>
        
        {/* New Bio Section */}
        <Text style={styles.bioText}>
          Full Stack Engineering student building cool things. Always ready for a trail walk!
        </Text>

        {/* New Location Section (Private) */}
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={pageColors.coolSteel} />
          <Text style={styles.locationText}>Tulsa, OK <Text style={styles.privateTag}>(Private)</Text></Text>
        </View>

      </View>

      {/* --- STATS ROW --- */}
      <View style={styles.statsRow}>
        <View style={[styles.bubbleCard, styles.halfCard]}>
          <Text style={styles.statNumber}>142</Text>
          <Text style={styles.statLabel}>Hours on Trail</Text>
        </View>
        <View style={[styles.bubbleCard, styles.halfCard]}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Safe Journeys</Text>
        </View>
      </View>

      {/* --- GOALS WIDGET (Now with Progress Ring!) --- */}
      <View style={[styles.bubbleCard, styles.goalCard]}>
        <Text style={styles.cardTitle}>Weekly Goal</Text>
        
        {/* The CSS Progress Ring */}
        <View style={styles.ringContainer}>
          <View style={styles.progressRing}>
            <View style={styles.innerRingContent}>
              <Text style={styles.ringPercentage}>75%</Text>
              <Text style={styles.ringSubtext}>Completed</Text>
            </View>
          </View>
        </View>

        <Text style={styles.progressText}>15 / 20 Miles</Text>
      </View>

      {/* --- TRUSTED CONTACTS WIDGET --- */}
      <TouchableOpacity style={styles.bubbleCard}>
        <View style={styles.contactRow}>
          <View>
            <Text style={styles.cardTitle}>Trusted Contacts (3)</Text>
            <Text style={styles.cardSubtext}>Tap to manage your safety network</Text>
          </View>
          <Feather name="chevron-right" size={24} color={pageColors.coolSteel} />
        </View>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pageColors.papaya, // The warm new background
  },
  scrollContent: {
    padding: 20,
    paddingTop: 28,
    gap: 16, 
  },
  pageTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 4,
  },
  pageTopSpacer: {
    flex: 1,
  },
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
  
  // Header Styles
  headerCard: {
    alignItems: 'center',
    paddingVertical: 30,
    position: 'relative', // Allows absolute positioning of the edit button
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
    backgroundColor: pageColors.papaya, // Soft background for the button
    borderRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: pageColors.coolSteel, 
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: pageColors.tangerine,
    padding: 8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: pageColors.white,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: pageColors.charcoal,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: pageColors.charcoal,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: pageColors.papaya,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 13,
    color: pageColors.charcoal,
    fontWeight: '500',
  },
  privateTag: {
    color: pageColors.coolSteel,
    fontStyle: 'italic',
  },

  // Stats Styles
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  halfCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: pageColors.tangerine, // Peachy pop for stats
  },
  statLabel: {
    fontSize: 13,
    color: pageColors.coolSteel,
    marginTop: 4,
    fontWeight: '700',
  },

  // Goals & Progress Ring Styles
  goalCard: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: pageColors.charcoal,
    marginBottom: 4,
  },
  cardSubtext: {
    color: pageColors.coolSteel,
    fontSize: 13,
    marginTop: 2,
  },
  ringContainer: {
    marginVertical: 20,
  },
  progressRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    // The "unfilled" track color
    borderColor: pageColors.papaya, 
    // The "filled" progress colors!
    borderTopColor: pageColors.lightGreen, 
    borderRightColor: pageColors.tangerine,
    justifyContent: 'center',
    alignItems: 'center',
    // Rotate the ring so the "fill" starts at the top
    transform: [{ rotate: '-45deg' }], 
  },
  innerRingContent: {
    // Counter-rotate the text so it isn't sideways inside the ring
    transform: [{ rotate: '45deg' }], 
    alignItems: 'center',
  },
  ringPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: pageColors.charcoal,
  },
  ringSubtext: {
    fontSize: 12,
    color: pageColors.coolSteel,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 16,
    color: pageColors.charcoal,
    fontWeight: '600',
  },

  // Contacts Row
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
