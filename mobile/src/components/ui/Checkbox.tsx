import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { brandColors, semanticColors, radius, spacing, typography } from '../../theme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'bonus' | 'legal';
}

export function Checkbox({
  checked,
  onPress,
  label,
  sublabel,
  variant = 'default',
}: CheckboxProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'bonus':
        return {
          container: styles.bonusContainer,
          box: checked ? styles.bonusBoxChecked : styles.bonusBox,
          label: styles.bonusLabel,
          sublabel: styles.bonusSublabel,
        };
      case 'legal':
        return {
          container: styles.legalContainer,
          box: checked ? styles.legalBoxChecked : styles.legalBox,
          label: styles.legalLabel,
          sublabel: styles.legalSublabel,
        };
      default:
        return {
          container: styles.defaultContainer,
          box: checked ? styles.defaultBoxChecked : styles.defaultBox,
          label: styles.defaultLabel,
          sublabel: styles.defaultSublabel,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, variantStyles.container]}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, variantStyles.box]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.label, variantStyles.label]} numberOfLines={2}>
          {label}
        </Text>
        {sublabel && (
          <Text style={[styles.sublabel, variantStyles.sublabel]}>
            {sublabel}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing[3],
  },
  defaultContainer: {
    // Default styling
  },
  bonusContainer: {
    backgroundColor: `${brandColors.green[400]}14`, // 8% opacity
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: `${brandColors.green[400]}33`, // 20% opacity
  },
  legalContainer: {
    paddingVertical: spacing[2],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
    marginTop: 1,
  },
  // Default variant
  defaultBox: {
    borderColor: semanticColors.border.strong,
    backgroundColor: 'transparent',
  },
  defaultBoxChecked: {
    borderColor: brandColors.green[400],
    backgroundColor: brandColors.green[400],
  },
  defaultLabel: {
    color: semanticColors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.sans,
  },
  defaultSublabel: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  // Bonus variant
  bonusBox: {
    borderColor: brandColors.green[400],
    backgroundColor: 'transparent',
  },
  bonusBoxChecked: {
    borderColor: brandColors.green[400],
    backgroundColor: brandColors.green[400],
  },
  bonusLabel: {
    color: brandColors.green[400],
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.sans,
  },
  bonusSublabel: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  // Legal variant
  legalBox: {
    borderColor: semanticColors.border.strong,
    backgroundColor: 'transparent',
    width: 18,
    height: 18,
    borderRadius: radius.sm,
  },
  legalBoxChecked: {
    borderColor: brandColors.green[400],
    backgroundColor: brandColors.green[400],
    width: 18,
    height: 18,
    borderRadius: radius.sm,
  },
  legalLabel: {
    color: semanticColors.text.tertiary,
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
    fontFamily: typography.fontFamily.sans,
  },
  legalSublabel: {
    color: semanticColors.text.muted,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
    fontFamily: typography.fontFamily.sans,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    lineHeight: 20,
  },
  sublabel: {
    lineHeight: 16,
  },
  checkmark: {
    color: semanticColors.background.base,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
