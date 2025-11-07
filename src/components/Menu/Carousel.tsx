import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const images = [
  require('../../assets/images/colegio3.jpg'),
  require('../../assets/images/colegio1.jpg'),
  require('../../assets/images/colegio2.png'),
];

const Carousel = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width * 0.85 + 16));
    setCurrentIndex(index);
  };

  const renderIndicators = () => (
    <View style={styles.indicatorContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            {
              backgroundColor: index === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              width: index === currentIndex ? 24 : 8,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item} style={styles.image} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageOverlay}
            />
            <View style={styles.shimmerEffect} />
          </View>
        )}
      />
      {renderIndicators()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginVertical: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  card: {
    width: width * 0.85,
    height: 190,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
});

export default Carousel;