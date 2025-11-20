import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MessageBox = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative elements */}
        <View style={styles.decorativeElement1} />
        <View style={styles.decorativeElement2} />
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.lightbulbIcon}>💡</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Educación Virtual</Text>
            <Text style={styles.message}>
              El uso de procesos educativos desde casa, vía virtual, permite fortalecer 
              el vínculo entre padres y estudiantes, creando un ambiente colaborativo 
              de aprendizaje.
            </Text>
          </View>
        </View>

        <View style={styles.bottomAccent} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBackground: {
    padding: 24,
    position: 'relative',
    minHeight: 120,
  },
  decorativeElement1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    top: -20,
    right: -20,
  },
  decorativeElement2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    bottom: -10,
    left: -10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  lightbulbIcon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontWeight: '400',
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
});

export default MessageBox;