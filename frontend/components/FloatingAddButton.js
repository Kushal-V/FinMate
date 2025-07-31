// frontend/components/FloatingAddButton.js

import React from 'react';
import { StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function FloatingAddButton() {
  const navigation = useNavigation();
  const x = useSharedValue(width - 80);
  const y = useSharedValue(height - 200);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.fabContainer, animatedStyle]}>
        <Pressable
          onPress={() => navigation.navigate('AddExpense')}
          style={styles.fab}
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    zIndex: 999,
  },
  fab: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
