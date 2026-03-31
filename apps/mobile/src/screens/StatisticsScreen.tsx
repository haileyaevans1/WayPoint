import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const pageColors = {
  lightGreen: '#B2EF91',
  tangerine: '#FA9372',
  charcoal: '#2C3E50',
  papaya: '#FDEBD0',
  coolSteel: '#77A0A9',
  white: '#FFFFFF',
};

export default function StatisticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      <Text style={styles.pageHeader}>Your Stats</Text>

      {/* --- STREAKS WIDGET --- */}
      <View style={styles.bubbleCard}>
        <View style={styles.streakHeader}>
          <Feather name="trending-up" size={32} color={pageColors.tangerine} />
          <View>
            <Text style={styles.streakNumber}>5 Days</Text>
            <Text style={styles.streakLabel}>Current Trail Streak</Text>
          </View>
        </View>
      </View>

      {/* --- ACTIVE GOALS WIDGET (With Edit Button) --- */}
      <View style={styles.bubbleCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Weekly Goals</Text>
          <TouchableOpacity style={styles.editIcon}>
            <Feather name="sliders" size={18} color={pageColors.charcoal} />
          </TouchableOpacity>
        </View>

        <View style={styles.goalRow}>
          <View>
            <Text style={styles.settingText}>Distance</Text>
            <Text style={styles.settingSubtext}>15 / 20 Miles</Text>
          </View>
          <Text style={styles.goalPercentage}>75%</Text>
        </View>

        <View style={styles.goalRow}>
          <View>
            <Text style={styles.settingText}>Active Time</Text>
            <Text style={styles.settingSubtext}>3 / 5 Hours</Text>
          </View>
          <Text style={styles.goalPercentage}>60%</Text>
        </View>

        <TouchableOpacity style={styles.editGoalsButton}>
          <Text style={styles.editGoalsText}>Adjust Goal Targets</Text>
        </TouchableOpacity>
      </View>

      {/* --- MILESTONES WIDGET --- */}
      <View style={styles.bubbleCard}>
        <Text style={styles.cardTitle}>Milestones</Text>
        
        <View style={styles.milestoneRow}>
          <View style={styles.iconCircle}>
            <Feather name="award" size={20} color={pageColors.white} />
          </View>
          <View>
            <Text style={styles.settingText}>100 Miles Walked</Text>
            <Text style={styles.settingSubtext}>Achieved Mar 15, 2026</Text>
          </View>
        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: pageColors.papaya },
  scrollContent: { padding: 20, paddingTop: 60, gap: 16 },
  pageHeader: { fontSize: 32, fontWeight: 'bold', color: pageColors.charcoal, marginBottom: 8 },
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
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: pageColors.charcoal },
  editIcon: { padding: 8, backgroundColor: pageColors.papaya, borderRadius: 20 },
  
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  streakNumber: { fontSize: 32, fontWeight: '900', color: pageColors.tangerine },
  streakLabel: { fontSize: 14, color: pageColors.coolSteel, fontWeight: '600' },

  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingText: { fontSize: 16, color: pageColors.charcoal, fontWeight: '500' },
  settingSubtext: { fontSize: 12, color: pageColors.coolSteel, marginTop: 4 },
  goalPercentage: { fontSize: 18, fontWeight: 'bold', color: pageColors.lightGreen },
  
  editGoalsButton: { marginTop: 16, paddingVertical: 12, alignItems: 'center', borderRadius: 16, borderWidth: 2, borderColor: pageColors.papaya },
  editGoalsText: { color: pageColors.charcoal, fontWeight: 'bold', fontSize: 14 },

  milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: pageColors.coolSteel, justifyContent: 'center', alignItems: 'center' },
});