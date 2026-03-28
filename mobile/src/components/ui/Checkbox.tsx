import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

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
    paddingVertical: 12,
  },
  defaultContainer: {
    // Default styling
  },
  bonusContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  legalContainer: {
    paddingVertical: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  // Default variant
  defaultBox: {
    borderColor: '#525252',
    backgroundColor: 'transparent',
  },
  defaultBoxChecked: {
    borderColor: '#22c55e',
    backgroundColor: '#22c55e',
  },
  defaultLabel: {
    color: '#fafafa',
    fontSize: 14,
  },
  defaultSublabel: {
    color: '#a3a3a3',
    fontSize: 12,
    marginTop: 2,
  },
  // Bonus variant
  bonusBox: {
    borderColor: '#22c55e',
    backgroundColor: 'transparent',
  },
  bonusBoxChecked: {
    borderColor: '#22c55e',
    backgroundColor: '#22c55e',
  },
  bonusLabel: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  bonusSublabel: {
    color: '#a3a3a3',
    fontSize: 12,
    marginTop: 2,
  },
  // Legal variant
  legalBox: {
    borderColor: '#525252',
    backgroundColor: 'transparent',
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  legalBoxChecked: {
    borderColor: '#22c55e',
    backgroundColor: '#22c55e',
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  legalLabel: {
    color: '#a3a3a3',
    fontSize: 12,
    lineHeight: 18,
  },
  legalSublabel: {
    color: '#737373',
    fontSize: 11,
    marginTop: 2,
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
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
