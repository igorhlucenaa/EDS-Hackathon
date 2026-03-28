import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GuidedBetRiskBadge } from './GuidedBetRiskBadge';
import type { GuidedBetSuggestion } from '@shared';

interface GuidedBetCardProps {
  suggestion: GuidedBetSuggestion;
  onPress?: () => void;
  onAddToSlip?: () => void;
  compact?: boolean;
}

export function GuidedBetCard({
  suggestion,
  onPress,
  onAddToSlip,
  compact = false,
}: GuidedBetCardProps) {
  const firstSelection = suggestion.selections[0];

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {suggestion.title}
          </Text>
          <GuidedBetRiskBadge level={suggestion.riskLevel} size="small" />
        </View>

        <Text style={styles.compactSubtitle} numberOfLines={2}>
          {suggestion.subtitle}
        </Text>

        <View style={styles.compactFooter}>
          <View style={styles.oddsContainer}>
            <Text style={styles.oddsLabel}>Odd total</Text>
            <Text style={styles.oddsValue}>{suggestion.totalOdds.toFixed(2)}</Text>
          </View>
          {onAddToSlip && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                onAddToSlip();
              }}
            >
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{suggestion.title}</Text>
          <Text style={styles.subtitle}>{suggestion.subtitle}</Text>
        </View>
        <GuidedBetRiskBadge level={suggestion.riskLevel} size="medium" />
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {suggestion.tags.slice(0, 2).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Selections Preview */}
      <View style={styles.selectionsContainer}>
        {suggestion.selections.slice(0, 2).map((sel, index) => (
          <View key={sel.id} style={styles.selectionRow}>
            <Text style={styles.selectionNumber}>{index + 1}</Text>
            <Text style={styles.selectionName} numberOfLines={1}>
              {sel.label}
            </Text>
            <Text style={styles.selectionOdds}>{sel.odds.toFixed(2)}</Text>
          </View>
        ))}
        {suggestion.selections.length > 2 && (
          <Text style={styles.moreSelections}>
            +{suggestion.selections.length - 2} mais
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.oddsSection}>
          <Text style={styles.oddsLabel}>Odd total</Text>
          <Text style={styles.oddsValueLarge}>{suggestion.totalOdds.toFixed(2)}</Text>
          {suggestion.potentialReturn && (
            <Text style={styles.potentialReturn}>
              Retorno: R$ {suggestion.potentialReturn.toFixed(2)}
            </Text>
          )}
        </View>
        {onAddToSlip && (
          <TouchableOpacity
            style={styles.addButtonLarge}
            onPress={(e) => {
              e.stopPropagation();
              onAddToSlip();
            }}
          >
            <Text style={styles.addButtonTextLarge}>Adicionar ao Betslip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Explanation */}
      <Text style={styles.explanation}>{suggestion.explanation}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginBottom: 12,
  },
  compactContainer: {
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(38, 38, 38, 0.5)',
    marginRight: 12,
    width: 280,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fafafa',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#a3a3a3',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    flex: 1,
    marginRight: 8,
  },
  compactSubtitle: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  tagText: {
    fontSize: 10,
    color: '#22c55e',
    fontWeight: '500',
  },
  selectionsContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectionNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#262626',
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 10,
    fontWeight: '700',
    color: '#a3a3a3',
    marginRight: 8,
  },
  selectionName: {
    flex: 1,
    fontSize: 13,
    color: '#fafafa',
  },
  selectionOdds: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22c55e',
  },
  moreSelections: {
    fontSize: 11,
    color: '#737373',
    marginTop: 4,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  oddsSection: {
    alignItems: 'flex-start',
  },
  oddsLabel: {
    fontSize: 11,
    color: '#737373',
    marginBottom: 2,
  },
  oddsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22c55e',
  },
  oddsValueLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: '#22c55e',
  },
  potentialReturn: {
    fontSize: 12,
    color: '#a3a3a3',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  addButtonLarge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonTextLarge: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  explanation: {
    fontSize: 12,
    color: '#737373',
    marginTop: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(38, 38, 38, 0.3)',
  },
  oddsContainer: {
    alignItems: 'flex-start',
  },
});
